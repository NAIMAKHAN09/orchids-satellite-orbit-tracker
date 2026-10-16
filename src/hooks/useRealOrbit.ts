import { useState, useEffect } from "react";
import * as satellite from "satellite.js";

export interface SatellitePosition {
  lat: number;
  lng: number;
  altitude: number;
  velocity: number;
  timestamp: number;
}

export interface SatelliteMetadata {
  id: string;
  name: string;
  catnr: string;
  color: string;
}

export const SATELLITE_REGISTRY: SatelliteMetadata[] = [
  { id: "iss", name: "ISS (Space Station)", catnr: "25544", color: "#06B6D4" },
  { id: "sentinel-2", name: "Sentinel-2A", catnr: "40697", color: "#60A5FA" },
  { id: "gps", name: "GPS (Navstar)", catnr: "41019", color: "#EAB308" },
  { id: "starlink", name: "Starlink", catnr: "44713", color: "#8B5CF6" },
  { id: "navic", name: "NavIC (India)", catnr: "40613", color: "#FF6B35" },
];

interface TleResponse {
  line1?: unknown;
  line2?: unknown;
}

export function useRealOrbit(catnr: string) {
  const [tle, setTle] = useState<{ line1: string; line2: string } | null>(null);
  const [position, setPosition] = useState<SatellitePosition | null>(null);
  const [groundTrack, setGroundTrack] = useState<{ lat: number; lng: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let isCurrentRequest = true;

    // Never keep showing a previous satellite while the next one is loading.
    setTle(null);
    setPosition(null);
    setGroundTrack([]);
    setLoading(true);
    setError(null);

    const fetchTLE = async () => {
      try {
        const response = await fetch(
          `https://tle.ivanstanojevic.me/api/tle/${encodeURIComponent(catnr)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Orbital data request failed (HTTP ${response.status})`);
        }

        const data = (await response.json()) as TleResponse;
        if (
          typeof data.line1 !== "string" ||
          typeof data.line2 !== "string" ||
          !data.line1.startsWith("1 ") ||
          !data.line2.startsWith("2 ")
        ) {
          throw new Error("The orbital data provider returned an invalid TLE.");
        }

        if (isCurrentRequest) {
          setTle({ line1: data.line1, line2: data.line2 });
        }
      } catch (err) {
        if (isCurrentRequest && !controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Failed to fetch orbital data.");
          setLoading(false);
        }
      }
    };

    void fetchTLE();

    return () => {
      isCurrentRequest = false;
      controller.abort();
    };
  }, [catnr]);

  useEffect(() => {
    if (!tle) return;

    let isActive = true;

    const updatePosition = () => {
      try {
        const now = new Date();
        const satrec = satellite.twoline2satrec(tle.line1, tle.line2);
        const propagated = satellite.propagate(satrec, now);
        const positionEci = propagated.position;
        const velocityEci = propagated.velocity;

        if (
          satrec.error !== 0 ||
          typeof positionEci === "boolean" ||
          typeof velocityEci === "boolean"
        ) {
          throw new Error("Orbital propagation failed for the received TLE.");
        }

        const gmst = satellite.gstime(now);
        const positionGd = satellite.eciToGeodetic(
          positionEci as satellite.EciVec3<number>,
          gmst
        );
        const lat = satellite.degreesLat(positionGd.latitude);
        const lng = satellite.degreesLong(positionGd.longitude);
        const altitude = positionGd.height;
        const velocity = Math.sqrt(
          velocityEci.x ** 2 + velocityEci.y ** 2 + velocityEci.z ** 2
        );

        if (![lat, lng, altitude, velocity].every(Number.isFinite)) {
          throw new Error("Orbital propagation returned invalid coordinates.");
        }

        if (!isActive) return;

        setPosition({ lat, lng, altitude, velocity, timestamp: now.getTime() });
        setError(null);
        setLoading(false);
        setGroundTrack((previous) =>
          [...previous, { lat, lng }].slice(-100)
        );
      } catch (err) {
        if (isActive) {
          setError(err instanceof Error ? err.message : "Unable to calculate the satellite position.");
          setPosition(null);
          setLoading(false);
        }
      }
    };

    updatePosition();
    const interval = setInterval(updatePosition, 3000);

    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, [tle]);

  return { position, groundTrack, loading, error, tle };
}

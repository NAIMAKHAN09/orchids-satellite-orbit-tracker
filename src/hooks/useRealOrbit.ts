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

export function useRealOrbit(catnr: string) {
  const [tle, setTle] = useState<{ line1: string; line2: string } | null>(null);
  const [position, setPosition] = useState<SatellitePosition | null>(null);
  const [groundTrack, setGroundTrack] = useState<{ lat: number; lng: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchTLE = async () => {
      setLoading(true);
      setError(null);
      try {
        // Using a more reliable TLE API that supports CORS
        const response = await fetch(`https://tle.ivanstanojevic.me/api/tle/${catnr}`);
        const data = await response.json();
        
        if (data.line1 && data.line2 && isMounted) {
          setTle({ line1: data.line1, line2: data.line2 });
          setGroundTrack([]); // Reset ground track on satellite change
        } else if (isMounted) {
          throw new Error("Invalid TLE data received");
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to fetch orbital data");
          console.error(err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTLE();
    return () => { isMounted = false; };
  }, [catnr]);

  useEffect(() => {
    if (!tle) return;

    const updatePosition = () => {
      const now = new Date();
      const satrec = satellite.twoline2satrec(tle.line1, tle.line2);
      const positionAndVelocity = satellite.propagate(satrec, now);
      
      const positionEci = positionAndVelocity.position;
      const velocityEci = positionAndVelocity.velocity;

      if (typeof positionEci !== "boolean" && typeof velocityEci !== "boolean") {
        const gmst = satellite.gstime(now);
        const positionGd = satellite.eciToGeodetic(positionEci as satellite.EciVec3<number>, gmst);
        
        const lng = satellite.degreesLong(positionGd.longitude);
        const lat = satellite.degreesLat(positionGd.latitude);
        const alt = positionGd.height;
        
        const velMag = Math.sqrt(
          Math.pow(velocityEci.x, 2) + 
          Math.pow(velocityEci.y, 2) + 
          Math.pow(velocityEci.z, 2)
        );

        const newPos = {
          lat,
          lng,
          altitude: alt,
          velocity: velMag,
          timestamp: now.getTime()
        };

        setPosition(newPos);
        setGroundTrack(prev => {
          const next = [...prev, { lat, lng }];
          // Keep last 100 points for the track
          return next.slice(-100);
        });
      }
    };

    updatePosition();
    const interval = setInterval(updatePosition, 3000); // Update every 3 seconds as requested
    return () => clearInterval(interval);
  }, [tle]);

  return { position, groundTrack, loading, error, tle };
}

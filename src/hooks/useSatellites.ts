import { useEffect, useState } from "react"

interface Satellite {
  id: string
  name: string
  angle: number
  distance: number
  speed: number
  color: string
  orbitNumber: number
}

export function useSatellites() {
  const [satellites, setSatellites] = useState<Satellite[]>([
    {
      id: "iss",
      name: "ISS (Space Station)",
      angle: 0,
      distance: 110,
      speed: 1.2,
      color: "#06B6D4",
      orbitNumber: 142563,
    },
    {
      id: "hubble",
      name: "Hubble Telescope",
      angle: 180,
      distance: 160,
      speed: 0.6,
      color: "#10B981",
      orbitNumber: 194872,
    },
    {
      id: "jwst",
      name: "James Webb (L2)",
      angle: 45,
      distance: 220,
      speed: 0.3,
      color: "#F59E0B",
      orbitNumber: 842,
    },
    {
      id: "sentinel-1",
      name: "Sentinel-1 (ESA)",
      angle: 90,
      distance: 140,
      speed: 0.8,
      color: "#3B82F6",
      orbitNumber: 42156,
    },
    {
      id: "sentinel-2",
      name: "Sentinel-2 (ESA)",
      angle: 120,
      distance: 145,
      speed: 0.75,
      color: "#60A5FA",
      orbitNumber: 38942,
    },
    {
      id: "landsat-8",
      name: "Landsat 8 (NASA)",
      angle: 210,
      distance: 150,
      speed: 0.7,
      color: "#EF4444",
      orbitNumber: 56231,
    },
    {
      id: "landsat-9",
      name: "Landsat 9 (NASA)",
      angle: 240,
      distance: 155,
      speed: 0.65,
      color: "#F87171",
      orbitNumber: 12453,
    },
    {
      id: "noaa-20",
      name: "NOAA Weather Sat",
      angle: 300,
      distance: 130,
      speed: 0.9,
      color: "#A855F7",
      orbitNumber: 89542,
    },
    {
      id: "starlink",
      name: "Starlink Fleet",
      angle: 15,
      distance: 120,
      speed: 1.1,
      color: "#8B5CF6",
      orbitNumber: 5847,
    },
    {
      id: "gps",
      name: "GPS (Navstar)",
      angle: 330,
      distance: 190,
      speed: 0.4,
      color: "#EAB308",
      orbitNumber: 21456,
    },
    {
      id: "navic",
      name: "NavIC (IRNSS)",
      angle: 60,
      distance: 195,
      speed: 0.35,
      color: "#FF6B35",
      orbitNumber: 4521,
    },
    {
      id: "dove",
      name: "Planet Dove",
      angle: 270,
      distance: 125,
      speed: 1.0,
      color: "#2DD4BF",
      orbitNumber: 15423,
    },
    {
      id: "ham",
      name: "HAM Radio Sat",
      angle: 150,
      distance: 135,
      speed: 0.85,
      color: "#F472B6",
      orbitNumber: 2356,
    },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setSatellites((prev) =>
        prev.map((sat) => ({
          ...sat,
          angle: (sat.angle + sat.speed) % 360,
        }))
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return satellites
}

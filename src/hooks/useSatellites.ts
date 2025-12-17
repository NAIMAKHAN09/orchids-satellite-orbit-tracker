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
      id: "sat-1",
      name: "STARLINK-2401",
      angle: 0,
      distance: 140,
      speed: 0.8,
      color: "#8B5CF6",
      orbitNumber: 5847,
    },
    {
      id: "sat-2",
      name: "ISS",
      angle: 90,
      distance: 110,
      speed: 1.2,
      color: "#06B6D4",
      orbitNumber: 142563,
    },
    {
      id: "sat-3",
      name: "HUBBLE",
      angle: 180,
      distance: 160,
      speed: 0.6,
      color: "#10B981",
      orbitNumber: 194872,
    },
    {
      id: "sat-4",
      name: "TERRA",
      angle: 270,
      distance: 130,
      speed: 0.9,
      color: "#F59E0B",
      orbitNumber: 129456,
    },
    {
      id: "sat-5",
      name: "CHANDRAYAAN-3",
      angle: 45,
      distance: 170,
      speed: 0.5,
      color: "#FF6B35",
      orbitNumber: 2847,
    },
    {
      id: "sat-6",
      name: "ADITYA-L1",
      angle: 135,
      distance: 185,
      speed: 0.4,
      color: "#FFD700",
      orbitNumber: 156,
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

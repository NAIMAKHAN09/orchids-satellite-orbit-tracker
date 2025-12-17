"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Database } from "lucide-react"
import * as satellite from "satellite.js"

interface SatellitePosition {
  lat: number
  lng: number
  altitude: number
  velocity: number
}

const ISS_TLE_LINE1 = "1 25544U 98067A   24063.48644508  .00014387  00000+0  26154-3 0  9990"
const ISS_TLE_LINE2 = "2 25544  51.6416  60.4079 0005089 150.3957 263.8576 15.49893963441957"

export function WorldMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [position, setPosition] = useState<SatellitePosition>({
    lat: 0,
    lng: 0,
    altitude: 400,
    velocity: 7.66,
  })
  const [groundTrack, setGroundTrack] = useState<{ lat: number; lng: number }[]>([])
  const [tle, setTle] = useState({ line1: ISS_TLE_LINE1, line2: ISS_TLE_LINE2 })

  useEffect(() => {
    const fetchTLE = async () => {
      try {
        const response = await fetch("https://tle.ivanstanojevic.me/api/tle/25544")
        const data = await response.json()
        if (data.line1 && data.line2) {
          setTle({ line1: data.line1, line2: data.line2 })
        }
      } catch (error) {
        console.error("Error fetching TLE:", error)
      }
    }
    fetchTLE()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const satrec = satellite.twoline2satrec(tle.line1, tle.line2)
      const positionAndVelocity = satellite.propagate(satrec, now)
      
      const positionEci = positionAndVelocity.position
      if (typeof positionEci !== "boolean") {
        const gmst = satellite.gstime(now)
        const positionGd = satellite.eciToGeodetic(positionEci as satellite.EciVec3<number>, gmst)
        
        const longitude = satellite.degreesLong(positionGd.longitude)
        const latitude = satellite.degreesLat(positionGd.latitude)
        const height = positionGd.height
        
        // Velocity magnitude calculation
        const velocityEci = positionAndVelocity.velocity
        let velMag = 7.66
        if (typeof velocityEci !== "boolean") {
          velMag = Math.sqrt(
            Math.pow(velocityEci.x, 2) + 
            Math.pow(velocityEci.y, 2) + 
            Math.pow(velocityEci.z, 2)
          )
        }

        const newPos = {
          lat: latitude,
          lng: longitude,
          altitude: height,
          velocity: velMag,
        }
        
        setPosition(newPos)
        setGroundTrack((prev) => {
          const newTrack = [...prev, { lat: newPos.lat, lng: newPos.lng }]
          return newTrack.slice(-200)
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [tle])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.fillStyle = "#0a1628"
    ctx.fillRect(0, 0, width, height)

    ctx.strokeStyle = "rgba(59, 130, 246, 0.15)"
    ctx.lineWidth = 1
    for (let lat = -80; lat <= 80; lat += 20) {
      const y = height / 2 - (lat / 90) * (height / 2)
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
    for (let lng = -180; lng <= 180; lng += 30) {
      const x = (lng + 180) / 360 * width
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    drawContinents(ctx, width, height)

    if (groundTrack.length > 1) {
      ctx.strokeStyle = "rgba(34, 211, 238, 0.4)"
      ctx.lineWidth = 2
      ctx.beginPath()
      let lastX = 0
      groundTrack.forEach((point, i) => {
        const x = ((point.lng + 180) / 360) * width
        const y = height / 2 - (point.lat / 90) * (height / 2)
        if (i === 0) {
          ctx.moveTo(x, y)
          lastX = x
        } else {
          if (Math.abs(x - lastX) > width / 2) {
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
          lastX = x
        }
      })
      ctx.stroke()
    }

    const satX = ((position.lng + 180) / 360) * width
    const satY = height / 2 - (position.lat / 90) * (height / 2)

    const pulseGradient = ctx.createRadialGradient(satX, satY, 0, satX, satY, 25)
    pulseGradient.addColorStop(0, "rgba(34, 211, 238, 0.6)")
    pulseGradient.addColorStop(0.5, "rgba(34, 211, 238, 0.2)")
    pulseGradient.addColorStop(1, "rgba(34, 211, 238, 0)")
    ctx.fillStyle = pulseGradient
    ctx.beginPath()
    ctx.arc(satX, satY, 25, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "#22d3ee"
    ctx.beginPath()
    ctx.arc(satX, satY, 6, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "#fff"
    ctx.beginPath()
    ctx.arc(satX, satY, 3, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "#22d3ee"
    ctx.font = "bold 11px monospace"
    ctx.fillText("LEO-SAT-01", satX + 12, satY - 8)
    ctx.font = "10px monospace"
    ctx.fillStyle = "rgba(255,255,255,0.7)"
    ctx.fillText(`${position.lat.toFixed(2)}°, ${position.lng.toFixed(2)}°`, satX + 12, satY + 5)
  }, [position, groundTrack])

  return (
    <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-bold">GROUND TRACK</span>
        </div>
        <Badge variant="outline" className="border-cyan-500 text-cyan-400 text-xs">
          <Navigation className="w-3 h-3 mr-1" />
          LEO SATELLITE
        </Badge>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-lg overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          width={600}
          height={300}
          className="w-full h-auto rounded-lg"
        />
      </motion.div>

      <div className="mt-3 grid grid-cols-4 gap-2 text-center">
        <div className="p-2 rounded bg-secondary/30">
          <div className="text-xs text-muted-foreground font-mono">LAT</div>
          <div className="text-sm font-bold text-cyan-400">{position.lat.toFixed(2)}°</div>
        </div>
        <div className="p-2 rounded bg-secondary/30">
          <div className="text-xs text-muted-foreground font-mono">LNG</div>
          <div className="text-sm font-bold text-cyan-400">{position.lng.toFixed(2)}°</div>
        </div>
        <div className="p-2 rounded bg-secondary/30">
          <div className="text-xs text-muted-foreground font-mono">ALT</div>
          <div className="text-sm font-bold text-emerald-400">{position.altitude.toFixed(1)} km</div>
        </div>
        <div className="p-2 rounded bg-secondary/30">
          <div className="text-xs text-muted-foreground font-mono">VEL</div>
          <div className="text-sm font-bold text-amber-400">{position.velocity.toFixed(2)} km/s</div>
        </div>
      </div>
    </Card>
  )
}

function drawContinents(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = "rgba(34, 197, 94, 0.3)"
  ctx.strokeStyle = "rgba(34, 197, 94, 0.5)"
  ctx.lineWidth = 1

  const toX = (lng: number) => ((lng + 180) / 360) * width
  const toY = (lat: number) => height / 2 - (lat / 90) * (height / 2)

  ctx.beginPath()
  ctx.moveTo(toX(-125), toY(48))
  ctx.lineTo(toX(-65), toY(48))
  ctx.lineTo(toX(-55), toY(25))
  ctx.lineTo(toX(-80), toY(25))
  ctx.lineTo(toX(-100), toY(20))
  ctx.lineTo(toX(-117), toY(32))
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(toX(-80), toY(12))
  ctx.lineTo(toX(-35), toY(5))
  ctx.lineTo(toX(-35), toY(-5))
  ctx.lineTo(toX(-50), toY(-25))
  ctx.lineTo(toX(-70), toY(-55))
  ctx.lineTo(toX(-75), toY(-20))
  ctx.lineTo(toX(-80), toY(0))
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(toX(-10), toY(70))
  ctx.lineTo(toX(40), toY(70))
  ctx.lineTo(toX(50), toY(50))
  ctx.lineTo(toX(30), toY(35))
  ctx.lineTo(toX(-10), toY(35))
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(toX(-15), toY(35))
  ctx.lineTo(toX(50), toY(35))
  ctx.lineTo(toX(50), toY(0))
  ctx.lineTo(toX(20), toY(-35))
  ctx.lineTo(toX(-15), toY(5))
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(toX(60), toY(70))
  ctx.lineTo(toX(180), toY(70))
  ctx.lineTo(toX(140), toY(50))
  ctx.lineTo(toX(100), toY(25))
  ctx.lineTo(toX(70), toY(35))
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(toX(110), toY(-10))
  ctx.lineTo(toX(155), toY(-10))
  ctx.lineTo(toX(150), toY(-40))
  ctx.lineTo(toX(115), toY(-35))
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}

"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation } from "lucide-react"

interface SatellitePosition {
  lat: number
  lng: number
  altitude: number
  velocity: number
}

export function WorldMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [position, setPosition] = useState<SatellitePosition>({
    lat: 28.5,
    lng: -80.6,
    altitude: 408,
    velocity: 7.66,
  })
  const [groundTrack, setGroundTrack] = useState<{ lat: number; lng: number }[]>([])

  useEffect(() => {
    let time = 0
    const orbitPeriod = 92 * 60
    const inclination = 51.6
    
    const interval = setInterval(() => {
      time += 5
      
      const meanAnomaly = (time / orbitPeriod) * 360
      const lng = ((meanAnomaly + 180) % 360) - 180
      const lat = inclination * Math.sin((meanAnomaly * Math.PI) / 180)
      const altVariation = 408 + Math.sin((time / 100) * Math.PI) * 5
      const velVariation = 7.66 + Math.cos((time / 80) * Math.PI) * 0.05
      
      const newPos = {
        lat: lat,
        lng: lng,
        altitude: altVariation,
        velocity: velVariation,
      }
      
      setPosition(newPos)
      setGroundTrack((prev) => {
        const newTrack = [...prev, { lat: newPos.lat, lng: newPos.lng }]
        return newTrack.slice(-100)
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

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

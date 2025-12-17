"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface Satellite {
  id: string
  name: string
  angle: number
  distance: number
  speed: number
  color: string
}

interface EarthGlobeProps {
  satellites: Satellite[]
}

export function EarthGlobe({ satellites }: EarthGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let rotation = 0

    const drawEarth = () => {
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const earthRadius = 80

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const gradient = ctx.createRadialGradient(
        centerX - 20,
        centerY - 20,
        10,
        centerX,
        centerY,
        earthRadius
      )
      gradient.addColorStop(0, "rgba(100, 150, 255, 0.8)")
      gradient.addColorStop(0.5, "rgba(70, 120, 220, 0.6)")
      gradient.addColorStop(1, "rgba(30, 60, 150, 0.4)")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, earthRadius, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = "rgba(100, 200, 255, 0.3)"
      ctx.lineWidth = 1
      for (let i = -90; i <= 90; i += 30) {
        ctx.beginPath()
        const y = centerY + (earthRadius * Math.sin((i * Math.PI) / 180))
        const radius = earthRadius * Math.cos((i * Math.PI) / 180)
        ctx.ellipse(centerX, y, radius, radius * 0.3, 0, 0, Math.PI * 2)
        ctx.stroke()
      }

      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI) / 6 + rotation
        ctx.beginPath()
        ctx.moveTo(
          centerX + earthRadius * Math.cos(angle),
          centerY + earthRadius * Math.sin(angle) * 0.3
        )
        ctx.lineTo(
          centerX - earthRadius * Math.cos(angle),
          centerY - earthRadius * Math.sin(angle) * 0.3
        )
        ctx.stroke()
      }

      satellites.forEach((sat) => {
        const satAngle = (sat.angle * Math.PI) / 180
        const satX = centerX + sat.distance * Math.cos(satAngle)
        const satY = centerY + sat.distance * Math.sin(satAngle)

        ctx.strokeStyle = sat.color + "40"
        ctx.lineWidth = 1
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.arc(centerX, centerY, sat.distance, 0, Math.PI * 2)
        ctx.stroke()
        ctx.setLineDash([])

        const satGradient = ctx.createRadialGradient(satX, satY, 0, satX, satY, 6)
        satGradient.addColorStop(0, sat.color)
        satGradient.addColorStop(0.5, sat.color + "AA")
        satGradient.addColorStop(1, sat.color + "00")

        ctx.fillStyle = satGradient
        ctx.beginPath()
        ctx.arc(satX, satY, 6, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = sat.color
        ctx.beginPath()
        ctx.arc(satX, satY, 3, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = sat.color
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(satX, satY)
        ctx.stroke()
      })

      rotation += 0.002
    }

    const animate = () => {
      drawEarth()
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [satellites])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative flex items-center justify-center"
    >
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="rounded-lg"
      />
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
    </motion.div>
  )
}

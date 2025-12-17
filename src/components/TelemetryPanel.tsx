"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TelemetryData {
  temperature: number
  power: number
  signalStrength: number
  batteryLevel: number
  solarPanelStatus: boolean
  dataTransmission: number
}

interface TelemetryPanelProps {
  satelliteName: string
  color: string
  delay?: number
}

export function TelemetryPanel({ satelliteName, color, delay = 0 }: TelemetryPanelProps) {
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    temperature: 0,
    power: 0,
    signalStrength: 0,
    batteryLevel: 0,
    solarPanelStatus: true,
    dataTransmission: 0,
  })

  useEffect(() => {
    const updateTelemetry = () => {
      setTelemetry({
        temperature: -20 + Math.random() * 100,
        power: 80 + Math.random() * 20,
        signalStrength: 70 + Math.random() * 30,
        batteryLevel: 85 + Math.random() * 15,
        solarPanelStatus: Math.random() > 0.1,
        dataTransmission: Math.random() * 1000,
      })
    }

    updateTelemetry()
    const interval = setInterval(updateTelemetry, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold" style={{ color }}>{satelliteName}</h3>
            <Badge variant="outline" className="text-xs pulse-glow" style={{ borderColor: color, color }}>
              ACTIVE
            </Badge>
          </div>
          <div className="text-[10px] text-muted-foreground font-mono mb-3">SIMULATED TELEMETRY</div>

        <div className="space-y-2">
          <DataRow label="TEMP" value={`${telemetry.temperature.toFixed(1)}°C`} color={color} />
          <DataRow label="PWR" value={`${telemetry.power.toFixed(1)}%`} color={color} />
          <DataRow label="SIG" value={`${telemetry.signalStrength.toFixed(1)} dBm`} color={color} />
          <DataRow label="BAT" value={`${telemetry.batteryLevel.toFixed(1)}%`} color={color} />
          <DataRow 
            label="SOL" 
            value={telemetry.solarPanelStatus ? "OPERATIONAL" : "OFFLINE"} 
            color={telemetry.solarPanelStatus ? color : "#ff4444"} 
          />
          <DataRow label="TX" value={`${telemetry.dataTransmission.toFixed(0)} Kb/s`} color={color} />
        </div>
      </Card>
    </motion.div>
  )
}

function DataRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="text-muted-foreground font-mono">{label}</span>
      <span className="font-mono font-semibold" style={{ color }}>{value}</span>
    </div>
  )
}

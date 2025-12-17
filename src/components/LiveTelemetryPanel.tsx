"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Thermometer, 
  Gauge, 
  Battery, 
  Signal, 
  Zap,
  Cpu
} from "lucide-react"

interface TelemetryData {
  altitude: number
  velocity: number
  battery: number
  temperature: number
  signalStrength: number
  solarPower: number
  cpuUsage: number
  fuelLevel: number
}

export function LiveTelemetryPanel() {
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    altitude: 408,
    velocity: 7.66,
    battery: 94,
    temperature: 22,
    signalStrength: -68,
    solarPower: 4.2,
    cpuUsage: 34,
    fuelLevel: 87,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => ({
        altitude: 408 + (Math.random() - 0.5) * 10,
        velocity: 7.66 + (Math.random() - 0.5) * 0.1,
        battery: Math.max(20, Math.min(100, prev.battery + (Math.random() - 0.48) * 2)),
        temperature: 22 + (Math.random() - 0.5) * 30,
        signalStrength: -68 + (Math.random() - 0.5) * 20,
        solarPower: Math.max(0, 4.2 + (Math.random() - 0.5) * 1),
        cpuUsage: Math.max(15, Math.min(80, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        fuelLevel: Math.max(0, prev.fuelLevel - Math.random() * 0.01),
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (value: number, thresholds: { good: number; warn: number }) => {
    if (value >= thresholds.good) return "text-emerald-400"
    if (value >= thresholds.warn) return "text-amber-400"
    return "text-red-400"
  }

  const getSignalBars = (db: number) => {
    if (db > -60) return 5
    if (db > -70) return 4
    if (db > -80) return 3
    if (db > -90) return 2
    return 1
  }

  return (
    <Card className="p-5 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Gauge className="w-5 h-5 text-primary" />
          LIVE TELEMETRY
        </h3>
        <Badge variant="outline" className="border-emerald-500 text-emerald-400 pulse-glow text-xs">
          STREAMING
        </Badge>
      </div>

      <div className="space-y-4">
        <TelemetryRow
          icon={<Gauge className="w-4 h-4" />}
          label="ALTITUDE"
          value={`${telemetry.altitude.toFixed(1)} km`}
          subValue="Low Earth Orbit"
          color="text-cyan-400"
          progress={(telemetry.altitude / 500) * 100}
          progressColor="bg-cyan-400"
        />

        <TelemetryRow
          icon={<Zap className="w-4 h-4" />}
          label="VELOCITY"
          value={`${telemetry.velocity.toFixed(2)} km/s`}
          subValue="27,576 km/h"
          color="text-amber-400"
          progress={(telemetry.velocity / 8) * 100}
          progressColor="bg-amber-400"
        />

        <TelemetryRow
          icon={<Battery className="w-4 h-4" />}
          label="BATTERY"
          value={`${telemetry.battery.toFixed(1)}%`}
          subValue={telemetry.battery > 50 ? "Charging" : "Discharging"}
          color={getStatusColor(telemetry.battery, { good: 70, warn: 40 })}
          progress={telemetry.battery}
          progressColor={telemetry.battery > 70 ? "bg-emerald-400" : telemetry.battery > 40 ? "bg-amber-400" : "bg-red-400"}
        />

        <TelemetryRow
          icon={<Thermometer className="w-4 h-4" />}
          label="TEMPERATURE"
          value={`${telemetry.temperature.toFixed(1)}°C`}
          subValue={telemetry.temperature > 30 ? "Cooling Active" : "Nominal"}
          color={Math.abs(telemetry.temperature) > 40 ? "text-red-400" : Math.abs(telemetry.temperature) > 30 ? "text-amber-400" : "text-emerald-400"}
          progress={((telemetry.temperature + 50) / 100) * 100}
          progressColor={Math.abs(telemetry.temperature) > 40 ? "bg-red-400" : "bg-emerald-400"}
        />

        <div className="flex items-center justify-between py-2 border-t border-border/30">
          <div className="flex items-center gap-2">
            <Signal className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-mono">SIGNAL</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5 h-4 items-end">
              {[1, 2, 3, 4, 5].map((bar) => (
                <motion.div
                  key={bar}
                  animate={{ opacity: bar <= getSignalBars(telemetry.signalStrength) ? 1 : 0.2 }}
                  className={`w-1.5 rounded-sm ${bar <= getSignalBars(telemetry.signalStrength) ? "bg-emerald-400" : "bg-muted"}`}
                  style={{ height: `${bar * 4}px` }}
                />
              ))}
            </div>
            <span className="text-sm font-mono font-bold text-emerald-400">
              {telemetry.signalStrength.toFixed(0)} dBm
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-xs text-muted-foreground font-mono">SOLAR</span>
            </div>
            <div className="text-lg font-bold text-yellow-400">
              {telemetry.solarPower.toFixed(1)} kW
            </div>
          </div>
          <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-mono">CPU</span>
            </div>
            <div className={`text-lg font-bold ${telemetry.cpuUsage > 60 ? "text-amber-400" : "text-emerald-400"}`}>
              {telemetry.cpuUsage.toFixed(0)}%
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

function TelemetryRow({
  icon,
  label,
  value,
  subValue,
  color,
  progress,
  progressColor,
}: {
  icon: React.ReactNode
  label: string
  value: string
  subValue: string
  color: string
  progress: number
  progressColor: string
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{icon}</span>
          <span className="text-xs text-muted-foreground font-mono">{label}</span>
        </div>
        <div className="text-right">
          <motion.span
            key={value}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            className={`text-sm font-mono font-bold ${color}`}
          >
            {value}
          </motion.span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-secondary/50 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${progressColor} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-[10px] text-muted-foreground w-16 text-right">{subValue}</span>
      </div>
    </div>
  )
}

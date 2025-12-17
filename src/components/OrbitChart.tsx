"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"

interface DataPoint {
  time: string
  altitude: number
}

interface OrbitChartProps {
  satelliteName: string
  color: string
}

export function OrbitChart({ satelliteName, color }: OrbitChartProps) {
  const [data, setData] = useState<DataPoint[]>([])

  useEffect(() => {
    const baseAltitude = 400 + Math.random() * 200
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: `T-${20 - i}`,
      altitude: baseAltitude + Math.sin(i * 0.5) * 30 + Math.random() * 10,
    }))
    setData(initialData)

    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev.slice(1)]
        const lastAltitude = prev[prev.length - 1].altitude
        newData.push({
          time: "NOW",
          altitude: lastAltitude + (Math.random() - 0.5) * 15,
        })
        return newData.map((d, i) => ({
          ...d,
          time: i === newData.length - 1 ? "NOW" : `T-${newData.length - i}`,
        }))
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
        <h3 className="text-sm font-bold mb-3" style={{ color }}>
          {satelliteName} - ALTITUDE TRACKING
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="time" 
              stroke="rgba(255,255,255,0.3)" 
              style={{ fontSize: "10px", fontFamily: "IBM Plex Mono" }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.3)" 
              style={{ fontSize: "10px", fontFamily: "IBM Plex Mono" }}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(20, 20, 40, 0.95)",
                border: `1px solid ${color}`,
                borderRadius: "8px",
                fontSize: "11px",
                fontFamily: "IBM Plex Mono",
              }}
              labelStyle={{ color }}
            />
            <Line
              type="monotone"
              dataKey="altitude"
              stroke={color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  )
}

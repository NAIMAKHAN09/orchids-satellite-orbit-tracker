"use client"

import { motion } from "framer-motion"
import { Satellite, Radio, Activity, Radar } from "lucide-react"
import { EarthGlobe } from "@/components/EarthGlobe"
import { TelemetryPanel } from "@/components/TelemetryPanel"
import { OrbitChart } from "@/components/OrbitChart"
import { useSatellites } from "@/hooks/useSatellites"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  const satellites = useSatellites()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <header className="border-b border-border/50 backdrop-blur-sm bg-background/50">
          <div className="container mx-auto px-6 py-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
                  <Satellite className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-wider">ORBITAL COMMAND</h1>
                  <p className="text-xs text-muted-foreground font-mono">Real-Time Satellite Tracking System</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="pulse-glow border-accent text-accent">
                  <Activity className="w-3 h-3 mr-1" />
                  LIVE
                </Badge>
                <Badge variant="outline" className="border-primary text-primary">
                  <Radar className="w-3 h-3 mr-1" />
                  {satellites.length} TRACKED
                </Badge>
              </div>
            </motion.div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">ORBITAL VISUALIZATION</h2>
                    <Badge variant="secondary" className="font-mono text-xs">
                      <Radio className="w-3 h-3 mr-1" />
                      TRACKING MODE
                    </Badge>
                  </div>
                  <div className="flex justify-center">
                    <EarthGlobe satellites={satellites} />
                  </div>
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {satellites.map((sat, i) => (
                      <motion.div
                        key={sat.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                        className="p-3 rounded-lg bg-secondary/30 border border-border/30 hover:border-primary/50 transition-all"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className="w-2 h-2 rounded-full pulse-glow"
                            style={{ backgroundColor: sat.color }}
                          />
                          <span className="text-xs font-bold truncate">{sat.name}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          ALT: {sat.distance * 3}km
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          VEL: {(sat.speed * 7.5).toFixed(1)}km/s
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {satellites.slice(0, 2).map((sat) => (
                  <OrbitChart key={sat.id} satelliteName={sat.name} color={sat.color} />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-accent" />
                  TELEMETRY DATA
                </h2>
              </motion.div>
              {satellites.map((sat, i) => (
                <TelemetryPanel
                  key={sat.id}
                  satelliteName={sat.name}
                  color={sat.color}
                  delay={0.3 + i * 0.1}
                />
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8"
          >
            <Card className="p-6 bg-card/30 backdrop-blur-sm border-border/30">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">{satellites.length}</div>
                  <div className="text-xs text-muted-foreground font-mono">ACTIVE SATELLITES</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent mb-1">98.7%</div>
                  <div className="text-xs text-muted-foreground font-mono">UPTIME</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-chart-3 mb-1">2.4TB</div>
                  <div className="text-xs text-muted-foreground font-mono">DATA COLLECTED</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-chart-4 mb-1">847</div>
                  <div className="text-xs text-muted-foreground font-mono">ORBITS COMPLETED</div>
                </div>
              </div>
            </Card>
          </motion.div>
        </main>
      </div>

      <div className="fixed bottom-4 right-4 z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <Badge variant="outline" className="text-xs font-mono border-muted-foreground/30 text-muted-foreground">
            SYS_TIME: {new Date().toISOString().split('T')[1].slice(0, 8)} UTC
          </Badge>
        </motion.div>
      </div>
    </div>
  )
}

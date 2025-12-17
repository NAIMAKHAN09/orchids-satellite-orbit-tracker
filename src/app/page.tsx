"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Satellite, Radio, Activity, Radar, Globe, Cpu, Clock, Target, Sparkles, ChevronDown, Check } from "lucide-react"
import { EarthGlobe } from "@/components/EarthGlobe"
import { TelemetryPanel } from "@/components/TelemetryPanel"
import { OrbitChart } from "@/components/OrbitChart"
import { WorldMap } from "@/components/WorldMap"
import { LiveTelemetryPanel } from "@/components/LiveTelemetryPanel"
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
                  <p className="text-xs text-muted-foreground font-mono">Satellite Data Visualizer</p>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Card className="p-6 bg-gradient-to-r from-primary/10 via-card/50 to-accent/10 backdrop-blur-sm border-primary/20">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                    Satellite Data Visualizer
                    <Badge variant="secondary" className="text-xs">SIMULATION</Badge>
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
                    Real-time satellite orbit tracking and telemetry monitoring dashboard. 
                    This simulation demonstrates orbital mechanics, ground track visualization, 
                    and live telemetry data streams from Low Earth Orbit satellites. 
                    Watch as satellites traverse their orbital paths while monitoring critical 
                    parameters like altitude, velocity, temperature, and signal strength.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
                    <Clock className="w-3 h-3 mr-1" />
                    92 min orbit
                  </Badge>
                  <Badge variant="outline" className="border-emerald-500/50 text-emerald-400">
                    <Target className="w-3 h-3 mr-1" />
                    408 km alt
                  </Badge>
                </div>
              </div>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold">ORBIT VIEW</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold">3D ORBITAL VISUALIZATION</h3>
                      <Badge variant="secondary" className="font-mono text-xs">
                        <Radio className="w-3 h-3 mr-1" />
                        TRACKING
                      </Badge>
                    </div>
                    <div className="flex justify-center">
                      <EarthGlobe satellites={satellites} />
                    </div>
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {satellites.slice(0, 6).map((sat, i) => (
                        <motion.div
                          key={sat.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                          className="p-2 rounded-lg bg-secondary/30 border border-border/30 hover:border-primary/50 transition-all"
                        >
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <div
                              className="w-2 h-2 rounded-full pulse-glow"
                              style={{ backgroundColor: sat.color }}
                            />
                            <span className="text-[10px] font-bold truncate">{sat.name}</span>
                          </div>
                          <div className="text-[9px] text-muted-foreground font-mono">
                            ORB #{sat.orbitNumber.toLocaleString()}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card>

                  <WorldMap />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-bold">TELEMETRY</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-1">
                    <LiveTelemetryPanel />
                  </div>
                  <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {satellites.slice(0, 4).map((sat, i) => (
                      <TelemetryPanel
                        key={sat.id}
                        satelliteName={sat.name}
                        color={sat.color}
                        delay={0.3 + i * 0.05}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Cpu className="w-5 h-5 text-chart-3" />
                  <h2 className="text-lg font-bold">MISSION STATUS</h2>
                </div>
                <Card className="p-6 bg-card/30 backdrop-blur-sm border-border/30">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mb-6">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {satellites.slice(0, 2).map((sat) => (
                      <OrbitChart key={sat.id} satelliteName={sat.name} color={sat.color} />
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>

            <div className="xl:col-span-1 space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Radar className="w-5 h-5 text-chart-4" />
                  <h2 className="text-sm font-bold">SATELLITE STATUS</h2>
                </div>
              </motion.div>
              {satellites.map((sat, i) => (
                <motion.div
                  key={sat.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                >
                  <Card className="p-3 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full pulse-glow"
                          style={{ backgroundColor: sat.color }}
                        />
                        <span className="text-xs font-bold" style={{ color: sat.color }}>{sat.name}</span>
                      </div>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0" style={{ borderColor: sat.color, color: sat.color }}>
                        ACTIVE
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-muted-foreground">
                      <div>ALT: {sat.distance * 3}km</div>
                      <div>VEL: {(sat.speed * 7.5).toFixed(1)}km/s</div>
                      <div>ORB: #{sat.orbitNumber.toLocaleString()}</div>
                      <div>INC: 51.6°</div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8"
          >
            <Card className="p-6 bg-gradient-to-r from-amber-500/10 via-card/30 to-orange-500/10 backdrop-blur-sm border-amber-500/20">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/30">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                    Inspired by Real Satellite Work
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This visualization draws from hands-on experience with satellite tracking systems 
                    and orbital mechanics. The telemetry parameters, ground track calculations, and 
                    orbital period simulations reflect real-world satellite operations concepts used 
                    in mission control centers. From understanding Keplerian orbital elements to 
                    implementing Two-Line Element (TLE) parsing, satellite tracking combines 
                    fascinating physics with practical engineering challenges.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="outline" className="text-xs border-amber-500/50 text-amber-400">Orbital Mechanics</Badge>
                    <Badge variant="outline" className="text-xs border-amber-500/50 text-amber-400">TLE Data Processing</Badge>
                    <Badge variant="outline" className="text-xs border-amber-500/50 text-amber-400">Ground Station Ops</Badge>
                    <Badge variant="outline" className="text-xs border-amber-500/50 text-amber-400">Telemetry Systems</Badge>
                  </div>
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

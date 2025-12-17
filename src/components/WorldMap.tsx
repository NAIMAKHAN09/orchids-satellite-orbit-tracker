"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Database, ChevronDown, Check, Loader2 } from "lucide-react"
import { useRealOrbit, SATELLITE_REGISTRY } from "@/hooks/useRealOrbit"
import dynamic from "next/dynamic"

const LeafletMap = dynamic(() => import("./LeafletMap"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-secondary/20 rounded-lg">
      <Loader2 className="w-6 h-6 text-primary animate-spin" />
    </div>
  )
})

export function WorldMap() {
  const [selectedSatId, setSelectedSatId] = useState("iss")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const selectedSat = SATELLITE_REGISTRY.find(s => s.id === selectedSatId) || SATELLITE_REGISTRY[0]
  
  const { position, groundTrack, loading, error } = useRealOrbit(selectedSat.catnr)

  return (
    <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-bold uppercase tracking-wider">Ground Track</span>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-2 py-1 rounded bg-secondary/50 border border-border/50 hover:border-primary/50 transition-all text-[10px] font-bold"
          >
            {selectedSat.name}
            <ChevronDown className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-card/95 backdrop-blur-sm border border-border/50 rounded shadow-xl z-50">
              <div className="p-1">
                {SATELLITE_REGISTRY.map((sat) => (
                  <button
                    key={sat.id}
                    onClick={() => {
                      setSelectedSatId(sat.id)
                      setDropdownOpen(false)
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-secondary/50 transition-all text-left text-[10px]"
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: sat.color }} />
                    <span className="flex-1">{sat.name}</span>
                    {selectedSatId === sat.id && <Check className="w-3 h-3 text-primary" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="text-[9px] border-cyan-500/50 text-cyan-400 px-1.5 py-0">
          <Navigation className="w-2.5 h-2.5 mr-1" />
          REAL-TIME TLE TRACKING
        </Badge>
        <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
          <Database className="w-2.5 h-2.5" />
          Source: Celestrak TLE
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-lg overflow-hidden bg-[#0a1628] aspect-[2/1]"
      >
        {loading && !position && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/20 backdrop-blur-[2px]">
            <Loader2 className="w-6 h-6 text-primary animate-spin mb-2" />
            <span className="text-[10px] font-mono animate-pulse">ACQUIRING ORBITAL ELEMENTS...</span>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-red-500/10 backdrop-blur-[2px]">
            <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest">{error}</span>
          </div>
        )}

        {position && (
          <LeafletMap 
            position={position} 
            groundTrack={groundTrack} 
            color={selectedSat.color} 
            name={selectedSat.name}
          />
        )}
        
        {selectedSatId === "iss" && (
          <div className="absolute top-2 left-2 z-[1000] pointer-events-none">
            <Badge variant="secondary" className="bg-primary/20 text-[8px] border-primary/30 uppercase">
              Demo Lock: ISS Active
            </Badge>
          </div>
        )}
      </motion.div>

      {position && (
        <div className="mt-3 grid grid-cols-4 gap-2 text-center">
          <div className="p-2 rounded bg-secondary/30 border border-border/20">
            <div className="text-[9px] text-muted-foreground font-mono uppercase">Latitude</div>
            <div className="text-xs font-bold text-cyan-400">{position.lat.toFixed(2)}°</div>
          </div>
          <div className="p-2 rounded bg-secondary/30 border border-border/20">
            <div className="text-[9px] text-muted-foreground font-mono uppercase">Longitude</div>
            <div className="text-xs font-bold text-cyan-400">{position.lng.toFixed(2)}°</div>
          </div>
          <div className="p-2 rounded bg-secondary/30 border border-border/20">
            <div className="text-[9px] text-muted-foreground font-mono uppercase">Altitude</div>
            <div className="text-xs font-bold text-emerald-400">{position.altitude.toFixed(1)} km</div>
          </div>
          <div className="p-2 rounded bg-secondary/30 border border-border/20">
            <div className="text-[9px] text-muted-foreground font-mono uppercase">Velocity</div>
            <div className="text-xs font-bold text-amber-400">{position.velocity.toFixed(2)} km/s</div>
          </div>
        </div>
      )}
      
      <div className="mt-2 text-[8px] text-muted-foreground italic text-right">
        Other satellites can be added using public TLE data
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

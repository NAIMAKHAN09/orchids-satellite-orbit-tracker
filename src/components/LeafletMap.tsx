"use client"

import { MapContainer, TileLayer, Marker, Polyline, useMap, LayersControl } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect, useState } from "react"

// Fix for default marker icons in Leaflet with Next.js
// @ts-ignore
if (typeof window !== 'undefined') {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  })
}

interface LeafletMapProps {
  position: { lat: number; lng: number }
  groundTrack: { lat: number; lng: number }[]
  color: string
  name: string
  id: string
}

function RecenterMap({ position }: { position: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    // Optional: center map on satellite change
  }, [position, map])
  return null
}

export default function LeafletMap({ position, groundTrack, color, name, id }: LeafletMapProps) {
  const satPos: [number, number] = [position.lat, position.lng]
  const [mapType, setMapType] = useState('y') // Default to Hybrid
  
  const polylinePositions = groundTrack.map(p => [p.lat, p.lng] as [number, number])

  // Custom icon for the satellite
  const satelliteIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="position: relative;">
        <div style="
          width: 14px; 
          height: 14px; 
          background-color: ${color}; 
          border: 2px solid white; 
          border-radius: 50%;
          box-shadow: 0 0 10px ${color}, 0 0 5px rgba(0,0,0,0.5);
        "></div>
        <div style="
          position: absolute;
          left: 20px;
          top: -10px;
          white-space: nowrap;
          color: white;
          font-weight: bold;
          font-size: 12px;
          text-shadow: 1px 1px 2px black;
          pointer-events: none;
          background: rgba(0,0,0,0.4);
          padding: 2px 6px;
          border-radius: 4px;
          backdrop-filter: blur(2px);
          border: 1px solid rgba(255,255,255,0.2);
        ">
          ${name}
        </div>
      </div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  })

  return (
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden shadow-2xl border border-white/10 relative">
      <MapContainer 
        key={id}
        center={satPos} 
        zoom={3} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', background: '#0a1628' }}
        attributionControl={true}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Google Hybrid">
            <TileLayer
              attribution='&copy; <a href="https://www.google.com/help/terms_maps/">Google Maps</a>'
              url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
              maxZoom={20}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Google Satellite">
            <TileLayer
              attribution='&copy; <a href="https://www.google.com/help/terms_maps/">Google Maps</a>'
              url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
              maxZoom={20}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Google Roadmap">
            <TileLayer
              attribution='&copy; <a href="https://www.google.com/help/terms_maps/">Google Maps</a>'
              url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
              maxZoom={20}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Google Terrain">
            <TileLayer
              attribution='&copy; <a href="https://www.google.com/help/terms_maps/">Google Maps</a>'
              url="https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
              maxZoom={20}
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        
        {/* Ground Track */}
        <Polyline 
          positions={polylinePositions} 
          pathOptions={{ color: color, weight: 3, opacity: 0.8, dashArray: '5, 10' }} 
        />
        
        {/* Current Position Marker */}
        <Marker position={satPos} icon={satelliteIcon} />
        
        <RecenterMap position={satPos} />
      </MapContainer>

      {/* Custom UI Elements to mimic Google Maps */}
      <div className="absolute bottom-6 left-2 z-[1000] pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md p-2 rounded shadow-lg border border-black/10 text-[10px] text-black font-semibold flex items-center gap-2">
          <div className="w-3 h-3 rounded-full animate-pulse bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.8)]" />
          Live Orbital Position
        </div>
      </div>
    </div>
  )
}

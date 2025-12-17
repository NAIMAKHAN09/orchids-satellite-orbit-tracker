"use client"

import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect } from "react"

// Fix for default marker icons in Leaflet with Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

interface LeafletMapProps {
  position: { lat: number; lng: number }
  groundTrack: { lat: number; lng: number }[]
  color: string
  name: string
  id: string
}

export default function LeafletMap({ position, groundTrack, color, name, id }: LeafletMapProps) {
  const satPos: [number, number] = [position.lat, position.lng]
  
  const polylinePositions = groundTrack.map(p => [p.lat, p.lng] as [number, number])

  // Custom icon for the satellite
  const satelliteIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="position: relative;">
        <div style="
          width: 12px; 
          height: 12px; 
          background-color: ${color}; 
          border: 2px solid white; 
          border-radius: 50%;
          box-shadow: 0 0 10px ${color};
        "></div>
        <div style="
          position: absolute;
          left: 18px;
          top: -10px;
          white-space: nowrap;
          color: white;
          font-weight: bold;
          font-size: 11px;
          text-shadow: 1px 1px 2px black;
          pointer-events: none;
        ">
          ${name}
        </div>
      </div>
    `,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  })

  return (
    <div className="w-full h-full min-h-[300px] rounded-lg overflow-hidden border border-border/50">
      <MapContainer 
        key={id}
        center={[0, 0]} 
        zoom={2} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', background: '#0a1628' }}
        attributionControl={false}
      >

        {/* Google Hybrid (Satellite + Roads) */}
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          maxZoom={20}
        />
        
        {/* Ground Track */}
        <Polyline 
          positions={polylinePositions} 
          pathOptions={{ color: color, weight: 2, opacity: 0.6, dashArray: '5, 10' }} 
        />
        
        {/* Current Position Marker */}
        <Marker position={satPos} icon={satelliteIcon} />
        
        <RecenterMap position={satPos} />
      </MapContainer>
    </div>
  )
}

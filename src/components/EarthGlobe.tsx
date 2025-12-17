"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import * as THREE from "three"

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
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    earth: THREE.Mesh
    atmosphere: THREE.Mesh
    satelliteMeshes: THREE.Group[]
    orbitLines: THREE.Line[]
  } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const width = 400
    const height = 400

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
    directionalLight.position.set(5, 3, 5)
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0x64a0ff, 0.8, 100)
    pointLight.position.set(-5, -3, 2)
    scene.add(pointLight)

    const earthGeometry = new THREE.SphereGeometry(1, 64, 64)
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2244aa,
      emissive: 0x112244,
      emissiveIntensity: 0.2,
      shininess: 25,
    })
    const earth = new THREE.Mesh(earthGeometry, earthMaterial)
    scene.add(earth)

    const atmosphereGeometry = new THREE.SphereGeometry(1.15, 64, 64)
    const atmosphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x4488ff,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    })
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
    scene.add(atmosphere)

    const gridMaterial = new THREE.LineBasicMaterial({ color: 0x4488cc, transparent: true, opacity: 0.3 })

    for (let i = -60; i <= 60; i += 30) {
      const phi = (90 - i) * (Math.PI / 180)
      const radius = Math.sin(phi)
      const y = Math.cos(phi)
      const points: THREE.Vector3[] = []
      for (let j = 0; j <= 64; j++) {
        const theta = (j / 64) * Math.PI * 2
        points.push(new THREE.Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius))
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(geometry, gridMaterial)
      earth.add(line)
    }

    for (let i = 0; i < 12; i++) {
      const points: THREE.Vector3[] = []
      const theta = (i / 12) * Math.PI * 2
      for (let j = 0; j <= 32; j++) {
        const phi = (j / 32) * Math.PI
        points.push(new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta),
          Math.cos(phi),
          Math.sin(phi) * Math.sin(theta)
        ))
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(geometry, gridMaterial)
      earth.add(line)
    }

    const continentsMaterial = new THREE.LineBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.4 })
    const continentShapes = [
      { lat: [30, 40, 50, 45, 35], lon: [-120, -100, -80, -75, -90] },
      { lat: [10, 20, 15, 5, 0], lon: [-80, -70, -50, -40, -60] },
      { lat: [35, 45, 55, 50, 40], lon: [0, 20, 30, 40, 10] },
      { lat: [30, 40, 35, 25, 20], lon: [70, 100, 120, 110, 80] },
      { lat: [-20, -10, -30, -35, -25], lon: [130, 150, 145, 135, 125] },
    ]
    
    continentShapes.forEach(shape => {
      const points: THREE.Vector3[] = []
      for (let i = 0; i < shape.lat.length; i++) {
        const lat = shape.lat[i] * (Math.PI / 180)
        const lon = shape.lon[i] * (Math.PI / 180)
        points.push(new THREE.Vector3(
          Math.cos(lat) * Math.cos(lon),
          Math.sin(lat),
          Math.cos(lat) * Math.sin(lon)
        ))
      }
      points.push(points[0].clone())
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(geometry, continentsMaterial)
      earth.add(line)
    })

    const satelliteMeshes: THREE.Group[] = []
    const orbitLines: THREE.Line[] = []

    sceneRef.current = { scene, camera, renderer, earth, atmosphere, satelliteMeshes, orbitLines }

    let isDragging = false
    let previousMousePosition = { x: 0, y: 0 }
    let rotationVelocity = { x: 0, y: 0 }

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      previousMousePosition = { x: e.clientX, y: e.clientY }
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const deltaX = e.clientX - previousMousePosition.x
      const deltaY = e.clientY - previousMousePosition.y
      rotationVelocity.x = deltaY * 0.005
      rotationVelocity.y = deltaX * 0.005
      previousMousePosition = { x: e.clientX, y: e.clientY }
    }

    const onMouseUp = () => {
      isDragging = false
    }

    renderer.domElement.addEventListener('mousedown', onMouseDown)
    renderer.domElement.addEventListener('mousemove', onMouseMove)
    renderer.domElement.addEventListener('mouseup', onMouseUp)
    renderer.domElement.addEventListener('mouseleave', onMouseUp)

    let animationFrameId: number

    const animate = () => {
      if (!sceneRef.current) return

      if (!isDragging) {
        rotationVelocity.x *= 0.95
        rotationVelocity.y *= 0.95
        earth.rotation.y += 0.002
      }

      earth.rotation.x += rotationVelocity.x
      earth.rotation.y += rotationVelocity.y

      sceneRef.current.satelliteMeshes.forEach((group, i) => {
        if (satellites[i]) {
          const sat = satellites[i]
          const angle = (sat.angle * Math.PI) / 180
          const orbitRadius = 1.3 + (sat.distance - 100) * 0.008
          group.position.x = Math.cos(angle) * orbitRadius
          group.position.z = Math.sin(angle) * orbitRadius
          group.position.y = Math.sin(angle * 0.5) * 0.3
        }
      })

      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      renderer.domElement.removeEventListener('mousedown', onMouseDown)
      renderer.domElement.removeEventListener('mousemove', onMouseMove)
      renderer.domElement.removeEventListener('mouseup', onMouseUp)
      renderer.domElement.removeEventListener('mouseleave', onMouseUp)
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  useEffect(() => {
    if (!sceneRef.current) return

    const { scene, satelliteMeshes, orbitLines } = sceneRef.current

    satelliteMeshes.forEach(mesh => scene.remove(mesh))
    orbitLines.forEach(line => scene.remove(line))
    satelliteMeshes.length = 0
    orbitLines.length = 0

    satellites.forEach(sat => {
      const orbitRadius = 1.3 + (sat.distance - 100) * 0.008
      const orbitPoints: THREE.Vector3[] = []
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2
        orbitPoints.push(new THREE.Vector3(
          Math.cos(theta) * orbitRadius,
          Math.sin(theta * 0.5) * 0.3,
          Math.sin(theta) * orbitRadius
        ))
      }
      const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints)
      const orbitMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color(sat.color),
        transparent: true,
        opacity: 0.3,
      })
      const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial)
      scene.add(orbitLine)
      orbitLines.push(orbitLine)

      const satGroup = new THREE.Group()

      const satGeometry = new THREE.SphereGeometry(0.06, 16, 16)
      const satMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(sat.color) })
      const satMesh = new THREE.Mesh(satGeometry, satMaterial)
      satGroup.add(satMesh)

      const glowGeometry = new THREE.SphereGeometry(0.12, 16, 16)
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(sat.color),
        transparent: true,
        opacity: 0.3,
      })
      const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial)
      satGroup.add(glowMesh)

      const angle = (sat.angle * Math.PI) / 180
      satGroup.position.x = Math.cos(angle) * orbitRadius
      satGroup.position.z = Math.sin(angle) * orbitRadius
      satGroup.position.y = Math.sin(angle * 0.5) * 0.3

      scene.add(satGroup)
      satelliteMeshes.push(satGroup)
    })
  }, [satellites])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative flex items-center justify-center"
    >
      <div
        ref={containerRef}
        className="rounded-lg cursor-grab active:cursor-grabbing"
        style={{ width: 400, height: 400 }}
      />
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
    </motion.div>
  )
}

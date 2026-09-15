import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface FullScene3DProps {
  isHolding?: boolean
  onHoldChange?: (holding: boolean) => void
}

export function FullScene3D({ isHolding = false, onHoldChange }: FullScene3DProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isHoldingRef = useRef(isHolding)

  useEffect(() => {
    isHoldingRef.current = isHolding
  }, [isHolding])

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x06080f, 0.0035)

    let width = window.innerWidth
    let height = window.innerHeight
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 0, 92)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.35

    // 2. Photorealistic Orbital Sun & Deep Space Lighting
    // Ambient space light: keeps the night side visible with natural deep indigo tone
    const ambientLight = new THREE.AmbientLight(0x182030, 1.3)
    scene.add(ambientLight)

    // Primary Sun Light: Brilliant golden-white sun rays coming from upper-right
    const sunLight = new THREE.DirectionalLight(0xfff8ee, 4.8)
    sunLight.position.set(65, 42, 45)
    scene.add(sunLight)

    // Warm Golden Sunrise Limb Backlight (creates the golden edge reflection on land/ocean)
    const rimLight = new THREE.DirectionalLight(0xf59e0b, 3.5)
    rimLight.position.set(40, 30, -35)
    scene.add(rimLight)

    // Subtle Earth Night-side Underfill
    const fillLight = new THREE.DirectionalLight(0x16263d, 1.2)
    fillLight.position.set(-50, -30, -20)
    scene.add(fillLight)

    // 3. REVOLVING 3D EARTH GLOBE GROUP
    const globeGroup = new THREE.Group()
    const isMobile = width < 1024
    globeGroup.position.set(isMobile ? 0 : 25, isMobile ? 8 : -1, isMobile ? -8 : 0)

    // Initial orientation: Europe, Africa, Middle East & India facing forward with natural axial tilt
    const defaultRotX = 0.28
    const defaultRotY = -1.25
    globeGroup.rotation.set(defaultRotX, defaultRotY, -0.12)
    scene.add(globeGroup)

    const globeRadius = 26.5

    // 4. LOAD HIGH-RESOLUTION PHOTOREALISTIC TEXTURES
    const textureLoader = new THREE.TextureLoader()

    const dayTexture = textureLoader.load('/textures/earth/earth_day_2048.jpg')
    const lightsTexture = textureLoader.load('/textures/earth/earth_lights_2048.png')
    const cloudsTexture = textureLoader.load('/textures/earth/earth_clouds_1024.png')
    const normalTexture = textureLoader.load('/textures/earth/earth_normal_2048.jpg')
    const specularTexture = textureLoader.load('/textures/earth/earth_specular_2048.jpg')

    dayTexture.colorSpace = THREE.SRGBColorSpace
    lightsTexture.colorSpace = THREE.SRGBColorSpace
    cloudsTexture.colorSpace = THREE.SRGBColorSpace

    // A. Main Earth Sphere (Continents, Topography, Reflective Oceans & Glowing City Lights)
    const earthGeo = new THREE.SphereGeometry(globeRadius, 64, 64)
    const earthMat = new THREE.MeshStandardMaterial({
      map: dayTexture,
      normalMap: normalTexture,
      normalScale: new THREE.Vector2(0.85, 0.85),
      roughnessMap: specularTexture,
      roughness: 0.52,
      metalness: 0.08,
      emissiveMap: lightsTexture,
      emissive: new THREE.Color(0xf59e0b), // Warm golden city night lights
      emissiveIntensity: 2.4,
    })
    const earthMesh = new THREE.Mesh(earthGeo, earthMat)
    globeGroup.add(earthMesh)

    // B. Realistic Drifting Cloud Layer
    const cloudGeo = new THREE.SphereGeometry(globeRadius + 0.35, 64, 64)
    const cloudMat = new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.36,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat)
    globeGroup.add(cloudMesh)

    // Helper: Generate soft radial flare texture for city beacons & shooting star photons
    function createFlareTexture() {
      const c = document.createElement('canvas')
      c.width = 64
      c.height = 64
      const ctx = c.getContext('2d')!
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
      g.addColorStop(0, 'rgba(255, 255, 255, 1)')
      g.addColorStop(0.18, 'rgba(254, 240, 138, 0.95)')
      g.addColorStop(0.48, 'rgba(245, 158, 11, 0.4)')
      g.addColorStop(1, 'rgba(245, 158, 11, 0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 64, 64)
      return new THREE.CanvasTexture(c)
    }

    const flareTexture = createFlareTexture()

    // Helper: Convert Latitude/Longitude to accurate 3D position on Earth
    function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
      const phi = (90 - lat) * (Math.PI / 180)
      const theta = (lon + 180) * (Math.PI / 180)
      const x = -(radius * Math.sin(phi) * Math.cos(theta))
      const z = radius * Math.sin(phi) * Math.sin(theta)
      const y = radius * Math.cos(phi)
      return new THREE.Vector3(x, y, z)
    }

    // C. Global Executive Hubs (Major Commercial & Tech Capitals)
    const cityHubs = [
      { name: 'London', lat: 51.5, lon: -0.12 },
      { name: 'Paris', lat: 48.85, lon: 2.35 },
      { name: 'Berlin', lat: 52.52, lon: 13.4 },
      { name: 'Madrid', lat: 40.41, lon: -3.7 },
      { name: 'Rome', lat: 41.9, lon: 12.5 },
      { name: 'Dubai', lat: 25.2, lon: 55.27 },
      { name: 'Cairo', lat: 30.04, lon: 31.23 },
      { name: 'Lagos', lat: 6.52, lon: 3.37 },
      { name: 'Nairobi', lat: -1.29, lon: 36.82 },
      { name: 'Johannesburg', lat: -26.2, lon: 28.04 },
      { name: 'Mumbai', lat: 19.07, lon: 72.87 },
      { name: 'Bangalore', lat: 12.97, lon: 77.59 },
      { name: 'Delhi', lat: 28.61, lon: 77.2 },
      { name: 'Singapore', lat: 1.35, lon: 103.81 },
      { name: 'Tokyo', lat: 35.67, lon: 139.65 },
      { name: 'New York', lat: 40.71, lon: -74.0 },
      { name: 'San Francisco', lat: 37.77, lon: -122.41 },
      { name: 'Toronto', lat: 43.65, lon: -79.38 },
      { name: 'Sao Paulo', lat: -23.55, lon: -46.63 },
      { name: 'Sydney', lat: -33.86, lon: 151.2 },
      { name: 'Cape Town', lat: -33.92, lon: 18.42 },
      { name: 'Zurich', lat: 47.37, lon: 8.54 },
      { name: 'Hong Kong', lat: 22.31, lon: 114.16 },
    ]

    const beaconGeo = new THREE.SphereGeometry(0.32, 12, 12)
    const beaconMat = new THREE.MeshBasicMaterial({
      color: 0xffedd5,
    })

    const flareSpriteMat = new THREE.SpriteMaterial({
      map: flareTexture,
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const cityPoints: { pos: THREE.Vector3; flare: THREE.Sprite }[] = []

    cityHubs.forEach((hub) => {
      const pos = latLonToVector3(hub.lat, hub.lon, globeRadius + 0.38)

      // Solid pinpoint center
      const bead = new THREE.Mesh(beaconGeo, beaconMat)
      bead.position.copy(pos)
      globeGroup.add(bead)

      // Soft luminous glowing starburst flare (no harsh outline rings!)
      const flare = new THREE.Sprite(flareSpriteMat.clone())
      flare.position.copy(pos)
      flare.scale.set(1.6, 1.6, 1)
      globeGroup.add(flare)

      cityPoints.push({ pos, flare })
    })

    // D. 3D Golden Network Connection Arcs & Luminous Photon Streams
    const arcConnections = [
      [0, 1], // London -> Paris
      [1, 2], // Paris -> Berlin
      [0, 3], // London -> Madrid
      [0, 5], // London -> Dubai
      [5, 10], // Dubai -> Mumbai
      [10, 11], // Mumbai -> Bangalore
      [10, 12], // Mumbai -> Delhi
      [11, 13], // Bangalore -> Singapore
      [13, 14], // Singapore -> Tokyo
      [5, 6], // Dubai -> Cairo
      [6, 7], // Cairo -> Lagos
      [7, 9], // Lagos -> Johannesburg
      [0, 9], // London -> Johannesburg
      [0, 15], // London -> New York
      [15, 16], // New York -> San Francisco
      [15, 17], // New York -> Toronto
      [15, 18], // New York -> Sao Paulo
      [13, 19], // Singapore -> Sydney
      [0, 21], // London -> Zurich
      [13, 22], // Singapore -> Hong Kong
      [14, 16], // Tokyo -> San Francisco
    ]

    const arcLines: THREE.Line[] = []
    interface PhotonStream {
      curve: THREE.QuadraticBezierCurve3
      head: THREE.Sprite
      tailLine: THREE.Line
      tailGeo: THREE.BufferGeometry
      speed: number
      offset: number
      targetCityIdx: number
    }
    const photonStreams: PhotonStream[] = []

    // Base Golden Arc Line
    const arcLineMat = new THREE.LineBasicMaterial({
      color: 0xd97706,
      transparent: true,
      opacity: 0.52,
      blending: THREE.AdditiveBlending,
    })

    // Glowing Photon Head Sprite
    const photonHeadMat = new THREE.SpriteMaterial({
      map: flareTexture,
      color: 0xfffbeb,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    // Fading Comet Tail Line
    const tailLineMat = new THREE.LineBasicMaterial({
      color: 0xfde047,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    })

    const TAIL_SEGMENTS = 7

    arcConnections.forEach(([fromIdx, toIdx], i) => {
      const p1 = cityPoints[fromIdx].pos
      const p2 = cityPoints[toIdx].pos

      const mid = p1.clone().add(p2).multiplyScalar(0.5)
      const distance = p1.distanceTo(p2)
      // Parabolic arc height scales with geographic distance
      const arcAltitude = globeRadius + Math.max(3.0, distance * 0.36)
      mid.normalize().multiplyScalar(arcAltitude)

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2)
      const points = curve.getPoints(44)
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points)
      const arcLine = new THREE.Line(lineGeo, arcLineMat)
      globeGroup.add(arcLine)
      arcLines.push(arcLine)

      // Luminous Photon Head
      const head = new THREE.Sprite(photonHeadMat.clone())
      head.scale.set(1.2, 1.2, 1)
      head.position.copy(p1)
      globeGroup.add(head)

      // Trailing Light Streak
      const tailPoints = new Array(TAIL_SEGMENTS).fill(p1.clone())
      const tailGeo = new THREE.BufferGeometry().setFromPoints(tailPoints)
      const tailLine = new THREE.Line(tailGeo, tailLineMat.clone())
      globeGroup.add(tailLine)

      photonStreams.push({
        curve,
        head,
        tailLine,
        tailGeo,
        speed: 0.14 + (i % 4) * 0.035,
        offset: i * 0.13,
        targetCityIdx: toIdx,
      })
    })

    // 5. INTERACTION: ONLY ROTATE ON LEFT-CLICK & DRAG (NO CURSOR-FOLLOW)
    let isDragging = false
    let prevPointerX = 0
    let prevPointerY = 0
    let dragVelX = 0
    let dragVelY = 0
    let rotX = defaultRotX
    let rotY = defaultRotY
    let targetRotX = defaultRotX
    let targetRotY = defaultRotY
    let targetCameraZ = 92
    let warpFactor = 0

    function onMouseDown(e: MouseEvent) {
      if (e.button !== 0) return // Left-click only
      const target = e.target as HTMLElement
      if (target.closest('a, button, input, textarea, select, nav, [role="button"]')) return

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        if (e.clientY < rect.top || e.clientY > rect.bottom || e.clientX < rect.left || e.clientX > rect.right) return
      }

      isDragging = true
      prevPointerX = e.clientX
      prevPointerY = e.clientY
      dragVelX = 0
      dragVelY = 0

      if (containerRef.current) {
        containerRef.current.style.cursor = 'grabbing'
      }
      onHoldChange?.(true)
    }

    function onMouseMove(e: MouseEvent) {
      if (!isDragging) return // Strict: do NOT move along with cursor hover!

      const deltaX = e.clientX - prevPointerX
      const deltaY = e.clientY - prevPointerY
      prevPointerX = e.clientX
      prevPointerY = e.clientY

      dragVelX = deltaX * 0.005
      dragVelY = deltaY * 0.005

      targetRotY += dragVelX
      targetRotX += dragVelY

      // Clamp vertical tilt so the Earth cannot tumble upside down
      targetRotX = Math.max(-Math.PI * 0.38, Math.min(Math.PI * 0.38, targetRotX))
    }

    function onMouseUp() {
      if (isDragging) {
        isDragging = false
        if (containerRef.current) {
          containerRef.current.style.cursor = 'grab'
        }
        onHoldChange?.(false)
      }
    }

    // Touch support for mobile/tablet drag
    function onTouchStart(e: TouchEvent) {
      if (e.touches.length !== 1) return
      const t = e.touches[0]
      const target = e.target as HTMLElement
      if (target.closest('a, button, input, textarea, select, nav, [role="button"]')) return

      isDragging = true
      prevPointerX = t.clientX
      prevPointerY = t.clientY
      dragVelX = 0
      dragVelY = 0
      onHoldChange?.(true)
    }

    function onTouchMove(e: TouchEvent) {
      if (!isDragging || e.touches.length !== 1) return
      const t = e.touches[0]
      const deltaX = t.clientX - prevPointerX
      const deltaY = t.clientY - prevPointerY
      prevPointerX = t.clientX
      prevPointerY = t.clientY

      dragVelX = deltaX * 0.005
      dragVelY = deltaY * 0.005

      targetRotY += dragVelX
      targetRotX += dragVelY
      targetRotX = Math.max(-Math.PI * 0.38, Math.min(Math.PI * 0.38, targetRotX))
    }

    function onTouchEnd() {
      if (isDragging) {
        isDragging = false
        onHoldChange?.(false)
      }
    }

    function onResize() {
      width = window.innerWidth
      height = window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)

      const mob = width < 1024
      globeGroup.position.x = mob ? 0 : 25
      globeGroup.position.y = mob ? 8 : -1
    }

    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('resize', onResize)

    // 6. RENDER & REVOLUTION ANIMATION LOOP
    let animId: number
    const clock = new THREE.Clock()

    function animate() {
      animId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      // Warp Factor for click & drag
      const targetWarp = isHoldingRef.current ? 1 : 0
      warpFactor += (targetWarp - warpFactor) * 0.1

      // When not dragging: smoothly decay inertia and apply steady natural auto-revolution
      if (!isDragging) {
        dragVelX *= 0.94
        dragVelY *= 0.94
        targetRotY += dragVelX + 0.0012
        targetRotX += dragVelY
        targetRotX = Math.max(-Math.PI * 0.38, Math.min(Math.PI * 0.38, targetRotX))
      }

      // Smoothly interpolate Earth rotation
      rotX += (targetRotX - rotX) * 0.1
      rotY += (targetRotY - rotY) * 0.1
      globeGroup.rotation.x = rotX
      globeGroup.rotation.y = rotY

      // Realistic slow independent cloud drift
      cloudMesh.rotation.y += 0.00035

      // Natural twinkling city beacon flare animation
      cityPoints.forEach(({ flare }, idx) => {
        const pulse = 1.3 + Math.sin(elapsedTime * 2.8 + idx * 0.7) * 0.35
        flare.scale.set(pulse, pulse, 1)
      })

      // Animate Luminous Photon Streams (Shooting Star Beams) along Arcs
      photonStreams.forEach((stream) => {
        const t = (elapsedTime * stream.speed * (1 + warpFactor * 2.5) + stream.offset) % 1
        const headPos = stream.curve.getPoint(t)
        stream.head.position.copy(headPos)

        // Generate smooth tapering trailing light streak behind the photon head
        const positions: THREE.Vector3[] = []
        for (let k = 0; k < TAIL_SEGMENTS; k++) {
          // Trail goes from t - 0.06 to t
          const trailT = Math.max(0, t - ((TAIL_SEGMENTS - 1 - k) / (TAIL_SEGMENTS - 1)) * 0.06)
          positions.push(stream.curve.getPoint(trailT))
        }
        stream.tailGeo.setFromPoints(positions)

        // Subtle arrival flare on target city when photon stream reaches destination
        if (t > 0.92) {
          const targetCity = cityPoints[stream.targetCityIdx]
          if (targetCity) {
            targetCity.flare.scale.set(2.2, 2.2, 1)
          }
        }
      })

      // Camera stays strictly centered — NO cursor follow
      targetCameraZ = 92 - warpFactor * 14
      camera.position.z += (targetCameraZ - camera.position.z) * 0.08
      camera.position.x = 0
      camera.position.y = 0
      camera.fov = 45 + warpFactor * 4
      camera.updateProjectionMatrix()

      // Sun intensity flare on click
      sunLight.intensity = 4.8 + warpFactor * 2.0
      rimLight.intensity = 3.8 + warpFactor * 2.5

      renderer.render(scene, camera)
    }

    animate()

    // 7. Cleanup
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('resize', onResize)

      renderer.dispose()
      earthGeo.dispose()
      earthMat.dispose()
      cloudGeo.dispose()
      cloudMat.dispose()
      beaconGeo.dispose()
      beaconMat.dispose()
      flareSpriteMat.dispose()
      flareTexture.dispose()
      photonHeadMat.dispose()
      tailLineMat.dispose()
      arcLineMat.dispose()

      dayTexture.dispose()
      lightsTexture.dispose()
      cloudsTexture.dispose()
      normalTexture.dispose()
      specularTexture.dispose()

      arcLines.forEach((l) => l.geometry.dispose())
      photonStreams.forEach((s) => {
        s.tailGeo.dispose()
      })
    }
  }, [onHoldChange])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden select-none cursor-grab active:cursor-grabbing"
      aria-hidden="true"
    >
      {/* Soft Radial Amber/Gold Backlight behind the Earth sunlit limb */}
      <div className="absolute top-1/4 right-1/6 w-[750px] h-[750px] bg-gradient-to-br from-amber-500/16 via-gold-500/8 to-transparent rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[550px] h-[550px] bg-gradient-to-tr from-amber-600/10 via-amber-400/5 to-transparent rounded-full blur-[130px] pointer-events-none" />

      {/* WebGL Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block pointer-events-auto" />
    </div>
  )
}

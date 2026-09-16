import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface OrbitalCoffeeMatch3DProps {
  className?: string
}

export function OrbitalCoffeeMatch3D({ className = '' }: OrbitalCoffeeMatch3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [activeMatch, setActiveMatch] = useState({
    title: 'ORBITAL MATCH CONFIRMED',
    pair: 'Subash S. (Founder) ⚡ Michael R. (Investor)',
    metric: '18.4s Latency · 99.8% Vector Precision',
    city: 'San Francisco ↔ London',
  })

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    let animationFrameId: number
    let width = container.clientWidth || 500
    let height = container.clientHeight || 450

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100)
    camera.position.set(0, 0, 24)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.4

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0x1a2130, 1.8)
    scene.add(ambientLight)

    // Intense central warm point light (singularity core)
    const coreLight = new THREE.PointLight(0xf59e0b, 4.5, 30)
    coreLight.position.set(0, 0, 0)
    scene.add(coreLight)

    // Key directional light for champagne metallic sheen
    const keyLight = new THREE.DirectionalLight(0xfffaed, 3.8)
    keyLight.position.set(15, 20, 15)
    scene.add(keyLight)

    // Back rim light for golden edges
    const rimLight = new THREE.DirectionalLight(0xf59e0b, 3.0)
    rimLight.position.set(-15, -10, -12)
    scene.add(rimLight)

    // Master Gyroscope Group
    const masterGroup = new THREE.Group()
    scene.add(masterGroup)

    // 3. Central Coffee Bean Singularity Core
    const coreGroup = new THREE.Group()
    masterGroup.add(coreGroup)

    // Dark Obsidian Sphere Core
    const sphereGeo = new THREE.SphereGeometry(3.0, 36, 36)
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x07090e,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x1f1304,
      emissiveIntensity: 0.35,
    })
    const solidSphere = new THREE.Mesh(sphereGeo, sphereMat)
    // Scale slightly into an organic coffee bean silhouette
    solidSphere.scale.set(0.92, 1.18, 0.82)
    coreGroup.add(solidSphere)

    // Golden Geometric Wireframe Cage (like the user reference image)
    const wireGeo = new THREE.IcosahedronGeometry(3.15, 3)
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    })
    const wireMesh = new THREE.Mesh(wireGeo, wireMat)
    wireMesh.scale.set(0.92, 1.18, 0.82)
    coreGroup.add(wireMesh)

    // Glowing Central Singularity Flare Orb
    const flareGeo = new THREE.SphereGeometry(0.7, 16, 16)
    const flareMat = new THREE.MeshBasicMaterial({
      color: 0xfffbeb,
      transparent: true,
      opacity: 0.95,
    })
    const flareOrb = new THREE.Mesh(flareGeo, flareMat)
    coreGroup.add(flareOrb)

    // Coffee Bean Center Seam (A curved golden glowing torus ring through the middle)
    const seamGeo = new THREE.TorusGeometry(3.05, 0.08, 16, 64, Math.PI)
    const seamMat = new THREE.MeshBasicMaterial({
      color: 0xfde047,
    })
    const seamMesh = new THREE.Mesh(seamGeo, seamMat)
    seamMesh.rotation.x = Math.PI / 2
    seamMesh.scale.set(0.92, 0.82, 1.18)
    coreGroup.add(seamMesh)

    // 4. Three Luxurious Armillary Golden Orbital Rings
    const goldRingMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.18,
      emissive: 0x3d2706,
      emissiveIntensity: 0.25,
    })

    const collarMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.8,
      roughness: 0.2,
    })

    interface OrbitTrack {
      group: THREE.Group
      radius: number
      speed: number
      angle: number
      bead: THREE.Mesh
      collar: THREE.Mesh
      pulseTime: number
    }

    const orbits: OrbitTrack[] = []

    const ORBIT_CONFIGS = [
      { radius: 6.2, tube: 0.12, rot: [0.35, 0.45, 0.2], speed: 0.016, beadColor: 0xffe082 },
      { radius: 7.8, tube: 0.14, rot: [1.15, -0.35, 0.75], speed: -0.012, beadColor: 0xf59e0b },
      { radius: 9.3, tube: 0.13, rot: [-0.65, 1.25, -0.35], speed: 0.009, beadColor: 0xfde047 },
    ]

    ORBIT_CONFIGS.forEach((cfg, idx) => {
      const orbitGroup = new THREE.Group()
      orbitGroup.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2])
      masterGroup.add(orbitGroup)

      // Torus Ring
      const ringGeo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 28, 120)
      const ringMesh = new THREE.Mesh(ringGeo, goldRingMat)
      orbitGroup.add(ringMesh)

      // Orbiting Golden Bead Node
      const beadGeo = new THREE.SphereGeometry(0.38, 20, 20)
      const beadMat = new THREE.MeshStandardMaterial({
        color: cfg.beadColor,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.6,
      })
      const bead = new THREE.Mesh(beadGeo, beadMat)
      orbitGroup.add(bead)

      // Outer Collar Ring around the bead (like in the user's reference image)
      const collarGeo = new THREE.TorusGeometry(0.55, 0.05, 12, 28)
      const collar = new THREE.Mesh(collarGeo, collarMat)
      orbitGroup.add(collar)

      // Second counter-bead on the other side of the orbit for richness
      if (idx === 1) {
        const bead2 = new THREE.Mesh(beadGeo, beadMat)
        bead2.position.set(-cfg.radius, 0, 0)
        orbitGroup.add(bead2)
      }

      orbits.push({
        group: orbitGroup,
        radius: cfg.radius,
        speed: cfg.speed,
        angle: (idx * Math.PI) / 3,
        bead,
        collar,
        pulseTime: 0,
      })
    })

    // 5. Golden Stardust Dust Cloud
    const particleCount = 220
    const particleGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const scales = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      const r = 4.5 + Math.random() * 8.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      scales[i] = Math.random() * 0.8 + 0.2
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.16,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    })
    const particlePoints = new THREE.Points(particleGeo, particleMat)
    masterGroup.add(particlePoints)

    // 6. Mouse Tracking & Inertia
    let mouseX = 0
    let mouseY = 0
    let targetRotX = 0.25
    let targetRotY = -0.35

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      mouseX = x
      mouseY = y
      targetRotY = mouseX * 0.65 - 0.2
      targetRotX = -mouseY * 0.55 + 0.25
    }

    container.addEventListener('mousemove', handleMouseMove)

    // Resize Handler
    const handleResize = () => {
      if (!container) return
      width = container.clientWidth
      height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    // 7. Animation Loop
    let clock = new THREE.Clock()
    let lastPairChange = 0

    const PAIRS = [
      {
        title: 'ORBITAL MATCH CONFIRMED',
        pair: 'Subash S. (Founder) ⚡ Michael R. (Investor)',
        metric: '18.4s Latency · 99.8% Precision',
        city: 'San Francisco ↔ London',
      },
      {
        title: 'ENTERPRISE RESONANCE ACTIVE',
        pair: 'Elena V. (VP Engineering) ⚡ David K. (Chief Architect)',
        metric: '14.2s Latency · E2EE Verified',
        city: 'New York ↔ Zurich',
      },
      {
        title: 'SERENDIPITY COFFEE VECTOR',
        pair: 'Arjun M. (Fintech CEO) ⚡ Sarah T. (General Partner)',
        metric: '19.1s Latency · 0 Cold Outreach',
        city: 'Dubai ↔ Singapore',
      },
    ]

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      // Smooth master tilt damping
      masterGroup.rotation.y += (targetRotY - masterGroup.rotation.y) * 0.05
      masterGroup.rotation.x += (targetRotX - masterGroup.rotation.x) * 0.05

      // Continuous subtle ambient roll
      coreGroup.rotation.y += 0.006
      coreGroup.rotation.z += 0.003
      particlePoints.rotation.y -= 0.002

      // Subtle breathing pulse of singularity flare
      const flareScale = 1.0 + Math.sin(elapsedTime * 3) * 0.15
      flareOrb.scale.set(flareScale, flareScale, flareScale)

      // Orbiting beads along the rings
      orbits.forEach((orb) => {
        orb.angle += orb.speed
        const bx = Math.cos(orb.angle) * orb.radius
        const by = Math.sin(orb.angle) * orb.radius

        orb.bead.position.set(bx, by, 0)
        orb.collar.position.set(bx, by, 0)
        orb.collar.rotation.z = orb.angle + Math.PI / 2
      })

      // Dynamic pair cycle every 4.5s
      if (elapsedTime - lastPairChange > 4.5) {
        lastPairChange = elapsedTime
        const nextIdx = Math.floor(elapsedTime / 4.5) % PAIRS.length
        setActiveMatch(PAIRS[nextIdx])
      }

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      container.removeEventListener('mousemove', handleMouseMove)
      resizeObserver.disconnect()
      renderer.dispose()
      scene.clear()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[520px] sm:h-[540px] rounded-2xl bg-[#080D18] border border-amber-500/25 shadow-2xl p-4 sm:p-5 text-white select-none overflow-hidden flex flex-col justify-between ${className}`}
    >
      {/* Ambient Flare Behind 3D Gyroscope */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80 text-xs font-sans shrink-0 z-10">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-medium text-[11px]">
          <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b] animate-pulse" />
          ORBITAL MATCH PROTOCOL
        </div>

        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
          <span className="text-amber-300/90 font-medium">Deterministic Gyroscope</span>
          <span className="hidden sm:inline text-emerald-400 font-medium">• Latency: 18.4s</span>
        </div>
      </div>

      {/* Main 3D Canvas Viewport */}
      <div className="relative w-full flex-1 my-2 rounded-xl overflow-hidden bg-[#060913]/90 border border-slate-800/60 min-h-0 flex items-center justify-center">
        {/* Subtle Latitude/Longitude Grid in Background */}
        <div className="absolute inset-0 pointer-events-none opacity-15">
          <div className="absolute left-1/4 top-0 bottom-0 border-r border-dashed border-amber-500/40" />
          <div className="absolute left-2/4 top-0 bottom-0 border-r border-dashed border-amber-500/40" />
          <div className="absolute left-3/4 top-0 bottom-0 border-r border-dashed border-amber-500/40" />
          <div className="absolute top-1/2 left-0 right-0 border-b border-dashed border-amber-500/40" />
        </div>

        {/* Live 3D Armillary Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-[5]" />

        {/* Floating Live Match HUD Banner */}
        <div className="absolute bottom-3 left-3 right-3 z-20 px-3.5 py-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-amber-500/30 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0 animate-ping" />
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-sans tracking-wider text-amber-400 font-semibold truncate">
                {activeMatch.title}
              </div>
              <div className="text-xs font-display font-medium text-white truncate">
                {activeMatch.pair}
              </div>
            </div>
          </div>
          <div className="hidden sm:block text-right shrink-0">
            <div className="text-[10px] font-sans text-emerald-400 font-medium">
              {activeMatch.metric}
            </div>
            <div className="text-[9.5px] font-sans text-slate-400">
              {activeMatch.city}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Drawer */}
      <div className="pt-2.5 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 text-xs font-sans shrink-0 z-10">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 text-[11.5px]">
            Latency: <strong className="text-white font-medium">18.4ms</strong> · Zero-Cloud Proxy · Sub-Second Alignment
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-semibold shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-pulse" />
          Deterministic Pair ⚡
        </div>
      </div>
    </div>
  )
}

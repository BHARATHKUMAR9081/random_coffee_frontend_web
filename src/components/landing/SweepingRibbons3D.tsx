import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * SweepingRibbons3D - Realistic Takeaway Coffee Cup with True Volumetric Steam & Mid-Level Voice Visualizer
 *
 * Specific Enhancements:
 * 1. Cup: Completely seamless pure-white paper cup matching user's silhouette image (NO black/dark line in middle).
 * 2. Realistic Steam: Volumetric rising smoke puff particle system using procedural soft Gaussian alpha sprites
 *    with buoyant convective curl, expansion, and natural evaporation. Plus ethereal wispy vapor accents.
 * 3. Realistic Voice Visualizer in the MIDDLE: Relocated from bottom to middle elevation. Features a sleek 3D
 *    acoustic equalizer ring with refined luminous micro-bars and an undulating voice frequency waveform.
 */
export function SweepingRibbons3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene()

    let width = container.clientWidth || 400
    let height = container.clientHeight || 360

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000)
    camera.position.set(0, 1.2, 45)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3

    // 2. Realistic Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x27272a, 2.2)
    scene.add(ambientLight)

    // Key Light: Soft studio light for realistic paper cup highlights
    const keyLight = new THREE.DirectionalLight(0xfffaed, 4.2)
    keyLight.position.set(22, 26, 30)
    scene.add(keyLight)

    // Back Rim Light: Warm champagne rim glow on cup contours and steam
    const rimLight = new THREE.DirectionalLight(0xf59e0b, 3.8)
    rimLight.position.set(-20, -6, -22)
    scene.add(rimLight)

    // Fill Light: Soft neutral fill
    const fillLight = new THREE.DirectionalLight(0xfff7ed, 1.8)
    fillLight.position.set(-18, 10, 24)
    scene.add(fillLight)

    // Warm Steam Point Light positioned directly above the lid
    const steamLight = new THREE.PointLight(0xfef08a, 2.5, 20)
    steamLight.position.set(0, 4, 1)
    scene.add(steamLight)

    // Master Group for Mouse Parallax
    const masterGroup = new THREE.Group()
    masterGroup.position.set(0, -2.2, 0)
    scene.add(masterGroup)

    // 3. Materials (Crisp Pure White Paper Cup - No Dark Lines)
    const cupMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.42,
      metalness: 0.02,
    })

    const lidMat = new THREE.MeshStandardMaterial({
      color: 0xf4f4f0,
      roughness: 0.28,
      metalness: 0.04,
    })

    // 4. Iconic Takeaway Coffee Cup (Matching Silhouette Perfectly)
    const cupGroup = new THREE.Group()
    cupGroup.position.set(0, -3.8, 0)
    masterGroup.add(cupGroup)

    // A. Clean Seamless Cup Body (Pure white, tapered cylinder, NO black band)
    const cupBodyGeo = new THREE.CylinderGeometry(2.65, 1.95, 6.8, 64)
    const cupBodyMesh = new THREE.Mesh(cupBodyGeo, cupMat)
    cupGroup.add(cupBodyMesh)

    // B. Recessed Bottom Ring / Base Lip
    const cupBaseGeo = new THREE.CylinderGeometry(1.98, 1.92, 0.3, 64)
    const cupBaseMesh = new THREE.Mesh(cupBaseGeo, cupMat)
    cupBaseMesh.position.y = -3.42
    cupGroup.add(cupBaseMesh)

    // C. Rolled Paper Top Rim Lip
    const cupRimGeo = new THREE.TorusGeometry(2.68, 0.08, 16, 64)
    const cupRimMesh = new THREE.Mesh(cupRimGeo, cupMat)
    cupRimMesh.rotation.x = Math.PI / 2
    cupRimMesh.position.y = 3.4
    cupGroup.add(cupRimMesh)

    // D. Snap-on Takeaway Lid (Exact Silhouette Steps)
    // Step 1: Overhanging Rim / Lip Collar (Prominently juts out over cup edge)
    const lidCollarGeo = new THREE.CylinderGeometry(2.92, 2.94, 0.48, 64)
    const lidCollarMesh = new THREE.Mesh(lidCollarGeo, lidMat)
    lidCollarMesh.position.y = 3.65
    cupGroup.add(lidCollarMesh)

    // Step 2: Inward Chamfer Shelf
    const lidShelfGeo = new THREE.CylinderGeometry(2.76, 2.86, 0.35, 64)
    const lidShelfMesh = new THREE.Mesh(lidShelfGeo, lidMat)
    lidShelfMesh.position.y = 4.02
    cupGroup.add(lidShelfMesh)

    // Step 3: Raised Dome / Flat-top Plateau
    const lidCapGeo = new THREE.CylinderGeometry(2.5, 2.68, 0.36, 64)
    const lidCapMesh = new THREE.Mesh(lidCapGeo, lidMat)
    lidCapMesh.position.y = 4.34
    cupGroup.add(lidCapMesh)

    // Step 4: Drinking Spout Aperture
    const spoutGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.1, 32)
    const spoutMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.5,
      metalness: 0.1,
    })
    const spoutMesh = new THREE.Mesh(spoutGeo, spoutMat)
    spoutMesh.position.set(0, 4.54, 1.85)
    cupGroup.add(spoutMesh)

    // Subtle natural tilt
    cupGroup.rotation.set(0.12, 0.16, -0.04)

    // 5. Realistic Volumetric Coffee Steam (Procedural Soft Smoke Particles)
    // Create a high-fidelity Gaussian smoke puff texture
    function createSmokeTexture() {
      const c = document.createElement('canvas')
      c.width = 128
      c.height = 128
      const ctx = c.getContext('2d')!

      // Multiple layered soft radial gradients for realistic cloudy vapor diffusion
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
      grad.addColorStop(0, 'rgba(255, 252, 245, 0.75)')
      grad.addColorStop(0.25, 'rgba(250, 240, 220, 0.45)')
      grad.addColorStop(0.55, 'rgba(235, 215, 185, 0.20)')
      grad.addColorStop(0.85, 'rgba(215, 190, 160, 0.05)')
      grad.addColorStop(1, 'rgba(200, 180, 150, 0)')

      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 128, 128)
      return new THREE.CanvasTexture(c)
    }

    const smokeTexture = createSmokeTexture()
    const STEAM_COUNT = 85

    interface SteamParticle {
      mesh: THREE.Sprite
      x: number
      y: number
      z: number
      vy: number
      scale: number
      growthRate: number
      maxLife: number
      age: number
      curlPhase: number
      curlSpeed: number
      baseOpacity: number
    }

    const steamParticles: SteamParticle[] = []
    const steamGroup = new THREE.Group()
    masterGroup.add(steamGroup)

    for (let i = 0; i < STEAM_COUNT; i++) {
      const mat = new THREE.SpriteMaterial({
        map: smokeTexture,
        transparent: true,
        opacity: 0,
        blending: THREE.NormalBlending,
        depthWrite: false,
      })
      const sprite = new THREE.Sprite(mat)

      // Stagger initial particle ages so steam flow is already established
      const initialAge = (i / STEAM_COUNT) * 6.0
      const p: SteamParticle = {
        mesh: sprite,
        x: (Math.random() - 0.5) * 0.4,
        y: 1.2 + initialAge * 2.6,
        z: 1.8 + (Math.random() - 0.5) * 0.4,
        vy: 0.045 + Math.random() * 0.025,
        scale: 1.0 + initialAge * 0.55,
        growthRate: 0.018 + Math.random() * 0.012,
        maxLife: 5.5 + Math.random() * 1.5,
        age: initialAge,
        curlPhase: Math.random() * Math.PI * 2,
        curlSpeed: 0.8 + Math.random() * 0.6,
        baseOpacity: 0.32 + Math.random() * 0.14,
      }
      sprite.position.set(p.x, p.y, p.z)
      sprite.scale.set(p.scale, p.scale, 1)
      steamGroup.add(sprite)
      steamParticles.push(p)
    }

    // Wispy Ethereal Vapor Stream Ribbons (Ultra-sheer, translucent, organic)
    const wispGeo1 = new THREE.PlaneGeometry(1.6, 16, 4, 48)
    const wispMat1 = new THREE.MeshBasicMaterial({
      color: 0xfffaed,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const wispMesh1 = new THREE.Mesh(wispGeo1, wispMat1)
    wispMesh1.position.set(0, 9.2, 1.2)
    masterGroup.add(wispMesh1)

    const wispGeo2 = new THREE.PlaneGeometry(1.4, 15, 4, 48)
    const wispMat2 = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const wispMesh2 = new THREE.Mesh(wispGeo2, wispMat2)
    wispMesh2.position.set(0, 8.8, 1.0)
    masterGroup.add(wispMesh2)

    const baseWispPos1 = wispGeo1.attributes.position.clone()
    const baseWispPos2 = wispGeo2.attributes.position.clone()

    // 6. REALISTIC VOICE VISUALIZER IN THE MIDDLE (Elevation y: ~ 0.5 to 2.5)
    // A refined 3D acoustic waveform ring positioned around the middle of the cup
    const voiceGroup = new THREE.Group()
    voiceGroup.position.set(0, 0.8, 0) // Centered at the middle!
    masterGroup.add(voiceGroup)

    // Array of sleek, modern LED equalizer frequency micro-bars
    const BAR_COUNT = 32
    const RING_RADIUS = 5.2
    const barGeo = new THREE.CylinderGeometry(0.08, 0.08, 1, 16)
    const barCapGeo = new THREE.SphereGeometry(0.12, 12, 12)

    const barStemMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.9,
    })

    const barHeadMat = new THREE.MeshStandardMaterial({
      color: 0xfffbeb,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.9,
      roughness: 0.1,
      metalness: 0.8,
    })

    interface EqBarNode {
      group: THREE.Group
      stem: THREE.Mesh
      head: THREE.Mesh
      angle: number
      phase: number
      baseScale: number
    }

    const eqBars: EqBarNode[] = []

    for (let i = 0; i < BAR_COUNT; i++) {
      const angle = (i / BAR_COUNT) * Math.PI * 2
      const g = new THREE.Group()
      g.position.set(Math.cos(angle) * RING_RADIUS, 0, Math.sin(angle) * RING_RADIUS)

      const stem = new THREE.Mesh(barGeo, barStemMat)
      stem.position.y = 0.5
      g.add(stem)

      const head = new THREE.Mesh(barCapGeo, barHeadMat)
      head.position.y = 1.0
      g.add(head)

      voiceGroup.add(g)
      eqBars.push({
        group: g,
        stem,
        head,
        angle,
        phase: i * 0.38,
        baseScale: 1,
      })
    }

    // Mid-level Glowing Acoustic Waveform Ring (Soundwave ripple around middle)
    const waveRingGeo = new THREE.TorusGeometry(RING_RADIUS, 0.04, 16, 96)
    const waveRingMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    })
    const waveRingMesh = new THREE.Mesh(waveRingGeo, waveRingMat)
    waveRingMesh.rotation.x = Math.PI / 2
    voiceGroup.add(waveRingMesh)

    // Floating Audio Data Sparkles in Middle Air
    const SPARKLE_COUNT = 45
    const sparkleGeo = new THREE.BufferGeometry()
    const sparklePos = new Float32Array(SPARKLE_COUNT * 3)

    for (let i = 0; i < SPARKLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const rad = 2.5 + Math.random() * 4.5
      sparklePos[i * 3 + 0] = Math.cos(theta) * rad
      sparklePos[i * 3 + 1] = (Math.random() - 0.5) * 5.5
      sparklePos[i * 3 + 2] = Math.sin(theta) * rad
    }
    sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePos, 3))

    const sparkleMat = new THREE.PointsMaterial({
      color: 0xfef08a,
      size: 0.7,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const sparkles = new THREE.Points(sparkleGeo, sparkleMat)
    voiceGroup.add(sparkles)

    // 7. Interactive Mouse Parallax Tracking
    let targetRotY = 0
    let targetRotX = 0
    let currentRotY = 0
    let currentRotX = 0

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      targetRotY = nx * 0.35
      targetRotX = ny * 0.18
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // 8. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = entry.contentRect.width
        height = entry.contentRect.height
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
      }
    })
    resizeObserver.observe(container)

    // 9. Animation Loop
    let animationFrameId: number
    const clock = new THREE.Clock()

    const animate = () => {
      const t = clock.getElapsedTime()

      // Smooth mouse parallax damping
      currentRotY += (targetRotY - currentRotY) * 0.05
      currentRotX += (targetRotX - currentRotX) * 0.05

      masterGroup.rotation.y = currentRotY + Math.sin(t * 0.3) * 0.06
      masterGroup.rotation.x = currentRotX + Math.cos(t * 0.25) * 0.03

      // Gentle cup floating hovering
      cupGroup.position.y = -3.8 + Math.sin(t * 1.3) * 0.14
      cupGroup.rotation.y = t * 0.18

      // Slow orbital rotation of mid-level voice visualizer
      voiceGroup.rotation.y = -t * 0.15

      // Realistic Conversational Audio Signals (Speaker 1 Gold & Speaker 2 Amber)
      const speech1 = Math.max(0, Math.sin(t * 2.1) * 0.75 + Math.sin(t * 4.2) * 0.35)
      const speech2 = Math.max(0, Math.sin(t * 1.8 + 2.4) * 0.7 + Math.cos(t * 3.6) * 0.4)

      // ── Animate Middle Voice Frequency Bars ──
      eqBars.forEach((bar) => {
        // Multi-frequency harmonic resonance mimicking voice formant speech
        const harmonic =
          Math.abs(Math.sin(t * 5.2 + bar.phase)) * 0.45 +
          Math.abs(Math.sin(t * 9.5 + bar.phase * 2)) * 0.35 +
          Math.abs(Math.cos(t * 2.8 + bar.phase)) * 0.2

        const speechTotal = (speech1 + speech2) * 0.65
        const height = 0.4 + harmonic * (1.2 + speechTotal * 2.4)

        bar.stem.scale.set(1, height, 1)
        bar.stem.position.y = height / 2
        bar.head.position.y = height + 0.12
      })

      // Pulsing glow on wave ring
      waveRingMat.opacity = 0.35 + (speech1 + speech2) * 0.25

      // ── Animate Realistic Volumetric Coffee Steam Particles ──
      steamParticles.forEach((p) => {
        p.age += 0.02
        p.y += p.vy
        p.scale += p.growthRate

        // Convective fluid turbulence curl
        const curlX = Math.sin(t * p.curlSpeed + p.y * 0.7 + p.curlPhase) * 0.025
        const curlZ = Math.cos(t * p.curlSpeed + p.y * 0.8 + p.curlPhase) * 0.022
        p.x += curlX
        p.z += curlZ

        // Natural vapor opacity curve:
        // Ramps up smoothly near spout (0 to 1.5 units), stays visible, then evaporates smoothly
        const normLife = p.age / p.maxLife
        let alpha = 0
        if (normLife < 0.25) {
          alpha = (normLife / 0.25) * p.baseOpacity
        } else {
          alpha = (1 - (normLife - 0.25) / 0.75) * p.baseOpacity
        }

        const spriteMat = p.mesh.material as THREE.SpriteMaterial
        spriteMat.opacity = Math.max(0, alpha)
        p.mesh.position.set(p.x, p.y, p.z)
        p.mesh.scale.set(p.scale, p.scale, 1)

        // Respawn particle at the drinking spout when lifespan expires
        if (p.age >= p.maxLife || p.y > 15) {
          p.age = 0
          p.y = 1.0 + Math.random() * 0.3
          p.x = (Math.random() - 0.5) * 0.35
          p.z = 1.8 + (Math.random() - 0.5) * 0.35
          p.scale = 0.9 + Math.random() * 0.35
        }
      })

      // ── Animate Ethereal Wispy Vapor Ribbons ──
      const wPos1 = wispGeo1.attributes.position
      for (let i = 0; i < wPos1.count; i++) {
        const origX = baseWispPos1.getX(i)
        const origY = baseWispPos1.getY(i)
        const ny = (origY + 8) / 16
        const curl = Math.sin(ny * 4 - t * 1.8) * (0.8 * ny)
        wPos1.setX(i, origX * (0.5 + ny * 1.2) + curl)
        wPos1.setZ(i, Math.cos(ny * 3.5 - t * 1.6) * (0.6 * ny))
      }
      wPos1.needsUpdate = true

      const wPos2 = wispGeo2.attributes.position
      for (let i = 0; i < wPos2.count; i++) {
        const origX = baseWispPos2.getX(i)
        const origY = baseWispPos2.getY(i)
        const ny = (origY + 7.5) / 15
        const curl = Math.cos(ny * 3.8 - t * 1.5 + Math.PI) * (0.7 * ny)
        wPos2.setX(i, origX * (0.4 + ny * 1.1) + curl)
        wPos2.setZ(i, Math.sin(ny * 3.2 - t * 1.4 + Math.PI) * (0.5 * ny))
      }
      wPos2.needsUpdate = true

      // Slow sparkle drift
      sparkles.rotation.y = t * 0.08

      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // 10. Complete Resource Disposal
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      resizeObserver.disconnect()

      renderer.dispose()
      cupBodyGeo.dispose()
      cupBaseGeo.dispose()
      cupRimGeo.dispose()
      lidCollarGeo.dispose()
      lidShelfGeo.dispose()
      lidCapGeo.dispose()
      spoutGeo.dispose()
      smokeTexture.dispose()
      wispGeo1.dispose()
      wispGeo2.dispose()
      barGeo.dispose()
      barCapGeo.dispose()
      waveRingGeo.dispose()
      sparkleGeo.dispose()

      cupMat.dispose()
      lidMat.dispose()
      spoutMat.dispose()
      wispMat1.dispose()
      wispMat2.dispose()
      barStemMat.dispose()
      barHeadMat.dispose()
      waveRingMat.dispose()
      sparkleMat.dispose()

      steamParticles.forEach((p) => {
        ;(p.mesh.material as THREE.Material).dispose()
      })
    }
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full relative flex items-center justify-center pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  )
}

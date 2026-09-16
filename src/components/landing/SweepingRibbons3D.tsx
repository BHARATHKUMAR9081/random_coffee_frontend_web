import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * SweepingRibbons3D - Branded Takeaway Coffee Cup
 *
 * Specific Enhancements:
 * 1. Sparkles Everywhere: Omnidirectional golden stardust cloud distributed across foreground,
 *    midground, and background with individual twinkling and gentle floating drift.
 * 2. Single Voice Visualizer in the Middle of the Cup: A single, ultra-clean, professional
 *    voice waveform mounted directly on the front-middle of the cup's gold sleeve.
 * 3. Logo-Branded Styling: Metallic gold sleeve, warm artisan cream cup, barista lid, and organic volumetric steam.
 */
export function SweepingRibbons3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    // 1. Scene, Camera & Renderer
    const scene = new THREE.Scene()

    let width = container.clientWidth || 400
    let height = container.clientHeight || 360

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000)
    camera.position.set(0, 0.4, 44)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.38

    // 2. Warm Luxury Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x2d2417, 2.6)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xfffaed, 4.5)
    keyLight.position.set(24, 28, 30)
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight(0xf59e0b, 4.6)
    rimLight.position.set(-22, -4, -20)
    scene.add(rimLight)

    const fillLight = new THREE.DirectionalLight(0xffedd5, 2.2)
    fillLight.position.set(-18, 12, 26)
    scene.add(fillLight)

    const coreLight = new THREE.PointLight(0xfde047, 3.5, 22)
    coreLight.position.set(0, 3.6, 1.2)
    scene.add(coreLight)

    // Master Group for mouse parallax
    const masterGroup = new THREE.Group()
    masterGroup.position.set(0, -1.6, 0)
    scene.add(masterGroup)

    // ── 3. Golden Stardust Sparkles EVERYWHERE (Foreground, Midground, Background) ──
    function createSparkleTexture() {
      const c = document.createElement('canvas')
      c.width = 64
      c.height = 64
      const ctx = c.getContext('2d')!
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
      g.addColorStop(0, 'rgba(255, 255, 255, 1)')
      g.addColorStop(0.2, 'rgba(254, 240, 138, 0.95)')
      g.addColorStop(0.5, 'rgba(245, 158, 11, 0.45)')
      g.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 64, 64)
      return new THREE.CanvasTexture(c)
    }

    const sparkleTexture = createSparkleTexture()
    const SPARKLE_COUNT = 240
    const sparklePositions = new Float32Array(SPARKLE_COUNT * 3)
    const sparklePhases: number[] = []
    const sparkleSpeeds: number[] = []

    for (let i = 0; i < SPARKLE_COUNT; i++) {
      // Dispersed everywhere across the 3D volume
      sparklePositions[i * 3 + 0] = (Math.random() - 0.5) * 50
      sparklePositions[i * 3 + 1] = (Math.random() - 0.5) * 44 + 1
      sparklePositions[i * 3 + 2] = (Math.random() - 0.5) * 40 // Foreground to deep background

      sparklePhases.push(Math.random() * Math.PI * 2)
      sparkleSpeeds.push(1.2 + Math.random() * 1.6)
    }

    const sparkleGeo = new THREE.BufferGeometry()
    sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3))

    const sparkleMat = new THREE.PointsMaterial({
      size: 1.15,
      map: sparkleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.8,
    })
    const everywhereSparkles = new THREE.Points(sparkleGeo, sparkleMat)
    masterGroup.add(everywhereSparkles)

    // ── 4. Branded Takeaway Coffee Cup (Tilted with Logo Gold Sleeve) ──
    const cupGroup = new THREE.Group()
    cupGroup.position.set(0, -3.2, 0)
    masterGroup.add(cupGroup)

    const cupMat = new THREE.MeshStandardMaterial({
      color: 0xfbf8f2,
      roughness: 0.38,
      metalness: 0.04,
    })

    const sleeveMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.28,
      metalness: 0.88,
      emissive: 0x422b07,
      emissiveIntensity: 0.35,
    })

    const sleeveTrimMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.2,
      metalness: 0.95,
    })

    const lidMat = new THREE.MeshStandardMaterial({
      color: 0xfdfdfc,
      roughness: 0.24,
      metalness: 0.05,
    })

    const coffeeLiquidMat = new THREE.MeshStandardMaterial({
      color: 0x1c120c,
      roughness: 0.12,
      metalness: 0.4,
    })

    // A. Cup Body (Tapered Cylinder)
    const cupBodyGeo = new THREE.CylinderGeometry(2.65, 1.95, 6.8, 64)
    const cupBodyMesh = new THREE.Mesh(cupBodyGeo, cupMat)
    cupGroup.add(cupBodyMesh)

    // B. Recessed Base Lip
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

    // D. Realistic Takeaway Coffee Sleeve in Signature Logo Gold
    const sleeveGeo = new THREE.CylinderGeometry(2.48, 2.22, 2.7, 64)
    const sleeveMesh = new THREE.Mesh(sleeveGeo, sleeveMat)
    sleeveMesh.position.y = -0.15
    cupGroup.add(sleeveMesh)

    // Sleeve Top Rib
    const sleeveTopRibGeo = new THREE.TorusGeometry(2.5, 0.04, 16, 64)
    const sleeveTopRib = new THREE.Mesh(sleeveTopRibGeo, sleeveTrimMat)
    sleeveTopRib.rotation.x = Math.PI / 2
    sleeveTopRib.position.y = 1.2
    cupGroup.add(sleeveTopRib)

    // Sleeve Bottom Rib
    const sleeveBottomRibGeo = new THREE.TorusGeometry(2.24, 0.04, 16, 64)
    const sleeveBottomRib = new THREE.Mesh(sleeveBottomRibGeo, sleeveTrimMat)
    sleeveBottomRib.rotation.x = Math.PI / 2
    sleeveBottomRib.position.y = -1.5
    cupGroup.add(sleeveBottomRib)

    // ── E. SINGLE VOICE VISUALIZER IN THE MIDDLE OF THE CUP ──
    // Mounted directly on the front-middle of the gold sleeve (y: -0.15 inside cupGroup)
    const singleVoiceGroup = new THREE.Group()
    singleVoiceGroup.position.set(0, -0.15, 0)
    cupGroup.add(singleVoiceGroup)

    // Minimalist, high-end single voice waveform:
    // 21 sleek vertical micro-bars arranged horizontally across the front face of the cup sleeve
    const VOICE_BAR_COUNT = 21
    const voiceBarGeo = new THREE.CylinderGeometry(0.038, 0.038, 1, 16)
    const voiceBarMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfef08a,
      emissiveIntensity: 0.95,
      roughness: 0.12,
      metalness: 0.9,
    })

    interface SingleVoiceBar {
      mesh: THREE.Mesh
      idx: number
      centerFactor: number
    }

    const singleVoiceBars: SingleVoiceBar[] = []
    const arcSpread = 0.95 // Radian arc across front face of sleeve
    const sleeveRadius = 2.40

    for (let i = 0; i < VOICE_BAR_COUNT; i++) {
      // Centered around front angle (theta = PI/2)
      const frac = (i / (VOICE_BAR_COUNT - 1)) - 0.5 // -0.5 to 0.5
      const theta = Math.PI / 2 + frac * arcSpread
      const centerFactor = 1 - Math.abs(frac) * 1.6 // Higher near center, lower at edges

      const bar = new THREE.Mesh(voiceBarGeo, voiceBarMat)
      bar.position.set(Math.cos(theta) * sleeveRadius, 0, Math.sin(theta) * sleeveRadius)
      // Orient normal to cup surface
      bar.rotation.y = -theta + Math.PI / 2
      singleVoiceGroup.add(bar)

      singleVoiceBars.push({
        mesh: bar,
        idx: i,
        centerFactor: Math.max(0.15, centerFactor),
      })
    }

    // Single glowing reference baseline curve on the middle sleeve
    const baseCurvePoints: THREE.Vector3[] = []
    for (let i = 0; i <= 32; i++) {
      const frac = (i / 32) - 0.5
      const theta = Math.PI / 2 + frac * (arcSpread * 1.1)
      baseCurvePoints.push(new THREE.Vector3(Math.cos(theta) * sleeveRadius, 0, Math.sin(theta) * sleeveRadius))
    }
    const baseCurveGeo = new THREE.BufferGeometry().setFromPoints(baseCurvePoints)
    const baseCurveMat = new THREE.LineBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    })
    const baseCurveLine = new THREE.Line(baseCurveGeo, baseCurveMat)
    singleVoiceGroup.add(baseCurveLine)

    // F. Snap-on Barista Lid
    const lidCollarGeo = new THREE.CylinderGeometry(2.92, 2.94, 0.48, 64)
    const lidCollarMesh = new THREE.Mesh(lidCollarGeo, lidMat)
    lidCollarMesh.position.y = 3.65
    cupGroup.add(lidCollarMesh)

    const lidShelfGeo = new THREE.CylinderGeometry(2.76, 2.86, 0.35, 64)
    const lidShelfMesh = new THREE.Mesh(lidShelfGeo, lidMat)
    lidShelfMesh.position.y = 4.02
    cupGroup.add(lidShelfMesh)

    const lidCapGeo = new THREE.CylinderGeometry(2.5, 2.68, 0.36, 64)
    const lidCapMesh = new THREE.Mesh(lidCapGeo, lidMat)
    lidCapMesh.position.y = 4.34
    cupGroup.add(lidCapMesh)

    const wellGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.1, 48)
    const wellMesh = new THREE.Mesh(wellGeo, lidMat)
    wellMesh.position.y = 4.48
    cupGroup.add(wellMesh)

    const spoutGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.12, 32)
    const spoutMesh = new THREE.Mesh(spoutGeo, coffeeLiquidMat)
    spoutMesh.position.set(0, 4.54, 1.82)
    cupGroup.add(spoutMesh)

    // Dynamic tilt matching brand-logo.jpg (12-14 degrees)
    cupGroup.rotation.set(0.14, 0.18, -0.06)

    // ── 5. Realistic Volumetric Coffee Steam (Organic Particles Only) ──
    function createSmokeTexture() {
      const c = document.createElement('canvas')
      c.width = 128
      c.height = 128
      const ctx = c.getContext('2d')!

      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
      grad.addColorStop(0, 'rgba(255, 252, 245, 0.85)')
      grad.addColorStop(0.22, 'rgba(250, 242, 225, 0.52)')
      grad.addColorStop(0.55, 'rgba(240, 225, 200, 0.22)')
      grad.addColorStop(0.82, 'rgba(225, 205, 175, 0.05)')
      grad.addColorStop(1, 'rgba(200, 180, 150, 0)')

      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 128, 128)
      return new THREE.CanvasTexture(c)
    }

    const smokeTexture = createSmokeTexture()
    const STEAM_COUNT = 90

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

      const initialAge = (i / STEAM_COUNT) * 6.5
      const p: SteamParticle = {
        mesh: sprite,
        x: (Math.random() - 0.5) * 0.4,
        y: 1.2 + initialAge * 2.5,
        z: 1.8 + (Math.random() - 0.5) * 0.4,
        vy: 0.042 + Math.random() * 0.024,
        scale: 0.95 + initialAge * 0.55,
        growthRate: 0.016 + Math.random() * 0.012,
        maxLife: 6.0 + Math.random() * 1.5,
        age: initialAge,
        curlPhase: Math.random() * Math.PI * 2,
        curlSpeed: 0.75 + Math.random() * 0.55,
        baseOpacity: 0.36 + Math.random() * 0.12,
      }
      sprite.position.set(p.x, p.y, p.z)
      sprite.scale.set(p.scale, p.scale, 1)
      steamGroup.add(sprite)
      steamParticles.push(p)
    }

    // ── 6. Interactive Mouse Parallax Tracking ──
    let targetRotY = 0
    let targetRotX = 0
    let currentRotY = 0
    let currentRotX = 0

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      targetRotY = nx * 0.32
      targetRotX = ny * 0.16
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // ── 7. Resize Observer ──
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

    // ── 8. Animation Loop ──
    let animationFrameId: number
    const clock = new THREE.Clock()

    const animate = () => {
      const t = clock.getElapsedTime()

      // Mouse Parallax Damping
      currentRotY += (targetRotY - currentRotY) * 0.05
      currentRotX += (targetRotX - currentRotX) * 0.05

      masterGroup.rotation.y = currentRotY + Math.sin(t * 0.28) * 0.05
      masterGroup.rotation.x = currentRotX + Math.cos(t * 0.22) * 0.03

      // Gentle cup hovering with signature tilt
      cupGroup.position.y = -3.2 + Math.sin(t * 1.4) * 0.12
      cupGroup.rotation.y = 0.18 + Math.sin(t * 0.6) * 0.08

      // Background Sparkles Everywhere: Twinkle & 3D ambient drift
      everywhereSparkles.rotation.y = t * 0.025
      everywhereSparkles.rotation.x = Math.sin(t * 0.2) * 0.02
      sparkleMat.opacity = 0.65 + Math.sin(t * 1.8) * 0.2

      // Voice Simulation Signal (Dynamic speech cadence)
      const speech = Math.max(0, Math.sin(t * 2.4) * 0.8 + Math.sin(t * 4.6) * 0.35)

      // ── Animate Single Voice Visualizer on the Middle of the Cup ──
      singleVoiceBars.forEach((bar) => {
        // Voice formant harmonic wave across the bars
        const wave =
          Math.sin(bar.idx * 0.75 + t * 6.0) * 0.4 +
          Math.sin(bar.idx * 1.4 - t * 8.5) * 0.3 +
          Math.cos(t * 3.2 + bar.idx * 0.5) * 0.3

        const rawHeight = 0.12 + Math.abs(wave) * bar.centerFactor * (0.4 + speech * 1.4)
        const height = Math.min(1.4, rawHeight)

        bar.mesh.scale.set(1, height, 1)
      })

      // ── Animate Realistic Volumetric Coffee Steam Particles ──
      steamParticles.forEach((p) => {
        p.age += 0.02
        p.y += p.vy
        p.scale += p.growthRate

        const curlX = Math.sin(t * p.curlSpeed + p.y * 0.75 + p.curlPhase) * 0.026
        const curlZ = Math.cos(t * p.curlSpeed + p.y * 0.85 + p.curlPhase) * 0.024
        p.x += curlX
        p.z += curlZ

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

        if (p.age >= p.maxLife || p.y > 15) {
          p.age = 0
          p.y = 1.0 + Math.random() * 0.3
          p.x = (Math.random() - 0.5) * 0.35
          p.z = 1.8 + (Math.random() - 0.5) * 0.35
          p.scale = 0.85 + Math.random() * 0.35
        }
      })

      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // ── 9. Complete Resource Disposal ──
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      resizeObserver.disconnect()

      renderer.dispose()
      cupBodyGeo.dispose()
      cupBaseGeo.dispose()
      cupRimGeo.dispose()
      sleeveGeo.dispose()
      sleeveTopRibGeo.dispose()
      sleeveBottomRibGeo.dispose()
      lidCollarGeo.dispose()
      lidShelfGeo.dispose()
      lidCapGeo.dispose()
      wellGeo.dispose()
      spoutGeo.dispose()
      smokeTexture.dispose()
      sparkleTexture.dispose()
      sparkleGeo.dispose()
      voiceBarGeo.dispose()
      baseCurveGeo.dispose()

      cupMat.dispose()
      sleeveMat.dispose()
      sleeveTrimMat.dispose()
      lidMat.dispose()
      coffeeLiquidMat.dispose()
      sparkleMat.dispose()
      voiceBarMat.dispose()
      baseCurveMat.dispose()

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

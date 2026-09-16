import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * SweepingRibbons3D - Realistic Branded Takeaway Coffee Cup with Logo Gold Palette
 *
 * Specific Enhancements:
 * 1. Branded Coffee Cup: Infused with the signature Gold & Amber palette from `brand-logo.jpg`:
 *    - Warm artisanal cream cup body with subtle paper texture.
 *    - Signature Logo-Gold heat sleeve with realistic top/bottom bevel bands and metallic sheen.
 *    - Barista snap-on lid with drinking well and dark espresso liquid visible in the aperture.
 *    - 14° dynamic tilt matching the logo's iconic silhouette angle.
 * 2. Pure Volumetric Steam: Soft Gaussian vapor puffs rising, expanding, and dissipating naturally.
 * 3. Golden Background Stardust Sparkles: Twinkling stardust cloud in the deep z-space behind the cup.
 * 4. Professional Mid-Level Voice Visualizer: Sleek high-end pro-audio telemetry ring at the middle
 *    with 40 precision gold & amber frequency meters and dual acoustic telemetry halos.
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
    camera.position.set(0, 0.6, 44)

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

    // 2. Warm Luxury Studio Lighting (Complementing Logo Gold)
    const ambientLight = new THREE.AmbientLight(0x2d2417, 2.6)
    scene.add(ambientLight)

    // Key Light: Warm champagne studio light
    const keyLight = new THREE.DirectionalLight(0xfffaed, 4.5)
    keyLight.position.set(24, 28, 30)
    scene.add(keyLight)

    // Back Rim Light: Rich logo gold edge light (#d4af37 / #f59e0b)
    const rimLight = new THREE.DirectionalLight(0xf59e0b, 4.6)
    rimLight.position.set(-22, -4, -20)
    scene.add(rimLight)

    // Soft Warm Fill Light
    const fillLight = new THREE.DirectionalLight(0xffedd5, 2.2)
    fillLight.position.set(-18, 12, 26)
    scene.add(fillLight)

    // Warm Steam & Crema Core Light directly above lid
    const coreLight = new THREE.PointLight(0xfde047, 3.5, 22)
    coreLight.position.set(0, 3.6, 1.2)
    scene.add(coreLight)

    // Master Group for mouse parallax
    const masterGroup = new THREE.Group()
    masterGroup.position.set(0, -1.6, 0)
    scene.add(masterGroup)

    // ── 3. Background Golden Stardust Sparkles (Deep z-space) ──
    function createSparkleTexture() {
      const c = document.createElement('canvas')
      c.width = 64
      c.height = 64
      const ctx = c.getContext('2d')!
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
      g.addColorStop(0, 'rgba(255, 255, 255, 1)')
      g.addColorStop(0.25, 'rgba(254, 240, 138, 0.9)')
      g.addColorStop(0.55, 'rgba(217, 119, 6, 0.4)')
      g.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 64, 64)
      return new THREE.CanvasTexture(c)
    }

    const sparkleTexture = createSparkleTexture()
    const SPARKLE_COUNT = 125
    const sparklePositions = new Float32Array(SPARKLE_COUNT * 3)

    for (let i = 0; i < SPARKLE_COUNT; i++) {
      sparklePositions[i * 3 + 0] = (Math.random() - 0.5) * 44
      sparklePositions[i * 3 + 1] = (Math.random() - 0.5) * 38 + 2
      sparklePositions[i * 3 + 2] = -6 - Math.random() * 20
    }

    const sparkleGeo = new THREE.BufferGeometry()
    sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3))

    const sparkleMat = new THREE.PointsMaterial({
      size: 1.15,
      map: sparkleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.75,
    })
    const bgSparkles = new THREE.Points(sparkleGeo, sparkleMat)
    masterGroup.add(bgSparkles)

    // ── 4. Branded Takeaway Coffee Cup (Tilted with Logo Gold Sleeve) ──
    const cupGroup = new THREE.Group()
    cupGroup.position.set(0, -3.2, 0)
    masterGroup.add(cupGroup)

    // Materials:
    // Warm artisan cream body
    const cupMat = new THREE.MeshStandardMaterial({
      color: 0xfbf8f2,
      roughness: 0.38,
      metalness: 0.04,
    })

    // Logo-Gold Metallic Coffee Sleeve (#d4af37 / #c8993e)
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

    // Clean Barista Snap-on Lid
    const lidMat = new THREE.MeshStandardMaterial({
      color: 0xfdfdfc,
      roughness: 0.24,
      metalness: 0.05,
    })

    // Roasted Dark Espresso Liquid for sipping hole
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
    // Height: 2.7, fits snugly over tapered cup body
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

    // E. Snap-on Barista Lid (Clean stepped silhouette matching logo)
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

    // Drinking Well / Recess
    const wellGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.1, 48)
    const wellMesh = new THREE.Mesh(wellGeo, lidMat)
    wellMesh.position.y = 4.48
    cupGroup.add(wellMesh)

    // Sipping Hole with Dark Espresso Liquid within
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

    // ── 6. Professional High-End Audio Voice Visualizer in the MIDDLE ──
    // Positioned at the middle elevation (y: 0.6) framing the cup's upper half
    const voiceGroup = new THREE.Group()
    voiceGroup.position.set(0, 0.6, 0)
    masterGroup.add(voiceGroup)

    // Precision Pro-Audio Horizon Halo Ring
    const ringRadius = 5.2
    const ringGeo = new THREE.TorusGeometry(ringRadius, 0.035, 16, 96)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    })
    const horizonRing = new THREE.Mesh(ringGeo, ringMat)
    horizonRing.rotation.x = Math.PI / 2
    voiceGroup.add(horizonRing)

    // Precision Pro-Audio Frequency Bars (Left: Host Gold, Right: Peer Amber)
    const BAR_COUNT = 40
    const barGeo = new THREE.CylinderGeometry(0.045, 0.045, 1, 12)

    const barGoldMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xd4af37,
      emissiveIntensity: 0.75,
      roughness: 0.2,
      metalness: 0.85,
    })

    const barAmberMat = new THREE.MeshStandardMaterial({
      color: 0xfdba74,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.7,
      roughness: 0.2,
      metalness: 0.85,
    })

    interface ProBarNode {
      mesh: THREE.Mesh
      angle: number
      phase: number
      isSpeaker1: boolean
    }

    const proBars: ProBarNode[] = []

    for (let i = 0; i < BAR_COUNT; i++) {
      const angle = (i / BAR_COUNT) * Math.PI * 2
      const isSpeaker1 = Math.cos(angle) > 0

      const mesh = new THREE.Mesh(barGeo, isSpeaker1 ? barGoldMat : barAmberMat)
      mesh.position.set(Math.cos(angle) * ringRadius, 0, Math.sin(angle) * ringRadius)
      voiceGroup.add(mesh)

      proBars.push({
        mesh,
        angle,
        phase: i * 0.35,
        isSpeaker1,
      })
    }

    // Undulating Luminous 3D Acoustic Waveform Curve
    const WAVE_POINTS = 96
    const wavePositions = new Float32Array(WAVE_POINTS * 3)
    for (let i = 0; i < WAVE_POINTS; i++) {
      const theta = (i / WAVE_POINTS) * Math.PI * 2
      wavePositions[i * 3 + 0] = Math.cos(theta) * (ringRadius + 0.1)
      wavePositions[i * 3 + 1] = 0
      wavePositions[i * 3 + 2] = Math.sin(theta) * (ringRadius + 0.1)
    }

    const waveGeo = new THREE.BufferGeometry()
    waveGeo.setAttribute('position', new THREE.BufferAttribute(wavePositions, 3))

    const waveLineMat = new THREE.LineBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    })
    const waveLine = new THREE.LineLoop(waveGeo, waveLineMat)
    voiceGroup.add(waveLine)

    // ── 7. Interactive Mouse Parallax Tracking ──
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

    // ── 8. Resize Observer ──
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

    // ── 9. Animation Loop ──
    let animationFrameId: number
    const clock = new THREE.Clock()

    const animate = () => {
      const t = clock.getElapsedTime()

      // Smooth mouse parallax damping
      currentRotY += (targetRotY - currentRotY) * 0.05
      currentRotX += (targetRotX - currentRotX) * 0.05

      masterGroup.rotation.y = currentRotY + Math.sin(t * 0.28) * 0.05
      masterGroup.rotation.x = currentRotX + Math.cos(t * 0.22) * 0.03

      // Gentle cup hovering with signature tilt
      cupGroup.position.y = -3.2 + Math.sin(t * 1.4) * 0.12
      cupGroup.rotation.y = 0.18 + Math.sin(t * 0.6) * 0.08

      // Slow telemetry rotation of the middle voice visualizer
      voiceGroup.rotation.y = -t * 0.12

      // Background Sparkle Twinkle
      sparkleMat.opacity = 0.55 + Math.sin(t * 1.6) * 0.2
      bgSparkles.rotation.y = t * 0.02

      // Realistic Conversational Audio Signals
      const speech1 = Math.max(0, Math.sin(t * 2.2) * 0.8 + Math.sin(t * 4.4) * 0.3)
      const speech2 = Math.max(0, Math.sin(t * 1.9 + 2.3) * 0.75 + Math.cos(t * 3.8) * 0.35)

      // Animate Middle Pro-Audio Frequency Bars
      proBars.forEach((bar) => {
        const activeSpeech = bar.isSpeaker1 ? speech1 : speech2
        const harmonic =
          Math.abs(Math.sin(t * 5.5 + bar.phase)) * 0.5 +
          Math.abs(Math.sin(t * 9.8 + bar.phase * 2)) * 0.35 +
          Math.abs(Math.cos(t * 3.1 + bar.phase)) * 0.25

        const height = 0.25 + harmonic * (0.6 + activeSpeech * 2.2)
        bar.mesh.scale.set(1, height, 1)
        bar.mesh.position.y = (Math.sin(bar.phase) > 0 ? 1 : -1) * (height / 2)
      })

      // Animate 3D Undulating Audio Wave Line
      const wPos = waveGeo.attributes.position.array as Float32Array
      for (let i = 0; i < WAVE_POINTS; i++) {
        const theta = (i / WAVE_POINTS) * Math.PI * 2
        const isLeft = Math.cos(theta) > 0
        const signal = isLeft ? speech1 : speech2

        const waveHeight =
          Math.sin(theta * 6 + t * 4.5) * (0.15 + signal * 0.65) +
          Math.cos(theta * 12 - t * 6.2) * (0.08 + signal * 0.35)

        wPos[i * 3 + 1] = waveHeight
      }
      waveGeo.attributes.position.needsUpdate = true

      // Animate Realistic Volumetric Coffee Steam Particles
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

    // ── 10. Complete Resource Disposal ──
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
      barGeo.dispose()
      ringGeo.dispose()
      waveGeo.dispose()

      cupMat.dispose()
      sleeveMat.dispose()
      sleeveTrimMat.dispose()
      lidMat.dispose()
      coffeeLiquidMat.dispose()
      sparkleMat.dispose()
      ringMat.dispose()
      barGoldMat.dispose()
      barAmberMat.dispose()
      waveLineMat.dispose()

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

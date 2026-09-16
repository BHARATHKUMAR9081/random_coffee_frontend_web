import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * SweepingRibbons3D - Professional Takeaway Coffee Visualizer
 *
 * Specific Enhancements:
 * 1. Background Sparkle Cloud: Glowing warm golden stardust particles with natural twinkle drifting behind the scene.
 * 2. Realistic Volumetric Smoke Only: Removed all planar ribbon strokes; exclusively soft, organic Gaussian smoke puffs.
 * 3. Professional Mid-Level Voice Visualizer: Relocated to the cup's mid-body waist. High-end pro-audio dual stereo
 *    oscilloscope arcs (Speaker 1 Gold & Speaker 2 Champagne) with sleek micro-bars and an undulating acoustic wave line.
 * 4. Pure Seamless White Cup: Exact match to user silhouette without any dark lines.
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
    camera.position.set(0, 0.8, 44)

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

    // 2. High-Luxury Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x27272a, 2.4)
    scene.add(ambientLight)

    // Key Light: Soft studio fill defining crisp white paper cup
    const keyLight = new THREE.DirectionalLight(0xfffaed, 4.4)
    keyLight.position.set(24, 28, 30)
    scene.add(keyLight)

    // Back Rim Light: Warm champagne edge highlight
    const rimLight = new THREE.DirectionalLight(0xf59e0b, 4.0)
    rimLight.position.set(-22, -4, -20)
    scene.add(rimLight)

    // Fill Light: Soft neutral ambient fill
    const fillLight = new THREE.DirectionalLight(0xfff7ed, 2.0)
    fillLight.position.set(-18, 12, 26)
    scene.add(fillLight)

    // Warm Steam Core Light directly over lid
    const steamCoreLight = new THREE.PointLight(0xfef08a, 3.2, 22)
    steamCoreLight.position.set(0, 3.8, 1.2)
    scene.add(steamCoreLight)

    // Master Group for mouse parallax
    const masterGroup = new THREE.Group()
    masterGroup.position.set(0, -1.8, 0)
    scene.add(masterGroup)

    // ── 3. Background Golden Sparkles / Stardust Cloud (Behind the Scene) ──
    function createSparkleTexture() {
      const c = document.createElement('canvas')
      c.width = 64
      c.height = 64
      const ctx = c.getContext('2d')!
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
      g.addColorStop(0, 'rgba(255, 255, 255, 1)')
      g.addColorStop(0.2, 'rgba(254, 240, 138, 0.9)')
      g.addColorStop(0.5, 'rgba(245, 158, 11, 0.4)')
      g.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 64, 64)
      return new THREE.CanvasTexture(c)
    }

    const sparkleTexture = createSparkleTexture()
    const SPARKLE_COUNT = 110
    const sparklePositions = new Float32Array(SPARKLE_COUNT * 3)
    const sparklePhases: number[] = []

    for (let i = 0; i < SPARKLE_COUNT; i++) {
      // Positioned behind the cup in depth (z: -4 to -22)
      sparklePositions[i * 3 + 0] = (Math.random() - 0.5) * 42
      sparklePositions[i * 3 + 1] = (Math.random() - 0.5) * 36 + 2
      sparklePositions[i * 3 + 2] = -5 - Math.random() * 18

      sparklePhases.push(Math.random() * Math.PI * 2)
    }

    const sparkleGeo = new THREE.BufferGeometry()
    sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3))

    const sparkleMat = new THREE.PointsMaterial({
      size: 1.1,
      map: sparkleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.75,
    })
    const bgSparkles = new THREE.Points(sparkleGeo, sparkleMat)
    masterGroup.add(bgSparkles)

    // ── 4. Iconic Takeaway Coffee Cup (Clean Pure White, Zero Dark Lines) ──
    const cupMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.44,
      metalness: 0.02,
    })

    const lidMat = new THREE.MeshStandardMaterial({
      color: 0xf6f6f2,
      roughness: 0.28,
      metalness: 0.04,
    })

    const cupGroup = new THREE.Group()
    cupGroup.position.set(0, -3.8, 0)
    masterGroup.add(cupGroup)

    // A. Cup Body (Tapered Cylinder matching silhouette)
    const cupBodyGeo = new THREE.CylinderGeometry(2.65, 1.95, 6.8, 64)
    const cupBodyMesh = new THREE.Mesh(cupBodyGeo, cupMat)
    cupGroup.add(cupBodyMesh)

    // B. Recessed Bottom Ring Lip
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

    // D. Snap-on Takeaway Lid Steps
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

    // Spout Aperture
    const spoutGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.1, 32)
    const spoutMat = new THREE.MeshStandardMaterial({
      color: 0x141416,
      roughness: 0.6,
      metalness: 0.1,
    })
    const spoutMesh = new THREE.Mesh(spoutGeo, spoutMat)
    spoutMesh.position.set(0, 4.54, 1.85)
    cupGroup.add(spoutMesh)

    cupGroup.rotation.set(0.12, 0.16, -0.04)

    // ── 5. Realistic Volumetric Coffee Steam ONLY (Zero Planar Lines) ──
    function createSmokeTexture() {
      const c = document.createElement('canvas')
      c.width = 128
      c.height = 128
      const ctx = c.getContext('2d')!

      // Multi-layered Gaussian vapor billow with zero hard edges
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
      grad.addColorStop(0, 'rgba(255, 252, 245, 0.8)')
      grad.addColorStop(0.2, 'rgba(250, 242, 225, 0.5)')
      grad.addColorStop(0.5, 'rgba(240, 225, 200, 0.22)')
      grad.addColorStop(0.8, 'rgba(225, 205, 175, 0.05)')
      grad.addColorStop(1, 'rgba(200, 180, 150, 0)')

      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 128, 128)
      return new THREE.CanvasTexture(c)
    }

    const smokeTexture = createSmokeTexture()
    const STEAM_COUNT = 95

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
        y: 1.0 + initialAge * 2.5,
        z: 1.8 + (Math.random() - 0.5) * 0.4,
        vy: 0.042 + Math.random() * 0.024,
        scale: 0.9 + initialAge * 0.58,
        growthRate: 0.016 + Math.random() * 0.012,
        maxLife: 6.0 + Math.random() * 1.5,
        age: initialAge,
        curlPhase: Math.random() * Math.PI * 2,
        curlSpeed: 0.75 + Math.random() * 0.55,
        baseOpacity: 0.35 + Math.random() * 0.12,
      }
      sprite.position.set(p.x, p.y, p.z)
      sprite.scale.set(p.scale, p.scale, 1)
      steamGroup.add(sprite)
      steamParticles.push(p)
    }

    // ── 6. Professional Audio Voice Visualizer in the MIDDLE (Cup Waist) ──
    // Inspired by high-end pro-audio interfaces (Apple Logic / Teenage Engineering):
    // Dual symmetrical stereo spectrum meters wrapping the cup waist, plus an undulating 3D voice wave line.
    const voiceGroup = new THREE.Group()
    voiceGroup.position.set(0, -3.6, 0) // Perfectly centered at the cup's midriff!
    masterGroup.add(voiceGroup)

    // Precision Audio Horizon Rings
    const ringGeo = new THREE.TorusGeometry(4.8, 0.035, 16, 96)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    })
    const horizonRing = new THREE.Mesh(ringGeo, ringMat)
    horizonRing.rotation.x = Math.PI / 2
    voiceGroup.add(horizonRing)

    // Sleek, Minimalist Pro-Audio Frequency Bars (Left: Speaker 1, Right: Speaker 2)
    const BAR_COUNT = 36
    const BAR_RADIUS = 4.8
    const barGeo = new THREE.CylinderGeometry(0.045, 0.045, 1, 12)

    // Speaker 1 (Host - Polished Gold) & Speaker 2 (Peer - Warm Amber)
    const barGoldMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xd4af37,
      emissiveIntensity: 0.7,
      roughness: 0.2,
      metalness: 0.85,
    })

    const barAmberMat = new THREE.MeshStandardMaterial({
      color: 0xfdba74,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.65,
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
      mesh.position.set(Math.cos(angle) * BAR_RADIUS, 0, Math.sin(angle) * BAR_RADIUS)
      voiceGroup.add(mesh)

      proBars.push({
        mesh,
        angle,
        phase: i * 0.35,
        isSpeaker1,
      })
    }

    // Undulating Luminous 3D Acoustic Waveform Curve passing through middle
    const WAVE_POINTS = 96
    const wavePositions = new Float32Array(WAVE_POINTS * 3)
    for (let i = 0; i < WAVE_POINTS; i++) {
      const theta = (i / WAVE_POINTS) * Math.PI * 2
      wavePositions[i * 3 + 0] = Math.cos(theta) * (BAR_RADIUS + 0.1)
      wavePositions[i * 3 + 1] = 0
      wavePositions[i * 3 + 2] = Math.sin(theta) * (BAR_RADIUS + 0.1)
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

      // Gentle cup hovering
      cupGroup.position.y = -3.8 + Math.sin(t * 1.4) * 0.12
      cupGroup.rotation.y = t * 0.16

      // Slow telemetry rotation of the middle voice visualizer
      voiceGroup.rotation.y = -t * 0.12

      // Background Sparkle Twinkle & Gentle Ambient Drift
      sparkleMat.opacity = 0.55 + Math.sin(t * 1.6) * 0.2
      bgSparkles.rotation.y = t * 0.02

      // Realistic Conversational Audio Signals
      const speech1 = Math.max(0, Math.sin(t * 2.2) * 0.8 + Math.sin(t * 4.4) * 0.3)
      const speech2 = Math.max(0, Math.sin(t * 1.9 + 2.3) * 0.75 + Math.cos(t * 3.8) * 0.35)

      // ── Animate Middle Pro-Audio Frequency Bars ──
      proBars.forEach((bar) => {
        const activeSpeech = bar.isSpeaker1 ? speech1 : speech2
        const harmonic =
          Math.abs(Math.sin(t * 5.5 + bar.phase)) * 0.5 +
          Math.abs(Math.sin(t * 9.8 + bar.phase * 2)) * 0.35 +
          Math.abs(Math.cos(t * 3.1 + bar.phase)) * 0.25

        // Clean, logarithmic pro-audio height
        const height = 0.25 + harmonic * (0.6 + activeSpeech * 2.2)

        bar.mesh.scale.set(1, height, 1)
        bar.mesh.position.y = (Math.sin(bar.phase) > 0 ? 1 : -1) * (height / 2)
      })

      // ── Animate 3D Undulating Audio Wave Line ──
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

      // ── Animate Realistic Volumetric Coffee Steam Particles (Organic Only) ──
      steamParticles.forEach((p) => {
        p.age += 0.02
        p.y += p.vy
        p.scale += p.growthRate

        // Fluid convective curl
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

        // Respawn at spout
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
      lidCollarGeo.dispose()
      lidShelfGeo.dispose()
      lidCapGeo.dispose()
      spoutGeo.dispose()
      smokeTexture.dispose()
      sparkleTexture.dispose()
      sparkleGeo.dispose()
      barGeo.dispose()
      ringGeo.dispose()
      waveGeo.dispose()

      cupMat.dispose()
      lidMat.dispose()
      spoutMat.dispose()
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

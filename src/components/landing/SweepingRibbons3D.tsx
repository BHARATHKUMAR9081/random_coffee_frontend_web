import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Idea 5: The Coffee Steam Audio Waveform (1:1 Live Conversation Visualizer)
 *
 * A tactile 3D visualization combining a sleek obsidian espresso cup with
 * dual intertwining ribbons of illuminated coffee vapor that oscillate as
 * real-time acoustic voice waveforms (Speaker 1 Gold & Speaker 2 Amber).
 * Features 3D spectral equalizer bars, expanding acoustic rings, and floating audio phonons.
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

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000)
    camera.position.set(0, 2, 48)

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

    // 2. High-End Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x18181b, 2.0)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xfffaed, 4.0)
    keyLight.position.set(25, 30, 30)
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight(0xf59e0b, 5.0)
    rimLight.position.set(-20, -10, -25)
    scene.add(rimLight)

    const warmCoreLight = new THREE.PointLight(0xf59e0b, 4.5, 30)
    warmCoreLight.position.set(0, -4, 2)
    scene.add(warmCoreLight)

    // Master visualizer group
    const visualizerGroup = new THREE.Group()
    visualizerGroup.position.set(0, -2.5, 0)
    scene.add(visualizerGroup)

    // 3. Obsidian Ceramic Espresso Cup & Saucer at Base
    const cupGroup = new THREE.Group()
    cupGroup.position.set(0, -7.5, 0)
    visualizerGroup.add(cupGroup)

    // Ceramic material (Deep charcoal/obsidian with subtle gold rim sheen)
    const ceramicMat = new THREE.MeshStandardMaterial({
      color: 0x141417,
      roughness: 0.18,
      metalness: 0.25,
    })

    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.2,
      metalness: 0.95,
    })

    const liquidMat = new THREE.MeshStandardMaterial({
      color: 0x221307,
      roughness: 0.08,
      metalness: 0.35,
    })

    // Saucer
    const saucerGeo = new THREE.CylinderGeometry(7.6, 5.2, 0.45, 48)
    const saucer = new THREE.Mesh(saucerGeo, ceramicMat)
    saucer.position.y = -0.25
    cupGroup.add(saucer)

    const saucerRimGeo = new THREE.TorusGeometry(7.5, 0.12, 16, 48)
    const saucerRim = new THREE.Mesh(saucerRimGeo, goldTrimMat)
    saucerRim.rotation.x = Math.PI / 2
    saucerRim.position.y = -0.05
    cupGroup.add(saucerRim)

    // Cup Body
    const cupGeo = new THREE.CylinderGeometry(4.2, 2.8, 4.8, 48, 1, true)
    const cup = new THREE.Mesh(cupGeo, ceramicMat)
    cup.position.y = 2.4
    cupGroup.add(cup)

    // Cup Base Plug
    const cupBottomGeo = new THREE.CylinderGeometry(2.8, 2.7, 0.2, 48)
    const cupBottom = new THREE.Mesh(cupBottomGeo, ceramicMat)
    cupBottom.position.y = 0.1
    cupGroup.add(cupBottom)

    // Gold Lip Ring
    const lipGeo = new THREE.TorusGeometry(4.2, 0.14, 16, 48)
    const lip = new THREE.Mesh(lipGeo, goldTrimMat)
    lip.rotation.x = Math.PI / 2
    lip.position.y = 4.8
    cupGroup.add(lip)

    // Liquid Surface
    const liquidGeo = new THREE.CircleGeometry(4.05, 48)
    const liquid = new THREE.Mesh(liquidGeo, liquidMat)
    liquid.rotation.x = -Math.PI / 2
    liquid.position.y = 4.5
    cupGroup.add(liquid)

    // 4. Acoustic Expanding Rings Radiating from Cup Mouth
    const acousticRings: { mesh: THREE.Mesh; baseScale: number; speed: number; phase: number }[] = []
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    })

    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.RingGeometry(4.2, 4.38, 48)
      const ringMesh = new THREE.Mesh(ringGeo, ringMat.clone())
      ringMesh.rotation.x = -Math.PI / 2
      ringMesh.position.y = 4.6
      cupGroup.add(ringMesh)
      acousticRings.push({
        mesh: ringMesh,
        baseScale: 1,
        speed: 0.75,
        phase: i * (Math.PI * 2 / 3),
      })
    }

    // 5. Dual Rising Voice Waveform Ribbons (Speaker 1: Gold, Speaker 2: Amber)
    // We construct two high-resolution custom parametric ribbon planes that undulate
    // mathematically according to simulated speech harmonics.
    const RIBBON_SEGMENTS_Y = 64
    const RIBBON_HEIGHT = 20
    const RIBBON_WIDTH = 2.4

    // Speaker 1 Ribbon Geometry
    const ribbonGeo1 = new THREE.PlaneGeometry(RIBBON_WIDTH, RIBBON_HEIGHT, 8, RIBBON_SEGMENTS_Y)
    const ribbonMat1 = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      emissive: 0x926c15,
      emissiveIntensity: 0.45,
      roughness: 0.25,
      metalness: 0.85,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    })
    const ribbonMesh1 = new THREE.Mesh(ribbonGeo1, ribbonMat1)
    ribbonMesh1.position.set(0, 7.5, 0)
    visualizerGroup.add(ribbonMesh1)

    // Speaker 2 Ribbon Geometry (Counter-phase, ember tint)
    const ribbonGeo2 = new THREE.PlaneGeometry(RIBBON_WIDTH, RIBBON_HEIGHT, 8, RIBBON_SEGMENTS_Y)
    const ribbonMat2 = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0x9a3412,
      emissiveIntensity: 0.4,
      roughness: 0.28,
      metalness: 0.8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    })
    const ribbonMesh2 = new THREE.Mesh(ribbonGeo2, ribbonMat2)
    ribbonMesh2.position.set(0, 7.5, 0)
    visualizerGroup.add(ribbonMesh2)

    // Save initial vertex X/Z anchors for the parametric audio deformation
    const basePos1 = ribbonGeo1.attributes.position.clone()
    const basePos2 = ribbonGeo2.attributes.position.clone()

    // 6. 3D Equalizer Spectrograph Bars (Circular Floating Array)
    const BAR_COUNT = 28
    const BAR_RADIUS = 7.8
    const barGeo = new THREE.CylinderGeometry(0.18, 0.18, 1, 16)
    const barMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.9,
    })

    const eqBars: { mesh: THREE.Mesh; angle: number; phaseOffset: number; baseHeight: number }[] = []
    const eqGroup = new THREE.Group()
    eqGroup.position.set(0, -2, 0)
    visualizerGroup.add(eqGroup)

    for (let i = 0; i < BAR_COUNT; i++) {
      const angle = (i / BAR_COUNT) * Math.PI * 2
      const bar = new THREE.Mesh(barGeo, barMat)
      bar.position.set(Math.cos(angle) * BAR_RADIUS, 0, Math.sin(angle) * BAR_RADIUS)
      eqGroup.add(bar)

      eqBars.push({
        mesh: bar,
        angle,
        phaseOffset: i * 0.4,
        baseHeight: 1,
      })
    }

    // 7. Rising Vocal Phonons / Steam Sparkles
    const PARTICLE_COUNT = 75
    const particlePositions = new Float32Array(PARTICLE_COUNT * 3)
    const particleVelocities: { x: number; y: number; z: number; phase: number }[] = []

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particlePositions[i * 3 + 0] = (Math.random() - 0.5) * 5
      particlePositions[i * 3 + 1] = Math.random() * 22 - 3
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 5

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.03,
        y: 0.04 + Math.random() * 0.06,
        z: (Math.random() - 0.5) * 0.03,
        phase: Math.random() * Math.PI * 2,
      })
    }

    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))

    // Soft glowing circle sprite texture
    const pCanvas = document.createElement('canvas')
    pCanvas.width = 64
    pCanvas.height = 64
    const pCtx = pCanvas.getContext('2d')!
    const pGrad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32)
    pGrad.addColorStop(0, 'rgba(255, 245, 200, 1)')
    pGrad.addColorStop(0.3, 'rgba(234, 179, 8, 0.8)')
    pGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    pCtx.fillStyle = pGrad
    pCtx.fillRect(0, 0, 64, 64)
    const particleTexture = new THREE.CanvasTexture(pCanvas)

    const particleMat = new THREE.PointsMaterial({
      size: 0.9,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.75,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    visualizerGroup.add(particles)

    // 8. Mouse Parallax Interaction
    let targetRotY = 0
    let targetRotX = 0
    let currentRotY = 0
    let currentRotX = 0

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      targetRotY = nx * 0.35
      targetRotX = ny * 0.2
    }

    window.addEventListener('mousemove', handleMouseMove)

    // 9. Resize Observer
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

    // 10. Animation Loop: Synthetic Audio Voice Simulation & Waveform Synthesis
    let animationFrameId: number
    const clock = new THREE.Clock()

    const animate = () => {
      const t = clock.getElapsedTime()

      // Smooth mouse parallax damping
      currentRotY += (targetRotY - currentRotY) * 0.05
      currentRotX += (targetRotX - currentRotX) * 0.05

      // Natural gentle sway + parallax
      visualizerGroup.rotation.y = currentRotY + Math.sin(t * 0.4) * 0.08
      visualizerGroup.rotation.x = currentRotX + Math.cos(t * 0.35) * 0.04

      // Gentle rotation of the cup & equalizer ring
      cupGroup.rotation.y = t * 0.25
      eqGroup.rotation.y = -t * 0.15

      // Simulated Vocal Activity Cadence:
      // Speaker 1 (Gold) speaks in pulses with pauses; Speaker 2 (Amber) responds
      const speech1 = Math.max(0, Math.sin(t * 1.6) * 0.7 + Math.sin(t * 3.1) * 0.4)
      const speech2 = Math.max(0, Math.sin(t * 1.4 + 2.0) * 0.75 + Math.cos(t * 2.8) * 0.35)

      // Animate Acoustic Rings
      acousticRings.forEach((ring) => {
        const p = ((t * ring.speed + ring.phase) % (Math.PI * 2)) / (Math.PI * 2)
        const scale = 1 + p * 1.6
        ring.mesh.scale.set(scale, scale, 1)
        ring.mesh.position.y = 4.6 + p * 1.8
        const mat = ring.mesh.material as THREE.MeshBasicMaterial
        mat.opacity = (1 - p) * 0.45 * (0.5 + speech1 * 0.5)
      })

      // Animate Speaker 1 Ribbon (Undulating vocal steam wave)
      const posAttr1 = ribbonGeo1.attributes.position
      const count1 = posAttr1.count

      for (let i = 0; i < count1; i++) {
        const origX = basePos1.getX(i)
        const origY = basePos1.getY(i)
        // Normalized height from bottom (0) to top (1)
        const normY = (origY + RIBBON_HEIGHT / 2) / RIBBON_HEIGHT

        // Steam expansion taper: narrow at cup rim, expanding upward
        const widthScale = 0.4 + normY * 1.2

        // Complex multi-harmonic voice frequency formula
        const waveX =
          Math.sin(normY * 6 - t * 4.2) * (1.2 + speech1 * 2.2) * normY +
          Math.sin(normY * 14 - t * 7.5) * (0.4 + speech1 * 0.8) * normY

        const waveZ =
          Math.cos(normY * 5 - t * 3.8) * (1.0 + speech1 * 1.8) * normY +
          Math.cos(normY * 12 - t * 6.2) * (0.35 + speech1 * 0.6) * normY

        // Helical curl as steam rises
        const spiralX = Math.sin(normY * 4 + t * 0.8) * normY * 2.2
        const spiralZ = Math.cos(normY * 4 + t * 0.8) * normY * 2.2

        posAttr1.setX(i, origX * widthScale + waveX + spiralX)
        posAttr1.setZ(i, waveZ + spiralZ)
      }
      posAttr1.needsUpdate = true
      ribbonGeo1.computeVertexNormals()

      // Animate Speaker 2 Ribbon (Intertwining counter-phase vocal stream)
      const posAttr2 = ribbonGeo2.attributes.position
      const count2 = posAttr2.count

      for (let i = 0; i < count2; i++) {
        const origX = basePos2.getX(i)
        const origY = basePos2.getY(i)
        const normY = (origY + RIBBON_HEIGHT / 2) / RIBBON_HEIGHT
        const widthScale = 0.35 + normY * 1.1

        const waveX =
          Math.cos(normY * 5.5 - t * 3.9 + Math.PI) * (1.1 + speech2 * 2.0) * normY +
          Math.cos(normY * 13 - t * 7.0) * (0.35 + speech2 * 0.75) * normY

        const waveZ =
          Math.sin(normY * 4.8 - t * 3.5 + Math.PI) * (0.9 + speech2 * 1.6) * normY +
          Math.sin(normY * 11 - t * 5.8) * (0.3 + speech2 * 0.55) * normY

        // Counter-helical curl
        const spiralX = Math.sin(normY * 4 - t * 0.7 + Math.PI) * normY * 2.0
        const spiralZ = Math.cos(normY * 4 - t * 0.7 + Math.PI) * normY * 2.0

        posAttr2.setX(i, origX * widthScale + waveX + spiralX)
        posAttr2.setZ(i, waveZ + spiralZ)
      }
      posAttr2.needsUpdate = true
      ribbonGeo2.computeVertexNormals()

      // Dynamic ribbon glow intensity matching vocal modulation
      ribbonMat1.emissiveIntensity = 0.35 + speech1 * 0.65
      ribbonMat2.emissiveIntensity = 0.3 + speech2 * 0.6

      // Animate 3D Equalizer Spectrograph Bars
      eqBars.forEach((b) => {
        // Multi-frequency harmonic formula
        const harmonic =
          Math.abs(Math.sin(t * 4.5 + b.phaseOffset)) * 0.5 +
          Math.abs(Math.sin(t * 8.2 + b.phaseOffset * 2)) * 0.35 +
          Math.abs(Math.cos(t * 2.1 + b.phaseOffset)) * 0.25

        const voiceInfluence = (speech1 + speech2) * 0.6
        const height = 0.6 + harmonic * (1.8 + voiceInfluence * 3.2)
        b.mesh.scale.set(1, height, 1)
        b.mesh.position.y = height / 2
      })

      // Animate Rising Vocal Phonon Particles
      const pArr = particleGeo.attributes.position.array as Float32Array
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const vel = particleVelocities[i]
        pArr[i * 3 + 1] += vel.y
        pArr[i * 3 + 0] += vel.x + Math.sin(t * 2 + vel.phase) * 0.02
        pArr[i * 3 + 2] += vel.z + Math.cos(t * 2 + vel.phase) * 0.02

        // Reset particle if it drifts above ribbon ceiling
        if (pArr[i * 3 + 1] > 20) {
          pArr[i * 3 + 1] = -3
          pArr[i * 3 + 0] = (Math.random() - 0.5) * 3
          pArr[i * 3 + 2] = (Math.random() - 0.5) * 3
        }
      }
      particleGeo.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // 11. Complete Resource Disposal
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      resizeObserver.disconnect()

      renderer.dispose()
      saucerGeo.dispose()
      saucerRimGeo.dispose()
      cupGeo.dispose()
      cupBottomGeo.dispose()
      lipGeo.dispose()
      liquidGeo.dispose()
      ribbonGeo1.dispose()
      ribbonGeo2.dispose()
      barGeo.dispose()
      particleGeo.dispose()
      particleTexture.dispose()

      ceramicMat.dispose()
      goldTrimMat.dispose()
      liquidMat.dispose()
      ringMat.dispose()
      ribbonMat1.dispose()
      ribbonMat2.dispose()
      barMat.dispose()
      particleMat.dispose()
    }
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full relative flex items-center justify-center pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  )
}

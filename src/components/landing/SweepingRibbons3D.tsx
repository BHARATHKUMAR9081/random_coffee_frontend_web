import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Idea 5 with User's Takeaway Coffee Cup:
 *
 * Faithfully incorporates the user's iconic takeaway coffee cup silhouette:
 * - Crisp matte white takeaway cup body with subtle gold brand accent and base ring
 * - Protruding snap-on takeaway lid with realistic collar overhang, raised plateau, and sipping aperture
 * - Dual vocal coffee steam ribbons (Speaker 1 Gold & Speaker 2 Amber) rising from the sipping spout
 * - 3D floating equalizer bars around the base and floating golden acoustic phonons
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
    camera.position.set(0, 1.5, 46)

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
    const ambientLight = new THREE.AmbientLight(0x1a2130, 1.8)
    scene.add(ambientLight)

    // Key Light: Crisp warm studio light for clean white cup definition
    const keyLight = new THREE.DirectionalLight(0xfffaed, 4.5)
    keyLight.position.set(25, 28, 32)
    scene.add(keyLight)

    // Back Rim Light: Golden glow highlighting cup silhouette and steam ribbons
    const rimLight = new THREE.DirectionalLight(0xf59e0b, 4.5)
    rimLight.position.set(-22, -8, -24)
    scene.add(rimLight)

    // Soft Warm Front Fill
    const fillLight = new THREE.DirectionalLight(0xfff7ed, 2.0)
    fillLight.position.set(-20, 12, 28)
    scene.add(fillLight)

    // Golden Halo point light behind the cup
    const coreLight = new THREE.PointLight(0xf59e0b, 3.8, 32)
    coreLight.position.set(0, 2, -2)
    scene.add(coreLight)

    // Master Visualizer Group
    const visualizerGroup = new THREE.Group()
    visualizerGroup.position.set(0, -3.2, 0)
    scene.add(visualizerGroup)

    // 3. Materials (Crisp Pure White Takeaway Cup + Gold Foil Detailing)
    const cupMat = new THREE.MeshStandardMaterial({
      color: 0xfcfbfa,
      roughness: 0.32,
      metalness: 0.04,
    })

    const lidMat = new THREE.MeshStandardMaterial({
      color: 0xf6f5f0,
      roughness: 0.22,
      metalness: 0.06,
    })

    const goldAccentMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.16,
      metalness: 0.95,
      emissive: 0x3d2706,
      emissiveIntensity: 0.2,
    })

    // 4. Iconic Takeaway Coffee Cup (Matching User Silhouette Image)
    const cupGroup = new THREE.Group()
    cupGroup.position.set(0, -3.5, 0)
    visualizerGroup.add(cupGroup)

    // A. Cup Body (Tapered Cylinder matching silhouette proportions)
    // Top radius 2.65, bottom radius 1.95, height 6.8
    const cupBodyGeo = new THREE.CylinderGeometry(2.65, 1.95, 6.8, 64)
    const cupBodyMesh = new THREE.Mesh(cupBodyGeo, cupMat)
    cupGroup.add(cupBodyMesh)

    // B. Recessed Bottom Ring / Base Lip
    const cupBaseGeo = new THREE.CylinderGeometry(1.98, 1.92, 0.3, 64)
    const cupBaseMesh = new THREE.Mesh(cupBaseGeo, cupMat)
    cupBaseMesh.position.y = -3.42
    cupGroup.add(cupBaseMesh)

    // C. Cup Top Rim (Rolled paper edge)
    const cupRimGeo = new THREE.TorusGeometry(2.68, 0.08, 16, 64)
    const cupRimMesh = new THREE.Mesh(cupRimGeo, cupMat)
    cupRimMesh.rotation.x = Math.PI / 2
    cupRimMesh.position.y = 3.4
    cupGroup.add(cupRimMesh)

    // D. Decorative Gold Band on Cup (Luxury Executive Branding)
    const cupBandGeo = new THREE.CylinderGeometry(2.45, 2.38, 0.6, 64)
    const cupBandMesh = new THREE.Mesh(cupBandGeo, goldAccentMat)
    cupBandMesh.position.y = 0.5
    cupGroup.add(cupBandMesh)

    // E. Takeaway Snap-on Lid (Distinct Silhouette Steps)
    // Step 1: Overhanging Rim / Lip Collar (Prominently juts out over cup)
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

    // Step 4: Drinking Spout Aperture with Gold Trim
    const spoutGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.12, 32)
    const spoutMesh = new THREE.Mesh(spoutGeo, goldAccentMat)
    spoutMesh.position.set(0, 4.54, 1.88)
    cupGroup.add(spoutMesh)

    // Subtle initial ergonomic tilt
    cupGroup.rotation.set(0.12, 0.18, -0.05)

    // 5. Dual Rising Vocal Steam Audio Ribbons (Emitting from Spout)
    const RIBBON_SEGMENTS_Y = 64
    const RIBBON_HEIGHT = 18
    const RIBBON_WIDTH = 2.2

    // Speaker 1 Ribbon Geometry (Warm Gold)
    const ribbonGeo1 = new THREE.PlaneGeometry(RIBBON_WIDTH, RIBBON_HEIGHT, 8, RIBBON_SEGMENTS_Y)
    const ribbonMat1 = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      emissive: 0x926c15,
      emissiveIntensity: 0.5,
      roughness: 0.22,
      metalness: 0.88,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    })
    const ribbonMesh1 = new THREE.Mesh(ribbonGeo1, ribbonMat1)
    ribbonMesh1.position.set(0, 10.2, 0)
    visualizerGroup.add(ribbonMesh1)

    // Speaker 2 Ribbon Geometry (Counter-phase, Amber Ember)
    const ribbonGeo2 = new THREE.PlaneGeometry(RIBBON_WIDTH, RIBBON_HEIGHT, 8, RIBBON_SEGMENTS_Y)
    const ribbonMat2 = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0x9a3412,
      emissiveIntensity: 0.45,
      roughness: 0.25,
      metalness: 0.82,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    })
    const ribbonMesh2 = new THREE.Mesh(ribbonGeo2, ribbonMat2)
    ribbonMesh2.position.set(0, 10.2, 0)
    visualizerGroup.add(ribbonMesh2)

    // Base anchors for parametric audio wave deformation
    const basePos1 = ribbonGeo1.attributes.position.clone()
    const basePos2 = ribbonGeo2.attributes.position.clone()

    // 6. Acoustic Expanding Concentric Rings (Sound Pulses from Cup Lid)
    const acousticRings: { mesh: THREE.Mesh; baseScale: number; speed: number; phase: number }[] = []
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    })

    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.RingGeometry(2.7, 2.85, 48)
      const ringMesh = new THREE.Mesh(ringGeo, ringMat.clone())
      ringMesh.rotation.x = -Math.PI / 2
      ringMesh.position.set(0, 4.5, 0)
      cupGroup.add(ringMesh)
      acousticRings.push({
        mesh: ringMesh,
        baseScale: 1,
        speed: 0.8,
        phase: i * (Math.PI * 2 / 3),
      })
    }

    // 7. 3D Equalizer Spectrograph Bars (Orbiting the Takeaway Cup Base)
    const BAR_COUNT = 24
    const BAR_RADIUS = 6.4
    const barGeo = new THREE.CylinderGeometry(0.16, 0.16, 1, 16)
    const barMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.55,
      roughness: 0.2,
      metalness: 0.9,
    })

    const eqBars: { mesh: THREE.Mesh; angle: number; phaseOffset: number }[] = []
    const eqGroup = new THREE.Group()
    eqGroup.position.set(0, -6.8, 0)
    visualizerGroup.add(eqGroup)

    for (let i = 0; i < BAR_COUNT; i++) {
      const angle = (i / BAR_COUNT) * Math.PI * 2
      const bar = new THREE.Mesh(barGeo, barMat)
      bar.position.set(Math.cos(angle) * BAR_RADIUS, 0, Math.sin(angle) * BAR_RADIUS)
      eqGroup.add(bar)

      eqBars.push({
        mesh: bar,
        angle,
        phaseOffset: i * 0.42,
      })
    }

    // 8. Rising Vocal Phonons / Steam Sparkles
    const PARTICLE_COUNT = 70
    const particlePositions = new Float32Array(PARTICLE_COUNT * 3)
    const particleVelocities: { x: number; y: number; z: number; phase: number }[] = []

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particlePositions[i * 3 + 0] = (Math.random() - 0.5) * 4
      particlePositions[i * 3 + 1] = Math.random() * 20 - 2
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 4

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.025,
        y: 0.045 + Math.random() * 0.055,
        z: (Math.random() - 0.5) * 0.025,
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
    pGrad.addColorStop(0, 'rgba(255, 245, 210, 1)')
    pGrad.addColorStop(0.35, 'rgba(234, 179, 8, 0.8)')
    pGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    pCtx.fillStyle = pGrad
    pCtx.fillRect(0, 0, 64, 64)
    const particleTexture = new THREE.CanvasTexture(pCanvas)

    const particleMat = new THREE.PointsMaterial({
      size: 0.85,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.75,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    visualizerGroup.add(particles)

    // 9. Interactive Mouse Parallax
    let targetRotY = 0
    let targetRotX = 0
    let currentRotY = 0
    let currentRotX = 0

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      targetRotY = nx * 0.4
      targetRotX = ny * 0.22
    }

    window.addEventListener('mousemove', handleMouseMove)

    // 10. Resize Observer
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

    // 11. Animation Loop
    let animationFrameId: number
    const clock = new THREE.Clock()

    const animate = () => {
      const t = clock.getElapsedTime()

      // Mouse Parallax Damping
      currentRotY += (targetRotY - currentRotY) * 0.05
      currentRotX += (targetRotX - currentRotX) * 0.05

      visualizerGroup.rotation.y = currentRotY + Math.sin(t * 0.35) * 0.07
      visualizerGroup.rotation.x = currentRotX + Math.cos(t * 0.3) * 0.04

      // Gentle cup hovering & slow axial rotation
      cupGroup.position.y = -3.5 + Math.sin(t * 1.5) * 0.18
      cupGroup.rotation.y = t * 0.22
      cupGroup.rotation.z = -0.05 + Math.sin(t * 0.9) * 0.02

      eqGroup.rotation.y = -t * 0.14

      // Voice Simulation Signals (Speaker 1 Gold & Speaker 2 Amber)
      const speech1 = Math.max(0, Math.sin(t * 1.7) * 0.7 + Math.sin(t * 3.3) * 0.4)
      const speech2 = Math.max(0, Math.sin(t * 1.5 + 2.2) * 0.75 + Math.cos(t * 2.9) * 0.35)

      // Animate Acoustic Rings
      acousticRings.forEach((ring) => {
        const p = ((t * ring.speed + ring.phase) % (Math.PI * 2)) / (Math.PI * 2)
        const scale = 1 + p * 1.5
        ring.mesh.scale.set(scale, scale, 1)
        ring.mesh.position.y = 4.5 + p * 1.6
        const mat = ring.mesh.material as THREE.MeshBasicMaterial
        mat.opacity = (1 - p) * 0.45 * (0.5 + speech1 * 0.5)
      })

      // Animate Speaker 1 Ribbon (Undulating vocal steam wave)
      const posAttr1 = ribbonGeo1.attributes.position
      const count1 = posAttr1.count

      for (let i = 0; i < count1; i++) {
        const origX = basePos1.getX(i)
        const origY = basePos1.getY(i)
        const normY = (origY + RIBBON_HEIGHT / 2) / RIBBON_HEIGHT
        const widthScale = 0.35 + normY * 1.15

        const waveX =
          Math.sin(normY * 6 - t * 4.2) * (1.1 + speech1 * 2.1) * normY +
          Math.sin(normY * 14 - t * 7.5) * (0.35 + speech1 * 0.75) * normY

        const waveZ =
          Math.cos(normY * 5 - t * 3.8) * (0.95 + speech1 * 1.7) * normY +
          Math.cos(normY * 12 - t * 6.2) * (0.3 + speech1 * 0.55) * normY

        const spiralX = Math.sin(normY * 3.8 + t * 0.75) * normY * 2.0
        const spiralZ = Math.cos(normY * 3.8 + t * 0.75) * normY * 2.0

        posAttr1.setX(i, origX * widthScale + waveX + spiralX)
        posAttr1.setZ(i, waveZ + spiralZ)
      }
      posAttr1.needsUpdate = true
      ribbonGeo1.computeVertexNormals()

      // Animate Speaker 2 Ribbon (Intertwining counter-phase stream)
      const posAttr2 = ribbonGeo2.attributes.position
      const count2 = posAttr2.count

      for (let i = 0; i < count2; i++) {
        const origX = basePos2.getX(i)
        const origY = basePos2.getY(i)
        const normY = (origY + RIBBON_HEIGHT / 2) / RIBBON_HEIGHT
        const widthScale = 0.32 + normY * 1.05

        const waveX =
          Math.cos(normY * 5.5 - t * 3.9 + Math.PI) * (1.0 + speech2 * 1.9) * normY +
          Math.cos(normY * 13 - t * 7.0) * (0.32 + speech2 * 0.7) * normY

        const waveZ =
          Math.sin(normY * 4.8 - t * 3.5 + Math.PI) * (0.85 + speech2 * 1.5) * normY +
          Math.sin(normY * 11 - t * 5.8) * (0.28 + speech2 * 0.5) * normY

        const spiralX = Math.sin(normY * 3.8 - t * 0.7 + Math.PI) * normY * 1.8
        const spiralZ = Math.cos(normY * 3.8 - t * 0.7 + Math.PI) * normY * 1.8

        posAttr2.setX(i, origX * widthScale + waveX + spiralX)
        posAttr2.setZ(i, waveZ + spiralZ)
      }
      posAttr2.needsUpdate = true
      ribbonGeo2.computeVertexNormals()

      // Emissive glow modulation
      ribbonMat1.emissiveIntensity = 0.35 + speech1 * 0.65
      ribbonMat2.emissiveIntensity = 0.3 + speech2 * 0.6

      // Animate 3D Equalizer Bars
      eqBars.forEach((b) => {
        const harmonic =
          Math.abs(Math.sin(t * 4.5 + b.phaseOffset)) * 0.5 +
          Math.abs(Math.sin(t * 8.2 + b.phaseOffset * 2)) * 0.35 +
          Math.abs(Math.cos(t * 2.1 + b.phaseOffset)) * 0.25

        const voiceInfluence = (speech1 + speech2) * 0.6
        const height = 0.5 + harmonic * (1.6 + voiceInfluence * 2.8)
        b.mesh.scale.set(1, height, 1)
        b.mesh.position.y = height / 2
      })

      // Animate Phonon Particles
      const pArr = particleGeo.attributes.position.array as Float32Array
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const vel = particleVelocities[i]
        pArr[i * 3 + 1] += vel.y
        pArr[i * 3 + 0] += vel.x + Math.sin(t * 2 + vel.phase) * 0.02
        pArr[i * 3 + 2] += vel.z + Math.cos(t * 2 + vel.phase) * 0.02

        if (pArr[i * 3 + 1] > 20) {
          pArr[i * 3 + 1] = -1
          pArr[i * 3 + 0] = (Math.random() - 0.5) * 3
          pArr[i * 3 + 2] = (Math.random() - 0.5) * 3
        }
      }
      particleGeo.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // 12. Resource Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      resizeObserver.disconnect()

      renderer.dispose()
      cupBodyGeo.dispose()
      cupBaseGeo.dispose()
      cupRimGeo.dispose()
      cupBandGeo.dispose()
      lidCollarGeo.dispose()
      lidShelfGeo.dispose()
      lidCapGeo.dispose()
      spoutGeo.dispose()
      ribbonGeo1.dispose()
      ribbonGeo2.dispose()
      barGeo.dispose()
      particleGeo.dispose()
      particleTexture.dispose()

      cupMat.dispose()
      lidMat.dispose()
      goldAccentMat.dispose()
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

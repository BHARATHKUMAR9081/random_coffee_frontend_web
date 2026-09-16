import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * SweepingRibbons3D - Two Branded Coffee Cups Clinking in a Celebratory "Cheers"
 *
 * Features:
 * 1. Two Logo-Branded Takeaway Coffee Cups (Host & Peer):
 *    - Warm artisan cream paper body with metallic brushed logo-gold sleeves.
 *    - Crisp barista snap-on lids with sipping apertures and dark espresso liquid.
 *    - Single voice waveform visualizers integrated into each cup's sleeve.
 * 2. Rhythmic "Cheers" Clink Animation:
 *    - Conversational floating hover apart -> smooth approach & inward tilt -> celebratory clink tap ->
 *      radiant golden contact shockwave & spark burst -> soft spring recoil.
 * 3. Dual Volumetric Steam Clouds: Organic rising vapor plumes billowing from both sipping spouts.
 * 4. Stardust Sparkles Everywhere: Omnidirectional golden stardust floating throughout 3D space.
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
    camera.position.set(0, 0.2, 37)

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

    // Center cheers highlight point light
    const cheersPointLight = new THREE.PointLight(0xfde047, 4.0, 24)
    cheersPointLight.position.set(0, 1.2, 3)
    scene.add(cheersPointLight)

    // Master Group for mouse parallax
    const masterGroup = new THREE.Group()
    masterGroup.position.set(0, -1.2, 0)
    scene.add(masterGroup)

    // ── 3. Golden Stardust Sparkles EVERYWHERE (Foreground, Midground, Background) ──
    function createSparkleTexture() {
      const c = document.createElement('canvas')
      c.width = 64
      c.height = 64
      const ctx = c.getContext('2d')!
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
      g.addColorStop(0, 'rgba(255, 255, 255, 1)')
      g.addColorStop(0.25, 'rgba(254, 240, 138, 0.95)')
      g.addColorStop(0.55, 'rgba(245, 158, 11, 0.45)')
      g.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 64, 64)
      return new THREE.CanvasTexture(c)
    }

    const sparkleTexture = createSparkleTexture()
    const SPARKLE_COUNT = 240
    const sparklePositions = new Float32Array(SPARKLE_COUNT * 3)

    for (let i = 0; i < SPARKLE_COUNT; i++) {
      sparklePositions[i * 3 + 0] = (Math.random() - 0.5) * 52
      sparklePositions[i * 3 + 1] = (Math.random() - 0.5) * 44 + 1
      sparklePositions[i * 3 + 2] = (Math.random() - 0.5) * 42
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

    // ── 4. Shared Cup Geometries & Materials ──
    const CUP_SCALE = 0.98 // Scaled up to be heroically prominent

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

    const voiceBarMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfef08a,
      emissiveIntensity: 0.95,
      roughness: 0.12,
      metalness: 0.9,
    })

    const baseCurveMat = new THREE.LineBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    })

    // Geometries
    const cupBodyGeo = new THREE.CylinderGeometry(2.65, 1.95, 6.8, 48)
    const cupBaseGeo = new THREE.CylinderGeometry(1.98, 1.92, 0.3, 48)
    const cupRimGeo = new THREE.TorusGeometry(2.68, 0.08, 16, 48)
    const sleeveGeo = new THREE.CylinderGeometry(2.48, 2.22, 2.7, 48)
    const sleeveTopRibGeo = new THREE.TorusGeometry(2.5, 0.04, 16, 48)
    const sleeveBottomRibGeo = new THREE.TorusGeometry(2.24, 0.04, 16, 48)
    const lidCollarGeo = new THREE.CylinderGeometry(2.92, 2.94, 0.48, 48)
    const lidShelfGeo = new THREE.CylinderGeometry(2.76, 2.86, 0.35, 48)
    const lidCapGeo = new THREE.CylinderGeometry(2.5, 2.68, 0.36, 48)
    const wellGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.1, 40)
    const spoutGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.12, 24)
    const voiceBarGeo = new THREE.CylinderGeometry(0.038, 0.038, 1, 12)

    interface CupInstance {
      group: THREE.Group
      voiceBars: { mesh: THREE.Mesh; idx: number; centerFactor: number }[]
    }

    function buildCup(): CupInstance {
      const g = new THREE.Group()
      g.scale.set(CUP_SCALE, CUP_SCALE, CUP_SCALE)

      // Body
      const body = new THREE.Mesh(cupBodyGeo, cupMat)
      g.add(body)

      // Base
      const base = new THREE.Mesh(cupBaseGeo, cupMat)
      base.position.y = -3.42
      g.add(base)

      // Rim
      const rim = new THREE.Mesh(cupRimGeo, cupMat)
      rim.rotation.x = Math.PI / 2
      rim.position.y = 3.4
      g.add(rim)

      // Gold Sleeve
      const sleeve = new THREE.Mesh(sleeveGeo, sleeveMat)
      sleeve.position.y = -0.15
      g.add(sleeve)

      const sleeveTopRib = new THREE.Mesh(sleeveTopRibGeo, sleeveTrimMat)
      sleeveTopRib.rotation.x = Math.PI / 2
      sleeveTopRib.position.y = 1.2
      g.add(sleeveTopRib)

      const sleeveBottomRib = new THREE.Mesh(sleeveBottomRibGeo, sleeveTrimMat)
      sleeveBottomRib.rotation.x = Math.PI / 2
      sleeveBottomRib.position.y = -1.5
      g.add(sleeveBottomRib)

      // Single Voice Waveform on the Sleeve
      const voiceSubGroup = new THREE.Group()
      voiceSubGroup.position.set(0, -0.15, 0)
      g.add(voiceSubGroup)

      const VOICE_BAR_COUNT = 17
      const voiceBars: { mesh: THREE.Mesh; idx: number; centerFactor: number }[] = []
      const arcSpread = 0.92
      const sleeveRadius = 2.40

      for (let i = 0; i < VOICE_BAR_COUNT; i++) {
        const frac = (i / (VOICE_BAR_COUNT - 1)) - 0.5
        const theta = Math.PI / 2 + frac * arcSpread
        const centerFactor = 1 - Math.abs(frac) * 1.5

        const bar = new THREE.Mesh(voiceBarGeo, voiceBarMat)
        bar.position.set(Math.cos(theta) * sleeveRadius, 0, Math.sin(theta) * sleeveRadius)
        bar.rotation.y = -theta + Math.PI / 2
        voiceSubGroup.add(bar)

        voiceBars.push({
          mesh: bar,
          idx: i,
          centerFactor: Math.max(0.18, centerFactor),
        })
      }

      // Lid
      const lidCollar = new THREE.Mesh(lidCollarGeo, lidMat)
      lidCollar.position.y = 3.65
      g.add(lidCollar)

      const lidShelf = new THREE.Mesh(lidShelfGeo, lidMat)
      lidShelf.position.y = 4.02
      g.add(lidShelf)

      const lidCap = new THREE.Mesh(lidCapGeo, lidMat)
      lidCap.position.y = 4.34
      g.add(lidCap)

      const well = new THREE.Mesh(wellGeo, lidMat)
      well.position.y = 4.48
      g.add(well)

      const spout = new THREE.Mesh(spoutGeo, coffeeLiquidMat)
      spout.position.set(0, 4.54, 1.82)
      g.add(spout)

      return { group: g, voiceBars }
    }

    // Create Cup 1 (Left / Host) and Cup 2 (Right / Peer)
    const cup1 = buildCup()
    const cup2 = buildCup()
    masterGroup.add(cup1.group)
    masterGroup.add(cup2.group)

    // ── 5. Cheers Clink Impact Shockwave Ring & Contact Spark Burst ──
    const shockwaveGeo = new THREE.RingGeometry(0.1, 0.45, 32)
    const shockwaveMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const shockwaveMesh = new THREE.Mesh(shockwaveGeo, shockwaveMat)
    shockwaveMesh.position.set(0, 0.8, 1.5)
    masterGroup.add(shockwaveMesh)

    // Contact Sparks burst at the cheers point
    const CHEERS_SPARK_COUNT = 24
    const cheersSparkGeo = new THREE.BufferGeometry()
    const cheersSparkPos = new Float32Array(CHEERS_SPARK_COUNT * 3)
    const cheersSparkVel: { x: number; y: number; z: number }[] = []

    for (let i = 0; i < CHEERS_SPARK_COUNT; i++) {
      cheersSparkPos[i * 3 + 0] = 0
      cheersSparkPos[i * 3 + 1] = 0.8
      cheersSparkPos[i * 3 + 2] = 1.5

      const angle = Math.random() * Math.PI * 2
      const spd = 0.08 + Math.random() * 0.12
      cheersSparkVel.push({
        x: Math.cos(angle) * spd,
        y: (Math.random() - 0.3) * spd * 1.4,
        z: Math.sin(angle) * spd,
      })
    }
    cheersSparkGeo.setAttribute('position', new THREE.BufferAttribute(cheersSparkPos, 3))

    const cheersSparkMat = new THREE.PointsMaterial({
      size: 1.4,
      map: sparkleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0,
    })
    const cheersSparks = new THREE.Points(cheersSparkGeo, cheersSparkMat)
    masterGroup.add(cheersSparks)

    // ── 6. Realistic Volumetric Coffee Steam Particles (For Both Cups) ──
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
    const STEAM_COUNT = 70 // Per cup

    interface DualSteamParticle {
      mesh: THREE.Sprite
      cupId: 1 | 2
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

    const dualSteamParticles: DualSteamParticle[] = []
    const steamGroup = new THREE.Group()
    masterGroup.add(steamGroup)

    for (let i = 0; i < STEAM_COUNT * 2; i++) {
      const cupId: 1 | 2 = i < STEAM_COUNT ? 1 : 2
      const mat = new THREE.SpriteMaterial({
        map: smokeTexture,
        transparent: true,
        opacity: 0,
        blending: THREE.NormalBlending,
        depthWrite: false,
      })
      const sprite = new THREE.Sprite(mat)

      const initialAge = ((i % STEAM_COUNT) / STEAM_COUNT) * 6.0
      const p: DualSteamParticle = {
        mesh: sprite,
        cupId,
        x: 0,
        y: 1.0 + initialAge * 2.2,
        z: 1.5,
        vy: 0.04 + Math.random() * 0.022,
        scale: 0.8 + initialAge * 0.5,
        growthRate: 0.015 + Math.random() * 0.01,
        maxLife: 5.5 + Math.random() * 1.5,
        age: initialAge,
        curlPhase: Math.random() * Math.PI * 2,
        curlSpeed: 0.75 + Math.random() * 0.5,
        baseOpacity: 0.32 + Math.random() * 0.12,
      }
      sprite.scale.set(p.scale, p.scale, 1)
      steamGroup.add(sprite)
      dualSteamParticles.push(p)
    }

    // ── 7. Interactive Mouse Parallax Tracking ──
    let targetRotY = 0
    let targetRotX = 0
    let currentRotY = 0
    let currentRotX = 0

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      targetRotY = nx * 0.28
      targetRotX = ny * 0.14
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

    // ── 9. Animation Loop: Rhythmic "Cheers" Clink Cycle ──
    let animationFrameId: number
    const clock = new THREE.Clock()

    // Shockwave trigger state
    let lastClinkCycle = -1

    const animate = () => {
      const t = clock.getElapsedTime()

      // Smooth mouse parallax damping
      currentRotY += (targetRotY - currentRotY) * 0.05
      currentRotX += (targetRotX - currentRotX) * 0.05

      masterGroup.rotation.y = currentRotY + Math.sin(t * 0.25) * 0.04
      masterGroup.rotation.x = currentRotX + Math.cos(t * 0.2) * 0.02

      // Background Sparkles Everywhere: Twinkle & 3D ambient drift
      everywhereSparkles.rotation.y = t * 0.025
      everywhereSparkles.rotation.x = Math.sin(t * 0.18) * 0.02
      sparkleMat.opacity = 0.65 + Math.sin(t * 1.8) * 0.2

      // ── CHEERS CLINK CHOREOGRAPHY (Cycle: ~4.2 seconds) ──
      const CHEERS_CYCLE = 4.2
      const cycleTime = t % CHEERS_CYCLE
      const cycleIndex = Math.floor(t / CHEERS_CYCLE)

      // Clink occurs at t = 2.4s of the cycle
      // Phase 0 to 1.8s: Natural hover and conversing apart
      // Phase 1.8 to 2.4s: Approach inward & tilt to touch
      // Phase 2.4s: Impact clink! (Trigger shockwave)
      // Phase 2.4 to 3.2s: Gentle spring recoil bounce
      // Phase 3.2 to 4.2s: Return to resting hover

      let clinkProgress = 0 // 0 = fully apart, 1 = touching in cheers
      let recoil = 0

      if (cycleTime < 1.8) {
        // Floating conversation apart
        clinkProgress = Math.sin((cycleTime / 1.8) * Math.PI * 0.5) * 0.08
      } else if (cycleTime < 2.4) {
        // Approach inward to toast
        const p = (cycleTime - 1.8) / 0.6
        // Smooth ease-in-out to impact
        clinkProgress = 0.08 + (p * p * (3 - 2 * p)) * 0.92
      } else if (cycleTime < 3.2) {
        // Spring recoil after clink
        const p = (cycleTime - 2.4) / 0.8
        clinkProgress = 1 - Math.sin(p * Math.PI) * 0.35 - p * 0.65
        recoil = Math.sin(p * Math.PI * 3) * (1 - p) * 0.12
      } else {
        // Return to resting position
        const p = (cycleTime - 3.2) / 1.0
        clinkProgress = (1 - p) * 0.1
      }

      // Trigger Shockwave & Sparks at contact (cycleTime ~ 2.4s)
      if (cycleIndex !== lastClinkCycle && cycleTime >= 2.4) {
        lastClinkCycle = cycleIndex
        // Reset spark positions
        const spArr = cheersSparkGeo.attributes.position.array as Float32Array
        for (let i = 0; i < CHEERS_SPARK_COUNT; i++) {
          spArr[i * 3 + 0] = 0
          spArr[i * 3 + 1] = 0.8
          spArr[i * 3 + 2] = 1.5
        }
        cheersSparkGeo.attributes.position.needsUpdate = true
      }

      // Clink contact shockwave animation
      const timeSinceClink = cycleTime >= 2.4 ? cycleTime - 2.4 : cycleTime + CHEERS_CYCLE - 2.4
      if (timeSinceClink < 0.9) {
        const p = timeSinceClink / 0.9
        const waveScale = 1 + p * 8.0
        shockwaveMesh.scale.set(waveScale, waveScale, 1)
        shockwaveMat.opacity = (1 - p) * 0.85
        cheersPointLight.intensity = 3.5 + (1 - p) * 6.0

        // Animate contact sparks
        const spArr = cheersSparkGeo.attributes.position.array as Float32Array
        for (let i = 0; i < CHEERS_SPARK_COUNT; i++) {
          const vel = cheersSparkVel[i]
          spArr[i * 3 + 0] += vel.x * (1 - p * 0.4)
          spArr[i * 3 + 1] += vel.y * (1 - p * 0.4)
          spArr[i * 3 + 2] += vel.z * (1 - p * 0.4)
        }
        cheersSparkGeo.attributes.position.needsUpdate = true
        cheersSparkMat.opacity = (1 - p) * 0.95
      } else {
        shockwaveMat.opacity = 0
        cheersSparkMat.opacity = 0
        cheersPointLight.intensity = 3.5
      }

      // Position Cup 1 (Left) and Cup 2 (Right) - Larger Heroic Proportions
      // Base resting distance: x = -4.2 and x = +4.2
      // Clink distance: x = -2.0 and x = +2.0
      const cup1X = -4.2 + clinkProgress * 2.2 - recoil
      const cup2X = 4.2 - clinkProgress * 2.2 + recoil

      // Inward tilt during cheers
      const tiltZ1 = -0.06 + clinkProgress * 0.22 + recoil * 0.35
      const tiltZ2 = 0.06 - clinkProgress * 0.22 - recoil * 0.35

      // Gentle floating bobbing
      const bob1 = Math.sin(t * 1.5) * 0.12
      const bob2 = Math.cos(t * 1.4) * 0.12

      cup1.group.position.set(cup1X, -2.6 + bob1, 0)
      cup1.group.rotation.set(0.14, 0.16 + clinkProgress * 0.1, tiltZ1)

      cup2.group.position.set(cup2X, -2.6 + bob2, 0)
      cup2.group.rotation.set(0.14, -0.16 - clinkProgress * 0.1, tiltZ2)

      // Conversational Voice Signals (Alternate speaking bursts)
      const speech1 = Math.max(0, Math.sin(t * 2.5) * 0.8 + Math.sin(t * 4.8) * 0.35)
      const speech2 = Math.max(0, Math.sin(t * 2.2 + 2.4) * 0.75 + Math.cos(t * 4.2) * 0.35)

      // Animate Cup 1 Voice Bars
      cup1.voiceBars.forEach((bar) => {
        const wave =
          Math.sin(bar.idx * 0.75 + t * 6.0) * 0.4 +
          Math.sin(bar.idx * 1.4 - t * 8.5) * 0.3 +
          Math.cos(t * 3.2 + bar.idx * 0.5) * 0.3
        const height = Math.min(1.4, 0.12 + Math.abs(wave) * bar.centerFactor * (0.4 + speech1 * 1.4))
        bar.mesh.scale.set(1, height, 1)
      })

      // Animate Cup 2 Voice Bars
      cup2.voiceBars.forEach((bar) => {
        const wave =
          Math.sin(bar.idx * 0.75 + t * 5.6 + 1.2) * 0.4 +
          Math.sin(bar.idx * 1.4 - t * 7.8) * 0.3 +
          Math.cos(t * 3.0 + bar.idx * 0.5) * 0.3
        const height = Math.min(1.4, 0.12 + Math.abs(wave) * bar.centerFactor * (0.4 + speech2 * 1.4))
        bar.mesh.scale.set(1, height, 1)
      })

      // Animate Dual Steam Particles
      dualSteamParticles.forEach((p) => {
        p.age += 0.02
        p.y += p.vy
        p.scale += p.growthRate

        const parentCup = p.cupId === 1 ? cup1.group : cup2.group
        const curlX = Math.sin(t * p.curlSpeed + p.y * 0.8 + p.curlPhase) * 0.024
        const curlZ = Math.cos(t * p.curlSpeed + p.y * 0.9 + p.curlPhase) * 0.022
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

        // Track rising above the parent cup's current X position
        p.mesh.position.set(parentCup.position.x + p.x, parentCup.position.y + p.y + 2.8, p.z)
        p.mesh.scale.set(p.scale, p.scale, 1)

        if (p.age >= p.maxLife || p.y > 13) {
          p.age = 0
          p.y = 1.0 + Math.random() * 0.3
          p.x = (Math.random() - 0.5) * 0.3
          p.z = 1.4 + (Math.random() - 0.5) * 0.3
          p.scale = 0.75 + Math.random() * 0.3
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
      voiceBarGeo.dispose()
      shockwaveGeo.dispose()
      cheersSparkGeo.dispose()

      cupMat.dispose()
      sleeveMat.dispose()
      sleeveTrimMat.dispose()
      lidMat.dispose()
      coffeeLiquidMat.dispose()
      sparkleMat.dispose()
      voiceBarMat.dispose()
      baseCurveMat.dispose()
      shockwaveMat.dispose()
      cheersSparkMat.dispose()

      dualSteamParticles.forEach((p) => {
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

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function SweepingRibbons3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()

    let width = container.clientWidth || 400
    let height = container.clientHeight || 360

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000)
    camera.position.set(0, 0, 54)

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

    // 2. High-Luxury Gold & Amber Lighting
    const ambientLight = new THREE.AmbientLight(0xffedd5, 1.8)
    scene.add(ambientLight)

    // Warm Gold Key Light
    const keyLight = new THREE.DirectionalLight(0xf59e0b, 5.5)
    keyLight.position.set(30, 25, 40)
    scene.add(keyLight)

    // Champagne Rim Light from behind
    const rimLight = new THREE.DirectionalLight(0xfffbeb, 6.0)
    rimLight.position.set(-35, 20, -25)
    scene.add(rimLight)

    // Center Core Point Light
    const coreLight = new THREE.PointLight(0xfbbf24, 3.5, 45)
    coreLight.position.set(0, 0, 0)
    scene.add(coreLight)

    // 3. Materials
    const goldMetalMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      emissive: 0x85540b,
      emissiveIntensity: 0.35,
      roughness: 0.14,
      metalness: 0.96,
    })

    const champagneGoldMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0x926116,
      emissiveIntensity: 0.25,
      roughness: 0.18,
      metalness: 0.92,
    })

    const coreSphereMat = new THREE.MeshPhysicalMaterial({
      color: 0x090d16,
      emissive: 0x1a0f04,
      emissiveIntensity: 0.3,
      roughness: 0.18,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.95,
    })

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    })

    // Glowing Golden Satellite Bead Material
    const beadMat = new THREE.MeshStandardMaterial({
      color: 0xfffbeb,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.85,
      roughness: 0.1,
      metalness: 0.9,
    })

    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    })

    // 4. Main Instrument Assembly
    const mainGroup = new THREE.Group()
    scene.add(mainGroup)

    // A. Central Obsidian Core Sphere
    const coreGeo = new THREE.SphereGeometry(4.6, 36, 36)
    const coreMesh = new THREE.Mesh(coreGeo, coreSphereMat)
    mainGroup.add(coreMesh)

    // Wireframe Cage around Core
    const cageGeo = new THREE.SphereGeometry(4.85, 18, 18)
    const cageMesh = new THREE.Mesh(cageGeo, wireMat)
    mainGroup.add(cageMesh)

    // Helper: Create a satellite bead mesh with an elegant outer aura ring
    const beadGeo = new THREE.SphereGeometry(0.55, 20, 20)
    const haloGeo = new THREE.RingGeometry(0.7, 1.05, 24)

    function createSatelliteBead(): THREE.Group {
      const g = new THREE.Group()
      const sphere = new THREE.Mesh(beadGeo, beadMat)
      const halo = new THREE.Mesh(haloGeo, haloMat)
      g.add(sphere)
      g.add(halo)
      return g
    }

    // B. Concentric Gyroscope Rings (24K Gold)
    // -------------------------------------------------------------
    // RING 1: Inner Gimbal (Radius 8.2)
    const ring1Group = new THREE.Group()
    mainGroup.add(ring1Group)
    const ring1Geo = new THREE.TorusGeometry(8.2, 0.26, 16, 72)
    const ring1Mesh = new THREE.Mesh(ring1Geo, goldMetalMat)
    ring1Group.add(ring1Mesh)

    // Beads mounted directly on Ring 1 track
    const bead1 = createSatelliteBead()
    const bead2 = createSatelliteBead()
    ring1Group.add(bead1)
    ring1Group.add(bead2)

    // -------------------------------------------------------------
    // RING 2: Middle Gimbal (Radius 11.4 - tilted)
    const ring2Group = new THREE.Group()
    mainGroup.add(ring2Group)
    ring2Group.rotation.x = Math.PI / 3.2
    const ring2Geo = new THREE.TorusGeometry(11.4, 0.3, 16, 80)
    const ring2Mesh = new THREE.Mesh(ring2Geo, champagneGoldMat)
    ring2Group.add(ring2Mesh)

    // Beads mounted directly on Ring 2 track
    const bead3 = createSatelliteBead()
    const bead4 = createSatelliteBead()
    ring2Group.add(bead3)
    ring2Group.add(bead4)

    // -------------------------------------------------------------
    // RING 3: Outer Horizon Ring (Radius 14.6 - tilted)
    const ring3Group = new THREE.Group()
    mainGroup.add(ring3Group)
    ring3Group.rotation.y = Math.PI / 4
    const ring3Geo = new THREE.TorusGeometry(14.6, 0.34, 16, 96)
    const ring3Mesh = new THREE.Mesh(ring3Geo, goldMetalMat)
    ring3Group.add(ring3Mesh)

    // Beads mounted directly on Ring 3 track
    const bead5 = createSatelliteBead()
    const bead6 = createSatelliteBead()
    ring3Group.add(bead5)
    ring3Group.add(bead6)

    // C. Soft Round Golden Stardust Particles
    function createCircleTexture() {
      const c = document.createElement('canvas')
      c.width = 32
      c.height = 32
      const ctx = c.getContext('2d')!
      const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
      g.addColorStop(0, 'rgba(255, 255, 255, 1)')
      g.addColorStop(0.3, 'rgba(254, 240, 138, 0.8)')
      g.addColorStop(1, 'rgba(254, 240, 138, 0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 32, 32)
      return new THREE.CanvasTexture(c)
    }

    const circleTexture = createCircleTexture()
    const starCount = 45
    const starGeo = new THREE.BufferGeometry()
    const starPos = new Float32Array(starCount * 3)

    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 36
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 36
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))

    const starMat = new THREE.PointsMaterial({
      color: 0xfef08a,
      size: 0.85,
      map: circleTexture,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const starPoints = new THREE.Points(starGeo, starMat)
    mainGroup.add(starPoints)

    // 5. Mouse Parallax Tracking
    let targetRotX = 0.2
    let targetRotY = 0.35
    let currentRotX = 0.2
    let currentRotY = 0.35

    function handleMouseMove(e: MouseEvent) {
      const rect = container?.getBoundingClientRect()
      if (!rect) return
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const nx = (e.clientX - cx) / (window.innerWidth / 2)
      const ny = (e.clientY - cy) / (window.innerHeight / 2)
      targetRotY = 0.35 + nx * 0.7
      targetRotX = 0.2 + ny * 0.5
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // 6. Resize Observer
    function handleResize() {
      if (!container) return
      width = container.clientWidth || 400
      height = container.clientHeight || 360
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    // 7. Animation Loop: Silky Smooth Orbiting Along Fixed Ring Tracks
    let animationFrameId: number
    const clock = new THREE.Clock()

    function animate() {
      const t = clock.getElapsedTime()

      // Smooth mouse lerp
      currentRotX += (targetRotX - currentRotX) * 0.05
      currentRotY += (targetRotY - currentRotY) * 0.05

      mainGroup.rotation.x = currentRotX + Math.sin(t * 0.3) * 0.06
      mainGroup.rotation.y = currentRotY + t * 0.12

      // Gimbal Differential Rotations (steady, smooth)
      ring1Group.rotation.z = t * 0.4
      ring2Group.rotation.y = -t * 0.3
      ring3Group.rotation.z = t * 0.22

      // Core wireframe slow pulse
      cageMesh.rotation.y = -t * 0.15
      const coreScale = 1 + Math.sin(t * 1.6) * 0.02
      coreMesh.scale.set(coreScale, coreScale, coreScale)

      // ── BEAD GLIDE ANIMATION ─────────────────────────────────────────
      // Every bead stays strictly on its own ring circumference (radius 8.2, 11.4, 14.6)
      // They NEVER enter the center core (radius 4.6), moving silky smooth and neat.

      // Ring 1 Beads (Radius 8.2) — moving smoothly clockwise
      const angle1 = t * 0.85
      bead1.position.set(Math.cos(angle1) * 8.2, Math.sin(angle1) * 8.2, 0)
      bead2.position.set(Math.cos(angle1 + Math.PI) * 8.2, Math.sin(angle1 + Math.PI) * 8.2, 0)

      // Ring 2 Beads (Radius 11.4) — moving smoothly counter-clockwise
      const angle2 = -t * 0.65
      bead3.position.set(Math.cos(angle2) * 11.4, Math.sin(angle2) * 11.4, 0)
      bead4.position.set(Math.cos(angle2 + Math.PI) * 11.4, Math.sin(angle2 + Math.PI) * 11.4, 0)

      // Ring 3 Beads (Radius 14.6) — moving smoothly clockwise at majestic outer speed
      const angle3 = t * 0.5 + 1.2
      bead5.position.set(Math.cos(angle3) * 14.6, Math.sin(angle3) * 14.6, 0)
      bead6.position.set(Math.cos(angle3 + Math.PI) * 14.6, Math.sin(angle3 + Math.PI) * 14.6, 0)

      // Stardust slow ambient drift
      starPoints.rotation.y = t * 0.02

      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      resizeObserver.disconnect()

      renderer.dispose()
      coreGeo.dispose()
      cageGeo.dispose()
      ring1Geo.dispose()
      ring2Geo.dispose()
      ring3Geo.dispose()
      beadGeo.dispose()
      haloGeo.dispose()
      starGeo.dispose()
      circleTexture.dispose()

      goldMetalMat.dispose()
      champagneGoldMat.dispose()
      coreSphereMat.dispose()
      wireMat.dispose()
      beadMat.dispose()
      haloMat.dispose()
      starMat.dispose()
    }
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full relative flex items-center justify-center pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  )
}

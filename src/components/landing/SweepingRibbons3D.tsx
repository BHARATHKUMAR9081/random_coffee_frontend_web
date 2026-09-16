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
    renderer.toneMappingExposure = 1.4

    // 2. High-Luxury Gold & Amber Lighting
    const ambientLight = new THREE.AmbientLight(0x1a2130, 1.8)
    scene.add(ambientLight)

    // Key Directional Light: Warm champagne metallic sheen
    const keyLight = new THREE.DirectionalLight(0xfffaed, 4.8)
    keyLight.position.set(30, 30, 35)
    scene.add(keyLight)

    // Back Rim Light: Golden edge illumination
    const rimLight = new THREE.DirectionalLight(0xf59e0b, 3.8)
    rimLight.position.set(-25, -10, -20)
    scene.add(rimLight)

    // Soft Warm Front Fill Light
    const fillLight = new THREE.DirectionalLight(0xfff7ed, 2.2)
    fillLight.position.set(-20, 15, 30)
    scene.add(fillLight)

    // Golden Halo Point Light directly behind the cup
    const coreLight = new THREE.PointLight(0xf59e0b, 5.0, 35)
    coreLight.position.set(0, 0, -2.5)
    scene.add(coreLight)

    // 3. Materials
    const goldMetalMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.96,
      roughness: 0.14,
      emissive: 0x3d2706,
      emissiveIntensity: 0.25,
    })

    const champagneGoldMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      metalness: 0.94,
      roughness: 0.16,
      emissive: 0x52360a,
      emissiveIntensity: 0.2,
    })

    const cupMat = new THREE.MeshStandardMaterial({
      color: 0xfcfbfa,
      roughness: 0.38,
      metalness: 0.02,
    })

    const lidMat = new THREE.MeshStandardMaterial({
      color: 0xf6f4ee,
      roughness: 0.26,
      metalness: 0.06,
    })

    const beadMat = new THREE.MeshStandardMaterial({
      color: 0xfffbeb,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.85,
      roughness: 0.1,
      metalness: 0.9,
    })

    const collarMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.85,
      roughness: 0.18,
    })

    // 4. Main Instrument Assembly
    const mainGroup = new THREE.Group()
    scene.add(mainGroup)

    // ── A. Floating 3D Coffee Cup with Lid ──
    const cupGroup = new THREE.Group()
    mainGroup.add(cupGroup)

    // Cup Body (Tapered Cylinder)
    const cupBodyGeo = new THREE.CylinderGeometry(2.55, 1.85, 6.6, 64)
    const cupBodyMesh = new THREE.Mesh(cupBodyGeo, cupMat)
    cupGroup.add(cupBodyMesh)

    // Cup Base Lip
    const cupBaseGeo = new THREE.CylinderGeometry(1.9, 1.82, 0.3, 64)
    const cupBaseMesh = new THREE.Mesh(cupBaseGeo, cupMat)
    cupBaseMesh.position.y = -3.35
    cupGroup.add(cupBaseMesh)

    // Cup Top Rim Lip
    const cupRimGeo = new THREE.TorusGeometry(2.58, 0.09, 16, 64)
    const cupRimMesh = new THREE.Mesh(cupRimGeo, cupMat)
    cupRimMesh.rotation.x = Math.PI / 2
    cupRimMesh.position.y = 3.3
    cupGroup.add(cupRimMesh)

    // Lid Base Collar (fits over the rim)
    const lidBaseGeo = new THREE.CylinderGeometry(2.72, 2.74, 0.45, 64)
    const lidBaseMesh = new THREE.Mesh(lidBaseGeo, lidMat)
    lidBaseMesh.position.y = 3.52
    cupGroup.add(lidBaseMesh)

    // Lid Middle Shelf
    const lidShelfGeo = new THREE.CylinderGeometry(2.6, 2.68, 0.35, 64)
    const lidShelfMesh = new THREE.Mesh(lidShelfGeo, lidMat)
    lidShelfMesh.position.y = 3.88
    cupGroup.add(lidShelfMesh)

    // Lid Raised Top Cap / Plateau
    const lidCapGeo = new THREE.CylinderGeometry(2.38, 2.52, 0.35, 64)
    const lidCapMesh = new THREE.Mesh(lidCapGeo, lidMat)
    lidCapMesh.position.y = 4.18
    cupGroup.add(lidCapMesh)

    // Lid Sipping Spout / Tab detail
    const spoutGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.12, 24)
    const spoutMesh = new THREE.Mesh(spoutGeo, lidMat)
    spoutMesh.position.set(0, 4.38, 1.82)
    cupGroup.add(spoutMesh)

    // Initial natural cup tilt matching reference
    cupGroup.rotation.set(0.16, 0.22, -0.08)

    // ── B. Satellite Bead Factory (with Collar Rings matching reference) ──
    const beadGeo = new THREE.SphereGeometry(0.5, 20, 20)
    const collarGeo = new THREE.TorusGeometry(0.72, 0.06, 12, 28)

    interface SatelliteNode {
      group: THREE.Group
      collar: THREE.Mesh
    }

    function createSatelliteNode(): SatelliteNode {
      const g = new THREE.Group()
      const sphere = new THREE.Mesh(beadGeo, beadMat)
      const collar = new THREE.Mesh(collarGeo, collarMat)
      g.add(sphere)
      g.add(collar)
      return { group: g, collar }
    }

    // ── C. Three Armillary Golden Orbital Rings ──
    // Ring 1: Inner Gimbal (Radius 8.2)
    const ring1Group = new THREE.Group()
    ring1Group.rotation.set(0.35, 0.45, 0.2)
    mainGroup.add(ring1Group)
    const ring1Geo = new THREE.TorusGeometry(8.2, 0.22, 24, 96)
    const ring1Mesh = new THREE.Mesh(ring1Geo, goldMetalMat)
    ring1Group.add(ring1Mesh)

    const node1 = createSatelliteNode()
    const node2 = createSatelliteNode()
    ring1Group.add(node1.group)
    ring1Group.add(node2.group)

    // Ring 2: Middle Gimbal (Radius 11.2 - tilted)
    const ring2Group = new THREE.Group()
    ring2Group.rotation.set(1.15, -0.35, 0.75)
    mainGroup.add(ring2Group)
    const ring2Geo = new THREE.TorusGeometry(11.2, 0.25, 24, 96)
    const ring2Mesh = new THREE.Mesh(ring2Geo, champagneGoldMat)
    ring2Group.add(ring2Mesh)

    const node3 = createSatelliteNode()
    const node4 = createSatelliteNode()
    ring2Group.add(node3.group)
    ring2Group.add(node4.group)

    // Ring 3: Outer Horizon Ring (Radius 14.4 - tilted)
    const ring3Group = new THREE.Group()
    ring3Group.rotation.set(-0.65, 1.25, -0.35)
    mainGroup.add(ring3Group)
    const ring3Geo = new THREE.TorusGeometry(14.4, 0.28, 24, 96)
    const ring3Mesh = new THREE.Mesh(ring3Geo, goldMetalMat)
    ring3Group.add(ring3Mesh)

    const node5 = createSatelliteNode()
    const node6 = createSatelliteNode()
    ring3Group.add(node5.group)
    ring3Group.add(node6.group)

    // ── D. Golden Stardust Dust Cloud ──
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
    const starCount = 65
    const starGeo = new THREE.BufferGeometry()
    const starPos = new Float32Array(starCount * 3)

    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 38
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 38
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 22
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))

    const starMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.85,
      map: circleTexture,
      transparent: true,
      opacity: 0.6,
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
      targetRotY = 0.35 + nx * 0.75
      targetRotX = 0.2 + ny * 0.55
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

    // 7. Animation Loop
    let animationFrameId: number
    const clock = new THREE.Clock()

    function animate() {
      const t = clock.getElapsedTime()

      // Smooth mouse lerp
      currentRotX += (targetRotX - currentRotX) * 0.05
      currentRotY += (targetRotY - currentRotY) * 0.05

      mainGroup.rotation.x = currentRotX + Math.sin(t * 0.3) * 0.05
      mainGroup.rotation.y = currentRotY + t * 0.1

      // Cup hovering & slow majestic rotation
      cupGroup.position.y = Math.sin(t * 1.4) * 0.22
      cupGroup.rotation.y = t * 0.12
      cupGroup.rotation.z = -0.08 + Math.sin(t * 0.8) * 0.025

      // Ring Rotations
      ring1Group.rotation.z = t * 0.35
      ring2Group.rotation.y = -t * 0.25
      ring3Group.rotation.z = t * 0.2

      // ── BEAD GLIDE ANIMATION WITH TANGENTIAL COLLAR ROTATIONS ──
      // Ring 1 Beads (Radius 8.2)
      const angle1 = t * 0.8
      node1.group.position.set(Math.cos(angle1) * 8.2, Math.sin(angle1) * 8.2, 0)
      node1.collar.rotation.z = angle1 + Math.PI / 2
      node2.group.position.set(Math.cos(angle1 + Math.PI) * 8.2, Math.sin(angle1 + Math.PI) * 8.2, 0)
      node2.collar.rotation.z = angle1 + Math.PI + Math.PI / 2

      // Ring 2 Beads (Radius 11.2)
      const angle2 = -t * 0.6
      node3.group.position.set(Math.cos(angle2) * 11.2, Math.sin(angle2) * 11.2, 0)
      node3.collar.rotation.z = angle2 + Math.PI / 2
      node4.group.position.set(Math.cos(angle2 + Math.PI) * 11.2, Math.sin(angle2 + Math.PI) * 11.2, 0)
      node4.collar.rotation.z = angle2 + Math.PI + Math.PI / 2

      // Ring 3 Beads (Radius 14.4)
      const angle3 = t * 0.45 + 1.2
      node5.group.position.set(Math.cos(angle3) * 14.4, Math.sin(angle3) * 14.4, 0)
      node5.collar.rotation.z = angle3 + Math.PI / 2
      node6.group.position.set(Math.cos(angle3 + Math.PI) * 14.4, Math.sin(angle3 + Math.PI) * 14.4, 0)
      node6.collar.rotation.z = angle3 + Math.PI + Math.PI / 2

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
      cupBodyGeo.dispose()
      cupBaseGeo.dispose()
      cupRimGeo.dispose()
      lidBaseGeo.dispose()
      lidShelfGeo.dispose()
      lidCapGeo.dispose()
      spoutGeo.dispose()
      ring1Geo.dispose()
      ring2Geo.dispose()
      ring3Geo.dispose()
      beadGeo.dispose()
      collarGeo.dispose()
      starGeo.dispose()
      circleTexture.dispose()

      goldMetalMat.dispose()
      champagneGoldMat.dispose()
      cupMat.dispose()
      lidMat.dispose()
      beadMat.dispose()
      collarMat.dispose()
      starMat.dispose()
    }
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full relative flex items-center justify-center pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  )
}

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function CerebriumGlobe({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const width = container.clientWidth
    const height = container.clientHeight
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 240

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Group for entire globe system
    const globeGroup = new THREE.Group()
    scene.add(globeGroup)

    // 1. Particle Sphere (Cerebrium globe points)
    const particleCount = 1800
    const particleGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    const colorGold = new THREE.Color('#D4AF37')
    const colorAmber = new THREE.Color('#F59E0B')
    const colorChampagne = new THREE.Color('#FDE68A')
    const radius = 68

    for (let i = 0; i < particleCount; i++) {
      // Fibonacci sphere distribution for even point layout
      const phi = Math.acos(-1 + (2 * i) / particleCount)
      const theta = Math.sqrt(particleCount * Math.PI) * phi

      const x = radius * Math.cos(theta) * Math.sin(phi)
      const y = radius * Math.sin(theta) * Math.sin(phi)
      const z = radius * Math.cos(phi)

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      // Subtle gold gradient variation
      const mixRatio = Math.random()
      const pColor = mixRatio > 0.6 ? colorGold : mixRatio > 0.3 ? colorAmber : colorChampagne
      colors[i * 3] = pColor.r
      colors[i * 3 + 1] = pColor.g
      colors[i * 3 + 2] = pColor.b

      sizes[i] = Math.random() * 2.2 + 0.8
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const particleMat = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    })

    const pointCloud = new THREE.Points(particleGeo, particleMat)
    globeGroup.add(pointCloud)

    // 2. Wireframe / Latitude rings
    const ringMat = new THREE.LineBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
    })

    for (let r = -50; r <= 50; r += 20) {
      const ringRadius = Math.sqrt(Math.max(0, radius * radius - r * r))
      const ringGeo = new THREE.BufferGeometry()
      const ringPts: number[] = []
      const segments = 64
      for (let j = 0; j <= segments; j++) {
        const angle = (j / segments) * Math.PI * 2
        ringPts.push(Math.cos(angle) * ringRadius, r, Math.sin(angle) * ringRadius)
      }
      ringGeo.setAttribute('position', new THREE.Float32BufferAttribute(ringPts, 3))
      const ring = new THREE.Line(ringGeo, ringMat)
      globeGroup.add(ring)
    }

    // 3. Equatorial Forcefield Band (Cerebrium signature)
    const forcefieldGroup = new THREE.Group()
    globeGroup.add(forcefieldGroup)

    const forcefieldRingGeo = new THREE.TorusGeometry(radius + 10, 1.4, 16, 100)
    const forcefieldMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      wireframe: true,
    })
    const forcefieldRing = new THREE.Mesh(forcefieldRingGeo, forcefieldMat)
    forcefieldRing.rotation.x = Math.PI / 2.3
    forcefieldGroup.add(forcefieldRing)

    // Outer faint pulse ring
    const outerRingGeo = new THREE.RingGeometry(radius + 16, radius + 17.5, 64)
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    })
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat)
    outerRing.rotation.x = Math.PI / 2.3
    forcefieldGroup.add(outerRing)

    // 4. Floating Connection Nodes (representing active 1:1 business calls)
    const nodeCount = 14
    const nodeGeo = new THREE.SphereGeometry(1.6, 12, 12)
    const nodeMat = new THREE.MeshBasicMaterial({
      color: 0xfff2a3,
      blending: THREE.AdditiveBlending,
    })
    const nodes: THREE.Mesh[] = []

    for (let n = 0; n < nodeCount; n++) {
      const node = new THREE.Mesh(nodeGeo, nodeMat)
      const phi = Math.random() * Math.PI
      const theta = Math.random() * Math.PI * 2
      const r = radius + 1.5
      node.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi))
      globeGroup.add(node)
      nodes.push(node)
    }

    // 5. Connecting lines between nodes
    const linesMat = new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    })
    const lineGeo = new THREE.BufferGeometry()
    const linePts: number[] = []
    for (let k = 0; k < nodes.length - 1; k += 2) {
      linePts.push(nodes[k].position.x, nodes[k].position.y, nodes[k].position.z)
      linePts.push(nodes[k + 1].position.x, nodes[k + 1].position.y, nodes[k + 1].position.z)
    }
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePts, 3))
    const connectionLines = new THREE.LineSegments(lineGeo, linesMat)
    globeGroup.add(connectionLines)

    // Mouse Interaction
    let targetRotX = 0.2
    let targetRotY = 0
    let mouseX = 0
    let mouseY = 0

    function handleMouseMove(e: MouseEvent) {
      const rect = container?.getBoundingClientRect()
      if (!rect) return
      mouseX = (e.clientX - rect.left) / rect.width - 0.5
      mouseY = (e.clientY - rect.top) / rect.height - 0.5
      targetRotY = mouseX * 1.6
      targetRotX = mouseY * 0.8 + 0.15
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Resize handling
    function handleResize() {
      if (!container) return
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener('resize', handleResize)

    // Animation Loop
    let animId: number
    let clock = new THREE.Clock()

    function animate() {
      animId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      // Continuous auto-rotation + mouse damping (GSAP-like smooth interpolation)
      globeGroup.rotation.y += 0.003 + (targetRotY - globeGroup.rotation.y) * 0.04
      globeGroup.rotation.x += (targetRotX - globeGroup.rotation.x) * 0.04

      // Gentle forcefield pulsation
      forcefieldRing.rotation.z = elapsedTime * 0.4
      outerRing.rotation.z = -elapsedTime * 0.2
      const pulseScale = 1 + Math.sin(elapsedTime * 2) * 0.035
      forcefieldGroup.scale.set(pulseScale, pulseScale, pulseScale)

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      particleGeo.dispose()
      particleMat.dispose()
      ringMat.dispose()
      forcefieldRingGeo.dispose()
      forcefieldMat.dispose()
      outerRingGeo.dispose()
      outerRingMat.dispose()
      nodeGeo.dispose()
      nodeMat.dispose()
      lineGeo.dispose()
      linesMat.dispose()
    }
  }, [])

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block pointer-events-none" />
    </div>
  )
}

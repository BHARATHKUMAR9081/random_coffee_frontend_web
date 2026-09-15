import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface ShowcaseThreeCanvasProps {
  activeStep: number
}

export function ShowcaseThreeCanvas({ activeStep }: ShowcaseThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const activeStepRef = useRef(activeStep)

  useEffect(() => {
    activeStepRef.current = activeStep
  }, [activeStep])

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    let width = container.clientWidth || window.innerWidth
    let height = container.clientHeight || 800

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 0, 90)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // 2. 3D Particle Morphing System (350 Points)
    const count = 360
    const currentPositions = new Float32Array(count * 3)

    // Precompute 4 Target Geometries for the 4 Sections
    const targetPositions: Float32Array[] = [
      new Float32Array(count * 3), // State 0: Speed streams (racing velocity vectors)
      new Float32Array(count * 3), // State 1: Global mesh sphere (interconnected nodes)
      new Float32Array(count * 3), // State 2: Cryptographic trust lattice (shield / matrix)
      new Float32Array(count * 3), // State 3: Dual audio/video waveform streams
    ]

    // Generate State 0: High-Speed Velocity Stream (Z-axis elongated tunnel)
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const rad = 6 + Math.random() * 26
      targetPositions[0][i * 3] = Math.cos(angle) * rad + 18
      targetPositions[0][i * 3 + 1] = Math.sin(angle) * rad
      targetPositions[0][i * 3 + 2] = (Math.random() - 0.5) * 120
    }

    // Generate State 1: Global Mesh Sphere
    const sphereRadius = 28
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count)
      const theta = Math.sqrt(count * Math.PI) * phi
      targetPositions[1][i * 3] = sphereRadius * Math.cos(theta) * Math.sin(phi) + 18
      targetPositions[1][i * 3 + 1] = sphereRadius * Math.sin(theta) * Math.sin(phi)
      targetPositions[1][i * 3 + 2] = sphereRadius * Math.cos(phi)
    }

    // Generate State 2: Cryptographic Hexagonal Shield Matrix
    for (let i = 0; i < count; i++) {
      const ring = (i % 6) + 1
      const segment = Math.floor(i / 6)
      const theta = (segment / (count / 6)) * Math.PI * 2
      const r = ring * 5.5
      targetPositions[2][i * 3] = Math.cos(theta) * r + 18
      targetPositions[2][i * 3 + 1] = Math.sin(theta) * r
      targetPositions[2][i * 3 + 2] = (ring % 2 === 0 ? 4 : -4) + (Math.random() - 0.5) * 4
    }

    // Generate State 3: Dual Oscillating Audio Waveforms
    for (let i = 0; i < count; i++) {
      const t = (i / count) * 2 - 1 // -1 to 1
      const isTop = i % 2 === 0
      targetPositions[3][i * 3] = t * 50 + 18
      targetPositions[3][i * 3 + 1] = Math.sin(t * Math.PI * 3) * 12 + (isTop ? 6 : -6)
      targetPositions[3][i * 3 + 2] = Math.cos(t * Math.PI * 2) * 8
    }

    // Initialize current positions to State 0
    for (let i = 0; i < count * 3; i++) {
      currentPositions[i] = targetPositions[0][i]
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3))

    // Color gradient for particles
    const colors = new Float32Array(count * 3)
    const colorGold = new THREE.Color('#D4AF37')
    const colorAmber = new THREE.Color('#F59E0B')
    const colorWhite = new THREE.Color('#FFFBEB')

    for (let i = 0; i < count; i++) {
      const r = Math.random()
      const c = r > 0.6 ? colorGold : r > 0.25 ? colorAmber : colorWhite
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 1.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    })

    const particleSystem = new THREE.Points(geometry, material)
    scene.add(particleSystem)

    // 3. Ambient Lighting
    const light = new THREE.PointLight(0xf59e0b, 2.5, 200)
    light.position.set(20, 20, 40)
    scene.add(light)

    // 4. Mouse Parallax
    let targetMouseX = 0
    let targetMouseY = 0
    let mouseX = 0
    let mouseY = 0

    function handleMouseMove(e: MouseEvent) {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }

    window.addEventListener('mousemove', handleMouseMove)

    // 5. Resize
    function handleResize() {
      if (!container || !canvas) return
      width = container.clientWidth || window.innerWidth
      height = container.clientHeight || 800
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    window.addEventListener('resize', handleResize)

    // 6. Smooth Morphing Animation Loop
    let animId: number
    const clock = new THREE.Clock()

    function animate() {
      animId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()
      const activeIdx = Math.min(Math.max(activeStepRef.current, 0), 3)
      const target = targetPositions[activeIdx]

      const posAttr = geometry.attributes.position as THREE.BufferAttribute
      const posArray = posAttr.array as Float32Array

      // Smooth lerp towards active geometry target
      const lerpSpeed = 0.05
      for (let i = 0; i < count * 3; i++) {
        posArray[i] += (target[i] - posArray[i]) * lerpSpeed
      }
      posAttr.needsUpdate = true

      // Gentle global rotation and breathing
      mouseX += (targetMouseX - mouseX) * 0.05
      mouseY += (targetMouseY - mouseY) * 0.05

      particleSystem.rotation.y = elapsed * 0.08 + mouseX * 0.15
      particleSystem.rotation.x = Math.sin(elapsed * 0.15) * 0.05 - mouseY * 0.1
      particleSystem.rotation.z = Math.cos(elapsed * 0.1) * 0.03

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none z-0 opacity-45"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  )
}

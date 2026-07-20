import React, { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { OrbitControls, Environment, Float, Html, MeshReflectorMaterial, Sky, Stars } from '@react-three/drei'
import { RobotModel } from './RobotModel'
import { useStore } from '../store/useStore'
import * as THREE from 'three'
import { BlueprintCallout } from '../components/BlueprintCallout'

// Simulated water plane
function WaterPlane() {
  const nightMode = useStore((state) => state.nightMode)
  const explodedView = useStore((state) => state.explodedView)
  const waterNormals = useLoader(THREE.TextureLoader, '/waternormals.jpg')

  useMemo(() => {
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping
    waterNormals.repeat.set(15, 15)
  }, [waterNormals])

  useFrame((state, delta) => {
    waterNormals.offset.x -= delta * 0.015
    waterNormals.offset.y += delta * 0.015
  })

  return (
    <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[200, 200]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={1.5}
        roughness={0.7}
        color={nightMode ? "#050F1A" : "#0F2A2E"}
        metalness={0.8}
        mirror={0.6}
        normalMap={waterNormals}
        normalScale={[0.15, 0.15]}
        transparent
        opacity={explodedView ? 0.15 : 0.9}
      />
    </mesh>
  )
}

// Waste Object that drifts towards the robot (deterministic based on timelineProgress)
function WasteItem({ initialPosition, type }) {
  const ref = useRef()
  const { timelineProgress, setSimulationState, isScrubbing } = useStore()
  const startPos = useMemo(() => new THREE.Vector3(...initialPosition), [initialPosition])
  
  useFrame((state, delta) => {
    if (!ref.current) return
    
    if (timelineProgress < 30) {
      const driftZ = isScrubbing ? timelineProgress * 0.01 : Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      ref.current.position.set(startPos.x, startPos.y, startPos.z + driftZ)
      ref.current.scale.set(1, 1, 1)
      if (timelineProgress > 25 && timelineProgress < 30) {
        setSimulationState({ systemStatus: 'Scanning', wasteDetected: false })
      }
    } 
    else if (timelineProgress >= 30 && timelineProgress < 70) {
      const t = (timelineProgress - 30) / 40 // 0 to 1
      ref.current.position.lerpVectors(startPos, new THREE.Vector3(0, 0, 1), t)
      ref.current.scale.set(1, 1, 1)
      if (timelineProgress > 30 && timelineProgress < 35) {
        setSimulationState({ systemStatus: 'Moving', wasteDetected: true, detectedPosition: [ref.current.position.x, ref.current.position.y, ref.current.position.z] })
      }
    } 
    else if (timelineProgress >= 70) {
      ref.current.scale.set(0, 0, 0) // hide
      if (timelineProgress > 70 && timelineProgress < 75) {
        setSimulationState({ systemStatus: 'Collecting', wasteDetected: false })
      }
    }
  })
  
  const color = type === 'bottle' ? '#2DD4BF' : type === 'leaf' ? '#14b8a6' : '#F5A623'
  const isTarget = timelineProgress >= 30 && timelineProgress < 70
  
  return (
    <group ref={ref} position={initialPosition}>
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh castShadow receiveShadow>
          {type === 'bottle' ? <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} /> : <boxGeometry args={[0.1, 0.02, 0.1]} />}
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
        </mesh>
        
        {isTarget && (
           <Html position={[0, 0.3, 0]} center>
             <div className="bg-marine/80 text-secondary border border-secondary px-3 py-1.5 rounded-sm font-mono text-[10px] uppercase tracking-widest whitespace-nowrap backdrop-blur shadow-[0_0_15px_rgba(245,166,35,0.3)]">
               Target [0.98]
             </div>
           </Html>
        )}
      </Float>
    </group>
  )
}

function RobotRig() {
  const ref = useRef()
  const { timelineProgress } = useStore()

  useFrame((state, delta) => {
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.02
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.02
    
    if (timelineProgress >= 30 && timelineProgress < 70) {
      ref.current.rotation.x = -0.05
    } else {
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.01
    }
  })

  return (
    <group ref={ref}>
      <RobotModel />
      
      {/* 3D Blueprint Callouts attached to the Robot */}
      <Html position={[0.7, 0, 0]} center>
        <div className="pointer-events-none transform -translate-x-1/2 -translate-y-1/2 scale-75 opacity-70">
           <BlueprintCallout label="Width" value="41" unit="cm" />
        </div>
      </Html>
      <Html position={[0, 0.6, -0.6]} center>
        <div className="pointer-events-none transform -translate-x-1/2 -translate-y-1/2 scale-75 opacity-70">
           <BlueprintCallout label="Height" value="34" unit="cm" />
        </div>
      </Html>
      <Html position={[0, 0, 0.9]} center>
        <div className="pointer-events-none transform -translate-x-1/2 -translate-y-1/2 scale-75 opacity-70">
           <BlueprintCallout label="Length" value="88" unit="cm" />
        </div>
      </Html>
      <Html position={[0, 0.5, 0.8]} center>
        <div className="pointer-events-none transform -translate-x-1/2 -translate-y-1/2 scale-75 opacity-70">
           <BlueprintCallout label="Incline" value="35" unit="°" />
        </div>
      </Html>
    </group>
  )
}

function CameraRig() {
  const { camera, size } = useThree()
  const { cinematicMode, setCinematicMode } = useStore()
  const controlsRef = useRef()
  const startTime = useRef(0)
  
  // Cinematic Curve
  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.5, 5),    // Low water surface
    new THREE.Vector3(4, 3, 4),      // Orbit side
    new THREE.Vector3(0, 4, 1),      // Top down
    new THREE.Vector3(-3, 2, -3),    // Rear view
    new THREE.Vector3(2, 2, 5)       // Default end view
  ]), [])

  // Responsive initial camera position
  useEffect(() => {
    const isMobile = size.width < 768
    const isTablet = size.width >= 768 && size.width < 1024
    
    // Zoom out more for smaller screens to ensure it fits
    const dist = isMobile ? 8 : (isTablet ? 7 : 6)
    
    // Position camera lower to see horizon
    camera.position.set(4, 2, dist)
    
    // Increase FOV slightly on mobile if needed
    camera.fov = isMobile ? 55 : 45
    camera.updateProjectionMatrix()
    
  }, [camera, size.width])

  useFrame((state) => {
    if (cinematicMode) {
      if (startTime.current === 0) startTime.current = state.clock.elapsedTime;
      const elapsed = state.clock.elapsedTime - startTime.current;
      const duration = 20; 
      
      let t = elapsed / duration;
      if (t >= 1) {
        t = 1;
        setCinematicMode(false);
        startTime.current = 0;
      }
      
      const pos = curve.getPointAt(t);
      camera.position.lerp(pos, 0.05); // smoother cinematic easing
      // Look slightly above origin to keep model centered
      camera.lookAt(0, 0.3, 0);
    } else {
      startTime.current = 0;
    }
  })

  return (
    <OrbitControls 
      ref={controlsRef}
      makeDefault 
      target={[0, 0.3, 0]} // Center around the visual middle of the robot
      minPolarAngle={0} 
      maxPolarAngle={Math.PI / 2 - 0.05} // Prevent going below water plane
      minDistance={2} 
      maxDistance={12} 
      enabled={!cinematicMode} 
      enableDamping
      dampingFactor={0.05}
    />
  )
}

export default function Scene() {
  const nightMode = useStore((state) => state.nightMode)

  return (
    <Canvas className="w-full h-full" shadows camera={{ position: [4, 2, 6], fov: 45 }}>
      <ContextHandler />
      
      {/* Sky and Environment */}
      <Sky
        distance={450000}
        sunPosition={nightMode ? [0, -1, 0] : [10, 5, 10]}
        turbidity={nightMode ? 0.1 : 8}
        rayleigh={nightMode ? 0.1 : 2}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      {nightMode && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}

      {/* Marine Navy Background */}
      <color attach="background" args={[nightMode ? '#050A10' : '#0B1420']} />
      <fog attach="fog" args={[nightMode ? '#050A10' : '#0B1420', 30, 90]} />
      
      <ambientLight intensity={nightMode ? 0.2 : 0.6} />
      <directionalLight 
        position={nightMode ? [5, 10, 5] : [10, 5, 10]} 
        intensity={nightMode ? 0.5 : 2.5} 
        color={nightMode ? "#2DD4BF" : "#ffffff"}
        castShadow 
        shadow-mapSize={2048}
        shadow-bias={-0.0001}
      />
      
      <CameraRig />
      <RobotRig />
      
      <WasteItem initialPosition={[1.5, 0, 2]} type="bottle" />
      <WasteItem initialPosition={[-2, 0, 3]} type="leaf" />
      
      <WaterPlane />
      <Environment preset={nightMode ? "night" : "sunset"} background={false} environmentIntensity={nightMode ? 0.3 : 1} />
    </Canvas>
  )
}

function ContextHandler() {
  const { gl } = useThree()
  useEffect(() => {
    const canvas = gl.domElement
    const onLost = (e) => { 
      e.preventDefault()
      console.warn('WebGL context lost')
    }
    const onRestored = () => { 
      console.warn('WebGL context restored')
    }
    canvas.addEventListener('webglcontextlost', onLost)
    canvas.addEventListener('webglcontextrestored', onRestored)
    return () => {
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
    }
  }, [gl])
  return null
}

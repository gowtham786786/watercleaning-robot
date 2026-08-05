import React, { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { OrbitControls, Environment, Float, Html, MeshReflectorMaterial, Sky, Stars, ContactShadows } from '@react-three/drei'
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


function WasteItem({ debris }) {
  const meshRef = useRef()
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2 + debris.id) * 0.05
    }
  })
  const color = debris.type === 'bottle' ? '#2DD4BF' : debris.type === 'leaf' ? '#14b8a6' : '#F5A623'
  return (
    <group position={debris.position}>
      <mesh ref={meshRef} castShadow receiveShadow>
        {debris.type === 'bottle' ? <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} /> : <boxGeometry args={[0.1, 0.02, 0.1]} />}
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
        
        {useStore((s) => s.showHudLabels) && (
          <Html position={[0, 0.3, 0]} center zIndexRange={[100, 0]}>
             <div className="bg-marine/80 text-secondary border border-secondary px-3 py-1.5 rounded-sm font-mono text-[10px] uppercase tracking-widest whitespace-nowrap backdrop-blur shadow-[0_0_15px_rgba(245,166,35,0.3)]">
               Target [{debris.confidence ? debris.confidence.toFixed(2) : '0.98'}]
             </div>
          </Html>
        )}
      </mesh>
    </group>
  )
}

const WATER_BOUNDS = { minX: -8, maxX: 8, minZ: -8, maxZ: 8 };
const ASV_SPEED = 0.8;
const ASV_TURN_RATE = 2.0;
const ARRIVAL_RADIUS = 2.2;

function RobotRig() {
  const ref = useRef()
  const { debrisList, removeDebris, spawnDebris, setCollectingDebris, setCollectProgress, setSimulationState, isRunning, inclineAngle, collectedCount, incrementStats, showHudLabels } = useStore()
  
  const [navState, setNavState] = React.useState('IDLE') // IDLE, NAVIGATING, COLLECTING
  const [targetId, setTargetId] = React.useState(null)
  
  // Navigation variables
  const robotPos = useRef(new THREE.Vector3(0, 0, 0))
  const robotRotY = useRef(0)
  const collectionTimer = useRef(0)
  
  useFrame((state, delta) => {
    if (!ref.current || !isRunning) return
    
    const time = state.clock.elapsedTime
    
    // Debug log specifically requested by user
    if (Math.random() < 0.01) { // Log occasionally to not flood console
        const target = debrisList.find(d => d.id === targetId)
        console.log(`[DEBUG] Robot Pos: [${robotPos.current.x.toFixed(2)}, ${robotPos.current.z.toFixed(2)}] | Target: ${target ? `[${target.position[0].toFixed(2)}, ${target.position[2].toFixed(2)}]` : 'None'} | State: ${navState}`);
    }
    
    if (navState === 'IDLE') {
      // Find nearest target
      if (debrisList.length > 0) {
        let nearest = null
        let minDist = Infinity
        debrisList.forEach(d => {
          const dist = Math.hypot(d.position[0] - robotPos.current.x, d.position[2] - robotPos.current.z)
          if (dist < minDist) {
            minDist = dist
            nearest = d
          }
        })
        if (nearest) {
          setTargetId(nearest.id)
          setNavState('NAVIGATING')
          setSimulationState({ systemStatus: 'Scanning', wasteDetected: true })
        }
      }
      
      // Idle bobbing
      ref.current.position.y = Math.sin(time * 2) * 0.02
      ref.current.rotation.z = Math.sin(time) * 0.02
      ref.current.rotation.x = Math.sin(time * 1.5) * 0.01
      
    } else if (navState === 'NAVIGATING') {
      const target = debrisList.find(d => d.id === targetId)
      if (!target) {
        setNavState('IDLE')
        return
      }
      
      const dx = target.position[0] - robotPos.current.x
      const dz = target.position[2] - robotPos.current.z
      const dist = Math.hypot(dx, dz)
      
      // Target reached (distance < ARRIVAL_RADIUS since ramp sticks out in front)
      if (dist < ARRIVAL_RADIUS) {
        setNavState('COLLECTING')
        collectionTimer.current = 0
        setCollectingDebris(target)
        removeDebris(target.id)
        incrementStats(target.type)
        setSimulationState({ systemStatus: 'Moving' })
        return
      }
      
      // Rotate towards target (smoothly)
      const targetAngle = Math.atan2(dx, dz)
      let angleDiff = targetAngle - robotRotY.current
      // Normalize angle diff to -PI to PI
      angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff))
      
      robotRotY.current += angleDiff * ASV_TURN_RATE * delta
      
      // Move forward along CURRENT heading if roughly facing target
      const moveSpeed = ASV_SPEED * delta
      if (Math.abs(angleDiff) < Math.PI / 4) {
         robotPos.current.x += Math.sin(robotRotY.current) * moveSpeed
         robotPos.current.z += Math.cos(robotRotY.current) * moveSpeed
      }
      
      ref.current.position.set(robotPos.current.x, Math.sin(time * 2) * 0.02, robotPos.current.z)
      // Add slight roll based on turning and pitch based on movement
      const pitch = Math.sin(time * 1.5) * 0.02 + 0.02 // slightly pitched up when moving
      const roll = Math.sin(time) * 0.02 - (angleDiff * 0.1) // roll into turns
      ref.current.rotation.set(pitch, robotRotY.current, roll)
      
    } else if (navState === 'COLLECTING') {
      collectionTimer.current += delta
      const progress = collectionTimer.current / 3.0 // 3 seconds to collect
      
      if (progress <= 1.0) {
        setCollectProgress(progress)
        if (progress > 0.8 && progress < 0.85) setSimulationState({ systemStatus: 'Collecting', wasteDetected: false })
      } else {
        setCollectingDebris(null)
        setCollectProgress(0)
        setNavState('IDLE')
        
        // Random 2-5s cooldown before next target
        setTimeout(() => {
          const type = Math.random() > 0.5 ? 'bottle' : 'leaf';
          const target = {
            id: Date.now(),
            position: [
              WATER_BOUNDS.minX + Math.random() * (WATER_BOUNDS.maxX - WATER_BOUNDS.minX),
              -0.2,
              WATER_BOUNDS.minZ + Math.random() * (WATER_BOUNDS.maxZ - WATER_BOUNDS.minZ)
            ],
            type: type,
            confidence: 0.85 + Math.random() * 0.14
          };
          spawnDebris(target);
        }, 2000 + Math.random() * 3000);
      }
      
      // Idle bobbing
      ref.current.position.y = Math.sin(time * 2) * 0.02
      ref.current.rotation.z = Math.sin(time) * 0.02
      ref.current.rotation.x = Math.sin(time * 1.5) * 0.01
    }
  })

  return (
    <group ref={ref} name="robotRig">
      <RobotModel />
      
      {/* 3D Blueprint Callouts attached to the Robot */}
      {showHudLabels && (
        <>
          <Html position={[1.5, 0.5, 0]} center>
            <div className="pointer-events-none transform scale-75 opacity-80 bg-marine/40 backdrop-blur-sm p-2 rounded-lg border border-cyan-500/30">
               <BlueprintCallout label="Width" value="41" unit="cm" />
            </div>
          </Html>
          <Html position={[-1.8, 0.5, 0]} center>
            <div className="pointer-events-none transform scale-75 opacity-80 bg-marine/40 backdrop-blur-sm p-2 rounded-lg border border-cyan-500/30">
               <BlueprintCallout label="Height" value="34" unit="cm" />
            </div>
          </Html>
          <Html position={[0, 0.5, 2.0]} center>
            <div className="pointer-events-none transform scale-75 opacity-80 bg-marine/40 backdrop-blur-sm p-2 rounded-lg border border-cyan-500/30">
               <BlueprintCallout label="Length" value="88" unit="cm" />
            </div>
          </Html>
          <Html position={[0, 0.8, -2.0]} center>
            <div className="pointer-events-none transform scale-75 opacity-80 bg-marine/40 backdrop-blur-sm p-2 rounded-lg border border-cyan-500/30">
               <BlueprintCallout label="Incline" value={inclineAngle} unit="°" />
            </div>
          </Html>
          <Html position={[1.5, 0.8, -1.0]} center>
            <div className="pointer-events-none transform scale-75 opacity-80 bg-marine/40 backdrop-blur-sm p-2 rounded-lg border border-cyan-500/30">
               <BlueprintCallout label="Collected" value={collectedCount} unit="" />
            </div>
          </Html>
        </>
      )}
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
    <TrackingControls />
  )
}

function TrackingControls() {
  const { cinematicMode } = useStore()
  const controlsRef = useRef()
  
  useFrame((state) => {
    if (controlsRef.current) {
      const robot = state.scene.getObjectByName('robotRig')
      if (robot) {
        // Smoothly lerp the orbit target to the robot's world position
        controlsRef.current.target.lerp(new THREE.Vector3(robot.position.x, 0, robot.position.z), 0.05)
        controlsRef.current.update()
      }
    }
  })
  
  return (
    <OrbitControls 
      ref={controlsRef}
      makeDefault
      enablePan={false}
      minPolarAngle={Math.PI / 4}
      maxPolarAngle={Math.PI / 2 - 0.1}
      minDistance={4}
      maxDistance={8}
      autoRotate={cinematicMode}
      autoRotateSpeed={0.5}
    />
  )
}

export default function Scene() {
  const nightMode = useStore((state) => state.nightMode)
  const debrisList = useStore((state) => state.debrisList)

  return (
    <Canvas 
      className="w-full h-full" 
      shadows={{ type: THREE.PCFSoftShadowMap }} 
      gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
      camera={{ position: [4, 2, 6], fov: 45 }}
    >
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
      
      {/* Key Light */}
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={nightMode ? 0.5 : 2.5} 
        color={nightMode ? "#2DD4BF" : "#ffffff"}
        castShadow 
        shadow-mapSize={2048}
        shadow-bias={-0.0001}
      />
      {/* Fill Light */}
      <directionalLight 
        position={[-10, 5, -5]} 
        intensity={nightMode ? 0.2 : 0.8} 
        color="#aaccff"
      />
      {/* Rim Light */}
      <directionalLight 
        position={[0, 5, -10]} 
        intensity={nightMode ? 0.8 : 2.0} 
        color={nightMode ? "#00ffff" : "#ffeedd"}
      />
      
      <CameraRig />
      <RobotRig />
      
      {/* Debris mapping */}
      {debrisList && debrisList.map(d => (
        <WasteItem key={d.id} debris={d} />
      ))}
      {/* Subtle ground shadow to visually ground the model */}
      <ContactShadows position={[0, -0.19, 0]} opacity={0.6} scale={5} blur={1.5} far={4} color="#000000" />
      
                        
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

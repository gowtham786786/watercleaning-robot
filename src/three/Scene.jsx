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
    waterNormals.repeat.set(12, 12) // slightly larger ripple scale
  }, [waterNormals])

  useFrame((state, delta) => {
    // Calmer lake water has slower wave motion
    waterNormals.offset.x -= delta * 0.004
    waterNormals.offset.y += delta * 0.004
  })

  return (
    <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[200, 200]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={2.2} // strong reflection mix for shoreline reflection
        roughness={0.28}   // slightly higher roughness to soften and widen the sun glint specular highlight
        color={nightMode ? "#031713" : "#114B3E"} // rich teal/emerald colors
        metalness={0.85}   // high metalness for shiny water highlight
        mirror={0.8}
        normalMap={waterNormals}
        normalScale={[0.08, 0.08]} // slightly stronger normal scale to deform and break up direct light reflections
        transparent
        opacity={explodedView ? 0.15 : 0.95}
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
  const startTime = useRef(0)
  const tempTarget = useMemo(() => new THREE.Vector3(), [])
  
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
      const robot = state.scene.getObjectByName('robotRig')
      
      if (robot) {
        // Spline coordinates are relative to the robot's live position
        tempTarget.copy(robot.position).add(pos)
        camera.position.lerp(tempTarget, 0.05)
        
        // Track the robot's live position, looking slightly above its center
        tempTarget.copy(robot.position)
        tempTarget.y += 0.3
        camera.lookAt(tempTarget)
      } else {
        camera.position.lerp(pos, 0.05); // fallback
        camera.lookAt(0, 0.3, 0);
      }
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
        // Only call OrbitControls update in normal exploration mode to avoid fighting with cinematic rig positioning
        if (!cinematicMode) {
          controlsRef.current.update()
        }
      }
    }
  })
  
  return (
    <OrbitControls 
      ref={controlsRef}
      makeDefault
      enabled={!cinematicMode}
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

function ForestTrees() {
  const nightMode = useStore((state) => state.nightMode)
  const meshRefTrunk = useRef()
  const meshRefLower = useRef()
  const meshRefMiddle = useRef()
  const meshRefUpper = useRef()
  
  const count = 100 // 100 trees total for a dense volumetric forest line

  // Define tree positions, scales, and colors once
  const treeData = useMemo(() => {
    const data = []
    const forestColors = ['#1E3F20', '#17351A', '#132C15', '#244727', '#1A391F']
    
    // Left bank trees
    for (let i = 0; i < count / 2; i++) {
      const scaleX = 0.7 + Math.random() * 0.7
      const scaleY = 0.8 + Math.random() * 0.8
      const scaleZ = scaleX
      const x = -12.5 - Math.random() * 9
      const z = -75 + Math.random() * 150
      const rotationY = Math.random() * Math.PI * 2
      const foliageColor = forestColors[Math.floor(Math.random() * forestColors.length)]
      data.push({ x, z, scaleX, scaleY, scaleZ, rotationY, foliageColor })
    }
    
    // Right bank trees
    for (let i = 0; i < count / 2; i++) {
      const scaleX = 0.7 + Math.random() * 0.7
      const scaleY = 0.8 + Math.random() * 0.8
      const scaleZ = scaleX
      const x = 12.5 + Math.random() * 9
      const z = -75 + Math.random() * 150
      const rotationY = Math.random() * Math.PI * 2
      const foliageColor = forestColors[Math.floor(Math.random() * forestColors.length)]
      data.push({ x, z, scaleX, scaleY, scaleZ, rotationY, foliageColor })
    }
    return data
  }, [])

  useEffect(() => {
    const tempObject = new THREE.Object3D()
    const tempColor = new THREE.Color()

    treeData.forEach((tree, idx) => {
      // 1. Trunk matrix and colors
      tempObject.position.set(tree.x, -0.2 + (0.4 * tree.scaleY) - 0.1, tree.z)
      tempObject.rotation.set(0, tree.rotationY, 0)
      tempObject.scale.set(tree.scaleX, tree.scaleY, tree.scaleZ)
      tempObject.updateMatrix()
      meshRefTrunk.current.setMatrixAt(idx, tempObject.matrix)
      
      const trunkColor = nightMode ? '#150B06' : '#2D190E'
      tempColor.set(trunkColor)
      meshRefTrunk.current.setColorAt(idx, tempColor)

      // 2. Lower Foliage matrix and colors
      tempObject.position.set(tree.x, -0.2 + (0.9 * tree.scaleY) - 0.1, tree.z)
      tempObject.updateMatrix()
      meshRefLower.current.setMatrixAt(idx, tempObject.matrix)
      
      const leafColor = nightMode ? '#07160B' : tree.foliageColor
      tempColor.set(leafColor)
      meshRefLower.current.setColorAt(idx, tempColor)

      // 3. Middle Foliage matrix
      tempObject.position.set(tree.x, -0.2 + (1.4 * tree.scaleY) - 0.1, tree.z)
      tempObject.updateMatrix()
      meshRefMiddle.current.setMatrixAt(idx, tempObject.matrix)
      meshRefMiddle.current.setColorAt(idx, tempColor)

      // 4. Upper Foliage matrix
      tempObject.position.set(tree.x, -0.2 + (1.9 * tree.scaleY) - 0.1, tree.z)
      tempObject.updateMatrix()
      meshRefUpper.current.setMatrixAt(idx, tempObject.matrix)
      meshRefUpper.current.setColorAt(idx, tempColor)
    })

    meshRefTrunk.current.instanceMatrix.needsUpdate = true
    meshRefLower.current.instanceMatrix.needsUpdate = true
    meshRefMiddle.current.instanceMatrix.needsUpdate = true
    meshRefUpper.current.instanceMatrix.needsUpdate = true

    if (meshRefTrunk.current.instanceColor) meshRefTrunk.current.instanceColor.needsUpdate = true
    if (meshRefLower.current.instanceColor) meshRefLower.current.instanceColor.needsUpdate = true
    if (meshRefMiddle.current.instanceColor) meshRefMiddle.current.instanceColor.needsUpdate = true
    if (meshRefUpper.current.instanceColor) meshRefUpper.current.instanceColor.needsUpdate = true
  }, [treeData, nightMode])

  return (
    <group>
      {/* Trunks */}
      <instancedMesh ref={meshRefTrunk} args={[null, null, count]} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.8, 5]} />
        <meshStandardMaterial roughness={0.9} />
      </instancedMesh>
      
      {/* Lower Foliage */}
      <instancedMesh ref={meshRefLower} args={[null, null, count]} castShadow receiveShadow>
        <coneGeometry args={[0.6, 0.8, 5]} />
        <meshStandardMaterial roughness={0.9} flatShading />
      </instancedMesh>

      {/* Middle Foliage */}
      <instancedMesh ref={meshRefMiddle} args={[null, null, count]} castShadow receiveShadow>
        <coneGeometry args={[0.45, 0.7, 5]} />
        <meshStandardMaterial roughness={0.9} flatShading />
      </instancedMesh>

      {/* Upper Foliage */}
      <instancedMesh ref={meshRefUpper} args={[null, null, count]} castShadow receiveShadow>
        <coneGeometry args={[0.3, 0.6, 5]} />
        <meshStandardMaterial roughness={0.9} flatShading />
      </instancedMesh>
    </group>
  )
}

function ShorelineDetails() {
  const nightMode = useStore((state) => state.nightMode)
  const meshRefRocks = useRef()
  const count = 50 // 25 left bank, 25 right bank

  // Define shoreline rock positions and shapes
  const rockData = useMemo(() => {
    const data = []
    // Left bank shoreline rocks (around x = -11)
    for (let i = 0; i < count / 2; i++) {
      const z = -80 + Math.random() * 160
      const x = -11.0 + (Math.random() * 0.4 - 0.2)
      const scale = 0.15 + Math.random() * 0.25
      const rotationY = Math.random() * Math.PI * 2
      const rotationX = Math.random() * 0.5
      data.push({ x, z, scale, rotationX, rotationY })
    }
    // Right bank shoreline rocks (around x = 11)
    for (let i = 0; i < count / 2; i++) {
      const z = -80 + Math.random() * 160
      const x = 11.0 + (Math.random() * 0.4 - 0.2)
      const scale = 0.15 + Math.random() * 0.25
      const rotationY = Math.random() * Math.PI * 2
      const rotationX = Math.random() * 0.5
      data.push({ x, z, scale, rotationX, rotationY })
    }
    return data
  }, [])

  useEffect(() => {
    const tempObject = new THREE.Object3D()
    const tempColor = new THREE.Color()

    rockData.forEach((rock, idx) => {
      // Skew and position rocks so they peek out of the shoreline
      tempObject.position.set(rock.x, -0.22, rock.z)
      tempObject.rotation.set(rock.rotationX, rock.rotationY, 0)
      tempObject.scale.set(rock.scale * 2.0, rock.scale * 0.8, rock.scale * 1.5)
      tempObject.updateMatrix()
      meshRefRocks.current.setMatrixAt(idx, tempObject.matrix)

      // Random rock shades (gray/brown/slate)
      const rockColors = nightMode 
        ? ['#0D1318', '#0B0F13', '#080A0C'] 
        : ['#4E545C', '#5C626A', '#3C4045', '#453E3A']
      const colorHex = rockColors[idx % rockColors.length]
      tempColor.set(colorHex)
      meshRefRocks.current.setColorAt(idx, tempColor)
    })

    meshRefRocks.current.instanceMatrix.needsUpdate = true
    if (meshRefRocks.current.instanceColor) meshRefRocks.current.instanceColor.needsUpdate = true
  }, [rockData, nightMode])

  return (
    <instancedMesh ref={meshRefRocks} args={[null, null, count]} castShadow receiveShadow>
      <dodecahedronGeometry args={[1, 1]} />
      <meshStandardMaterial roughness={0.8} metalness={0.2} />
    </instancedMesh>
  )
}

function ForestDetails() {
  const nightMode = useStore((state) => state.nightMode)
  const meshRefTufts = useRef()
  const meshRefRocks = useRef()
  const count = 100 // 50 left bank, 50 right bank

  const tuftData = useMemo(() => {
    const data = []
    // Left bank grass tufts
    for (let i = 0; i < count / 2; i++) {
      const z = -80 + Math.random() * 160
      const x = -13.0 - Math.random() * 7
      const scale = 0.1 + Math.random() * 0.25
      const rotationY = Math.random() * Math.PI * 2
      data.push({ x, z, scale, rotationY })
    }
    // Right bank grass tufts
    for (let i = 0; i < count / 2; i++) {
      const z = -80 + Math.random() * 160
      const x = 13.0 + Math.random() * 7
      const scale = 0.1 + Math.random() * 0.25
      const rotationY = Math.random() * Math.PI * 2
      data.push({ x, z, scale, rotationY })
    }
    return data
  }, [])

  const rockData = useMemo(() => {
    const data = []
    // Left bank scattered rocks
    for (let i = 0; i < 20; i++) {
      const z = -80 + Math.random() * 160
      const x = -13.0 - Math.random() * 8
      const scale = 0.25 + Math.random() * 0.4
      const rotationY = Math.random() * Math.PI * 2
      data.push({ x, z, scale, rotationY })
    }
    // Right bank scattered rocks
    for (let i = 0; i < 20; i++) {
      const z = -80 + Math.random() * 160
      const x = 13.0 + Math.random() * 8
      const scale = 0.25 + Math.random() * 0.4
      const rotationY = Math.random() * Math.PI * 2
      data.push({ x, z, scale, rotationY })
    }
    return data
  }, [])

  useEffect(() => {
    const tempObject = new THREE.Object3D()
    const tempColor = new THREE.Color()

    // Position and scale grass tufts
    tuftData.forEach((tuft, idx) => {
      tempObject.position.set(tuft.x, -0.1, tuft.z)
      tempObject.rotation.set(0, tuft.rotationY, 0)
      tempObject.scale.set(tuft.scale, tuft.scale * 1.5, tuft.scale)
      tempObject.updateMatrix()
      meshRefTufts.current.setMatrixAt(idx, tempObject.matrix)

      const tuftColors = nightMode 
        ? ['#0A1C0F', '#08160C'] 
        : ['#2E5A35', '#244D2B', '#1E3F23']
      tempColor.set(tuftColors[idx % tuftColors.length])
      meshRefTufts.current.setColorAt(idx, tempColor)
    })
    meshRefTufts.current.instanceMatrix.needsUpdate = true
    if (meshRefTufts.current.instanceColor) meshRefTufts.current.instanceColor.needsUpdate = true

    // Position and scale scattered rocks
    rockData.forEach((rock, idx) => {
      tempObject.position.set(rock.x, -0.15, rock.z)
      tempObject.rotation.set(Math.random() * 0.2, rock.rotationY, 0)
      tempObject.scale.set(rock.scale * 1.5, rock.scale * 0.7, rock.scale)
      tempObject.updateMatrix()
      meshRefRocks.current.setMatrixAt(idx, tempObject.matrix)

      const rockColors = nightMode 
        ? ['#0A0E13', '#080B0F'] 
        : ['#4E545C', '#5C626A', '#3C4045']
      tempColor.set(rockColors[idx % rockColors.length])
      meshRefRocks.current.setColorAt(idx, tempColor)
    })
    meshRefRocks.current.instanceMatrix.needsUpdate = true
    if (meshRefRocks.current.instanceColor) meshRefRocks.current.instanceColor.needsUpdate = true
  }, [tuftData, rockData, nightMode])

  return (
    <group>
      {/* Grass Tufts */}
      <instancedMesh ref={meshRefTufts} args={[null, null, count]} castShadow receiveShadow>
        <coneGeometry args={[0.2, 0.5, 4]} />
        <meshStandardMaterial roughness={0.9} flatShading />
      </instancedMesh>
      
      {/* Scattered rocks */}
      <instancedMesh ref={meshRefRocks} args={[null, null, 40]} castShadow receiveShadow>
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial roughness={0.8} metalness={0.2} />
      </instancedMesh>
    </group>
  )
}

// Custom Shader Material for realistic gradient mountains with vertex noise displacement
const MountainShader = {
  uniforms: {
    uLowColor: { value: new THREE.Color() },
    uHighColor: { value: new THREE.Color() },
    uMinY: { value: -20.0 },
    uMaxY: { value: 20.0 },
    uFogColor: { value: new THREE.Color() },
    uFogDensity: { value: 0.012 }
  },
  vertexShader: `
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    
    // Simple 3D noise for rugged rock ridge shapes
    float hash(vec3 p) {
      p = fract(p * 0.3183099 + 0.1);
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }
    float noise(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(
        mix(mix(hash(i+vec3(0,0,0)), hash(i+vec3(1,0,0)), f.x),
            mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
        mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),
            mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y), f.z
      );
    }
    
    void main() {
      vPosition = position;
      vec3 pos = position;
      
      // Only displace the non-base vertices to keep the bottom edge flat
      if (position.y > -19.0) {
        // Multi-frequency noise for rocky displacement
        float n = noise(position * 0.1) * 3.5 + noise(position * 0.3) * 1.0;
        pos += normal * n;
      }
      
      vec4 worldPos = modelMatrix * vec4(pos, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    uniform vec3 uLowColor;
    uniform vec3 uHighColor;
    uniform float uMinY;
    uniform float uMaxY;
    uniform vec3 uFogColor;
    uniform float uFogDensity;
    uniform vec3 cameraPosition; // built-in R3F camera position
    
    // Noise for rock microtexture
    float hash2(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }
    
    void main() {
      // 1. Height-based color gradient
      float h = clamp((vPosition.y - uMinY) / (uMaxY - uMinY), 0.0, 1.0);
      vec3 rockColor = mix(uLowColor, uHighColor, h);
      
      // 2. Microtexture noise shading
      float n = hash2(vPosition.xy * 20.0) * 0.04 - 0.02;
      rockColor += vec3(n);
      
      // 3. Distance-based exponential fog (atmospheric perspective)
      float dist = length(vWorldPosition - cameraPosition);
      float fogFactor = 1.0 - exp(-dist * uFogDensity);
      fogFactor = clamp(fogFactor, 0.0, 1.0);
      
      vec3 finalColor = mix(rockColor, uFogColor, fogFactor);
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
}

function Mountain({ position, args, opacity = 1.0 }) {
  const nightMode = useStore((state) => state.nightMode)
  const matRef = useRef()

  const uniforms = useMemo(() => ({
    uLowColor: { value: new THREE.Color() },
    uHighColor: { value: new THREE.Color() },
    uMinY: { value: -args[1] / 2 },
    uMaxY: { value: args[1] / 2 },
    uFogColor: { value: new THREE.Color() },
    uFogDensity: { value: 0.012 }
  }), [args])

  useEffect(() => {
    if (nightMode) {
      uniforms.uLowColor.value.set('#030E14') // deep midnight dark base
      uniforms.uHighColor.value.set('#0D1E2A') // soft dark indigo peak
      uniforms.uFogColor.value.set('#030E14')  // blends with night fog
    } else {
      uniforms.uLowColor.value.set('#16353E') // dark rock teal-green base
      uniforms.uHighColor.value.set('#5D8C9B') // misty blue-gray peak
      uniforms.uFogColor.value.set('#729BA8')  // blends with daylight fog
    }
  }, [nightMode, uniforms])

  return (
    <mesh position={position} castShadow receiveShadow>
      <coneGeometry args={args} />
      <shaderMaterial
        ref={matRef}
        vertexShader={MountainShader.vertexShader}
        fragmentShader={MountainShader.fragmentShader}
        uniforms={uniforms}
        transparent
        opacity={opacity}
      />
    </mesh>
  )
}

function ForestEnvironment() {
  const nightMode = useStore((state) => state.nightMode)

  // Procedural Canvas Texture for Grass color mapping
  const grassTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    
    ctx.fillStyle = '#1A321E'
    ctx.fillRect(0, 0, 256, 256)
    
    // Add speckled noise details to simulate grassy/organic patches
    for (let i = 0; i < 6000; i++) {
      const x = Math.random() * 256
      const y = Math.random() * 256
      const w = 2 + Math.random() * 4
      const h = 2 + Math.random() * 4
      
      const r = Math.random()
      if (r < 0.3) {
        ctx.fillStyle = '#132817' // dark patch
      } else if (r < 0.6) {
        ctx.fillStyle = '#22482A' // light patch
      } else {
        ctx.fillStyle = '#1A321E'
      }
      ctx.fillRect(x, y, w, h)
    }
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(2, 24)
    return texture
  }, [])

  // Procedural Canvas Texture for Grass normal/bump mapping
  const grassNormalTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    
    ctx.fillStyle = 'rgb(128, 128, 255)' // flat normal base
    ctx.fillRect(0, 0, 256, 256)
    
    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * 256
      const y = Math.random() * 256
      const r = 1 + Math.random() * 2
      
      const nx = Math.floor(128 + (Math.random() * 32 - 16))
      const ny = Math.floor(128 + (Math.random() * 32 - 16))
      ctx.fillStyle = `rgb(${nx}, ${ny}, 255)`
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(2, 24)
    return texture
  }, [])

  // Stagger shoreline segments to make the water boundary irregular
  const shorelineSegments = useMemo(() => {
    const segments = []
    const count = 10
    const segmentLength = 160 / count
    for (let i = 0; i < count; i++) {
      const z = -80 + (i * segmentLength) + segmentLength / 2
      // Random X offsets to break up straight line
      const leftOffset = -0.35 + Math.random() * 0.7
      const rightOffset = -0.35 + Math.random() * 0.7
      segments.push({ z, length: segmentLength, leftOffset, rightOffset })
    }
    return segments
  }, [])

  return (
    <group>
      {/* Shorelines (Staggered Segments with Procedural Textures) */}
      {shorelineSegments.map((seg, idx) => (
        <group key={`shore-seg-${idx}`}>
          {/* Left Segment */}
          <mesh position={[-16 + seg.leftOffset, -0.21, seg.z]} receiveShadow>
            <boxGeometry args={[10, 0.2, seg.length + 0.1]} />
            <meshStandardMaterial 
              map={grassTexture}
              normalMap={grassNormalTexture}
              normalScale={[0.3, 0.3]}
              color={nightMode ? "#333333" : "#FFFFFF"}
              roughness={0.9} 
              metalness={0.1}
            />
          </mesh>
          {/* Right Segment */}
          <mesh position={[16 + seg.rightOffset, -0.21, seg.z]} receiveShadow>
            <boxGeometry args={[10, 0.2, seg.length + 0.1]} />
            <meshStandardMaterial 
              map={grassTexture}
              normalMap={grassNormalTexture}
              normalScale={[0.3, 0.3]}
              color={nightMode ? "#333333" : "#FFFFFF"}
              roughness={0.9} 
              metalness={0.1}
            />
          </mesh>
        </group>
      ))}

      {/* Instanced Shoreline Rocks */}
      <ShorelineDetails />

      {/* Instanced Undergrowth (Tufts & Scattered Rocks) */}
      <ForestDetails />

      {/* Instanced Pine Forest */}
      <ForestTrees />

      {/* Distant gradient-shaded misty mountains with vertex displacement */}
      <group position={[0, -2, -85]}>
        <Mountain position={[-20, 15, -10]} args={[45, 40, 4]} opacity={0.95} />
        <Mountain position={[25, 12, -5]} args={[35, 30, 4]} opacity={0.95} />
        <Mountain position={[5, 18, -20]} args={[50, 45, 4]} opacity={0.85} />
      </group>
    </group>
  )
}

// Custom Sky Shader with procedurally generated drifting clouds
const SkyPlaneShader = {
  uniforms: {
    uSkyColor: { value: new THREE.Color() },
    uHorizonColor: { value: new THREE.Color() },
    uTime: { value: 0.0 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform vec3 uSkyColor;
    uniform vec3 uHorizonColor;
    uniform float uTime;
    
    // Hash & Noise for clouds
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }
    
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(
        mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), f.x),
        mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), f.x), 
        f.y
      );
    }
    
    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }
    
    void main() {
      // Sky gradient
      vec3 sky = mix(uHorizonColor, uSkyColor, vUv.y);
      
      // Cloud noise coordinates, slowly drifting over time
      vec2 uvCloud = vUv * vec2(3.0, 1.5) + vec2(uTime * 0.003, 0.0);
      float cloudNoise = fbm(uvCloud);
      
      // Cloud density thresholding
      float cloudDensity = smoothstep(0.38, 0.7, cloudNoise);
      
      // Soft white/light-gray cloud color
      vec3 cloudColor = vec3(0.96, 0.98, 1.0);
      
      // Blend clouds into the sky, fading them out near the horizon
      float cloudOpacity = cloudDensity * 0.55 * smoothstep(0.08, 0.45, vUv.y);
      
      vec3 finalColor = mix(sky, cloudColor, cloudOpacity);
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
}

function SkyPlane() {
  const nightMode = useStore((state) => state.nightMode)
  const uniforms = useMemo(() => ({
    uSkyColor: { value: new THREE.Color() },
    uHorizonColor: { value: new THREE.Color() },
    uTime: { value: 0.0 }
  }), [])

  useEffect(() => {
    if (nightMode) {
      uniforms.uSkyColor.value.set('#01050A')     // deep night zenith
      uniforms.uHorizonColor.value.set('#030E14') // soft horizon glow
    } else {
      uniforms.uSkyColor.value.set('#296985')     // rich daylight blue
      uniforms.uHorizonColor.value.set('#729BA8') // soft misty horizon teal-blue
    }
  }, [nightMode, uniforms])

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh position={[0, 48, -99]}>
      <planeGeometry args={[300, 120]} />
      <shaderMaterial
        vertexShader={SkyPlaneShader.vertexShader}
        fragmentShader={SkyPlaneShader.fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
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
      
      {/* SkyPlane with custom gradient and drifting clouds */}
      <SkyPlane />
      {nightMode && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}

      {/* Forest Lake Background (Misty light teal-blue for day, deep dark night for night) */}
      <color attach="background" args={[nightMode ? '#030E14' : '#729BA8']} />
      <fog attach="fog" args={[nightMode ? '#030E14' : '#729BA8', 35, 120]} />
      
      <ambientLight intensity={nightMode ? 0.2 : 0.7} color={nightMode ? "#0D1B2A" : "#E6F2F5"} />
      
      {/* Warm late-morning forest daylight Key Light with custom shadow camera frustum */}
      <directionalLight 
        position={[15, 20, 8]} 
        intensity={nightMode ? 0.5 : 2.8} 
        color={nightMode ? "#2DD4BF" : "#FFF5E0"}
        castShadow 
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
        shadow-camera-left={-35}
        shadow-camera-right={35}
        shadow-camera-top={35}
        shadow-camera-bottom={-35}
        shadow-camera-near={0.5}
        shadow-camera-far={65}
      />
      {/* Fill Light */}
      <directionalLight 
        position={[-10, 5, -5]} 
        intensity={nightMode ? 0.2 : 1.0} 
        color={nightMode ? "#1B2A4A" : "#D2E6EC"}
      />
      {/* Rim Light with soft forest reflection tint */}
      <directionalLight 
        position={[0, 5, -10]} 
        intensity={nightMode ? 0.8 : 2.2} 
        color={nightMode ? "#00ffff" : "#E8F5E9"}
      />
      
      <CameraRig />
      <RobotRig />
      <ForestEnvironment />
      
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

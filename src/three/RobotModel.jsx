import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../store/useStore'
import * as THREE from 'three'
import { Text, Html, QuadraticBezierLine } from '@react-three/drei'
import { BlueprintCallout } from '../components/BlueprintCallout'

// A reusable component part that can be clicked and exploded
const RobotPart = ({ 
  name, 
  description,
  position = [0, 0, 0], 
  explodeOffset = [0, 1, 0], // How much to move when exploded
  children 
}) => {
  const groupRef = useRef()
  const explodedView = useStore((state) => state.explodedView)
  const setActiveComponent = useStore((state) => state.setActiveComponent)
  
  const targetPos = useMemo(() => new THREE.Vector3(), [])
  const basePos = useMemo(() => new THREE.Vector3(...position), [position])
  
  useFrame((state, delta) => {
    if (explodedView) {
      targetPos.set(basePos.x + explodeOffset[0], basePos.y + explodeOffset[1], basePos.z + explodeOffset[2])
    } else {
      targetPos.copy(basePos)
    }
    groupRef.current.position.lerp(targetPos, 5 * delta)
  })

  const handleClick = (e) => {
    e.stopPropagation()
    setActiveComponent({ name, description })
  }

  const handlePointerOver = (e) => {
    e.stopPropagation()
    document.body.style.cursor = 'pointer'
  }
  
  const handlePointerOut = (e) => {
    e.stopPropagation()
    document.body.style.cursor = 'auto'
  }

  return (
    <group 
      ref={groupRef} 
      position={position}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {children}
      {explodedView && (
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="black"
        >
          {name}
        </Text>
      )}
    </group>
  )
}

export function RobotModel(props) {
  const transparentChassis = useStore((state) => state.transparentChassis)
  const nightMode = useStore((state) => state.nightMode)
  
  return (
    <group {...props} dispose={null}>
      
      {/* --- FLOATS --- */}
      <RobotPart 
        name="PVC Floats & Mounts" 
        description="Parallel white PVC pipes with rounded caps and wooden bracket mounts."
        position={[0, -0.4, 0]} 
        explodeOffset={[0, -0.8, 0]}
      >
        {/* Left Float */}
        <group position={[-0.4, 0, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.15, 0.15, 1.6, 32]} />
            <meshStandardMaterial color="#eeeeee" roughness={0.3} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0, 0.8]} castShadow receiveShadow>
            <sphereGeometry args={[0.15, 32, 16]} />
            <meshStandardMaterial color="#dddddd" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, -0.8]} castShadow receiveShadow>
            <sphereGeometry args={[0.15, 32, 16]} />
            <meshStandardMaterial color="#dddddd" roughness={0.3} />
          </mesh>
          {/* Wooden brackets */}
          <mesh position={[0, 0.2, 0.6]} castShadow>
             <boxGeometry args={[0.1, 0.2, 0.2]} />
             <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.2, -0.6]} castShadow>
             <boxGeometry args={[0.1, 0.2, 0.2]} />
             <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
          </mesh>
        </group>
        {/* Right Float */}
        <group position={[0.4, 0, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.15, 0.15, 1.6, 32]} />
            <meshStandardMaterial color="#eeeeee" roughness={0.3} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0, 0.8]} castShadow receiveShadow>
            <sphereGeometry args={[0.15, 32, 16]} />
            <meshStandardMaterial color="#dddddd" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, -0.8]} castShadow receiveShadow>
            <sphereGeometry args={[0.15, 32, 16]} />
            <meshStandardMaterial color="#dddddd" roughness={0.3} />
          </mesh>
          {/* Wooden brackets */}
          <mesh position={[0, 0.2, 0.6]} castShadow>
             <boxGeometry args={[0.1, 0.2, 0.2]} />
             <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.2, -0.6]} castShadow>
             <boxGeometry args={[0.1, 0.2, 0.2]} />
             <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
          </mesh>
        </group>
      </RobotPart>

      {/* --- STORAGE TOTE HULL --- */}
      <RobotPart 
        name="Storage Tote Hull" 
        description="Clear plastic storage tote serving as the main watertight hull, with red snap latches."
        position={[0, 0, 0]}
        explodeOffset={[0, 0, 0]} 
      >
        <mesh castShadow receiveShadow>
          {/* A box to represent the tote */}
          <boxGeometry args={[1.2, 0.3, 1.4]} />
          <meshPhysicalMaterial 
            color="#ffffff" 
            transparent={true} 
            opacity={transparentChassis ? 0.3 : 0.6} 
            roughness={0.2} 
            metalness={0.1}
            transmission={0.9} 
            thickness={0.02}
          />
        </mesh>
        {/* Red Latches */}
        <mesh position={[-0.62, 0.05, 0.4]} castShadow>
          <boxGeometry args={[0.04, 0.08, 0.15]} />
          <meshStandardMaterial color="#dc2626" roughness={0.6} />
        </mesh>
        <mesh position={[-0.62, 0.05, -0.4]} castShadow>
          <boxGeometry args={[0.04, 0.08, 0.15]} />
          <meshStandardMaterial color="#dc2626" roughness={0.6} />
        </mesh>
        <mesh position={[0.62, 0.05, 0.4]} castShadow>
          <boxGeometry args={[0.04, 0.08, 0.15]} />
          <meshStandardMaterial color="#dc2626" roughness={0.6} />
        </mesh>
        <mesh position={[0.62, 0.05, -0.4]} castShadow>
          <boxGeometry args={[0.04, 0.08, 0.15]} />
          <meshStandardMaterial color="#dc2626" roughness={0.6} />
        </mesh>
        {/* Flat Lid Deck */}
        <mesh position={[0, 0.16, 0]} receiveShadow>
           <boxGeometry args={[1.22, 0.02, 1.42]} />
           <meshPhysicalMaterial color="#ffffff" transparent opacity={0.7} roughness={0.3} transmission={0.5} />
        </mesh>
      </RobotPart>

      {/* --- COLLECTION RAMP --- */}
      <RobotPart 
        name="Mesh Collection Ramp" 
        description="Angled mesh conveyor with black tape reinforcements and dual yellow DC gear motors."
        position={[0, 0.15, 0.85]} 
        explodeOffset={[0, 0.5, 0.8]}
      >
        {/* 30 degree angle (PI / 6) */}
        <group rotation={[-Math.PI / 6, 0, 0]}>
          {/* White plastic/wooden Side rails */}
          <mesh position={[-0.35, 0, 0]} castShadow>
            <boxGeometry args={[0.05, 1.2, 0.05]} />
            <meshStandardMaterial color="#f8f9fa" roughness={0.8} />
          </mesh>
          <mesh position={[0.35, 0, 0]} castShadow>
            <boxGeometry args={[0.05, 1.2, 0.05]} />
            <meshStandardMaterial color="#f8f9fa" roughness={0.8} />
          </mesh>
          {/* Cream Rollers */}
          <mesh position={[0, 0.55, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.7, 32]} />
            <meshStandardMaterial color="#d2b48c" roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.55, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.7, 32]} />
            <meshStandardMaterial color="#d2b48c" roughness={0.6} />
          </mesh>
          {/* The Mesh Surface */}
          <mesh position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[0.68, 1.1]} />
            <meshStandardMaterial color="#aaaaaa" transparent opacity={0.6} roughness={0.9} />
          </mesh>
          {/* Wireframe weave */}
          <mesh position={[0, 0, 0.001]}>
             <planeGeometry args={[0.68, 1.1, 20, 30]} />
             <meshBasicMaterial color="#555555" wireframe={true} transparent opacity={0.3} />
          </mesh>
          {/* Black Tape Strips */}
          <mesh position={[-0.15, 0, 0.002]}>
             <planeGeometry args={[0.03, 1.1]} />
             <meshBasicMaterial color="#111111" />
          </mesh>
          <mesh position={[0.15, 0, 0.002]}>
             <planeGeometry args={[0.03, 1.1]} />
             <meshBasicMaterial color="#111111" />
          </mesh>
          {/* Yellow DC Motors at base */}
          <mesh position={[-0.42, -0.55, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
             <boxGeometry args={[0.08, 0.1, 0.08]} />
             <meshStandardMaterial color="#eab308" roughness={0.4} />
          </mesh>
          <mesh position={[0.42, -0.55, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
             <boxGeometry args={[0.08, 0.1, 0.08]} />
             <meshStandardMaterial color="#eab308" roughness={0.4} />
          </mesh>
        </group>
      </RobotPart>

      {/* --- ELECTRONICS --- */}
      {/* Battery */}
      <RobotPart 
        name="Battery Pack" 
        description="Red 18650 holder with two exposed cyan Li-ion cells and a red rocker switch."
        position={[0, 0.2, -0.2]} 
        explodeOffset={[0, 1.2, -0.2]}
      >
        {/* Red Holder */}
        <mesh castShadow>
          <boxGeometry args={[0.16, 0.04, 0.16]} />
          <meshStandardMaterial color="#dc2626" roughness={0.7} />
        </mesh>
        {/* Cells */}
        <mesh position={[-0.04, 0.03, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.14, 32]} />
          <meshStandardMaterial color="#06b6d4" roughness={0.3} metalness={0.6} />
        </mesh>
        <mesh position={[0.04, 0.03, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.14, 32]} />
          <meshStandardMaterial color="#06b6d4" roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Switch */}
        <mesh position={[0.12, 0.02, 0]} castShadow>
          <boxGeometry args={[0.04, 0.04, 0.06]} />
          <meshStandardMaterial color="#111111" roughness={0.8} />
        </mesh>
        <mesh position={[0.12, 0.04, 0]} rotation={[0, 0, 0.2]} castShadow>
          <boxGeometry args={[0.02, 0.02, 0.04]} />
          <meshStandardMaterial color="#ef4444" roughness={0.4} />
        </mesh>
      </RobotPart>

      {/* Control PCBs */}
      <RobotPart 
        name="Control PCB (ESP32 / Pi)" 
        description="Raspberry Pi 4 and ESP32 with visible GPIO headers, ports, and messy jumper wiring."
        position={[0.2, 0.18, 0.1]} 
        explodeOffset={[0.5, 1.0, 0.1]}
      >
        {/* Raspberry Pi 4 */}
        <group position={[0.1, 0, 0]}>
           {/* Green PCB */}
           <mesh castShadow>
             <boxGeometry args={[0.22, 0.015, 0.15]} />
             <meshStandardMaterial color="#15803d" roughness={0.8} />
           </mesh>
           {/* GPIO Header */}
           <mesh position={[0, 0.02, -0.06]} castShadow>
             <boxGeometry args={[0.14, 0.03, 0.02]} />
             <meshStandardMaterial color="#111111" roughness={0.8} />
           </mesh>
           {/* USB/Ethernet Blocks */}
           <mesh position={[0.08, 0.03, 0.05]} castShadow>
             <boxGeometry args={[0.04, 0.05, 0.06]} />
             <meshStandardMaterial color="#d1d5db" metalness={0.9} roughness={0.2} />
           </mesh>
           <mesh position={[0.08, 0.03, -0.02]} castShadow>
             <boxGeometry args={[0.04, 0.05, 0.04]} />
             <meshStandardMaterial color="#d1d5db" metalness={0.9} roughness={0.2} />
           </mesh>
           {/* CPU */}
           <mesh position={[-0.02, 0.015, 0.02]} castShadow>
             <boxGeometry args={[0.04, 0.01, 0.04]} />
             <meshStandardMaterial color="#333333" roughness={0.7} />
           </mesh>
        </group>

        {/* ESP32 */}
        <group position={[-0.15, 0, 0.05]}>
           {/* Green PCB */}
           <mesh castShadow>
             <boxGeometry args={[0.1, 0.015, 0.14]} />
             <meshStandardMaterial color="#16a34a" roughness={0.8} />
           </mesh>
           {/* Chip */}
           <mesh position={[0, 0.015, 0.03]} castShadow>
             <boxGeometry args={[0.04, 0.01, 0.06]} />
             <meshStandardMaterial color="#111111" metalness={0.8} />
           </mesh>
           {/* Glow LED */}
           <mesh position={[-0.03, 0.015, -0.05]}>
             <sphereGeometry args={[0.01, 8, 8]} />
             <meshBasicMaterial color={nightMode ? "#ff0055" : "#00f0ff"} />
             <pointLight distance={0.5} intensity={1} color={nightMode ? "#ff0055" : "#00f0ff"} />
           </mesh>
        </group>
      </RobotPart>

      <RobotPart 
        name="Motor Drivers (L298N)" 
        description="Blue/Red L298N driver boards with large black heatsinks."
        position={[-0.25, 0.18, 0.2]} 
        explodeOffset={[-0.6, 1.0, 0.2]}
      >
        {/* Driver 1 */}
        <group position={[0, 0, 0]}>
           <mesh castShadow>
             <boxGeometry args={[0.12, 0.015, 0.12]} />
             <meshStandardMaterial color="#b91c1c" roughness={0.7} />
           </mesh>
           {/* Black Heatsink */}
           <mesh position={[0, 0.04, -0.02]} castShadow>
              <boxGeometry args={[0.08, 0.08, 0.04]} />
              <meshStandardMaterial color="#111111" roughness={0.4} metalness={0.5} />
           </mesh>
           {/* Terminals */}
           <mesh position={[0, 0.02, 0.04]} castShadow>
              <boxGeometry args={[0.1, 0.03, 0.03]} />
              <meshStandardMaterial color="#0284c7" roughness={0.8} />
           </mesh>
        </group>
        {/* Driver 2 */}
        <group position={[0, 0, -0.2]}>
           <mesh castShadow>
             <boxGeometry args={[0.12, 0.015, 0.12]} />
             <meshStandardMaterial color="#1d4ed8" roughness={0.7} />
           </mesh>
           {/* Black Heatsink */}
           <mesh position={[0, 0.04, -0.02]} castShadow>
              <boxGeometry args={[0.08, 0.08, 0.04]} />
              <meshStandardMaterial color="#111111" roughness={0.4} metalness={0.5} />
           </mesh>
           {/* Terminals */}
           <mesh position={[0, 0.02, 0.04]} castShadow>
              <boxGeometry args={[0.1, 0.03, 0.03]} />
              <meshStandardMaterial color="#0284c7" roughness={0.8} />
           </mesh>
        </group>
      </RobotPart>

      {/* Messy Jumper Wires connecting components on the deck */}
      <group position={[0, 0.18, 0]}>
         {/* Pi to ESP32 */}
         <QuadraticBezierLine start={[0.3, 0.05, 0.04]} end={[0.05, 0.05, 0.15]} mid={[0.15, 0.2, 0.1]} color="yellow" lineWidth={2} />
         <QuadraticBezierLine start={[0.3, 0.05, 0.05]} end={[0.05, 0.05, 0.16]} mid={[0.2, 0.25, 0.1]} color="green" lineWidth={2} />
         {/* ESP32 to L298N 1 */}
         <QuadraticBezierLine start={[0.02, 0.05, 0.1]} end={[-0.2, 0.05, 0.24]} mid={[-0.1, 0.15, 0.15]} color="purple" lineWidth={2} />
         <QuadraticBezierLine start={[0.03, 0.05, 0.12]} end={[-0.22, 0.05, 0.24]} mid={[-0.1, 0.2, 0.2]} color="white" lineWidth={2} />
         {/* Battery to ESP/Pi */}
         <QuadraticBezierLine start={[0.12, 0.05, -0.2]} end={[0.35, 0.05, 0]} mid={[0.2, 0.2, -0.1]} color="red" lineWidth={3} />
         <QuadraticBezierLine start={[0.1, 0.05, -0.2]} end={[0.33, 0.05, 0]} mid={[0.1, 0.1, -0.05]} color="black" lineWidth={3} />
      </group>

      {/* --- SENSOR CLUSTER --- */}
      <RobotPart 
        name="Ultrasonic Sensor" 
        description="HC-SR04 sonar with dual aluminum 'eyes' on a tan bracket."
        position={[-0.4, 0.25, 0.6]} 
        explodeOffset={[-0.8, 0.8, 0.5]}
      >
        <group rotation={[0, -0.2, 0]}>
           {/* Tan Bracket */}
           <mesh position={[0, -0.05, -0.02]} castShadow>
             <boxGeometry args={[0.14, 0.08, 0.04]} />
             <meshStandardMaterial color="#d2b48c" roughness={0.8} />
           </mesh>
           {/* Blue PCB */}
           <mesh castShadow>
             <boxGeometry args={[0.14, 0.06, 0.01]} />
             <meshStandardMaterial color="#1d4ed8" roughness={0.4} />
           </mesh>
           {/* Aluminum Eyes */}
           <mesh position={[-0.04, 0, 0.015]} rotation={[Math.PI / 2, 0, 0]} castShadow>
             <cylinderGeometry args={[0.025, 0.025, 0.02, 32]} />
             <meshStandardMaterial color="#d1d5db" metalness={0.9} roughness={0.2} />
           </mesh>
           <mesh position={[0.04, 0, 0.015]} rotation={[Math.PI / 2, 0, 0]} castShadow>
             <cylinderGeometry args={[0.025, 0.025, 0.02, 32]} />
             <meshStandardMaterial color="#d1d5db" metalness={0.9} roughness={0.2} />
           </mesh>
           {/* Wire to main deck */}
           <QuadraticBezierLine start={[0, 0, -0.05]} end={[0.3, -0.05, -0.45]} mid={[0.1, 0.1, -0.2]} color="yellow" lineWidth={2} />
           <QuadraticBezierLine start={[0, 0, -0.05]} end={[0.3, -0.05, -0.45]} mid={[0.2, 0.2, -0.3]} color="red" lineWidth={2} />
        </group>
      </RobotPart>

      {/* --- SORTING BINS --- */}
      <RobotPart 
        name="Metal Bin" 
        description="0.89 L capacity compartment for collected metallic waste."
        position={[-0.3, 0.28, -0.45]} 
        explodeOffset={[-0.6, 0.5, -0.8]}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.2, 0.2, 0.25]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.8} />
        </mesh>
        <Html position={[0, 0.25, 0]} center>
          <div className="pointer-events-none transform -translate-x-1/2 -translate-y-1/2 scale-75 opacity-90">
             <BlueprintCallout label="Metal Bin" value="0.89" unit="L" />
          </div>
        </Html>
      </RobotPart>

      <RobotPart 
        name="Non-Metal Bin" 
        description="7.8 L capacity compartment for general collected waste."
        position={[0.15, 0.35, -0.45]} 
        explodeOffset={[0.6, 0.6, -0.8]}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.5, 0.35, 0.5]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.2} />
        </mesh>
        <Html position={[0, 0.35, 0]} center>
          <div className="pointer-events-none transform -translate-x-1/2 -translate-y-1/2 scale-75 opacity-90">
             <BlueprintCallout label="Non-Metal Bin" value="7.8" unit="L" />
          </div>
        </Html>
      </RobotPart>

      {/* --- PROPULSION --- */}
      <RobotPart 
        name="Propulsion Motors" 
        description="Rear DC motors driving propellers for steering and forward movement."
        position={[0, -0.1, -0.7]} 
        explodeOffset={[0, -0.2, -1.2]}
      >
        <mesh position={[-0.3, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.2, 32]} />
          <meshStandardMaterial color="#222222" roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh position={[0.3, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.2, 32]} />
          <meshStandardMaterial color="#222222" roughness={0.2} metalness={0.9} />
        </mesh>
      </RobotPart>

    </group>
  )
}

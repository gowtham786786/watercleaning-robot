import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../store/useStore'
import * as THREE from 'three'
import { Text } from '@react-three/drei'

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
        name="PVC Floats" 
        description="Parallel PVC pipes providing buoyancy and stability."
        position={[0, -0.4, 0]} 
        explodeOffset={[0, -0.8, 0]}
      >
        {/* Left Float */}
        <mesh position={[-0.4, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.15, 0.15, 1.6, 32]} />
          <meshStandardMaterial color="#d0d0d0" roughness={0.2} metalness={0.1} />
        </mesh>
        {/* Right Float */}
        <mesh position={[0.4, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.15, 0.15, 1.6, 32]} />
          <meshStandardMaterial color="#d0d0d0" roughness={0.2} metalness={0.1} />
        </mesh>
      </RobotPart>

      {/* --- CHASSIS DECK --- */}
      <RobotPart 
        name="Acrylic Chassis" 
        description="Clear rectangular deck mounting all electronics and mechanical parts."
        position={[0, 0, 0]}
        explodeOffset={[0, 0, 0]} 
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.05, 1.4]} />
          <meshPhysicalMaterial 
            color="#ffffff" 
            transparent={transparentChassis} 
            opacity={transparentChassis ? 0.3 : 0.95} 
            roughness={0.05} 
            metalness={0.1}
            transmission={transparentChassis ? 0.95 : 0} 
            ior={1.5}
            thickness={0.05}
          />
        </mesh>
      </RobotPart>

      {/* --- COLLECTION RAMP --- */}
      <RobotPart 
        name="Mesh Collection Ramp" 
        description="Angled mesh conveyor that scoops surface waste as the robot moves forward."
        position={[0, 0.2, 0.8]} 
        explodeOffset={[0, 0.5, 0.8]}
      >
        <group rotation={[-Math.PI / 4, 0, 0]}>
          {/* Side rails */}
          <mesh position={[-0.35, 0, 0]} castShadow>
            <boxGeometry args={[0.05, 1.2, 0.05]} />
            <meshStandardMaterial color="#a0a0a0" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0.35, 0, 0]} castShadow>
            <boxGeometry args={[0.05, 1.2, 0.05]} />
            <meshStandardMaterial color="#a0a0a0" roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Top/Bottom Rollers */}
          <mesh position={[0, 0.55, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.7, 32]} />
            <meshStandardMaterial color="#333333" roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.55, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.7, 32]} />
            <meshStandardMaterial color="#333333" roughness={0.8} />
          </mesh>
          {/* The Mesh Surface */}
          <mesh position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[0.68, 1.1]} />
            <meshStandardMaterial color="#111111" transparent opacity={0.6} roughness={0.9} />
          </mesh>
          {/* Wireframe overlay */}
          <mesh position={[0, 0, 0.001]}>
             <planeGeometry args={[0.68, 1.1, 20, 30]} />
             <meshBasicMaterial color="#00f0ff" wireframe={true} transparent opacity={0.15} />
          </mesh>
        </group>
      </RobotPart>

      {/* --- ELECTRONICS --- */}
      <RobotPart 
        name="Battery Pack" 
        description="18650 Li-ion battery pack supplying power to motors and logic."
        position={[0, 0.1, -0.2]} 
        explodeOffset={[0, 1.2, -0.2]}
      >
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.15, 0.15]} />
          <meshStandardMaterial color="#00f0ff" roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.08]} castShadow>
          <boxGeometry args={[0.05, 0.05, 0.05]} />
          <meshStandardMaterial color="#222222" roughness={0.4} />
        </mesh>
      </RobotPart>

      <RobotPart 
        name="Control PCB (ESP32 / Pi)" 
        description="Main microcontroller handling sensor data, motor PWM, and logic."
        position={[0.2, 0.05, 0.1]} 
        explodeOffset={[0.5, 1.0, 0.1]}
      >
        <mesh position={[0.1, 0, 0]} castShadow>
          <boxGeometry args={[0.2, 0.02, 0.15]} />
          <meshStandardMaterial color="#111111" roughness={0.5} />
        </mesh>
        <mesh position={[-0.1, 0, 0.1]} castShadow>
          <boxGeometry args={[0.15, 0.02, 0.1]} />
          <meshStandardMaterial color="#003311" roughness={0.6} />
        </mesh>
        <mesh position={[-0.1, 0.015, 0.1]} castShadow>
          <boxGeometry args={[0.05, 0.01, 0.05]} />
          <meshStandardMaterial color="#e0e0e0" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Glow LED */}
        <mesh position={[-0.15, 0.015, 0.12]}>
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshBasicMaterial color={nightMode ? "#ff0055" : "#00f0ff"} />
          <pointLight distance={1} intensity={2} color={nightMode ? "#ff0055" : "#00f0ff"} />
        </mesh>
      </RobotPart>

      <RobotPart 
        name="Motor Drivers (L298N)" 
        description="Dual H-Bridge drivers for controlling the propulsion and conveyor motors."
        position={[-0.25, 0.05, 0.2]} 
        explodeOffset={[-0.6, 1.0, 0.2]}
      >
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.12, 0.02, 0.12]} />
          <meshStandardMaterial color="#880000" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.03, -0.03]} castShadow>
           <boxGeometry args={[0.1, 0.06, 0.04]} />
           <meshStandardMaterial color="#111111" roughness={0.3} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0, -0.2]} castShadow>
          <boxGeometry args={[0.12, 0.02, 0.12]} />
          <meshStandardMaterial color="#880000" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.03, -0.23]} castShadow>
           <boxGeometry args={[0.1, 0.06, 0.04]} />
           <meshStandardMaterial color="#111111" roughness={0.3} metalness={0.2} />
        </mesh>
      </RobotPart>

      <RobotPart 
        name="Ultrasonic Sensor" 
        description="HC-SR04 sonar for obstacle avoidance and waste detection distance."
        position={[-0.4, 0.15, 0.5]} 
        explodeOffset={[-0.8, 0.8, 0.5]}
      >
        <mesh castShadow>
          <boxGeometry args={[0.12, 0.06, 0.02]} />
          <meshStandardMaterial color="#1133aa" roughness={0.4} />
        </mesh>
        <mesh position={[-0.03, 0, 0.01]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.02, 32]} />
          <meshStandardMaterial color="#e0e0e0" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.03, 0, 0.01]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.02, 32]} />
          <meshStandardMaterial color="#e0e0e0" metalness={0.8} roughness={0.2} />
        </mesh>
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

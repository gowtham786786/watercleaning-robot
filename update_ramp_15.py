import re

# 1. Update useStore.js
store_path = r"C:\Users\Admin\OneDrive\Desktop\CERTIFICATES\project\robotics water cleaning full document\robotics-website\src\store\useStore.js"
with open(store_path, "r", encoding="utf-8") as f:
    store_content = f.read()

store_content = store_content.replace("inclineAngle: 72", "inclineAngle: 15")
with open(store_path, "w", encoding="utf-8") as f:
    f.write(store_content)

# 2. Update RobotModel.jsx
robot_path = r"C:\Users\Admin\OneDrive\Desktop\CERTIFICATES\project\robotics water cleaning full document\robotics-website\src\three\RobotModel.jsx"
with open(robot_path, "r", encoding="utf-8") as f:
    robot_content = f.read()

old_ramp = """      {/* --- COLLECTION RAMP --- */}
      <RobotPart 
        name="Mesh Collection Ramp" 
        description="Angled mesh conveyor with black tape reinforcements and dual yellow DC gear motors."
        position={[0, -0.33, 1.13]} 
        explodeOffset={[0, 0.5, 0.8]}
      >
        <group rotation={[rampRotationX, 0, 0]}>
          {/* White plastic/wooden Side rails */}
          <mesh position={[-0.35, 0.55, 0]} castShadow>
            <boxGeometry args={[0.05, 1.2, 0.05]} />
            <meshStandardMaterial color="#f8f9fa" roughness={0.8} />
          </mesh>
          <mesh position={[0.35, 0.55, 0]} castShadow>
            <boxGeometry args={[0.05, 1.2, 0.05]} />
            <meshStandardMaterial color="#f8f9fa" roughness={0.8} />
          </mesh>
          {/* Cream Rollers */}
          <mesh position={[0, 1.1, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.7, 32]} />
            <meshStandardMaterial color="#d2b48c" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.7, 32]} />
            <meshStandardMaterial color="#d2b48c" roughness={0.6} />
          </mesh>
          {/* The Mesh Surface */}
          <mesh position={[0, 0.55, 0]} receiveShadow>
            <planeGeometry args={[0.68, 1.1]} />
            <meshStandardMaterial color="#aaaaaa" transparent opacity={0.6} roughness={0.9} />
          </mesh>
          {/* Wireframe weave */}
          <mesh position={[0, 0.55, 0.001]}>
             <planeGeometry args={[0.68, 1.1, 20, 30]} />
             <meshStandardMaterial color="#555555" wireframe={true} transparent opacity={0.3} roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Black Tape Strips */}
          <mesh position={[-0.15, 0.55, 0.002]}>
             <planeGeometry args={[0.03, 1.1]} />
             <meshStandardMaterial color="#111111" roughness={0.8} metalness={0} />
          </mesh>
          <mesh position={[0.15, 0.55, 0.002]}>
             <planeGeometry args={[0.03, 1.1]} />
             <meshStandardMaterial color="#111111" roughness={0.8} metalness={0} />
          </mesh>
          {/* Conveyor Cleats for steeper incline */}
          {Array.from({ length: 11 }).map((_, i) => (
            <mesh key={i} position={[0, 0.05 + i * 0.1, 0.01]} castShadow>
              <boxGeometry args={[0.66, 0.015, 0.02]} />
              <meshStandardMaterial color="#111111" roughness={0.8} metalness={0} />
            </mesh>
          ))}
          {/* Yellow DC Motors at base */}
          <mesh position={[-0.42, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
             <boxGeometry args={[0.08, 0.1, 0.08]} />
             <meshStandardMaterial color="#eab308" roughness={0.4} />
          </mesh>
          <mesh position={[0.42, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
             <boxGeometry args={[0.08, 0.1, 0.08]} />
             <meshStandardMaterial color="#eab308" roughness={0.4} />
          </mesh>
        </group>
      </RobotPart>"""

new_ramp = """      {/* --- COLLECTION RAMP --- */}
      <RobotPart 
        name="Mesh Collection Ramp" 
        description="Angled mesh conveyor with black tape reinforcements and dual yellow DC gear motors."
        position={[0, -0.15, 1.4]} 
        explodeOffset={[0, 0.5, 1.0]}
      >
        <group rotation={[rampRotationX, 0, 0]}>
          {/* White plastic/wooden Side rails */}
          <mesh position={[-0.35, 1.0, 0]} castShadow>
            <boxGeometry args={[0.05, 2.1, 0.05]} />
            <meshStandardMaterial color="#f8f9fa" roughness={0.8} />
          </mesh>
          <mesh position={[0.35, 1.0, 0]} castShadow>
            <boxGeometry args={[0.05, 2.1, 0.05]} />
            <meshStandardMaterial color="#f8f9fa" roughness={0.8} />
          </mesh>
          {/* Cream Rollers */}
          <mesh position={[0, 2.0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.7, 32]} />
            <meshStandardMaterial color="#d2b48c" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.7, 32]} />
            <meshStandardMaterial color="#d2b48c" roughness={0.6} />
          </mesh>
          {/* The Mesh Surface */}
          <mesh position={[0, 1.0, 0]} receiveShadow>
            <planeGeometry args={[0.68, 2.0]} />
            <meshStandardMaterial color="#aaaaaa" transparent opacity={0.6} roughness={0.9} />
          </mesh>
          {/* Wireframe weave */}
          <mesh position={[0, 1.0, 0.001]}>
             <planeGeometry args={[0.68, 2.0, 20, 50]} />
             <meshStandardMaterial color="#555555" wireframe={true} transparent opacity={0.3} roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Black Tape Strips */}
          <mesh position={[-0.15, 1.0, 0.002]}>
             <planeGeometry args={[0.03, 2.0]} />
             <meshStandardMaterial color="#111111" roughness={0.8} metalness={0} />
          </mesh>
          <mesh position={[0.15, 1.0, 0.002]}>
             <planeGeometry args={[0.03, 2.0]} />
             <meshStandardMaterial color="#111111" roughness={0.8} metalness={0} />
          </mesh>
          {/* Conveyor Cleats for steeper incline */}
          {Array.from({ length: 20 }).map((_, i) => (
            <mesh key={i} position={[0, 0.05 + i * 0.1, 0.01]} castShadow>
              <boxGeometry args={[0.66, 0.015, 0.02]} />
              <meshStandardMaterial color="#111111" roughness={0.8} metalness={0} />
            </mesh>
          ))}
          {/* Yellow DC Motors at base */}
          <mesh position={[-0.42, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
             <boxGeometry args={[0.08, 0.1, 0.08]} />
             <meshStandardMaterial color="#eab308" roughness={0.4} />
          </mesh>
          <mesh position={[0.42, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
             <boxGeometry args={[0.08, 0.1, 0.08]} />
             <meshStandardMaterial color="#eab308" roughness={0.4} />
          </mesh>
        </group>
      </RobotPart>"""

if old_ramp in robot_content:
    robot_content = robot_content.replace(old_ramp, new_ramp)
    with open(robot_path, "w", encoding="utf-8") as f:
        f.write(robot_content)
    print("Ramp successfully updated to length 2.0 and pivot [0, -0.15, 1.4]")
else:
    print("Could not find old ramp in RobotModel.jsx")

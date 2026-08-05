import re

robot_path = r"C:\Users\Admin\OneDrive\Desktop\CERTIFICATES\project\robotics water cleaning full document\robotics-website\src\three\RobotModel.jsx"
with open(robot_path, "r", encoding="utf-8") as f:
    robot_content = f.read()

# We need to find the RobotPart named "Mesh Collection Ramp"
start_idx = robot_content.find('{/* --- COLLECTION RAMP --- */}')
end_idx = robot_content.find('{/* --- ELECTRONICS --- */}', start_idx)

if start_idx != -1 and end_idx != -1:
    old_ramp_block = robot_content[start_idx:end_idx]
    
    new_ramp_block = """{/* --- COLLECTION RAMP --- */}
      <RobotPart 
        name="Mesh Collection Ramp" 
        description="Angled mesh conveyor with black tape reinforcements and dual yellow DC gear motors."
        position={[0, 0.15, 0.85]} 
        explodeOffset={[0, 0.5, 0.8]}
      >
        <group rotation={[rampRotationX, 0, 0]}>
          {/* White plastic/wooden Side rails */}
          <mesh position={[-0.35, -0.5, 0]} castShadow>
            <boxGeometry args={[0.05, 2.1, 0.05]} />
            <meshStandardMaterial color="#f8f9fa" roughness={0.8} />
          </mesh>
          <mesh position={[0.35, -0.5, 0]} castShadow>
            <boxGeometry args={[0.05, 2.1, 0.05]} />
            <meshStandardMaterial color="#f8f9fa" roughness={0.8} />
          </mesh>
          {/* Cream Rollers */}
          <mesh position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.7, 32]} />
            <meshStandardMaterial color="#d2b48c" roughness={0.6} />
          </mesh>
          <mesh position={[0, -1.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.7, 32]} />
            <meshStandardMaterial color="#d2b48c" roughness={0.6} />
          </mesh>
          {/* The Mesh Surface */}
          <mesh position={[0, -0.5, 0]} receiveShadow>
            <planeGeometry args={[0.68, 2.0]} />
            <meshStandardMaterial color="#aaaaaa" transparent opacity={0.6} roughness={0.9} />
          </mesh>
          {/* Wireframe weave */}
          <mesh position={[0, -0.5, 0.001]}>
             <planeGeometry args={[0.68, 2.0, 20, 50]} />
             <meshStandardMaterial color="#555555" wireframe={true} transparent opacity={0.3} roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Black Tape Strips */}
          <mesh position={[-0.15, -0.5, 0.002]}>
             <planeGeometry args={[0.03, 2.0]} />
             <meshStandardMaterial color="#111111" roughness={0.8} metalness={0} />
          </mesh>
          <mesh position={[0.15, -0.5, 0.002]}>
             <planeGeometry args={[0.03, 2.0]} />
             <meshStandardMaterial color="#111111" roughness={0.8} metalness={0} />
          </mesh>
          {/* Conveyor Cleats for steeper incline */}
          {Array.from({ length: 20 }).map((_, i) => (
            <mesh key={i} position={[0, -1.45 + i * 0.1, 0.01]} castShadow>
              <boxGeometry args={[0.66, 0.015, 0.02]} />
              <meshStandardMaterial color="#111111" roughness={0.8} metalness={0} />
            </mesh>
          ))}
          {/* Yellow DC Motors at top near hinge */}
          <mesh position={[-0.42, 0.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
             <boxGeometry args={[0.08, 0.1, 0.08]} />
             <meshStandardMaterial color="#eab308" roughness={0.4} />
          </mesh>
          <mesh position={[0.42, 0.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
             <boxGeometry args={[0.08, 0.1, 0.08]} />
             <meshStandardMaterial color="#eab308" roughness={0.4} />
          </mesh>
        </group>
      </RobotPart>

      """
    
    robot_content = robot_content.replace(old_ramp_block, new_ramp_block)
    
    with open(robot_path, "w", encoding="utf-8") as f:
        f.write(robot_content)
    print("Ramp successfully updated to pivot at chassis mount and extend downwards.")
else:
    print("Could not find boundaries.")

import re

robot_path = r"C:\Users\Admin\OneDrive\Desktop\CERTIFICATES\project\robotics water cleaning full document\robotics-website\src\three\RobotModel.jsx"
with open(robot_path, "r", encoding="utf-8") as f:
    robot_content = f.read()

climbing_debris_code = """
function ClimbingDebris({ debris, progress }) {
  if (!debris) return null;
  
  // Progress goes from 0 to 1
  // Ramp goes from y=-1.45 to y=0.45
  const yPos = -1.45 + progress * 1.9;
  const color = debris.type === 'bottle' ? '#2DD4BF' : debris.type === 'leaf' ? '#14b8a6' : '#F5A623';
  
  const scale = progress > 0.8 ? Math.max(0, 1 - (progress - 0.8) * 5) : 1;
  const showLabel = progress < 0.8;

  return (
    <group position={[0, yPos, 0.05]} scale={scale}>
      <mesh castShadow receiveShadow>
        {debris.type === 'bottle' ? <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} /> : <boxGeometry args={[0.1, 0.02, 0.1]} />}
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </mesh>
      
      {showLabel && (
         <Html position={[0, 0.3, 0]} center zIndexRange={[100, 0]}>
           <div className="bg-marine/80 text-secondary border border-secondary px-3 py-1.5 rounded-sm font-mono text-[10px] uppercase tracking-widest whitespace-nowrap backdrop-blur shadow-[0_0_15px_rgba(245,166,35,0.3)]">
             Target [0.98]
           </div>
         </Html>
      )}
    </group>
  );
}
"""

if "function ClimbingDebris" not in robot_content:
    robot_content = climbing_debris_code + robot_content

# Add state to RobotModel
if "const { collectingDebris, collectProgress }" not in robot_content:
    robot_content = robot_content.replace(
        "const { inclineAngle, explodedView, transparentChassis } = useStore()",
        "const { inclineAngle, explodedView, transparentChassis, collectingDebris, collectProgress } = useStore()"
    )

# Add ClimbingDebris to the Ramp Group
if "<ClimbingDebris" not in robot_content:
    ramp_target = "{/* Conveyor Cleats for steeper incline */}"
    ramp_replacement = """<ClimbingDebris debris={collectingDebris} progress={collectProgress} />
          {/* Conveyor Cleats for steeper incline */}"""
    robot_content = robot_content.replace(ramp_target, ramp_replacement)

with open(robot_path, "w", encoding="utf-8") as f:
    f.write(robot_content)

print("Updated RobotModel.jsx with ClimbingDebris")

import re

# 1. Update Scene.jsx to remove the old static labels
scene_path = r"C:\Users\Admin\OneDrive\Desktop\CERTIFICATES\project\robotics water cleaning full document\robotics-website\src\three\Scene.jsx"
with open(scene_path, "r", encoding="utf-8") as f:
    scene_content = f.read()

# Find and remove the Html block in WasteItem
html_block = """        {isTarget && (
           <Html position={[0, 0.3, 0]} center>
             <div className="bg-marine/80 text-secondary border border-secondary px-3 py-1.5 rounded-sm font-mono text-[10px] uppercase tracking-widest whitespace-nowrap backdrop-blur shadow-[0_0_15px_rgba(245,166,35,0.3)]">
               Target [0.98]
             </div>
           </Html>
        )}"""

if html_block in scene_content:
    scene_content = scene_content.replace(html_block, "")
    with open(scene_path, "w", encoding="utf-8") as f:
        f.write(scene_content)
    print("Removed old static TARGET labels from Scene.jsx")
else:
    print("Could not find the Html block in Scene.jsx to remove.")

# 2. Update RobotModel.jsx to add ConveyorTarget
robot_path = r"C:\Users\Admin\OneDrive\Desktop\CERTIFICATES\project\robotics water cleaning full document\robotics-website\src\three\RobotModel.jsx"
with open(robot_path, "r", encoding="utf-8") as f:
    robot_content = f.read()

# Create the ConveyorTarget component
conveyor_target_code = """
// Animated target marker that moves along the conveyor belt
function ConveyorTarget({ offset = 0, speed = 0.2 }) {
  const ref = useRef()
  const { isRunning } = useStore()
  
  useFrame((state) => {
    if (ref.current && isRunning) {
      // Loop between -1.45 (bottom) and 0.45 (top)
      const t = (state.clock.elapsedTime * speed + offset) % 1;
      ref.current.position.y = -1.45 + (t * 1.9);
      
      // Optional: slight scale effect when popping in/out to avoid sudden clipping
      const scale = Math.sin(t * Math.PI) > 0.1 ? 1 : Math.sin(t * Math.PI) * 10;
      ref.current.scale.setScalar(Math.max(0, Math.min(1, scale)));
    }
  })

  return (
    <group ref={ref} position={[0, -1.45, 0.05]}>
      <Html position={[0, 0, 0]} center zIndexRange={[100, 0]}>
         <div className="bg-marine/80 text-secondary border border-secondary px-3 py-1.5 rounded-sm font-mono text-[10px] uppercase tracking-widest whitespace-nowrap backdrop-blur shadow-[0_0_15px_rgba(245,166,35,0.3)]">
           Target [0.98]
         </div>
      </Html>
    </group>
  )
}

// A reusable component part that can be clicked and exploded
"""

if "function ConveyorTarget" not in robot_content:
    robot_content = robot_content.replace(
        "// A reusable component part that can be clicked and exploded",
        conveyor_target_code
    )

# Inject them into the Mesh Collection Ramp group
if "<ConveyorTarget" not in robot_content:
    ramp_target = """{/* Conveyor Cleats for steeper incline */}"""
    ramp_replacement = """{/* Animated Target Markers on the belt */}
          <ConveyorTarget offset={0.1} speed={0.15} />
          <ConveyorTarget offset={0.5} speed={0.15} />
          <ConveyorTarget offset={0.85} speed={0.15} />
          
          {/* Conveyor Cleats for steeper incline */}"""
    
    robot_content = robot_content.replace(ramp_target, ramp_replacement)
    
    with open(robot_path, "w", encoding="utf-8") as f:
        f.write(robot_content)
    print("Added ConveyorTarget markers to RobotModel.jsx")
else:
    print("ConveyorTarget already exists in RobotModel.jsx")

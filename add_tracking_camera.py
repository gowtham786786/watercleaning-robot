import re

scene_path = r"C:\Users\Admin\OneDrive\Desktop\CERTIFICATES\project\robotics water cleaning full document\robotics-website\src\three\Scene.jsx"
with open(scene_path, "r", encoding="utf-8") as f:
    scene_content = f.read()

tracking_controls_code = """
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
"""

if "function TrackingControls()" not in scene_content:
    scene_content = scene_content.replace("export default function Scene() {", tracking_controls_code + "\nexport default function Scene() {")

# Replace OrbitControls in Scene
orbit_target = re.search(r"<OrbitControls\s*makeDefault.*?autoRotate=\{false\}\s*/>", scene_content, re.DOTALL)
if orbit_target:
    scene_content = scene_content.replace(orbit_target.group(0), "<TrackingControls />")

# Update RobotRig to add name="robotRig" to the group so getObjectByName works
rig_start = re.search(r"return \(\s*<group ref=\{ref\}>", scene_content)
if rig_start:
    scene_content = scene_content.replace(rig_start.group(0), "return (\n    <group ref={ref} name=\"robotRig\">")

with open(scene_path, "w", encoding="utf-8") as f:
    f.write(scene_content)
    
print("Added TrackingControls and fixed OrbitControls replacement.")

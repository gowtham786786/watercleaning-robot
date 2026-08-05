import re

scene_path = r"C:\Users\Admin\OneDrive\Desktop\CERTIFICATES\project\robotics water cleaning full document\robotics-website\src\three\Scene.jsx"
with open(scene_path, "r", encoding="utf-8") as f:
    scene_content = f.read()

waste_item_code = """
// Static waste object floating in the water
function WasteItem({ debris }) {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.set(
        debris.position[0], 
        debris.position[1] + Math.sin(state.clock.elapsedTime * 2 + debris.id) * 0.05, 
        debris.position[2]
      )
    }
  })
  const color = debris.type === 'bottle' ? '#2DD4BF' : debris.type === 'leaf' ? '#14b8a6' : '#F5A623'
  return (
    <group ref={ref}>
      <Float speed={2} rotationIntensity={1} floatIntensity={0}>
        <mesh castShadow receiveShadow>
          {debris.type === 'bottle' ? <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} /> : <boxGeometry args={[0.1, 0.02, 0.1]} />}
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
        </mesh>
      </Float>
    </group>
  )
}
"""

robot_rig_code = """
function RobotRig() {
  const ref = useRef()
  const { debrisList, removeDebris, spawnDebris, setCollectingDebris, setCollectProgress, setSimulationState, isRunning } = useStore()
  
  const [navState, setNavState] = React.useState('IDLE') // IDLE, NAVIGATING, COLLECTING
  const [targetId, setTargetId] = React.useState(null)
  
  // Navigation variables
  const robotPos = useRef(new THREE.Vector3(0, 0, 0))
  const robotRotY = useRef(0)
  const collectionTimer = useRef(0)
  
  useFrame((state, delta) => {
    if (!ref.current || !isRunning) return
    
    const time = state.clock.elapsedTime
    
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
      
      // Target reached (distance < 1.5 since ramp sticks out by 1.4)
      if (dist < 1.5) {
        setNavState('COLLECTING')
        collectionTimer.current = 0
        setCollectingDebris(target)
        removeDebris(target.id)
        setSimulationState({ systemStatus: 'Moving' })
        return
      }
      
      // Move towards target
      const speed = 0.5 * delta
      robotPos.current.x += (dx / dist) * speed
      robotPos.current.z += (dz / dist) * speed
      
      // Rotate towards target (smoothly)
      const targetAngle = Math.atan2(dx, dz)
      const angleDiff = targetAngle - robotRotY.current
      const normalizedDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff))
      robotRotY.current += normalizedDiff * 3 * delta
      
      ref.current.position.set(robotPos.current.x, Math.sin(time * 2) * 0.02, robotPos.current.z)
      ref.current.rotation.set(Math.sin(time * 1.5) * 0.01, robotRotY.current, Math.sin(time) * 0.02)
      
    } else if (navState === 'COLLECTING') {
      collectionTimer.current += delta
      const progress = collectionTimer.current / 3.0 // 3 seconds to collect
      
      if (progress <= 1.0) {
        setCollectProgress(progress)
        if (progress > 0.8 && progress < 0.85) setSimulationState({ systemStatus: 'Collecting', wasteDetected: false })
      } else {
        setCollectingDebris(null)
        setCollectProgress(0)
        spawnDebris()
        setNavState('IDLE')
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
    </group>
  )
}
"""

tracking_controls_code = """
function TrackingControls() {
  const { cinematicMode } = useStore()
  const controlsRef = useRef()
  
  useFrame((state) => {
    if (controlsRef.current) {
      const robot = state.scene.getObjectByName('robotRig')
      if (robot) {
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
      minDistance={2}
      maxDistance={6}
      autoRotate={cinematicMode}
      autoRotateSpeed={0.5}
    />
  )
}
"""

# 1. Replace WasteItem
old_waste = re.search(r"// Waste Object that drifts towards the robot.*?return \(\s*<group.*?</group>\s*\)\s*}\s*", scene_content, re.DOTALL)
if old_waste:
    scene_content = scene_content.replace(old_waste.group(0), waste_item_code)

# 2. Replace RobotRig
old_rig = re.search(r"function RobotRig\(\).*?return \(\s*<group ref=\{ref\}>\s*<RobotModel \/>\s*<\/group>\s*\)\s*}\s*", scene_content, re.DOTALL)
if old_rig:
    scene_content = scene_content.replace(old_rig.group(0), robot_rig_code)

# 3. Replace OrbitControls with TrackingControls
if "function TrackingControls()" not in scene_content:
    scene_content = scene_content.replace("export function Scene() {", tracking_controls_code + "\\nexport function Scene() {")
    
orbit_pattern = re.search(r"<OrbitControls[^>]*\/>", scene_content, re.DOTALL)
if orbit_pattern:
    scene_content = scene_content.replace(orbit_pattern.group(0), "<TrackingControls />")

# 4. Update the instances inside Scene()
# Remove old <WasteItem> instances
scene_content = re.sub(r"<WasteItem [^\n]*\n?", "", scene_content)

# Add debrisList mapping
if "debrisList.map" not in scene_content:
    scene_content = scene_content.replace("const { nightMode, explodedView } = useStore()", "const { nightMode, explodedView, debrisList } = useStore()")
    
    ground_shadow = '{/* Subtle ground shadow to visually ground the model */}'
    new_instances = """{/* Debris mapping */}
      {debrisList && debrisList.map(d => (
        <WasteItem key={d.id} debris={d} />
      ))}
      """ + ground_shadow
    scene_content = scene_content.replace(ground_shadow, new_instances)

with open(scene_path, "w", encoding="utf-8") as f:
    f.write(scene_content)
print("Updated Scene.jsx for navigation")

import re

scene_path = r"C:\Users\Admin\OneDrive\Desktop\CERTIFICATES\project\robotics water cleaning full document\robotics-website\src\three\Scene.jsx"
with open(scene_path, "r", encoding="utf-8") as f:
    scene_content = f.read()

robot_rig_code = """
function RobotRig() {
  const ref = useRef()
  const { debrisList, removeDebris, spawnDebris, setCollectingDebris, setCollectProgress, setSimulationState, isRunning, inclineAngle } = useStore()
  
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
    <group ref={ref}>
      <RobotModel />
      
      {/* 3D Blueprint Callouts attached to the Robot */}
      <Html position={[0.7, 0, 0]} center>
        <div className="pointer-events-none transform -translate-x-1/2 -translate-y-1/2 scale-75 opacity-70">
           <BlueprintCallout label="Width" value="41" unit="cm" />
        </div>
      </Html>
      <Html position={[0, 0.6, -0.6]} center>
        <div className="pointer-events-none transform -translate-x-1/2 -translate-y-1/2 scale-75 opacity-70">
           <BlueprintCallout label="Height" value="34" unit="cm" />
        </div>
      </Html>
      <Html position={[0, 0, 0.9]} center>
        <div className="pointer-events-none transform -translate-x-1/2 -translate-y-1/2 scale-75 opacity-70">
           <BlueprintCallout label="Length" value="88" unit="cm" />
        </div>
      </Html>
      <Html position={[0, 0.5, 0.8]} center>
        <div className="pointer-events-none transform -translate-x-1/2 -translate-y-1/2 scale-75 opacity-70">
           <BlueprintCallout label="Incline" value={inclineAngle} unit="°" />
        </div>
      </Html>
    </group>
  )
}
"""

old_rig = re.search(r"function RobotRig\(\).*?return \(\s*<group ref=\{ref\}>\s*<RobotModel \/>.*?<\/group>\s*\)\s*}\s*", scene_content, re.DOTALL)

if old_rig:
    scene_content = scene_content.replace(old_rig.group(0), robot_rig_code)
    with open(scene_path, "w", encoding="utf-8") as f:
        f.write(scene_content)
    print("Successfully replaced RobotRig!")
else:
    print("Failed to match RobotRig.")

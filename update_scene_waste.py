import re

scene_path = r"C:\Users\Admin\OneDrive\Desktop\CERTIFICATES\project\robotics water cleaning full document\robotics-website\src\three\Scene.jsx"
with open(scene_path, "r", encoding="utf-8") as f:
    scene_content = f.read()

# Replace WasteItem definition
old_waste = re.search(r"// Waste Object that drifts towards the robot.*?return \(\s*<group.*?</group>\s*\)\s*}\s*", scene_content, re.DOTALL)

new_waste = """// Waste Object that drifts towards the robot with independent autonomous lifecycles
function WasteItem({ initialPosition, type, offset = 0 }) {
  const ref = useRef()
  const { setSimulationState, isRunning } = useStore()
  const startPos = useMemo(() => new THREE.Vector3(...initialPosition), [initialPosition])
  
  // Ramp coordinates (25 degree incline, 2.0 length, pivot at [0, 0.15, 0.85])
  const basePos = useMemo(() => new THREE.Vector3(0, -0.48, 2.21), [])
  const topPos = useMemo(() => new THREE.Vector3(0, 0.36, 0.40), [])
  const binPos = useMemo(() => new THREE.Vector3(0, 0.35, -0.45), [])
  
  const [showLabel, setShowLabel] = React.useState(false)

  const cycleDuration = 15 // seconds
  
  useFrame((state, delta) => {
    if (!ref.current || !isRunning) return
    
    // Calculate local time in the cycle
    const t = (state.clock.elapsedTime + offset) % cycleDuration
    
    // Label visibility threshold
    if (t >= 5 && t < 12) {
      if (!showLabel) setShowLabel(true)
    } else {
      if (showLabel) setShowLabel(false)
    }
    
    // State machine based on time 't'
    if (t < 5) {
      // 1. Drifting in water
      ref.current.position.set(startPos.x, startPos.y + Math.sin(t * 2) * 0.05, startPos.z)
      ref.current.scale.setScalar(1)
    } 
    else if (t >= 5 && t < 7) {
      // 2. Approach: detected, moving to base of ramp
      const progress = (t - 5) / 2
      ref.current.position.lerpVectors(startPos, basePos, progress)
      
      if (t > 5.0 && t < 5.1) setSimulationState({ systemStatus: 'Scanning', wasteDetected: true })
    }
    else if (t >= 7 && t < 12) {
      // 3. Climbing: moving up the ramp
      const progress = (t - 7) / 5
      ref.current.position.lerpVectors(basePos, topPos, progress)
      
      if (t > 7.0 && t < 7.1) setSimulationState({ systemStatus: 'Moving' })
    }
    else if (t >= 12 && t < 13) {
      // 4. Dropping into bin
      const progress = (t - 12) / 1
      ref.current.position.lerpVectors(topPos, binPos, progress)
      
      // Scale down to disappear into bin
      ref.current.scale.setScalar(1 - progress)
      
      if (t > 12.0 && t < 12.1) setSimulationState({ systemStatus: 'Collecting', wasteDetected: false })
    }
    else {
      // 5. Hidden, resetting
      ref.current.scale.setScalar(0)
    }
  })
  
  const color = type === 'bottle' ? '#2DD4BF' : type === 'leaf' ? '#14b8a6' : '#F5A623'
  
  return (
    <group ref={ref} position={initialPosition}>
      <Float speed={2} rotationIntensity={1} floatIntensity={0}>
        <mesh castShadow receiveShadow>
          {type === 'bottle' ? <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} /> : <boxGeometry args={[0.1, 0.02, 0.1]} />}
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
        </mesh>
        
        {showLabel && (
           <Html position={[0, 0.3, 0]} center zIndexRange={[100, 0]}>
             <div className="bg-marine/80 text-secondary border border-secondary px-3 py-1.5 rounded-sm font-mono text-[10px] uppercase tracking-widest whitespace-nowrap backdrop-blur shadow-[0_0_15px_rgba(245,166,35,0.3)]">
               Target [0.98]
             </div>
           </Html>
        )}
      </Float>
    </group>
  )
}
"""

if old_waste:
    scene_content = scene_content.replace(old_waste.group(0), new_waste)

# Replace WasteItem instances
old_instances = """      <WasteItem initialPosition={[1.5, 0, 2]} type="bottle" />
      <WasteItem initialPosition={[-2, 0, 3]} type="leaf" />"""

new_instances = """      <WasteItem initialPosition={[1.5, -0.2, 2.5]} type="bottle" offset={0} />
      <WasteItem initialPosition={[-1.2, -0.2, 3]} type="leaf" offset={5} />
      <WasteItem initialPosition={[0.8, -0.2, 3.5]} type="bottle" offset={10} />"""

scene_content = scene_content.replace(old_instances, new_instances)

with open(scene_path, "w", encoding="utf-8") as f:
    f.write(scene_content)

print("WasteItem updated in Scene.jsx")

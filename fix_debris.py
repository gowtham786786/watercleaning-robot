import re

# 1. Update useStore.js
store_path = r"C:\Users\Admin\OneDrive\Desktop\CERTIFICATES\project\robotics water cleaning full document\robotics-website\src\store\useStore.js"
with open(store_path, "r", encoding="utf-8") as f:
    store_content = f.read()

store_content = re.sub(r"position: \[\s*2\.0,\s*-0\.2,\s*3\.5\s*\]", "position: [1.2, -0.2, 2.8]", store_content)
store_content = re.sub(r"position: \[\s*-1\.5,\s*-0\.2,\s*2\.8\s*\]", "position: [-1.2, -0.2, 2.5]", store_content)
# Update spawn boundary to be closer (x: -1.5 to 1.5, z: 2.5 to 4.5)
store_content = re.sub(r"position: \[\(Math\.random\(\) - 0\.5\) \* 6, -0\.2, \(Math\.random\(\) \* 3\) \+ 2\]", "position: [(Math.random() - 0.5) * 3, -0.2, (Math.random() * 2) + 2.5]", store_content)

with open(store_path, "w", encoding="utf-8") as f:
    f.write(store_content)


# 2. Update Scene.jsx to add TARGET label back to WasteItem
scene_path = r"C:\Users\Admin\OneDrive\Desktop\CERTIFICATES\project\robotics water cleaning full document\robotics-website\src\three\Scene.jsx"
with open(scene_path, "r", encoding="utf-8") as f:
    scene_content = f.read()

target_label = """        <mesh castShadow receiveShadow>
          {debris.type === 'bottle' ? <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} /> : <boxGeometry args={[0.1, 0.02, 0.1]} />}
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
        </mesh>
        
        <Html position={[0, 0.3, 0]} center zIndexRange={[100, 0]}>
           <div className="bg-marine/80 text-secondary border border-secondary px-3 py-1.5 rounded-sm font-mono text-[10px] uppercase tracking-widest whitespace-nowrap backdrop-blur shadow-[0_0_15px_rgba(245,166,35,0.3)]">
             Target [0.98]
           </div>
        </Html>"""

# Replace in WasteItem
waste_target = r"<mesh castShadow receiveShadow>.*?<\/mesh>"
# Only replace the FIRST occurrence (in WasteItem)
scene_content = re.sub(waste_target, target_label, scene_content, count=1, flags=re.DOTALL)

with open(scene_path, "w", encoding="utf-8") as f:
    f.write(scene_content)
    
print("Updated debris spawn locations and added target label.")

import re

# 1. Update useStore.js
store_path = r"C:\Users\Admin\OneDrive\Desktop\CERTIFICATES\project\robotics water cleaning full document\robotics-website\src\store\useStore.js"
with open(store_path, "r", encoding="utf-8") as f:
    store_content = f.read()

old_debris = """  debrisList: [
    { id: 1, position: [1.5, -0.2, 2.5], type: 'bottle' },
    { id: 2, position: [-2.0, -0.2, 3.0], type: 'leaf' },
    { id: 3, position: [0.8, -0.2, 4.0], type: 'bottle' }
  ],
  removeDebris: (id) => set((state) => ({ debrisList: state.debrisList.filter(d => d.id !== id) })),
  spawnDebris: () => set((state) => {
    const types = ['bottle', 'leaf', 'bottle'];
    const r = Math.random() * 4 + 2; // distance between 2 and 6
    const theta = Math.random() * Math.PI * 2;
    const newDebris = {
      id: Date.now() + Math.random(),
      position: [r * Math.cos(theta), -0.2, r * Math.sin(theta)],
      type: types[Math.floor(Math.random() * types.length)]
    };
    return { debrisList: [...state.debrisList, newDebris] };
  }),"""

new_debris = """  debrisList: [
    { id: 1, position: [2.0, -0.2, 3.5], type: 'bottle' },
    { id: 2, position: [-1.5, -0.2, 2.8], type: 'bottle' }
  ],
  removeDebris: (id) => set((state) => ({ debrisList: state.debrisList.filter(d => d.id !== id) })),
  spawnDebris: () => set((state) => {
    // Only spawn when both are collected
    if (state.debrisList.length > 0) return state;
    
    // Spawn 2 new bottles in the visible front area (x: -3 to 3, z: 2 to 5)
    const newDebris = Array.from({ length: 2 }).map((_, i) => ({
      id: Date.now() + i,
      position: [(Math.random() - 0.5) * 6, -0.2, (Math.random() * 3) + 2],
      type: 'bottle'
    }));
    return { debrisList: newDebris };
  }),"""

if old_debris in store_content:
    store_content = store_content.replace(old_debris, new_debris)
    with open(store_path, "w", encoding="utf-8") as f:
        f.write(store_content)
    print("Updated useStore.js to strictly 2 bottles and batch respawning")
else:
    print("Could not find exact debris string in useStore.js. Falling back to regex.")
    # More robust replacement
    store_content = re.sub(r"debrisList: \[\s*\{.*?\}\s*],\s*removeDebris:.*?spawnDebris: \(\) => set\(\(state\) => \{.*?return \{ debrisList: \[\.\.\.state\.debrisList, newDebris\] \};\s*\}\),", new_debris, store_content, flags=re.DOTALL)
    with open(store_path, "w", encoding="utf-8") as f:
        f.write(store_content)

# 2. Update Scene.jsx to remove TrackingControls and restore OrbitControls
scene_path = r"C:\Users\Admin\OneDrive\Desktop\CERTIFICATES\project\robotics water cleaning full document\robotics-website\src\three\Scene.jsx"
with open(scene_path, "r", encoding="utf-8") as f:
    scene_content = f.read()

# Remove TrackingControls definition
scene_content = re.sub(r"function TrackingControls\(\).*?return \(\s*<OrbitControls[^>]*\/>\s*\)\s*}\s*", "", scene_content, flags=re.DOTALL)

# Replace <TrackingControls /> with original OrbitControls
orbit_controls = """<OrbitControls 
        makeDefault
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2 - 0.1}
        minDistance={2}
        maxDistance={6}
        autoRotate={false}
      />"""

scene_content = scene_content.replace("<TrackingControls />", orbit_controls)

with open(scene_path, "w", encoding="utf-8") as f:
    f.write(scene_content)
print("Restored fixed framing OrbitControls in Scene.jsx")

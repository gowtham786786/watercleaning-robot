import re

# 1. Update useStore.js
store_path = r"C:\Users\Admin\OneDrive\Desktop\CERTIFICATES\project\robotics water cleaning full document\robotics-website\src\store\useStore.js"
with open(store_path, "r", encoding="utf-8") as f:
    store_content = f.read()

missing_state = """  isRunning: true,
  collectingDebris: null,
  setCollectingDebris: (debris) => set({ collectingDebris: debris }),
  collectProgress: 0,
  setCollectProgress: (p) => set({ collectProgress: p }),"""

store_content = store_content.replace("  isRunning: true,", missing_state)

with open(store_path, "w", encoding="utf-8") as f:
    f.write(store_content)


# 2. Update Scene.jsx HTML labels
scene_path = r"C:\Users\Admin\OneDrive\Desktop\CERTIFICATES\project\robotics water cleaning full document\robotics-website\src\three\Scene.jsx"
with open(scene_path, "r", encoding="utf-8") as f:
    scene_content = f.read()

old_labels = """      {/* 3D Blueprint Callouts attached to the Robot */}
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
      </Html>"""

new_labels = """      {/* 3D Blueprint Callouts attached to the Robot */}
      <Html position={[1.5, 0.5, 0]} center>
        <div className="pointer-events-none transform scale-75 opacity-80 bg-marine/40 backdrop-blur-sm p-2 rounded-lg border border-cyan-500/30">
           <BlueprintCallout label="Width" value="41" unit="cm" />
        </div>
      </Html>
      <Html position={[-1.5, 0.5, 0]} center>
        <div className="pointer-events-none transform scale-75 opacity-80 bg-marine/40 backdrop-blur-sm p-2 rounded-lg border border-cyan-500/30">
           <BlueprintCallout label="Height" value="34" unit="cm" />
        </div>
      </Html>
      <Html position={[0, 0.5, 2.0]} center>
        <div className="pointer-events-none transform scale-75 opacity-80 bg-marine/40 backdrop-blur-sm p-2 rounded-lg border border-cyan-500/30">
           <BlueprintCallout label="Length" value="88" unit="cm" />
        </div>
      </Html>
      <Html position={[0, 0.8, -2.0]} center>
        <div className="pointer-events-none transform scale-75 opacity-80 bg-marine/40 backdrop-blur-sm p-2 rounded-lg border border-cyan-500/30">
           <BlueprintCallout label="Incline" value={inclineAngle} unit="°" />
        </div>
      </Html>"""

scene_content = scene_content.replace(old_labels, new_labels)

with open(scene_path, "w", encoding="utf-8") as f:
    f.write(scene_content)
    
print("Updated store and scene labels.")

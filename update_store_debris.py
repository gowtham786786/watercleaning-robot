import re

store_path = r"C:\Users\Admin\OneDrive\Desktop\CERTIFICATES\project\robotics water cleaning full document\robotics-website\src\store\useStore.js"
with open(store_path, "r", encoding="utf-8") as f:
    store_content = f.read()

# Add debris list and actions
debris_code = """  debrisList: [
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
  }),
  
  collectingDebris: null,
  setCollectingDebris: (debris) => set({ collectingDebris: debris }),
  collectProgress: 0,
  setCollectProgress: (val) => set({ collectProgress: val }),
"""

# Insert before // Simulation State
target = "  // Simulation State"
if target in store_content and "debrisList" not in store_content:
    store_content = store_content.replace(target, debris_code + "\n" + target)
    with open(store_path, "w", encoding="utf-8") as f:
        f.write(store_content)
    print("Successfully updated useStore.js with debris navigation state")
else:
    print("Could not find insertion point or already updated")

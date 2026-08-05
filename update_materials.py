import re

file_path = r"C:\Users\Admin\OneDrive\Desktop\CERTIFICATES\project\robotics water cleaning full document\robotics-website\src\three\RobotModel.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Plastic tub: roughness={0.2} metalness={0.1} -> roughness={0.6} metalness={0}
content = content.replace("roughness={0.2} \n            metalness={0.1}", "roughness={0.6} \n            metalness={0}")
content = content.replace("roughness={0.2} \n            metalness={0.1}", "roughness={0.6} \n            metalness={0}")
# Let's use regex for safer replacement
content = re.sub(r'roughness={0\.2}\s*metalness={0\.1}', 'roughness={0.6} metalness={0}', content)

# 2. PVC floats: roughness={0.3} metalness={0.1} -> roughness={0.6} metalness={0}
content = content.replace("roughness={0.3} metalness={0.1}", "roughness={0.6} metalness={0}")

# 3. Basic materials -> Standard materials
# Wireframe weave
content = content.replace('<meshBasicMaterial color="#555555" wireframe={true} transparent opacity={0.3} />', '<meshStandardMaterial color="#555555" wireframe={true} transparent opacity={0.3} roughness={0.3} metalness={0.8} />')

# Black Tape Strips
content = content.replace('<meshBasicMaterial color="#111111" />', '<meshStandardMaterial color="#111111" roughness={0.8} metalness={0} />')

# 4. Battery cells (metal)
content = content.replace('roughness={0.3} metalness={0.6}', 'roughness={0.3} metalness={0.8}')

# 5. Aluminum eyes / USB blocks (metal)
content = content.replace('metalness={0.9} roughness={0.2}', 'metalness={0.8} roughness={0.3}')
content = content.replace('roughness={0.2} metalness={0.9}', 'roughness={0.3} metalness={0.8}')

# 6. ESP32 Chip (metalness 0.8) -> add roughness 0.3
content = content.replace('metalness={0.8} />', 'metalness={0.8} roughness={0.3} />')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Materials updated in RobotModel.jsx")

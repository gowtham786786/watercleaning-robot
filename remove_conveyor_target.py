import re

robot_path = r"C:\Users\Admin\OneDrive\Desktop\CERTIFICATES\project\robotics water cleaning full document\robotics-website\src\three\RobotModel.jsx"
with open(robot_path, "r", encoding="utf-8") as f:
    robot_content = f.read()

# Remove the ConveyorTarget function definition
func_pattern = re.compile(r"// Animated target marker that moves along the conveyor belt.*?function ConveyorTarget.*?return \(\s*<group.*?</group>\s*\)\s*}\s*", re.DOTALL)
robot_content = func_pattern.sub("", robot_content)

# Remove the ConveyorTarget instances from the Ramp group
instances_pattern = re.compile(r"\{\/\* Animated Target Markers on the belt \*\/}.*?(?=\{\/\* Conveyor Cleats)", re.DOTALL)
robot_content = instances_pattern.sub("", robot_content)

with open(robot_path, "w", encoding="utf-8") as f:
    f.write(robot_content)

print("Removed ConveyorTarget from RobotModel.jsx")

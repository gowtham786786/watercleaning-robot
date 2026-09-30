export const WORKFLOW_NODES = [
  {
    id: 'power_bank',
    name: 'Dedicated Compute Power Bank',
    label: 'Power bank (5V to 12.5V)',
    category: 'Power Subsystem',
    role: 'Isolated High-Stability Compute & Vision Power Supply',
    iconName: 'BatteryCharging',
    coords: { cx: 15.04, cy: 7.84, r: 8.5 },
    color: '#F59E0B',
    whatItDoes: 'Supplies clean, isolated, and surge-protected DC power dedicated strictly to the Raspberry Pi 4 microcomputer and vision camera. By isolating compute power from motor actuators, it eliminates brownouts and inductive back-EMF voltage spikes caused by heavy motor start/stops that could otherwise crash the central Linux operating system.',
    keyFeatures: [
      'Galvanically isolated ground bus to prevent motor noise interference',
      'Dedicated 5.1V / 3.1A rail with micro-surge dampening',
      'Provides steady power during aggressive thruster and conveyor accelerations',
      'Integrated battery telemetry fuel gauge reporting state of charge'
    ],
    specs: {
      'Operating Voltage': '5.1V regulated (supports 5.0V – 12.5V input rails)',
      'Capacity & Chemistry': '20,000 mAh Li-Polymer high-energy density cells',
      'Continuous Output': '3.1A continuous over low-resistance USB-C bus',
      'Protection Circuits': 'Over-current, over-voltage, short-circuit, and thermal cutoff',
      'Safety Isolation': 'Separated from 12V motor battery to stop ground loops'
    },
    workflowRole: 'Powers the central brain and camera before mission initiation. Continuously monitors supply health to signal low-battery return-to-base protocols.',
    upstream: 'External charging dock / onboard solar top-up array',
    downstream: 'Raspberry Pi 4 (5V/3A USB-C line)'
  },
  {
    id: 'rpi4',
    name: 'Raspberry Pi 4 Model B',
    label: 'Raspberry Pi 4 (Main controller & camera vision)',
    category: 'Central Processing & AI Vision',
    role: 'Autonomous Navigation Planner & Neural Vision Processor',
    iconName: 'Cpu',
    coords: { cx: 50.00, cy: 7.84, r: 10.5 },
    color: '#10B981',
    whatItDoes: 'Acts as the central cognitive brain of the autonomous cleaning robot. Runs high-level path planning, autonomous lawnmower coverage algorithms, and real-time computer vision inference (YOLOv8-nano / OpenCV) to recognize surface debris (plastic bottles, wrappers, cans, organics) and evaluate navigation clearance. Sends compact command vectors down to the ESP32 via high-speed UART.',
    keyFeatures: [
      'Executes YOLOv8-nano neural vision model at 18-22 FPS for debris classification',
      'Generates optimal vector trajectories to intercept floating debris clusters',
      'Calculates water surface cleaning coverage and maps cleaned zones',
      'Transmits real-time operational telemetry and camera streams to dashboard',
      'Issues motor steering & sorting gate commands to the ESP32 coprocessor'
    ],
    specs: {
      'SoC Processor': 'Broadcom BCM2711, Quad-core Cortex-A72 (ARM v8) 64-bit @ 1.5GHz',
      'System RAM': '4GB / 8GB LPDDR4-3200 SDRAM',
      'Inter-Chip Bus': 'High-speed UART serial link to ESP32 @ 115,200 baud',
      'Bus Latency': '8.2 ms average latency with 99.2% packet reliability',
      'Camera Interface': 'MIPI CSI-2 2-lane camera serial bus (zero CPU video capture)',
      'Network Uplink': 'Dual-band 802.11ac Wi-Fi / 4G cellular IoT telemetry'
    },
    workflowRole: 'Receives video frames from the camera, classifies debris types, calculates optimal interception vectors, and transmits motion commands and sorting decisions to the ESP32.',
    upstream: 'Camera Module (CSI-2 bus), Dedicated Power Bank (5V/3A)',
    downstream: 'ESP32 Microcontroller (Bidirectional UART serial link)'
  },
  {
    id: 'esp32',
    name: 'ESP32 Microcontroller Dev Kit',
    label: 'ESP32 (Motor & sensor hub)',
    category: 'Real-Time Embedded Controller',
    role: 'Low-Level Real-Time I/O & Deterministic Motor Hub',
    iconName: 'Microchip',
    coords: { cx: 49.87, cy: 23.92, r: 10.0 },
    color: '#0284C7',
    whatItDoes: 'Serves as the real-time hardware executive of the vessel. Runs deterministic FreeRTOS tasks to poll ultrasonic sensors every 50ms, manage metal detection interrupts, generate precision hardware PWM waveforms for 4 DC motors and the sorting servo, and execute closed-loop safety reflexes if an obstacle breaches the 50cm safety perimeter.',
    keyFeatures: [
      'Executes deterministic PID closed-loop motor speed & heading control',
      'Hardware interrupt capture for instantaneous metal detection (< 2ms response)',
      'Generates 16-channel hardware PWM signals for motor drivers and servo gate',
      'Directly safeguards vessel with fail-safe acoustic obstacle avoidance reflexes',
      'Handles UART command parser and telemetry status encoding'
    ],
    specs: {
      'CPU Core': 'Tensilica Xtensa Dual-Core 32-bit LX6 microprocessor @ 240 MHz',
      'Hardware PWM': '16-channel LEDC PWM controller (50 Hz servo, 20 kHz motor drive)',
      'ADC Inputs': '12-bit SAR ADC with hardware threshold comparator interrupts',
      'Interrupt Speed': 'Sub-1ms interrupt reflex for emergency motor halt and gate flip',
      'UART Baud Rate': '115,200 baud bidirectional link with parity verification',
      'Operating Rail': '3.3V logic (5V tolerant through optoisolator buffers)'
    },
    workflowRole: 'Translates high-level mission directives from Raspberry Pi 4 into electrical PWM pulses for motor drivers, monitors sensors in real-time, and actuates sorting servo flippers.',
    upstream: 'Raspberry Pi 4 (UART commands), Ultrasonic Sensor, Metal Detector, Li-ion Battery',
    downstream: 'L298N #1 (Conveyor), L298N #2 (Thrusters), MG996R Servo Motor'
  },
  {
    id: 'li_ion',
    name: 'High-Discharge Li-Ion Battery Pack',
    label: 'Li-ion Battery pack (ESP32 & sensor power)',
    category: 'Power Subsystem',
    role: 'High-Current Propulsion & Actuation Power Source',
    iconName: 'Zap',
    coords: { cx: 81.95, cy: 27.22, r: 10.5 },
    color: '#F59E0B',
    whatItDoes: 'Delivers high-amperage electrical current required to drive the two catamaran paddle wheel propulsion motors, two conveyor belt motors, and the heavy-duty metal-gear segregation servo. Equipped with an onboard BMS that prevents deep discharge, short circuits, and thermal runaway under heavy debris loading.',
    keyFeatures: [
      'High-discharge cell architecture absorbs high inrush motor currents',
      'Powers all 4 DC gearmotors and servo simultaneously without sagging',
      'Provides stepped-down regulated 5V power to the ESP32 microcontroller',
      'Integrated Battery Management System (BMS) with cell balancing'
    ],
    specs: {
      'Cell Configuration': '3S2P Lithium-Ion 18650 cell arrangement (11.1V nom, 12.6V max)',
      'Capacity & Energy': '5200 mAh / 57.7 Wh continuous energy storage',
      'Discharge Rating': '20A continuous discharge / 35A peak surge current',
      'Autonomous Runtime': '3.5 – 4.5 hours continuous water surface cleaning per cycle',
      'Safety Protection': '30A BMS board with over-charge, over-discharge, and thermal cutoffs'
    },
    workflowRole: 'Directly powers high-draw inductive loads (DC motors and servo) through L298N drivers and provides stepped-down 5V logic power to the ESP32 board.',
    upstream: 'External balance fast-charger / onboard solar harvest bus',
    downstream: 'L298N Driver #1, L298N Driver #2, ESP32 VIN (via 5V buck regulator)'
  },
  {
    id: 'l298n_1',
    name: 'L298N Dual H-Bridge Driver #1',
    label: 'L298N #1 (Conveyor & separation belt)',
    category: 'Motor Driver',
    role: 'Intake & Separation Belt Power Modulation',
    iconName: 'Layers',
    coords: { cx: 17.79, cy: 39.38, r: 8.0 },
    color: '#8B5CF6',
    whatItDoes: 'Converts low-power logic PWM signals from the ESP32 into high-voltage, high-current drive power for the intake conveyor belt and the secondary material separation belt. Allows variable speed regulation and reverse pulsing if debris clogs the intake mechanism.',
    keyFeatures: [
      'Independent dual H-bridge channels for intake and transfer belts',
      'PWM speed modulation allows matching conveyor speed to boat cruise rate',
      'Hardware reverse direction capability to clear entangled weeds or clogs',
      'Flyback clamp diodes protect upstream electronics from inductive spikes'
    ],
    specs: {
      'Driver Architecture': 'Dual Full-Bridge Driver with integrated flyback clamp diodes',
      'Drive Voltage': '12V DC input directly from the high-discharge Li-ion rail',
      'Peak Current': '2.0A continuous per channel (3.0A peak inrush burst)',
      'Logic Input': 'Standard TTL 3.3V/5V compatible PWM speed and direction inputs',
      'Thermal Sink': 'Heavy-gauge aluminum extruded fin heatsink for passive cooling'
    },
    workflowRole: 'Regulates conveyor belt velocities to match boat forward speed, guaranteeing smooth debris scooping without water wave turbulence.',
    upstream: 'ESP32 (PWM GPIOs), Li-ion Battery pack (12V)',
    downstream: 'Conveyor Belt Motor, Separation Belt Motor'
  },
  {
    id: 'l298n_2',
    name: 'L298N Dual H-Bridge Driver #2',
    label: 'L298N #2 (Wheel drive motors)',
    category: 'Motor Driver',
    role: 'Differential Propulsion & Steering Driver',
    iconName: 'Layers',
    coords: { cx: 82.21, cy: 39.79, r: 7.7 },
    color: '#059669',
    whatItDoes: 'Drives the two high-torque paddle wheel propulsion motors located on the port and starboard catamaran pontoons. Enables differential steering, smooth forward cruising, zero-radius spot turning, and reverse clearing maneuvers based on navigational telemetry.',
    keyFeatures: [
      'Dual-channel differential thruster control for agile catamaran navigation',
      'Enables pivot-turn rotation on the spot for tight canal maneuvering',
      'Dynamic electronic braking for precision station keeping and dock approach',
      'Smooth throttle ramping to prevent motor surge currents'
    ],
    specs: {
      'Driver Architecture': 'Dual Full-Bridge Driver with forward/reverse switching',
      'Propulsion Rail': '12V DC dedicated high-current motor bus',
      'Channel Current': '2.0A continuous per wheel thruster channel',
      'Steering Resolution': 'Independent 8-bit differential PWM speed modulation (0–255 steps)',
      'Braking Modes': 'Active dynamic motor braking via low-side H-bridge clamping'
    },
    workflowRole: 'Translates yaw/velocity commands from the navigation algorithm into differential thrust to maneuver the robot toward detected debris or steer around obstacles.',
    upstream: 'ESP32 (PWM GPIOs), Li-ion Battery pack (12V)',
    downstream: 'Left Wheel Motor, Right Wheel Motor'
  },
  {
    id: 'conv_motor',
    name: 'Main Intake Conveyor Belt Motor',
    label: 'Conveyor belt (Motor)',
    category: 'Actuator / Intake',
    role: 'Primary Surface Debris Collection Drive',
    iconName: 'RotateCw',
    coords: { cx: 7.52, cy: 53.61, r: 6.9 },
    color: '#64748B',
    whatItDoes: 'Powers the primary inclined conveyor belt (47×22 cm, 28° incline, 15° V-shaped scoop). Submerged paddle scoops lift floating plastics, wrappers, bottles, and organic weeds out of the water surface and transport them upwards toward the primary separation deck.',
    keyFeatures: [
      'Drives the 47×22 cm stainless mesh elevator belt at a steady 60 RPM',
      'V-shaped intake ramp channels waterborne debris directly into the scoops',
      'High gear reduction delivers 7.5 kg-cm stall torque to crush through jams',
      'Waterproof sealed shaft housing prevents water ingress'
    ],
    specs: {
      'Motor Type': '12V DC High-Torque Geared Motor with all-metal planetary gearbox',
      'Nominal Speed': '60 RPM steady-state intake speed under load',
      'Stall Torque': '7.5 kg-cm stall torque rating to clear dense weed jams',
      'Conveyor Geometry': '47×22 cm mesh belt, 28° inclined elevator ramp, 15° scoop',
      'Debris Throughput': '1.23 kg/hr continuous surface debris collection throughput'
    },
    workflowRole: 'Scoops floating waste continuously from the water surface and lifts it onto the deck for sensor inspection and classification.',
    upstream: 'L298N Driver #1 (Channel A)',
    downstream: 'Main inclined mesh conveyor belt roller mechanism'
  },
  {
    id: 'sep_motor',
    name: 'Secondary Separation Belt Motor',
    label: 'Separation belt (Motor)',
    category: 'Actuator / Transfer',
    role: 'Controlled Material Inspection Feed Drive',
    iconName: 'RotateCw',
    coords: { cx: 26.07, cy: 53.81, r: 6.9 },
    color: '#64748B',
    whatItDoes: 'Operates the secondary separation conveyor belt (18×14 cm) that carries collected debris across the inductive metal detection coil. Ensures waste moves at a calibrated, uniform velocity of 0.12 m/s so the sensor can reliably scan every item before it reaches the diverter flipper gate.',
    keyFeatures: [
      'Transports debris across the metal detector coil at a calibrated velocity',
      'Non-conductive PVC belt material prevents false electromagnetic triggers',
      'Synchronized with the main conveyor to prevent debris piling or bottle jams',
      'Feeds items singulated into the sorting flipper gate zone'
    ],
    specs: {
      'Motor Type': '12V DC Precision Geared Motor with bronze bushings',
      'Belt Geometry': '18×14 cm horizontal flat transfer conveyor',
      'Transfer Velocity': '0.12 m/s constant linear transfer speed (calibrated dwell time)',
      'Operating Torque': '4.2 kg-cm continuous operating torque',
      'Belt Material': 'Anti-static, non-conductive food-grade PVC mesh'
    },
    workflowRole: 'Transports debris past the metal detection coil at a constant speed, allowing sufficient dwell time for eddy current evaluation.',
    upstream: 'L298N Driver #1 (Channel B)',
    downstream: 'Secondary transfer conveyor belt roller'
  },
  {
    id: 'left_wheel',
    name: 'Left Propulsion Wheel Motor',
    label: 'Left wheel (Motor)',
    category: 'Actuator / Propulsion',
    role: 'Port Propulsion & Differential Steering Thruster',
    iconName: 'Compass',
    coords: { cx: 73.43, cy: 53.81, r: 7.1 },
    color: '#64748B',
    whatItDoes: 'Drives the port-side paddle wheel. Together with the starboard wheel motor, it propels the catamaran hull through water currents, headwinds, and debris mats. Speed differential between left and right motors achieves smooth turning and pivot rotation.',
    keyFeatures: [
      'Powers the port paddle wheel with direct high-torque gear reduction',
      'Differential speed control allows navigating around shallow river obstacles',
      'High-displacement paddle blades prevent weed entanglement compared to propellers',
      'Waterproof shaft seal rated for continuous surface submersion'
    ],
    specs: {
      'Motor Type': '12V High-Torque DC Geared Motor with silicone double-lip seals',
      'Thruster Type': 'Heavy-duty 8-blade paddle wheel assembly (anti-weed design)',
      'Cruising Velocity': '0.85 m/s (approx. 1.65 knots) nominal forward sweep speed',
      'Rated Torque': '8.0 kg-cm with reinforced metal reduction gears',
      'Current Draw': '1.2A cruising / 2.8A peak stall per thruster'
    },
    workflowRole: 'Provides port thrust for straight cruising and differential yaw steering during debris pursuit and obstacle avoidance.',
    upstream: 'L298N Driver #2 (Channel A)',
    downstream: 'Port catamaran paddle wheel propulsion assembly'
  },
  {
    id: 'right_wheel',
    name: 'Right Propulsion Wheel Motor',
    label: 'Right wheel (Motor)',
    category: 'Actuator / Propulsion',
    role: 'Starboard Propulsion & Differential Steering Thruster',
    iconName: 'Compass',
    coords: { cx: 92.23, cy: 54.02, r: 7.0 },
    color: '#64748B',
    whatItDoes: 'Drives the starboard-side paddle wheel in harmony with the left wheel. By running in reverse while the left wheel runs forward, the robot can execute zero-turn spin-on-a-dime rotations to navigate tight river bends and harbor corners.',
    keyFeatures: [
      'Powers the starboard paddle wheel with symmetrical torque output',
      'Executes counter-rotational zero-turn maneuvers on command',
      'Maintains straight-line GPS heading in windy or choppy water conditions',
      'Waterproof sealed gearbox prevents silt and sand abrasion'
    ],
    specs: {
      'Motor Type': '12V High-Torque DC Geared Motor with silicone double-lip seals',
      'Thruster Type': 'Heavy-duty 8-blade paddle wheel assembly (anti-weed design)',
      'Cruising Velocity': '0.85 m/s nominal forward sweep speed',
      'Rated Torque': '8.0 kg-cm with reinforced metal reduction gears',
      'Current Draw': '1.2A cruising / 2.8A peak stall per thruster'
    },
    workflowRole: 'Provides starboard thrust for vectoring, cruising, and station-keeping during cleaning operations.',
    upstream: 'L298N Driver #2 (Channel B)',
    downstream: 'Starboard catamaran paddle wheel propulsion assembly'
  },
  {
    id: 'ultrasonic',
    name: 'HC-SR04 Ultrasonic Sensor Array',
    label: 'Ultrasonic sensor (Obstacle avoidance)',
    category: 'Perception / Safety',
    role: 'Acoustic Proximity & Collision Prevention',
    iconName: 'Radio',
    coords: { cx: 31.08, cy: 65.77, r: 7.7 },
    color: '#F97316',
    whatItDoes: 'Emits 40 kHz ultrasonic acoustic sound pulses and measures round-trip echo time to calculate the distance to approaching obstacles (riverbanks, bridge piers, anchored boats, buoys, swimmers). Feeds distance readings directly to the ESP32 every 50ms. If an obstacle is detected within 50 cm, it overrides current navigation and commands an emergency stop or bypass maneuver (95.6 ± 2.1% avoidance reliability).',
    keyFeatures: [
      'Continuously sweeps 15° cone zones around the catamaran hulls',
      'Operates independently of water turbidity, sunlight glare, or surface reflections',
      'Directly fires high-priority avoidance reflex if target < 50 cm',
      'Field-proven 95.6 ± 2.1% obstacle avoidance reliability across test scenarios'
    ],
    specs: {
      'Sensor Model': 'HC-SR04 Ultrasonic Transducer Module (sealed water-resistant cones)',
      'Operating Frequency': '40 kHz acoustic burst sequence',
      'Measurement Range': '2 cm to 400 cm (effective collision safety horizon: 15 cm – 250 cm)',
      'Measuring Angle': '15° effective beam cone angle per transducer unit',
      'Distance Accuracy': '0.3 cm distance measurement resolution',
      'Empirical Reliability': '95.6 ± 2.1% obstacle clearance across static, dynamic & debris fields'
    },
    workflowRole: 'Continuously monitors forward and lateral clearances, triggering reactive avoidance maneuvers if any object enters the hazard perimeter.',
    upstream: '5V supply rail from ESP32, acoustic reflections from environment',
    downstream: 'ESP32 GPIO Trigger/Echo pins (hardware timer interrupts)'
  },
  {
    id: 'camera',
    name: 'Wide-Angle HD Vision Camera Module',
    label: 'Camera module (Robot location / vision)',
    category: 'Perception & AI Vision',
    role: 'Surface Waste Classification & Visual Odometry',
    iconName: 'Video',
    coords: { cx: 49.62, cy: 66.39, r: 8.8 },
    color: '#EF4444',
    whatItDoes: 'Captures high-resolution color video frames of the forward water surface. Video streams are piped directly over the MIPI CSI-2 bus into the Raspberry Pi 4 GPU/CPU pipeline for real-time neural network inference. The vision model detects and classifies floating litter (PET bottles, bags, beverage cans, leaves) and computes directional coordinates to steer the robot directly toward trash clusters.',
    keyFeatures: [
      'Streams raw video frames into the Raspberry Pi 4 vision pipeline',
      'Enables neural detection and bounding-box tracking of floating litter',
      'Computes debris cluster density heatmaps to prioritize dirty water regions',
      'Provides live FPV video stream to the shore-based remote operator portal'
    ],
    specs: {
      'Sensor Hardware': 'OmniVision OV5647 5-Megapixel Color CMOS Sensor',
      'Resolution & Rate': '1080p @ 30fps / 720p @ 60fps low-latency video feed',
      'Optical Lens': '120° Ultra-wide angle focal lens with anti-glare hydrophobic dome',
      'Hardware Bus': '15-pin MIPI CSI-2 camera serial bus (direct GPU memory transfer)',
      'Supported AI Models': 'YOLOv8-nano / MobileNet-SSD optimized for floating debris'
    },
    workflowRole: 'Provides real-time visual perception, identifies debris targets, and supplies visual telemetry to the operator web portal.',
    upstream: 'Raspberry Pi 4 CSI Camera port (3.3V/5V supply)',
    downstream: 'Raspberry Pi 4 Vision Inference Engine & Web Streaming Pipeline'
  },
  {
    id: 'metal_det',
    name: 'KY-036 Inductive Metal Proximity Detector',
    label: 'Metal detector (Identifies metal waste)',
    category: 'Material Sensing',
    role: 'Electromagnetic Ferrous/Non-Ferrous Debris Identification',
    iconName: 'Target',
    coords: { cx: 69.17, cy: 65.77, r: 7.8 },
    color: '#DC2626',
    whatItDoes: 'Mounted immediately beneath the non-conductive separation conveyor belt. Creates a high-frequency electromagnetic oscillating field. When a metallic object (such as an aluminum soda can, steel tin, bottle cap, or foil) passes over the coil, eddy currents dampen the oscillation. The sensor detects this drop instantly and asserts a digital HIGH interrupt signal to the ESP32 within 2 milliseconds.',
    keyFeatures: [
      'High-speed eddy-current coil detects both ferrous and non-ferrous metals',
      'Non-contact sensing operates seamlessly through the moving conveyor belt',
      'Adjustable multi-turn potentiometer sets sensitivity threshold',
      'Triggers hardware interrupt in ESP32 to open the metal sorting gate in 0.17s'
    ],
    specs: {
      'Sensor Model': 'KY-036 Inductive Proximity Coil with LM393 voltage comparator circuit',
      'Detection Horizon': '0 – 15 mm penetration through non-conductive conveyor belt',
      'Output Modes': 'Dual Output: Analog voltage level + Digital TTL HIGH trigger',
      'Trigger Latency': '< 2.0 ms instantaneous hardware interrupt signal assert',
      'Sorting Accuracy': '94.5 ± 1.6% overall sorting accuracy (ferrous metal recovery > 91%)'
    },
    workflowRole: 'Monitors debris passing on the transfer belt, asserting a metal interrupt signal whenever metallic waste is detected.',
    upstream: 'ESP32 5V rail, moving debris electromagnetic field',
    downstream: 'ESP32 External Interrupt GPIO pin (triggers servo diverter task)'
  },
  {
    id: 'servo',
    name: 'MG996R Metal Gear High-Torque Servo Motor',
    label: 'Servo motor (Directs waste to correct bin)',
    category: 'Actuator / Segregation',
    role: 'Automated Debris Diverter Gate Actuation',
    iconName: 'RotateCw',
    coords: { cx: 50.13, cy: 82.47, r: 8.9 },
    color: '#BE185D',
    whatItDoes: 'Physically operates the mechanical diverter flap positioned at the discharge end of the separation conveyor. By default, the flap remains in the neutral channel routing organic waste and plastics into the Non-Metal Bin. When the ESP32 receives a "Metal Detected" signal, it generates a 50Hz PWM pulse to swing the servo arm 60° in 0.17 seconds, deflecting the metal item down the chute into the Metal Bin before returning to neutral.',
    keyFeatures: [
      'Rapid 0.17s transit time to catch fast-moving items off the conveyor belt',
      '11 kg-cm torque easily deflects heavy full cans without binding',
      'Double ball-bearing shaft withstands repeated impact shock loads',
      'Automated timer resets the diverter gate to default non-metal pathway'
    ],
    specs: {
      'Servo Model': 'MG996R High-Torque Digital Metal Gear Coreless Servo',
      'Operating Voltage': '4.8V – 7.2V DC (powered via dedicated Li-ion regulator rail)',
      'Stall Torque': '11.0 kg-cm @ 6.0V (handles heavy aluminum cans and wet debris)',
      'Actuation Speed': '0.17 sec / 60 degrees rotation angle',
      'Internal Gears': 'Hardened all-copper and steel alloy gear transmission',
      'Command Signal': '50 Hz PWM waveform with 1000 µs – 2000 µs pulse duration'
    },
    workflowRole: 'Physically deflects confirmed metal objects into the metal bin while letting non-metallic waste pass into the general bin.',
    upstream: 'ESP32 PWM control pin, 6V regulated power from Li-ion pack',
    downstream: 'Mechanical sorting diverter chute flap mechanism'
  },
  {
    id: 'metal_bin',
    name: 'Perforated Metal Recyclables Bin',
    label: 'Metal bin (Metal waste collected)',
    category: 'Storage & Containment',
    role: 'Segregated Metallic Waste Containment',
    iconName: 'Trash2',
    coords: { cx: 21.55, cy: 93.40, r: 7.4 },
    color: '#475569',
    whatItDoes: 'Dedicated high-capacity storage container positioned beneath the metal diverter chute. Collects sorted aluminum drink cans, tin food cans, foil wrappers, and metallic fragments. Features a perforated drain grid on its bottom and sides to shed captured water back into the river while retaining recyclable solids.',
    keyFeatures: [
      'Stores recyclable metals separately for immediate post-mission processing',
      'Perforated drainage matrix sheds water back into the river, saving payload weight',
      'Quick-release latches allow rapid container swap at dockside in under 30 seconds',
      'Corrosion-resistant marine-grade construction prevents saltwater rusting'
    ],
    specs: {
      'Bin Dimensions': '29 cm (W) × 41 cm (L) × 19 cm (D)',
      'Internal Volume': 'Approx. 22.5 Liters payload capacity',
      'Payload Rating': '~2.5 kg dry metal waste capacity',
      'Hull Material': 'Perforated marine-grade 304 stainless steel & ABS composite',
      'Drainage Matrix': 'High-flow 3mm drainage mesh (prevents standing water draft)',
      'Dock Transfer': 'Quick-release ergonomic top-access latches'
    },
    workflowRole: 'Safely stores separated metal waste for recycling at the end of the cleaning sweep.',
    upstream: 'Diverted sorting chute output (from servo gate deflection)',
    downstream: 'Manual shore-side recycling drop-off / dock transfer'
  },
  {
    id: 'non_metal_bin',
    name: 'Perforated Non-Metal & Plastics Bin',
    label: 'Non-metal bin (Other waste collected)',
    category: 'Storage & Containment',
    role: 'Plastics, Debris & Organic Waste Containment',
    iconName: 'Trash2',
    coords: { cx: 77.19, cy: 93.61, r: 7.3 },
    color: '#475569',
    whatItDoes: 'Receives all non-metallic floating debris collected from the water surface, including PET plastic bottles, polythene carry bags, snack wrappers, foam containers, disposable cups, and river weeds. Water drains naturally through the perforated hull, preventing unnecessary boat payload draft.',
    keyFeatures: [
      'High-volume capacity accommodates bulky plastic bottles and Styrofoam',
      'Multi-directional perforated drainage ensures zero trapped water accumulation',
      'Integrated optical bin-full sensor warns operator when payload approaches 80%',
      'Dual-side ergonomic handles for one-person dockside emptying'
    ],
    specs: {
      'Bin Dimensions': '29 cm (W) × 41 cm (L) × 19 cm (D)',
      'Internal Volume': 'Approx. 22.5 Liters payload capacity',
      'Payload Rating': '~2.5 kg dry non-metallic waste capacity',
      'Hull Material': 'Impact-resistant polycarbonate & ABS composite shell',
      'Drainage System': 'Multi-directional drainage ports for zero standing water',
      'Fill Monitoring': 'Integrated optical fill-level indicator to alert when bin is full'
    },
    workflowRole: 'Stores general plastics and organics, ready for shore municipal processing.',
    upstream: 'Direct straight-through chute output from separation conveyor',
    downstream: 'Municipal solid waste management / sorting center'
  }
]

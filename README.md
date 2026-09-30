![Hero Cover](docs/readme-assets/hero-cover.jpg)

# Autonomous Water Cleaning Robot - Digital Twin
> An interactive digital twin of a surface water cleaning robot with onboard waste classification, real-time telemetry, and interactive system architecture.

[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![Threejs](https://img.shields.io/badge/threejs-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-success?style=for-the-badge&logo=vercel)](https://watercleaning-robot.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

## Overview
Urban waterways are increasingly choked by floating solid waste. While most USVs (Unmanned Surface Vehicles) collect debris, they fail to classify it, capping recyclable material recovery at around 43% without onboard sorting capabilities. This digital twin represents an autonomous water-cleaning platform that bridges this critical gap by performing real-time inductive metal segregation directly on the water.

## Validated Performance
The physical prototype of this system was validated across 12 statistically powered swimming-pool trials, yielding the following results:

| Metric | Result |
|---|---|
| Waste segregation accuracy | 94.5 ± 1.6% |
| Debris collection efficiency | 87.9 ± 3.2% |
| Collection throughput | 1.23 kg/hr |
| Obstacle avoidance success | 95.6 ± 2.1% |
| Inter-processor control latency | 8.2 ± 1.4 ms |
| Mission endurance | 52.3 ± 8.1 min (737 m²/mission) |
| Recycling value recovery vs. baseline | 2.9× |
| Areal coverage rate vs. baseline | 3.4× |

## Key Features
- **Interactive 3D Digital Twin:** A 1:1 scale procedural model of the catamaran vessel featuring dual pontoon hulls, paddle wheels, dual conveyor elevator systems, and dual sorted bins.
- **Interactive System Architecture & Workflow Modals (Fig. 2a):** Every tool and subsystem block in the signal & power architecture diagram (Raspberry Pi 4, ESP32 hub, Li-Ion/Power bank supplies, L298N drivers, motors, ultrasonic/camera/metal sensors, sorting servo, and collection bins) is interactively clickable. Clicking any node opens a technical modal detailing its operational role, key functions, hardware parameters, and signal connections.
- **Realistic Multi-Type Aquatic Debris Simulation:** Dynamically renders diverse river pollutants including crushed beverage cans, plastic bottles, snack wrappers, foam containers, organic river weeds, leaves, and driftwood.
- **Interactive Pause & Simulation Controls:** Live pause/play control toggle allows freezing robot motion and water drift for detailed inspection without resetting session state.
- **Exploded View Analysis:** Dynamically separates internal mechanical and electrical assemblies along the Y-axis to inspect internal conveyor gears, battery compartments, and segregation chutes.
- **Real-Time Telemetry Dashboard:** Monitors live battery discharge, thruster RPM, cruising speed, and metal vs. non-metal collection counts.
- **Fully Responsive Architecture:** Built with React 19, Three.js, and TailwindCSS v4 with full touch, mouse, and keyboard accessibility.

## System Snapshot
![System Architecture Diagram](docs/readme-assets/architecture-diagram.png)

**Hardware Specifications:**
- **Platform Dimensions:** 88×41×34 cm, 3.75 kg displacement
- **Conveyor:** 47×22 cm, 28° incline
- **Sensors:** KY-036 inductive sensor, MG996R sorting servo, 4× HC-SR04 ultrasonic array
- **Control Architecture:** Raspberry Pi 4 paired with ESP32-WROOM-32 (UART / JSON / CRC-8)
- **Power:** 10 Ah 12V LiPo battery, 38.4 W average draw

## Gallery
<table>
  <tr>
    <td><img src="docs/readme-assets/top-down-view.jpg" alt="Top Down View" width="100%"/></td>
    <td><img src="docs/readme-assets/side-angle.png" alt="Side Angle View" width="100%"/></td>
    <td><img src="docs/readme-assets/water-collection.jpg" alt="Water Collection" width="100%"/></td>
  </tr>
</table>

## Tech Stack
- **Frontend Framework:** React 19 + Vite
- **3D Rendering:** Three.js, `@react-three/fiber`, `@react-three/drei`
- **Styling:** TailwindCSS v4
- **State Management:** Zustand
- **Animations:** Framer Motion

## Folder Structure
```
robotics-website/
├── src/
│   ├── components/       # 2D UI Components (Hero, Dashboard, Content)
│   ├── store/            # Zustand state management (useStore.js)
│   ├── three/            # 3D Components (RobotModel, Scene)
│   ├── App.jsx           # Main Application layout
│   └── index.css         # Tailwind configuration & global styles
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## Running Locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```
   The static assets will be output to the `dist/` directory, ready to be deployed to Vercel, Netlify, or GitHub Pages.

## Roadmap
- [ ] Implement AI object detection
- [ ] Add swarm capabilities

## Citation
*Publication pending. Please check back for the official DOI and citation format.*

## License
MIT License

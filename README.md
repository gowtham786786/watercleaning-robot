# Autonomous Water Cleaning Robot - Digital Twin

This repository contains the interactive 3D digital twin for the Autonomous Water Cleaning Robot, built as a supplementary visualization tool for our Q1 academic journal submission.

## Features
- **Interactive 3D Procedural Model:** A 1:1 scale representation of the physical prototype, built using primitive geometries to maintain high performance.
- **Exploded View Analysis:** Separate the components along the Y-axis to inspect the internal architecture (electronics, propulsion, buoyancy).
- **Simulated Telemetry:** A live dashboard showing simulated data for battery consumption, RPM, speed, and waste collection counts.
- **Waste Detection Simulation:** Visualizes the robot's behavior when encountering floating surface waste (scanning, approaching, collecting).
- **Responsive & Performant:** Built with React Three Fiber, optimized for 60fps even on mid-range devices.

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

## License
MIT License

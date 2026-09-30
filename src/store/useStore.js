import { create } from 'zustand'

// Simple Web Audio API synth for UI blips
let audioCtx = null;
const playBlip = () => {
  if (typeof window === 'undefined') return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  } catch (e) {
    console.error("Audio playback failed", e);
  }
}

// Ambient Noise Generator
let ambientNoiseSource = null;
let ambientGain = null;
const toggleAmbientAudio = (mute) => {
  if (typeof window === 'undefined') return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    if (mute) {
      if (ambientGain) {
        ambientGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.1);
      }
      return;
    }

    if (audioCtx.state === 'suspended') audioCtx.resume();

    if (!ambientNoiseSource) {
      const bufferSize = audioCtx.sampleRate * 2; // 2 seconds
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1; // white noise
      }

      ambientNoiseSource = audioCtx.createBufferSource();
      ambientNoiseSource.buffer = buffer;
      ambientNoiseSource.loop = true;

      // Lowpass filter to make it sound like wind/water
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;

      ambientGain = audioCtx.createGain();
      ambientGain.gain.value = 0.05; // low volume

      ambientNoiseSource.connect(filter);
      filter.connect(ambientGain);
      ambientGain.connect(audioCtx.destination);
      ambientNoiseSource.start();
    } else if (ambientGain) {
      ambientGain.gain.setTargetAtTime(0.05, audioCtx.currentTime, 0.1);
    }
  } catch (e) {
    console.error("Ambient audio failed", e);
  }
}

export const useStore = create((set, get) => ({
  // UI State
  inclineAngle: 15,
  setInclineAngle: (val) => set({ inclineAngle: val }),
  explodedView: false,
  toggleExplodedView: () => {
    if (!get().audioMuted) playBlip();
    set((state) => ({ explodedView: !state.explodedView }))
  },

  transparentChassis: false,
  toggleTransparentChassis: () => {
    if (!get().audioMuted) playBlip();
    set((state) => ({ transparentChassis: !state.transparentChassis }))
  },

  activeComponent: null,
  setActiveComponent: (component) => {
    if (!get().audioMuted && component) playBlip();
    set({ activeComponent: component })
  },

  // Phase 2 states
  cinematicMode: false,
  setCinematicMode: (active) => {
    if (!get().audioMuted) playBlip();
    set({ cinematicMode: active })
  },

  nightMode: false,
  toggleNightMode: () => {
    if (!get().audioMuted) playBlip();
    set((state) => ({ nightMode: !state.nightMode }))
  },

  timelineProgress: 0,
  isScrubbing: false,
  setTimelineProgress: (val) => set({ timelineProgress: val }),
  setIsScrubbing: (val) => set({ isScrubbing: val }),

  audioMuted: true,
  toggleAudio: () => {
    const nextMuted = !get().audioMuted;
    set({ audioMuted: nextMuted });
    toggleAmbientAudio(nextMuted);
    if (!nextMuted) playBlip();
  },
  
  showHudLabels: false,
  toggleHudLabels: () => {
    if (!get().audioMuted) playBlip();
    set((state) => ({ showHudLabels: !state.showHudLabels }))
  },

  isPaused: false,
  togglePause: () => {
    if (!get().audioMuted) playBlip();
    set((state) => {
      const nextPaused = !state.isPaused;
      return { 
        isPaused: nextPaused, 
        isRunning: !nextPaused,
        systemStatus: nextPaused ? 'Paused' : 'Scanning'
      };
    });
  },

  // Simulation State & Segregated Bin Accumulation
  collectedCount: 0,
  metalBinVolume: 0.89,
  nonMetalBinVolume: 7.8,
  lastCollectedType: null,
  incrementStats: (type) => set((state) => {
    const isMetal = type === 'can' || type === 'metal';
    return {
      collectedCount: state.collectedCount + 1,
      lastCollectedType: type,
      metalBinVolume: Number((state.metalBinVolume + (isMetal ? (Math.random() * 0.08 + 0.04) : 0)).toFixed(2)),
      nonMetalBinVolume: Number((state.nonMetalBinVolume + (!isMetal ? (Math.random() * 0.25 + 0.08) : 0)).toFixed(2))
    };
  }),

  // Realistic River Debris Field (Matching diverse floating waste)
  debrisList: [
    { id: 1, position: [-1.2, -0.2, 2.8], type: 'bottle', label: 'PET Bottle', confidence: 0.98 },
    { id: 2, position: [1.6, -0.2, 3.4], type: 'can', label: 'Beverage Can', confidence: 0.96 },
    { id: 3, position: [-2.4, -0.2, 1.9], type: 'leaf', label: 'River Foliage', confidence: 0.94 },
    { id: 4, position: [0.6, -0.2, 4.2], type: 'bag', label: 'Plastic Bag', confidence: 0.91 },
    { id: 5, position: [2.8, -0.2, -1.8], type: 'styrofoam', label: 'Styrofoam Foam', confidence: 0.95 },
    { id: 6, position: [-3.0, -0.2, 3.6], type: 'snack_pack', label: 'Snack Wrapper', confidence: 0.92 },
    { id: 7, position: [1.4, -0.2, -2.6], type: 'bottle', label: 'Water Bottle', confidence: 0.97 },
    { id: 8, position: [-1.6, -0.2, -3.4], type: 'can', label: 'Soda Can', confidence: 0.95 },
    { id: 9, position: [3.2, -0.2, 2.2], type: 'leaf', label: 'Aquatic Weeds', confidence: 0.93 },
    { id: 10, position: [-2.0, -0.2, -1.5], type: 'bag', label: 'Polythene Film', confidence: 0.89 },
    { id: 11, position: [0.2, -0.2, -4.2], type: 'styrofoam', label: 'Takeaway Foam', confidence: 0.96 },
    { id: 12, position: [2.5, -0.2, 4.5], type: 'snack_pack', label: 'Foil Pouch', confidence: 0.94 }
  ],
  removeDebris: (id) => set((state) => ({ debrisList: state.debrisList.filter(d => d.id !== id) })),
  spawnDebris: (newTarget) => set((state) => {
    // Keep active river debris field populated up to 14 items
    if (state.debrisList && state.debrisList.length >= 14) return state;
    return { debrisList: [...state.debrisList, newTarget] };
  }),
  
  isRunning: true,
  collectingDebris: null,
  setCollectingDebris: (debris) => set({ collectingDebris: debris }),
  collectProgress: 0,
  setCollectProgress: (p) => set({ collectProgress: p }),
  battery: 87,
  rpm: 1200,
  speed: 1.2,
  wasteCount: 0,
  systemStatus: 'Scanning',

  wasteDetected: false,
  detectedPosition: [0, 0, 0],

  updateTelemetry: () => {
    if (!get().isRunning) return

    const currentBattery = get().battery
    const newBattery = Math.max(0, currentBattery - (Math.random() * 0.01))

    let targetRpm = 800;
    if (get().systemStatus === 'Moving') targetRpm = 1400;
    if (get().systemStatus === 'Collecting') targetRpm = 1600;

    const newRpm = get().rpm + (targetRpm - get().rpm) * 0.1 + (Math.random() * 20 - 10)
    const newSpeed = Math.max(0, (newRpm / 1500) * 1.5 + (Math.random() * 0.1 - 0.05))

    set({
      battery: Number(newBattery.toFixed(2)),
      rpm: Math.round(newRpm),
      speed: Number(newSpeed.toFixed(2))
    })
  },

  setSimulationState: (updates) => set((state) => ({ ...state, ...updates })),
  incrementWaste: () => set((state) => ({ wasteCount: state.wasteCount + 1 }))
}))

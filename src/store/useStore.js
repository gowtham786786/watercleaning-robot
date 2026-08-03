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

  // Simulation State
  debrisList: [
    { id: 1, position: [-1.0, -0.2, 3.2], type: 'bottle' }
  ],
  removeDebris: (id) => set((state) => ({ debrisList: state.debrisList.filter(d => d.id !== id) })),
  spawnDebris: () => set((state) => {
    if (state.debrisList && state.debrisList.length > 0) return state;
    const newDebris = [
      {
        id: Date.now(),
        position: [-1.0, -0.2, 3.2],
        type: 'bottle'
      }
    ];
    return { debrisList: newDebris };
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

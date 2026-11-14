/**
 * Space Cockpit Web Audio Synthesizer
 * 100% offline-first native browser Web Audio API synthesis
 *
 * Implements realistic spacecraft interior acoustics:
 * - Low-frequency life-support cabin ventilation hum (pressurized interior)
 * - Propulsion thruster vibration during interplanetary transit
 * - Cockpit console confirmation beeps, chimes, and docking alerts
 * - Persistent volume and mute state in localStorage
 * - Safe user-interaction gating (respects browser autoplay policies)
 */

class SpaceSoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.cabinHumOsc = null;
    this.cabinHumGain = null;
    this.cabinNoiseNode = null;
    this.heartbeatInterval = null;

    // Load persisted settings
    const storedMute = localStorage.getItem('spaceship_404_audio_muted');
    this.isMuted = storedMute !== null ? storedMute === 'true' : true; // Default muted per user prompt

    const storedVol = localStorage.getItem('spaceship_404_audio_volume');
    this.volume = storedVol !== null ? parseFloat(storedVol) : 0.65;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(level) {
    this.volume = Math.max(0, Math.min(1, level));
    localStorage.setItem('spaceship_404_audio_volume', this.volume.toString());
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }
  }

  toggleMute() {
    this.init();
    this.isMuted = !this.isMuted;
    localStorage.setItem('spaceship_404_audio_muted', this.isMuted.toString());

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }

    if (this.isMuted) {
      this.stopHeartbeat();
      this.stopCabinAmbience();
    } else {
      this.startCabinAmbience();
      this.playBeep(980, 0.08);
    }
    return this.isMuted;
  }

  // Continuous subtle pressurized cabin life-support hum
  startCabinAmbience() {
    if (this.isMuted) return;
    this.init();
    if (this.cabinHumOsc) return; // Already running

    try {
      const now = this.ctx.currentTime;

      // 1. Low fundamental tone (68Hz cabin structural resonance)
      this.cabinHumOsc = this.ctx.createOscillator();
      this.cabinHumOsc.type = 'sine';
      this.cabinHumOsc.frequency.setValueAtTime(68, now);

      this.cabinHumGain = this.ctx.createGain();
      this.cabinHumGain.gain.setValueAtTime(0.001, now);
      this.cabinHumGain.gain.linearRampToValueAtTime(0.045, now + 1.5);

      // Lowpass filter to ensure sound remains a gentle interior hum
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, now);

      this.cabinHumOsc.connect(filter);
      filter.connect(this.cabinHumGain);
      this.cabinHumGain.connect(this.masterGain);

      this.cabinHumOsc.start(now);
    } catch (e) {
      console.warn('Cabin ambience error:', e);
    }
  }

  stopCabinAmbience() {
    if (this.cabinHumOsc && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        if (this.cabinHumGain) {
          this.cabinHumGain.gain.linearRampToValueAtTime(0.001, now + 0.5);
        }
        setTimeout(() => {
          if (this.cabinHumOsc) {
            this.cabinHumOsc.stop();
            this.cabinHumOsc.disconnect();
            this.cabinHumOsc = null;
            this.cabinHumGain = null;
          }
        }, 600);
      } catch (e) {
        this.cabinHumOsc = null;
      }
    }
  }

  // Interplanetary Propulsion / Thruster Burn (interior hull vibration)
  playThrusterBurn(duration = 2.2) {
    if (this.isMuted) return;
    try {
      this.init();
      const now = this.ctx.currentTime;

      // Low rumble
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(42, now);
      osc.frequency.linearRampToValueAtTime(54, now + 0.8);
      osc.frequency.linearRampToValueAtTime(36, now + duration);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.4);
      gain.gain.linearRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {}
  }

  // Docking & Orbital Insertion Confirmation Chime
  playDockingChime() {
    if (this.isMuted) return;
    try {
      this.init();
      const now = this.ctx.currentTime;

      // First Harmonic
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now); // E5
      gain1.gain.setValueAtTime(0.08, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc1.connect(gain1);
      gain1.connect(this.masterGain);
      osc1.start(now);
      osc1.stop(now + 0.4);

      // Second Harmonic (arriving at octave)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now + 0.12); // A5
      gain2.gain.setValueAtTime(0.07, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc2.connect(gain2);
      gain2.connect(this.masterGain);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.6);
    } catch (e) {}
  }

  // Sci-Fi Cockpit Console Beep
  playBeep(freq = 1150, duration = 0.07, type = 'sine') {
    if (this.isMuted) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + duration);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {}
  }

  // Scanner Chirp
  playChirp() {
    if (this.isMuted) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.linearRampToValueAtTime(1450, now + 0.09);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {}
  }

  // Mars / Deep Space Medical Telemetry Alarm
  playEmergencyAlarm() {
    if (this.isMuted) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(330, now + 0.22);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  }

  // Real-Time Astronaut Heartbeat (Lub-Dub)
  startHeartbeat(bpm = 72) {
    if (this.isMuted) return;
    this.stopHeartbeat();

    const intervalMs = Math.max(400, (60 / bpm) * 1000);

    const playLubDub = () => {
      if (this.isMuted) return;
      try {
        this.init();
        const now = this.ctx.currentTime;

        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(62, now);
        osc1.frequency.exponentialRampToValueAtTime(38, now + 0.11);
        gain1.gain.setValueAtTime(0.12, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
        osc1.connect(gain1);
        gain1.connect(this.masterGain);
        osc1.start(now);
        osc1.stop(now + 0.11);

        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(90, now + 0.12);
        osc2.frequency.exponentialRampToValueAtTime(45, now + 0.22);
        gain2.gain.setValueAtTime(0.09, now + 0.12);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc2.connect(gain2);
        gain2.connect(this.masterGain);
        osc2.start(now + 0.12);
        osc2.stop(now + 0.22);
      } catch (e) {}
    };

    playLubDub();
    this.heartbeatInterval = setInterval(playLubDub, intervalMs);
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
}

export const spaceAudio = new SpaceSoundEngine();

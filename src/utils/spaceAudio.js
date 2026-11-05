/**
 * Space Cockpit Web Audio Synthesizer
 * 100% offline-first native browser audio synthesis (No external mp3/wav files required!)
 */

class SpaceSoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.heartbeatInterval = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopHeartbeat();
    }
    return this.isMuted;
  }

  // Sci-Fi UI Beep / Button Click
  playBeep(freq = 1200, duration = 0.08, type = 'sine') {
    if (this.isMuted) return;
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  // Telemetry Alert / Scanner Chirp
  playChirp() {
    if (this.isMuted) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.linearRampToValueAtTime(1600, now + 0.1);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {}
  }

  // Mars Emergency Blackout Klaxon
  playEmergencyAlarm() {
    if (this.isMuted) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.linearRampToValueAtTime(320, now + 0.25);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    } catch (e) {}
  }

  // Realistic Lub-Dub Heartbeat Synthesis
  startHeartbeat(bpm = 72) {
    if (this.isMuted) return;
    this.stopHeartbeat();

    const intervalMs = Math.max(400, (60 / bpm) * 1000);

    const playLubDub = () => {
      if (this.isMuted) return;
      try {
        this.init();
        const now = this.ctx.currentTime;

        // "Lub" (First heart tone - lower pitch ~65Hz)
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(65, now);
        osc1.frequency.exponentialRampToValueAtTime(40, now + 0.12);
        gain1.gain.setValueAtTime(0.15, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc1.connect(gain1);
        gain1.connect(this.ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.12);

        // "Dub" (Second heart tone ~95Hz, 120ms later)
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(95, now + 0.13);
        osc2.frequency.exponentialRampToValueAtTime(50, now + 0.24);
        gain2.gain.setValueAtTime(0.12, now + 0.13);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);
        osc2.start(now + 0.13);
        osc2.stop(now + 0.24);
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

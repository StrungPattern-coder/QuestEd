/**
 * Sound Effects Library using Web Audio API
 * Provides audio feedback for quiz interactions
 */

class SoundManager {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      // Initialize on first user interaction to comply with browser autoplay policies
      this.initialize();
    }
  }

  private initialize() {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.connect(this.audioContext.destination);

        // Load mute preference from localStorage
        const savedMuteState = localStorage.getItem("questEdSoundsMuted");
        this.isMuted = savedMuteState === "true";
        this.masterGain.gain.value = this.isMuted ? 0 : 1;
      } catch (error) {
        console.warn("Web Audio API not supported:", error);
      }
    }
  }

  private ensureInitialized() {
    if (!this.audioContext) {
      this.initialize();
    }
    // Resume context if it's suspended (browser autoplay policy)
    if (this.audioContext?.state === "suspended") {
      this.audioContext.resume();
    }
  }

  /**
   * Play a sound with given frequency and duration
   */
  private playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = "sine",
    volume: number = 0.3
  ) {
    this.ensureInitialized();
    if (!this.audioContext || !this.masterGain || this.isMuted) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    // Envelope for smooth sound
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      volume,
      this.audioContext.currentTime + 0.01
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  /**
   * Play a chord (multiple frequencies)
   */
  private playChord(
    frequencies: number[],
    duration: number,
    type: OscillatorType = "sine",
    volume: number = 0.2
  ) {
    frequencies.forEach((freq) => this.playTone(freq, duration, type, volume));
  }

  /**
   * Correct answer sound - pleasant ascending tones
   */
  correctAnswer() {
    this.playChord([523.25, 659.25, 783.99], 0.3, "sine", 0.25); // C-E-G major chord
  }

  /**
   * Wrong answer sound - descending buzz
   */
  wrongAnswer() {
    this.playTone(200, 0.4, "sawtooth", 0.2);
    setTimeout(() => this.playTone(150, 0.3, "sawtooth", 0.15), 100);
  }

  /**
   * Timer tick sound - subtle click
   */
  timerTick() {
    this.playTone(800, 0.05, "square", 0.1);
  }

  /**
   * Timer warning - urgent beeps
   */
  timerWarning() {
    this.playTone(880, 0.15, "sine", 0.25);
    setTimeout(() => this.playTone(880, 0.15, "sine", 0.25), 200);
  }

  /**
   * Question transition - whoosh sound
   */
  questionTransition() {
    this.ensureInitialized();
    if (!this.audioContext || !this.masterGain || this.isMuted) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.type = "sine";

    // Sweep from high to low
    oscillator.frequency.setValueAtTime(
      1200,
      this.audioContext.currentTime
    );
    oscillator.frequency.exponentialRampToValueAtTime(
      200,
      this.audioContext.currentTime + 0.3
    );

    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.3
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  /**
   * Leaderboard update - notification sound
   */
  leaderboardUpdate() {
    this.playChord([659.25, 783.99], 0.2, "sine", 0.15);
  }

  /**
   * Winner fanfare - triumphant melody
   */
  winnerFanfare() {
    const notes = [
      { freq: 523.25, time: 0 }, // C
      { freq: 659.25, time: 200 }, // E
      { freq: 783.99, time: 400 }, // G
      { freq: 1046.5, time: 600 }, // C (high)
    ];

    notes.forEach(({ freq, time }) => {
      setTimeout(() => this.playTone(freq, 0.4, "sine", 0.3), time);
    });
  }

  /**
   * Podium reveal - drum roll effect
   */
  drumRoll() {
    this.ensureInitialized();
    if (!this.audioContext || !this.masterGain || this.isMuted) return;

    const duration = 2; // 2 seconds
    const interval = 30; // milliseconds between hits
    const steps = (duration * 1000) / interval;

    for (let i = 0; i < steps; i++) {
      setTimeout(() => {
        // Increase intensity over time
        const volume = 0.1 + (i / steps) * 0.2;
        this.playTone(100, 0.05, "triangle", volume);
      }, i * interval);
    }

    // Final crash cymbal
    setTimeout(() => {
      this.playChord([800, 1200, 1600], 1, "square", 0.15);
    }, duration * 1000);
  }

  /**
   * Applause effect
   */
  applause() {
    this.ensureInitialized();
    if (!this.audioContext || !this.masterGain || this.isMuted) return;

    const duration = 3000; // 3 seconds
    const interval = setInterval(() => {
      // Random claps
      const frequency = 200 + Math.random() * 100;
      this.playTone(frequency, 0.05, "triangle", 0.05);
    }, 30);

    setTimeout(() => clearInterval(interval), duration);
  }

  /**
   * Achievement unlocked sound
   */
  achievement() {
    const melody = [
      { freq: 523.25, time: 0 }, // C
      { freq: 659.25, time: 100 }, // E
      { freq: 783.99, time: 200 }, // G
      { freq: 1046.5, time: 300 }, // C (high)
      { freq: 1318.5, time: 500 }, // E (high)
    ];

    melody.forEach(({ freq, time }) => {
      setTimeout(() => this.playTone(freq, 0.3, "triangle", 0.25), time);
    });
  }

  /**
   * Countdown beep (3... 2... 1... GO!)
   */
  countdownBeep(isGo: boolean = false) {
    if (isGo) {
      // Higher pitched for "GO!"
      this.playChord([1046.5, 1318.5], 0.5, "sine", 0.3);
    } else {
      // Standard beep for numbers
      this.playTone(800, 0.2, "sine", 0.25);
    }
  }

  /**
   * Streak bonus sound
   */
  streakBonus(streakCount: number) {
    // Play more notes for higher streaks
    const baseFreq = 523.25;
    for (let i = 0; i < Math.min(streakCount, 5); i++) {
      setTimeout(() => {
        this.playTone(baseFreq * Math.pow(1.2, i), 0.15, "sine", 0.2);
      }, i * 80);
    }
  }

  /**
   * Position up sound
   */
  positionUp() {
    this.playChord([659.25, 830.61], 0.25, "sine", 0.2); // E-G#
  }

  /**
   * Position down sound
   */
  positionDown() {
    this.playChord([493.88, 392.0], 0.3, "sine", 0.15); // B-G (descending)
  }

  /**
   * Button click sound
   */
  buttonClick() {
    this.playTone(600, 0.05, "sine", 0.15);
  }

  /**
   * Toggle mute/unmute
   */
  toggleMute(): boolean {
    this.ensureInitialized();
    if (!this.masterGain) return this.isMuted;

    this.isMuted = !this.isMuted;
    this.masterGain.gain.value = this.isMuted ? 0 : 1;

    // Save preference
    localStorage.setItem("questEdSoundsMuted", String(this.isMuted));

    // Play feedback sound if unmuting
    if (!this.isMuted) {
      this.buttonClick();
    }

    return this.isMuted;
  }

  /**
   * Get current mute state
   */
  getMuted() {
    return this.isMuted;
  }

  /**
   * Set master volume (0-1)
   */
  setVolume(volume: number) {
    this.ensureInitialized();
    if (!this.masterGain) return;

    const clampedVolume = Math.max(0, Math.min(1, volume));
    if (!this.isMuted) {
      this.masterGain.gain.value = clampedVolume;
    }
    localStorage.setItem("questEdSoundsVolume", String(clampedVolume));
  }

  /**
   * Get master volume
   */
  getVolume() {
    const savedVolume = localStorage.getItem("questEdSoundsVolume");
    return savedVolume ? parseFloat(savedVolume) : 1;
  }
}

// Export singleton instance
export const soundManager = new SoundManager();

// Convenience functions
export const playSoundEffect = {
  correctAnswer: () => soundManager.correctAnswer(),
  wrongAnswer: () => soundManager.wrongAnswer(),
  timerTick: () => soundManager.timerTick(),
  timerWarning: () => soundManager.timerWarning(),
  questionTransition: () => soundManager.questionTransition(),
  leaderboardUpdate: () => soundManager.leaderboardUpdate(),
  winnerFanfare: () => soundManager.winnerFanfare(),
  drumRoll: () => soundManager.drumRoll(),
  applause: () => soundManager.applause(),
  achievement: () => soundManager.achievement(),
  countdownBeep: (isGo?: boolean) => soundManager.countdownBeep(isGo),
  streakBonus: (count: number) => soundManager.streakBonus(count),
  positionUp: () => soundManager.positionUp(),
  positionDown: () => soundManager.positionDown(),
  buttonClick: () => soundManager.buttonClick(),
};

/**
 * Haptic Feedback Library for Mobile Devices
 * 
 * Provides vibration patterns for various quiz events
 * Uses the Vibration API for mobile devices
 */

type HapticPattern = number | number[];

/**
 * Check if Vibration API is supported
 */
export const isHapticsSupported = (): boolean => {
  return typeof window !== 'undefined' && 'vibrate' in navigator;
};

/**
 * Execute a haptic pattern
 */
const vibrate = (pattern: HapticPattern): void => {
  if (!isHapticsSupported()) return;
  
  try {
    navigator.vibrate(pattern);
  } catch (error) {
    console.warn('Haptic feedback failed:', error);
  }
};

/**
 * Haptic Feedback Patterns
 */

// Light tap - for button presses
export const buttonTap = (): void => {
  vibrate(10);
};

// Success haptic - for correct answers
export const correctAnswer = (): void => {
  vibrate([50, 50, 50]); // Three short bursts
};

// Error haptic - for wrong answers
export const wrongAnswer = (): void => {
  vibrate([100, 50, 100]); // Two longer bursts
};

// Warning haptic - for timer running out
export const timerWarning = (): void => {
  vibrate([30, 30, 30, 30, 30]); // Rapid pulses
};

// Timer tick - subtle feedback
export const timerTick = (): void => {
  vibrate(5); // Very short vibration
};

// Answer submitted
export const submitAnswer = (): void => {
  vibrate(20);
};

// Question transition
export const questionTransition = (): void => {
  vibrate([15, 15, 15]);
};

// Celebration - for winning/podium
export const celebration = (): void => {
  vibrate([100, 50, 100, 50, 200]); // Escalating pattern
};

// Streak bonus - for answer streaks
export const streakBonus = (): void => {
  vibrate([30, 20, 30, 20, 30, 20, 50]); // Building intensity
};

// Position up - moved up in leaderboard
export const positionUp = (): void => {
  vibrate([30, 20, 60]); // Rising pattern
};

// Position down - moved down in leaderboard
export const positionDown = (): void => {
  vibrate([60, 20, 30]); // Falling pattern
};

// Quiz start countdown
export const countdownBeep = (): void => {
  vibrate(25);
};

// Final results reveal
export const resultsReveal = (): void => {
  vibrate([50, 30, 50, 30, 100]); // Drum roll effect
};

// Achievement unlocked
export const achievement = (): void => {
  vibrate([80, 50, 80, 50, 120]); // Triumphant pattern
};

// Stop all vibrations
export const stopHaptics = (): void => {
  if (isHapticsSupported()) {
    navigator.vibrate(0);
  }
};

/**
 * Haptic Manager Class
 * Provides centralized control over haptics with enable/disable
 */
export class HapticManager {
  private static instance: HapticManager;
  private enabled: boolean = true;
  private readonly storageKey = 'hapticsEnabled';

  private constructor() {
    // Load preference from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(this.storageKey);
      this.enabled = saved !== null ? saved === 'true' : true;
    }
  }

  static getInstance(): HapticManager {
    if (!HapticManager.instance) {
      HapticManager.instance = new HapticManager();
    }
    return HapticManager.instance;
  }

  isEnabled(): boolean {
    return this.enabled && isHapticsSupported();
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, String(enabled));
    }
  }

  toggle(): boolean {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  // Wrapped haptic methods that respect enabled state
  buttonTap(): void {
    if (this.isEnabled()) buttonTap();
  }

  correctAnswer(): void {
    if (this.isEnabled()) correctAnswer();
  }

  wrongAnswer(): void {
    if (this.isEnabled()) wrongAnswer();
  }

  timerWarning(): void {
    if (this.isEnabled()) timerWarning();
  }

  timerTick(): void {
    if (this.isEnabled()) timerTick();
  }

  submitAnswer(): void {
    if (this.isEnabled()) submitAnswer();
  }

  questionTransition(): void {
    if (this.isEnabled()) questionTransition();
  }

  celebration(): void {
    if (this.isEnabled()) celebration();
  }

  streakBonus(): void {
    if (this.isEnabled()) streakBonus();
  }

  positionUp(): void {
    if (this.isEnabled()) positionUp();
  }

  positionDown(): void {
    if (this.isEnabled()) positionDown();
  }

  countdownBeep(): void {
    if (this.isEnabled()) countdownBeep();
  }

  resultsReveal(): void {
    if (this.isEnabled()) resultsReveal();
  }

  achievement(): void {
    if (this.isEnabled()) achievement();
  }

  stop(): void {
    stopHaptics();
  }
}

// Export singleton instance
export const haptics = HapticManager.getInstance();

// Export individual functions for direct use
export const playHaptic = {
  buttonTap,
  correctAnswer,
  wrongAnswer,
  timerWarning,
  timerTick,
  submitAnswer,
  questionTransition,
  celebration,
  streakBonus,
  positionUp,
  positionDown,
  countdownBeep,
  resultsReveal,
  achievement,
  stop: stopHaptics,
};

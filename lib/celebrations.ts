import confetti from 'canvas-confetti';

/**
 * Celebration Animations Library
 * 
 * Provides multiple celebration effects for correct answers in quizzes.
 * Effects are randomized to keep the experience fresh and engaging.
 */

// 1. Classic Confetti
export const celebrateWithConfetti = () => {
  confetti({
    particleCount: 150,
    spread: 90,
    origin: { y: 0.6 },
    colors: ['#FF991C', '#FF8F4D', '#FFB280'],
  });
};

// 2. Fireworks Effect
export const celebrateWithFireworks = () => {
  const duration = 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: any = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    // Two bursts from different positions
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42'],
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42'],
    });
  }, 250);
};

// 3. Star Burst
export const celebrateWithStars = () => {
  const defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    shapes: ['star'] as confetti.Shape[],
    colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8'],
  };

  function shoot() {
    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ['star'] as confetti.Shape[],
    });

    confetti({
      ...defaults,
      particleCount: 10,
      scalar: 0.75,
      shapes: ['circle'] as confetti.Shape[],
    });
  }

  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);
};

// 4. Sparkle Rain
export const celebrateWithSparkles = () => {
  const duration = 1500;
  const animationEnd = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.4 },
      colors: ['#bb0000', '#ffffff', '#00bb00', '#0000bb', '#ffff00'],
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.4 },
      colors: ['#bb0000', '#ffffff', '#00bb00', '#0000bb', '#ffff00'],
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  }());
};

// 5. Emoji Celebration
export const celebrateWithEmojis = () => {
  const scalar = 2;
  const emojis = ['🎉', '✨', '💫', '⭐', '🌟'];

  confetti({
    particleCount: 50,
    spread: 100,
    origin: { y: 0.6 },
    scalar,
    shapes: ['circle'] as confetti.Shape[],
    colors: ['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#9370DB'],
  });
};

// 6. Side Cannons
export const celebrateWithCannons = () => {
  const end = Date.now() + 500;

  (function frame() {
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#ff0080', '#ff8c00', '#ffed00', '#00ff00', '#00bfff'],
    });
    confetti({
      particleCount: 7,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#ff0080', '#ff8c00', '#ffed00', '#00ff00', '#00bfff'],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
};

// 7. Realistic Confetti
export const celebrateWithRealisticConfetti = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};

// Array of all celebration functions
const celebrations = [
  celebrateWithConfetti,
  celebrateWithFireworks,
  celebrateWithStars,
  celebrateWithSparkles,
  celebrateWithEmojis,
  celebrateWithCannons,
  celebrateWithRealisticConfetti,
];

/**
 * Randomly select and trigger a celebration animation
 */
export const triggerRandomCelebration = () => {
  const randomIndex = Math.floor(Math.random() * celebrations.length);
  celebrations[randomIndex]();
};

/**
 * Trigger a specific celebration by name
 */
export const triggerCelebration = (type: 'confetti' | 'fireworks' | 'stars' | 'sparkles' | 'emojis' | 'cannons' | 'realistic') => {
  switch (type) {
    case 'confetti':
      celebrateWithConfetti();
      break;
    case 'fireworks':
      celebrateWithFireworks();
      break;
    case 'stars':
      celebrateWithStars();
      break;
    case 'sparkles':
      celebrateWithSparkles();
      break;
    case 'emojis':
      celebrateWithEmojis();
      break;
    case 'cannons':
      celebrateWithCannons();
      break;
    case 'realistic':
      celebrateWithRealisticConfetti();
      break;
    default:
      celebrateWithConfetti();
  }
};

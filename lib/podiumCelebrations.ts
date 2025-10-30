import confetti from "canvas-confetti";

/**
 * Podium Celebration Animations
 * Different celebration types for different placements
 */

export const triggerGoldMedalCelebration = () => {
  const duration = 5000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // Gold confetti from multiple origins
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ["#FFD700", "#FFA500", "#FFFF00"],
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ["#FFD700", "#FFA500", "#FFFF00"],
    });
  }, 250);
};

export const triggerSilverMedalCelebration = () => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 30 * (timeLeft / duration);

    // Silver confetti from sides
    confetti({
      particleCount,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#C0C0C0", "#E8E8E8", "#A8A8A8"],
      zIndex: 9999,
    });
    confetti({
      particleCount,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#C0C0C0", "#E8E8E8", "#A8A8A8"],
      zIndex: 9999,
    });
  }, 250);
};

export const triggerBronzeMedalCelebration = () => {
  const duration = 2000;

  // Bronze confetti burst
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#CD7F32", "#E8B86D", "#8B4513"],
    zIndex: 9999,
  });
};

export const triggerFireworks = () => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
};

export const triggerStarBurst = () => {
  const defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    shapes: ["star"] as confetti.Shape[],
    colors: ["#FFD700", "#FFA500", "#FF69B4", "#00CED1"],
    zIndex: 9999,
  };

  const shoot = () => {
    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ["star"],
    });

    confetti({
      ...defaults,
      particleCount: 10,
      scalar: 0.75,
      shapes: ["circle"],
    });
  };

  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);
};

export const triggerRainbowShower = () => {
  const duration = 2000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#9400D3"],
      zIndex: 9999,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#9400D3"],
      zIndex: 9999,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
};

export const triggerTrophyRain = () => {
  const duration = 3000;
  const end = Date.now() + duration;

  const colors = ["#FFD700", "#FFA500"];

  (function frame() {
    confetti({
      particleCount: 1,
      angle: 90,
      spread: 45,
      origin: { x: Math.random(), y: 0 },
      colors: colors,
      shapes: ["circle"],
      scalar: 2,
      zIndex: 9999,
      gravity: 0.5,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
};

export const triggerPodiumExplosion = () => {
  // Center explosion
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    zIndex: 9999,
  });

  // Side explosions
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      zIndex: 9999,
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      zIndex: 9999,
    });
  }, 200);
};

/**
 * Main celebration function based on placement
 */
export const celebratePodiumPlacement = (placement: 1 | 2 | 3) => {
  switch (placement) {
    case 1:
      // 1st place: Epic celebration
      triggerGoldMedalCelebration();
      setTimeout(triggerFireworks, 500);
      setTimeout(triggerStarBurst, 1500);
      break;
    case 2:
      // 2nd place: Great celebration
      triggerSilverMedalCelebration();
      setTimeout(triggerStarBurst, 500);
      break;
    case 3:
      // 3rd place: Good celebration
      triggerBronzeMedalCelebration();
      break;
  }
};

/**
 * Celebration for all winners at once
 */
export const celebrateAllWinners = () => {
  triggerPodiumExplosion();
  setTimeout(triggerRainbowShower, 500);
  setTimeout(triggerTrophyRain, 1000);
  setTimeout(triggerFireworks, 1500);
};

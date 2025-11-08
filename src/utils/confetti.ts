import confetti from 'canvas-confetti';

/**
 * Triggers a celebration confetti animation when a task is completed
 */
export function celebrateTaskCompletion() {
  const duration = 2000;
  const end = Date.now() + duration;

  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']; // Pastel blue, purple, pink, yellow, green

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: colors,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();

  // Also do a burst from the center
  setTimeout(() => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { x: 0.5, y: 0.5 },
      colors: colors,
      gravity: 0.8,
      scalar: 1.2,
    });
  }, 100);
}


# 🎯 Quick Reference - Celebration Features

## Import Statements

```typescript
// Components
import Podium from '@/components/Podium';
import TrophyReveal from '@/components/TrophyReveal';
import ShareResults from '@/components/ShareResults';
import CertificateDownload from '@/components/CertificateDownload';
import SoundToggle from '@/components/SoundToggle';

// Libraries
import { celebratePodiumPlacement, celebrateAllWinners } from '@/lib/podiumCelebrations';
import { playSoundEffect } from '@/lib/sounds';
import { downloadCertificate, downloadBadge } from '@/lib/certificateGenerator';
```

---

## Quick Usage

### Play Sound Effects
```typescript
// Answer feedback
playSoundEffect.correctAnswer();
playSoundEffect.wrongAnswer();

// Timer
playSoundEffect.timerTick();
playSoundEffect.timerWarning();

// Celebrations
playSoundEffect.winnerFanfare();
playSoundEffect.applause();
playSoundEffect.drumRoll();
```

### Trigger Confetti
```typescript
// By placement
celebratePodiumPlacement(1); // Gold celebration
celebratePodiumPlacement(2); // Silver celebration
celebratePodiumPlacement(3); // Bronze celebration

// All winners
celebrateAllWinners(); // Epic multi-stage celebration
```

### Display Components
```tsx
// Trophy reveal (top 3 only)
<TrophyReveal
  placement={1}
  playerName="Alice"
  score={95}
  onAnimationComplete={() => console.log('Done!')}
/>

// Podium display
<Podium
  winners={[
    { name: "Alice", score: 95, percentage: 95, emoji: "🏆" },
    { name: "Bob", score: 85, percentage: 85, emoji: "🥈" },
    { name: "Carol", score: 75, percentage: 75, emoji: "🥉" },
  ]}
/>

// Share results
<ShareResults
  quizTitle="JavaScript Basics"
  playerName="Alice"
  score={19}
  totalQuestions={20}
  percentage={95}
  placement={1}
/>

// Certificate download
<CertificateDownload
  playerName="Alice"
  quizTitle="JavaScript Basics"
  score={19}
  totalQuestions={20}
  percentage={95}
  placement={1}
/>

// Sound toggle (add to any page)
<SoundToggle size="md" />
```

---

## Common Patterns

### Results Page Pattern
```typescript
const [showTrophy, setShowTrophy] = useState(false);
const [showPodium, setShowPodium] = useState(false);

useEffect(() => {
  // Trigger celebrations on mount
  if (percentage >= 80) {
    playSoundEffect.winnerFanfare();
    celebrateAllWinners();
    
    if (placement <= 3) {
      setTimeout(() => setShowTrophy(true), 1000);
    }
  }
}, [percentage, placement]);

return (
  <>
    <SoundToggle />
    
    {showTrophy && (
      <TrophyReveal
        placement={placement}
        playerName={userName}
        score={score}
        onAnimationComplete={() => {
          setShowTrophy(false);
          setShowPodium(true);
          celebratePodiumPlacement(placement);
        }}
      />
    )}
    
    {showPodium && <Podium winners={topThree} />}
    
    <ShareResults {...props} />
    <CertificateDownload {...props} />
  </>
);
```

### Quiz Taking Pattern
```typescript
const handleAnswerSubmit = () => {
  const correct = selectedAnswer === correctAnswer;
  
  if (correct) {
    playSoundEffect.correctAnswer();
    triggerRandomCelebration(); // Existing function
  } else {
    playSoundEffect.wrongAnswer();
  }
};

// Timer effect
useEffect(() => {
  if (timeLeft <= 5) {
    playSoundEffect.timerTick();
  }
  if (timeLeft === 6) {
    playSoundEffect.timerWarning();
  }
}, [timeLeft]);
```

---

## Props Reference

### Podium
```typescript
interface PodiumProps {
  winners: Array<{
    name: string;
    score: number;
    percentage: number;
    avatar?: string;
    emoji?: string;
  }>;
  onAnimationComplete?: () => void;
}
```

### TrophyReveal
```typescript
interface TrophyRevealProps {
  placement: 1 | 2 | 3;
  playerName: string;
  score: number;
  onAnimationComplete?: () => void;
}
```

### ShareResults
```typescript
interface ShareResultsProps {
  quizTitle: string;
  playerName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  placement?: 1 | 2 | 3 | number;
  className?: string;
}
```

### CertificateDownload
```typescript
interface CertificateDownloadProps {
  playerName: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  placement?: 1 | 2 | 3;
  className?: string;
}
```

### SoundToggle
```typescript
interface SoundToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}
```

---

## Function Reference

### Celebrations
```typescript
// Individual medals
triggerGoldMedalCelebration();    // 5s gold confetti
triggerSilverMedalCelebration();  // 3s silver confetti
triggerBronzeMedalCelebration();  // 2s bronze confetti

// Special effects
triggerFireworks();       // Multi-origin fireworks
triggerStarBurst();       // Star-shaped particles
triggerRainbowShower();   // Rainbow confetti
triggerTrophyRain();      // Gold trophy particles
triggerPodiumExplosion(); // Center + side explosions

// Smart functions
celebratePodiumPlacement(1 | 2 | 3);  // Auto-triggers appropriate celebration
celebrateAllWinners();                // Epic multi-stage celebration
```

### Sounds
```typescript
playSoundEffect.correctAnswer();
playSoundEffect.wrongAnswer();
playSoundEffect.timerTick();
playSoundEffect.timerWarning();
playSoundEffect.questionTransition();
playSoundEffect.leaderboardUpdate();
playSoundEffect.winnerFanfare();
playSoundEffect.drumRoll();
playSoundEffect.applause();
playSoundEffect.achievement();
playSoundEffect.countdownBeep(isGo?: boolean);
playSoundEffect.streakBonus(count: number);
playSoundEffect.positionUp();
playSoundEffect.positionDown();
playSoundEffect.buttonClick();
```

### Certificates
```typescript
// Generate and download certificate
await downloadCertificate({
  playerName: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: Date;
  placement?: 1 | 2 | 3;
});

// Generate and download badge
await downloadBadge({
  type: "1st" | "2nd" | "3rd" | "participation" | "perfect" | "streak";
  playerName: string;
  details?: string;
});
```

---

## Color Constants

```typescript
const COLORS = {
  gold: "#FFD700",      // 1st place
  silver: "#C0C0C0",    // 2nd place
  bronze: "#CD7F32",    // 3rd place
  purple: "#667eea",    // Primary brand
  orange: "#FF991C",    // Accent
};
```

---

## Animation Timings

```typescript
const TIMINGS = {
  trophyReveal: {
    glow: 0,              // Background glow appears
    trophy: 200,          // Trophy spins in
    particles: 500,       // Particles shoot out
    text: 600,            // Placement text
    info: 800,            // Player name/score
    hint: 1500,           // Continue hint
  },
  podium: {
    center: 500,          // 1st place appears
    left: 800,            // 2nd place appears
    right: 1100,          // 3rd place appears
  },
};
```

---

## Conditional Rendering

```typescript
// Show trophy for top 3
{placement && placement <= 3 && <TrophyReveal />}

// Show certificate for 60%+
{percentage >= 60 && <CertificateDownload />}

// Play fanfare for 80%+
if (percentage >= 80) {
  playSoundEffect.winnerFanfare();
}

// Achievement sound for 60%+
if (percentage >= 60) {
  playSoundEffect.achievement();
}
```

---

## Files Reference

### Components
- `/components/Podium.tsx`
- `/components/TrophyReveal.tsx`
- `/components/ShareResults.tsx`
- `/components/CertificateDownload.tsx`
- `/components/SoundToggle.tsx`

### Libraries
- `/lib/podiumCelebrations.ts`
- `/lib/sounds.ts`
- `/lib/certificateGenerator.ts`

### Integration Points
- `/app/dashboard/student/tests/[id]/result/page.tsx`
- `/app/dashboard/student/tests/[id]/take/page.tsx`
- `/app/quick-quiz/[id]/take/page.tsx`

### Documentation
- `/docs/CELEBRATION_FEATURES.md`
- `/docs/RESULTS_PODIUM_COMPLETE.md`
- `/docs/CELEBRATION_QUICK_REFERENCE.md` (this file)

---

## Testing Tips

1. **Test with sound ON and OFF**: Verify mute toggle works
2. **Test different scores**: 100%, 80%, 60%, 50%, 0%
3. **Test placements**: 1st, 2nd, 3rd, 10th
4. **Test on mobile**: Verify native share works
5. **Test certificate downloads**: Check all badge types
6. **Test timer sounds**: Let timer run to <5s
7. **Test answer feedback**: Try correct and wrong answers

---

## Common Issues

### Sound not playing?
- Check if mute toggle is on
- Verify browser autoplay policy (user must interact first)
- Check browser console for audio context errors

### Confetti not showing?
- Verify canvas-confetti is installed
- Check z-index conflicts
- Ensure no CSS overflow:hidden on parent

### Certificates not downloading?
- Check browser popup blocker
- Verify canvas is supported
- Check console for canvas errors

---

## Performance Notes

- Confetti particles are limited to prevent lag
- Audio context suspended until user interaction
- Canvas clears after image generation
- Components lazy load on demand

---

**Quick Reference Version**: 1.0
**Last Updated**: October 31, 2025
**Status**: Production Ready ✅

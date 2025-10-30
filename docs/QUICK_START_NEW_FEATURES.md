# QuestEd - Quick Start Guide for New Features

## 🎯 **Recently Added Features**

This guide covers the newly implemented features (Phases 1-22) and how to use them.

---

## 📚 **Quiz Template Library**

### For Teachers

#### 1. Browse Templates
```typescript
// Navigate to template browser
router.push('/templates');

// Or click "Browse Templates" button on teacher dashboard
```

**Features**:
- Search by keywords
- Filter by category (15 categories)
- Filter by difficulty (easy/medium/hard)
- Sort by: recent, popular, or rating
- View template cards with meta info

#### 2. Preview Template
```typescript
// Click any template card to view details
router.push(`/templates/${templateId}`);
```

**What You See**:
- Full question list with correct answers
- Category, difficulty, time estimates
- Clone count and ratings
- Author information
- Tags and description

#### 3. Clone Template
```typescript
// In template detail page, click "Clone to My Classroom"
// Select target classroom
// Customize title (optional)
// Click "Clone Now"
```

**Result**: Template is copied to your test library with all questions

#### 4. Save Your Test as Template
```typescript
// API endpoint
POST /api/templates/save

// Request body
{
  "testId": "your-test-id",
  "title": "Custom Template Title",
  "description": "Template description",
  "category": "Education",
  "tags": ["math", "algebra"],
  "visibility": "public" | "private",
  "difficulty": "easy" | "medium" | "hard"
}

// Headers
Authorization: Bearer <your-jwt-token>
```

---

## 🎉 **Celebration & Results Features**

### Components Available

#### 1. Podium Display
```tsx
import Podium from '@/components/Podium';

<Podium 
  winners={[
    { name: 'Alice', score: 950, placement: 1 },
    { name: 'Bob', score: 850, placement: 2 },
    { name: 'Charlie', score: 750, placement: 3 }
  ]}
  onAnimationComplete={() => console.log('Podium shown!')}
/>
```

#### 2. Trophy Reveal
```tsx
import TrophyReveal from '@/components/TrophyReveal';

<TrophyReveal
  placement={1} // 1, 2, or 3
  playerName="Alice"
  score={950}
  onAnimationComplete={() => console.log('Trophy revealed!')}
/>
```

#### 3. Confetti Celebrations
```typescript
import { 
  celebratePodiumPlacement,
  triggerGoldMedalCelebration,
  triggerFireworks
} from '@/lib/podiumCelebrations';

// For podium placement
celebratePodiumPlacement(1); // 1, 2, or 3

// Custom celebrations
triggerGoldMedalCelebration(); // 5 seconds
triggerFireworks(); // Multi-origin fireworks
```

#### 4. Sound Effects
```typescript
import { playSoundEffect } from '@/lib/sounds';

// On correct answer
playSoundEffect.correctAnswer();

// On wrong answer
playSoundEffect.wrongAnswer();

// Timer warnings
playSoundEffect.timerTick();
playSoundEffect.timerWarning();

// Celebrations
playSoundEffect.winnerFanfare();
playSoundEffect.applause();
```

#### 5. Sound Toggle
```tsx
import SoundToggle from '@/components/SoundToggle';

<SoundToggle 
  size="md" // sm, md, or lg
  showLabel={false}
  className="fixed top-4 right-4"
/>
```

#### 6. Social Sharing
```tsx
import ShareResults from '@/components/ShareResults';

<ShareResults
  title="My Quiz Results"
  score={85}
  totalQuestions={20}
  url={window.location.href}
/>
```

#### 7. Certificate Download
```tsx
import CertificateDownload from '@/components/CertificateDownload';

<CertificateDownload
  playerName="Alice"
  testName="Math Quiz"
  score={95}
  totalQuestions={20}
  date={new Date()}
  placement={1} // optional, for top 3
/>
```

---

## 👥 **Participant Experience Features**

### 1. Score Animations
```tsx
import ScoreAnimation from '@/components/ScoreAnimation';

const [showScore, setShowScore] = useState(false);

// Show when answer is correct
const handleCorrectAnswer = () => {
  setShowScore(true);
};

<ScoreAnimation
  points={500}
  show={showScore}
  onComplete={() => setShowScore(false)}
  position="center" // center, top, or bottom
  color="green" // green, gold, purple, blue
/>
```

### 2. Streak Indicators
```tsx
import StreakIndicator, { 
  StreakBrokenAnimation,
  StreakMilestoneAnimation 
} from '@/components/StreakIndicator';

// Current streak display
<StreakIndicator
  streak={5}
  size="md"
  className="fixed top-20 right-4"
/>

// When streak breaks
<StreakBrokenAnimation
  previousStreak={7}
  show={streakBroken}
  onComplete={() => setStreakBroken(false)}
/>

// Milestone celebrations (5, 10, 15+)
<StreakMilestoneAnimation
  streak={10}
  show={showMilestone}
  onComplete={() => setShowMilestone(false)}
/>
```

### 3. Position Change Indicators
```tsx
import PositionChangeIndicator, { 
  PositionBadge,
  RankUpAnimation 
} from '@/components/PositionChangeIndicator';

// Show rank change
<PositionChangeIndicator
  change={3} // +3 for up, -2 for down
  show={showChange}
  onComplete={() => setShowChange(false)}
/>

// Current position badge
<PositionBadge
  position={2}
  previousPosition={5}
  totalPlayers={20}
/>

// Major rank improvement
<RankUpAnimation
  newRank={1}
  show={showRankUp}
  onComplete={() => setShowRankUp(false)}
/>
```

### 4. Haptic Feedback
```typescript
import { playHaptic, haptics } from '@/lib/haptics';

// Direct haptic patterns
playHaptic.correctAnswer(); // Success burst
playHaptic.wrongAnswer(); // Error pattern
playHaptic.timerWarning(); // Rapid pulses
playHaptic.celebration(); // Escalating pattern
playHaptic.streakBonus(); // Building intensity

// Using manager for control
haptics.correctAnswer(); // Respects enabled state
haptics.toggle(); // Toggle on/off
haptics.isEnabled(); // Check state
```

### 5. Haptic Toggle
```tsx
import HapticToggle from '@/components/HapticToggle';

// Only shows on devices with vibration support
<HapticToggle 
  size="md"
  showLabel={false}
  className="fixed top-16 right-4"
/>
```

---

## 🎯 **Integration Examples**

### Complete Quiz Taking Page
```tsx
'use client';

import { useState, useEffect } from 'react';
import SoundToggle from '@/components/SoundToggle';
import HapticToggle from '@/components/HapticToggle';
import ScoreAnimation from '@/components/ScoreAnimation';
import StreakIndicator from '@/components/StreakIndicator';
import PositionBadge from '@/components/PositionChangeIndicator';
import { playSoundEffect } from '@/lib/sounds';
import { playHaptic } from '@/lib/haptics';

export default function QuizTakePage() {
  const [streak, setStreak] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [points, setPoints] = useState(0);
  const [position, setPosition] = useState(5);
  const [previousPosition, setPreviousPosition] = useState(5);

  const handleAnswerSubmit = (isCorrect: boolean) => {
    if (isCorrect) {
      // Update streak
      setStreak(prev => prev + 1);
      
      // Calculate points
      const earnedPoints = 500;
      setPoints(earnedPoints);
      setShowScore(true);
      
      // Feedback
      playSoundEffect.correctAnswer();
      playHaptic.correctAnswer();
    } else {
      // Reset streak
      setStreak(0);
      
      // Feedback
      playSoundEffect.wrongAnswer();
      playHaptic.wrongAnswer();
    }
  };

  return (
    <div className="relative">
      {/* Controls */}
      <div className="fixed top-4 right-4 flex gap-2">
        <SoundToggle size="md" />
        <HapticToggle size="md" />
      </div>

      {/* Streak indicator */}
      {streak > 0 && (
        <StreakIndicator 
          streak={streak} 
          className="fixed top-20 right-4"
        />
      )}

      {/* Position badge */}
      <PositionBadge
        position={position}
        previousPosition={previousPosition}
        totalPlayers={20}
        className="fixed top-4 left-4"
      />

      {/* Score animation */}
      <ScoreAnimation
        points={points}
        show={showScore}
        onComplete={() => setShowScore(false)}
        color="green"
      />

      {/* Quiz content */}
      <div className="p-8">
        {/* Your quiz UI here */}
      </div>
    </div>
  );
}
```

### Complete Results Page
```tsx
'use client';

import { useState, useEffect } from 'react';
import Podium from '@/components/Podium';
import TrophyReveal from '@/components/TrophyReveal';
import ShareResults from '@/components/ShareResults';
import CertificateDownload from '@/components/CertificateDownload';
import { celebratePodiumPlacement } from '@/lib/podiumCelebrations';
import { playSoundEffect } from '@/lib/sounds';

export default function ResultsPage() {
  const [showTrophy, setShowTrophy] = useState(false);
  const [showPodium, setShowPodium] = useState(false);

  const playerScore = 95;
  const placement = 1;

  useEffect(() => {
    // Show trophy for top 3
    if (placement <= 3) {
      setShowTrophy(true);
      playSoundEffect.winnerFanfare();
    }

    // Trigger celebrations based on score
    if (playerScore >= 80) {
      celebratePodiumPlacement(placement);
    }
  }, []);

  const handleTrophyComplete = () => {
    setShowTrophy(false);
    setShowPodium(true);
  };

  return (
    <div>
      {/* Trophy reveal */}
      <TrophyReveal
        placement={placement}
        playerName="Alice"
        score={playerScore}
        onAnimationComplete={handleTrophyComplete}
      />

      {/* Main results */}
      <div className="max-w-4xl mx-auto p-8">
        <h1>Quiz Results</h1>
        <p>Score: {playerScore}%</p>

        {/* Podium for top 3 */}
        {showPodium && (
          <Podium winners={[
            { name: 'Alice', score: 950, placement: 1 },
            { name: 'Bob', score: 850, placement: 2 },
            { name: 'Charlie', score: 750, placement: 3 }
          ]} />
        )}

        {/* Sharing */}
        <ShareResults
          title="I scored 95% on this quiz!"
          score={playerScore}
          totalQuestions={20}
          url={window.location.href}
        />

        {/* Certificate */}
        {playerScore >= 60 && (
          <CertificateDownload
            playerName="Alice"
            testName="Math Quiz"
            score={playerScore}
            totalQuestions={20}
            date={new Date()}
            placement={placement}
          />
        )}
      </div>
    </div>
  );
}
```

---

## 🎨 **Customization Options**

### Color Schemes
All animation components support custom colors:
- **green**: Success, correct answers (default)
- **gold**: Achievements, bonuses
- **purple**: Special events, milestones
- **blue**: Information, neutral

### Sizes
Most components support three sizes:
- **sm**: Compact for mobile
- **md**: Standard desktop (default)
- **lg**: Large for emphasis

### Positions
Score animations can appear at:
- **center**: Full attention (default)
- **top**: Less intrusive
- **bottom**: Near controls

---

## 📱 **Mobile Considerations**

### Haptic Feedback
- Only works on devices with Vibration API
- iOS requires user interaction first
- Android works immediately
- Component auto-hides on unsupported devices

### Touch Interactions
- All buttons are touch-friendly (44x44px minimum)
- Swipe gestures supported where applicable
- Responsive layouts for all screen sizes

### Performance
- Animations use hardware acceleration
- Particles limited on mobile
- Lazy loading for heavy components

---

## 🐛 **Troubleshooting**

### Sounds Not Playing
1. Check browser autoplay policy
2. User must interact with page first
3. Verify sound toggle is enabled
4. Check browser console for errors

### Haptics Not Working
1. Check device support: `isHapticsSupported()`
2. iOS requires permission on first use
3. Verify haptic toggle is enabled
4. Some browsers block vibration in iframes

### Templates Not Loading
1. Verify MongoDB connection
2. Check JWT token in localStorage
3. Ensure user has teacher role
4. Check network tab for API errors

### Animations Not Smooth
1. Reduce particle counts on low-end devices
2. Disable some animations for performance
3. Check for conflicting CSS
4. Verify Framer Motion is installed

---

## 🚀 **Best Practices**

### Performance
- Use `AnimatePresence` for mount/unmount animations
- Debounce search inputs (300ms recommended)
- Lazy load templates (pagination)
- Preload sounds on page load

### UX
- Always provide visual + audio + haptic feedback
- Allow users to disable effects
- Use appropriate animation durations (1-2s max)
- Don't block user interactions during animations

### Accessibility
- Provide text alternatives for animations
- Support keyboard navigation
- Respect `prefers-reduced-motion`
- Ensure sufficient color contrast

---

## 📚 **API Reference**

### Template APIs
```typescript
// Browse templates
GET /api/templates?search=math&category=Education&sort=popular&page=1

// Get template details
GET /api/templates/{id}

// Save test as template
POST /api/templates/save
Body: { testId, title, category, tags, visibility, difficulty }

// Clone template
POST /api/templates/{id}/clone
Body: { classroomId, title, mode, startTime, endTime }

// Delete template
DELETE /api/templates/{id}
```

### Response Formats
```typescript
// Template list response
{
  templates: Template[],
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number,
    hasMore: boolean
  }
}

// Template detail response
{
  _id: string,
  title: string,
  description: string,
  category: string,
  difficulty: 'easy' | 'medium' | 'hard',
  questions: TemplateQuestion[],
  ...
}
```

---

## ✅ **What's Complete**

**Phases 1-22 (67% of project)**:
- ✅ Results & Podium (7 phases)
- ✅ Quiz Library (7 phases - missing external import)
- ✅ Participant Experience (5 phases - missing emoji/avatar)
- ✅ Sound Effects
- ✅ Haptic Feedback
- ✅ Social Sharing
- ✅ Certificates & Badges

## 🔜 **What's Next**

**Remaining 10 phases**:
- External import (Kahoot/Quizlet)
- Emoji nicknames & avatars
- Security features (PIN, password, rate limiting)
- Final integration & testing
- Comprehensive documentation

---

## 💡 **Tips & Tricks**

1. **Template Discovery**: Use tags for better searchability
2. **Performance**: Clone popular templates instead of recreating
3. **Engagement**: Enable all feedback types (sound + haptic + visual)
4. **Mobile**: Test on actual devices, not just Chrome DevTools
5. **Celebrations**: Trigger based on performance thresholds (80%+ = big celebration)

---

## 🆘 **Need Help?**

Check these files for detailed documentation:
- `/docs/CELEBRATION_FEATURES.md` - Complete celebration system guide
- `/docs/CELEBRATION_QUICK_REFERENCE.md` - Quick component reference
- `/docs/SESSION_COMPLETION_SUMMARY.md` - Implementation details
- `/docs/RESULTS_PODIUM_COMPLETE.md` - Results page implementation

---

**Last Updated**: Session completion after Phase 22
**Version**: QuestEd v2.0 (20/30 phases complete)

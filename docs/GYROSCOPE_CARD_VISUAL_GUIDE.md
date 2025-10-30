# Gyroscope Profile Card - Visual Guide

## Feature Overview

The Profile Card on the About Creator page now features **gyroscope-enabled 3D tilt** for mobile devices! 📱✨

---

## Mobile Experience

### Initial State
```
┌─────────────────────────────────────┐
│                                     │
│         [Profile Card]              │
│                                     │
│    📱 "Tilt your device to          │
│        move the card!"              │
└─────────────────────────────────────┘
```

### Device Tilted Left
```
┌─────────────────────────────────────┐
│                                     │
│           ╱ [Card] ╲                │
│          ╱  tilted  ╲               │
│         ╱    left    ╲              │
│                                     │
└─────────────────────────────────────┘
Device: ⟵ (tilted left)
```

### Device Tilted Right
```
┌─────────────────────────────────────┐
│                                     │
│            ╱ [Card] ╲               │
│           ╱  tilted  ╲              │
│          ╱   right    ╲             │
│                                     │
└─────────────────────────────────────┘
Device: ⟶ (tilted right)
```

### Device Tilted Forward
```
┌─────────────────────────────────────┐
│                                     │
│         ╔═══════════╗               │
│         ║  [Card]   ║               │
│         ║  tilted   ║               │
│         ║  forward  ║               │
│         ╚═══════════╝               │
└─────────────────────────────────────┘
Device: ⤵ (tilted forward)
```

---

## Desktop Experience

### Cursor Hover
```
┌─────────────────────────────────────┐
│            👆 Cursor                │
│                                     │
│         [Card tilts toward          │
│          cursor position]           │
│                                     │
└─────────────────────────────────────┘
```

---

## User Flow

### Mobile Users
1. **Page Load** → Hint appears
   ```
   "📱 Tilt your device to move the card!"
   ```

2. **After 5 Seconds** → Hint fades
   ```
   [Card visible, ready to respond]
   ```

3. **User Tilts Device** → Card responds
   ```
   Device Movement → Gyroscope → Card Tilt
   ```

### iOS Users (Additional Step)
1. **First Interaction** → Permission prompt
   ```
   "Allow motion & orientation access?"
   [Allow] [Don't Allow]
   ```

2. **User Allows** → Gyroscope enabled
   ```
   ✅ Card now responds to device tilt
   ```

### Desktop Users
1. **Page Load** → No hint shown
2. **Mouse Hover** → Card tilts toward cursor
3. **Mouse Leave** → Card returns to center

---

## Visual States

### Hint Component

**Visible State (0-5 seconds)**
```
┌──────────────────────────────────┐
│  📱 Tilt your device to move     │
│     the card!                    │
└──────────────────────────────────┘
Background: Orange (#FF991C)
Text: Black
Animation: Fade in + slide up
```

**Hidden State (after 5 seconds)**
```
[Hint fades out smoothly]
```

---

## Card Transform Examples

### Rotation Values

| Device Tilt | Beta (β) | Gamma (γ) | Card Rotation |
|-------------|----------|-----------|---------------|
| Neutral     | 0°       | 0°        | No rotation   |
| Left 30°    | 0°       | -30°      | RotateY: -24° |
| Right 30°   | 0°       | 30°       | RotateY: 24°  |
| Forward 20° | 20°      | 0°        | RotateX: 5°   |
| Back 20°    | -20°     | 0°        | RotateX: -5°  |

### Sensitivity Impact

**Low Sensitivity (5)**
```
Device: ←→ (45° tilt)
Card:   ← (subtle tilt)
```

**Medium Sensitivity (8) - Current**
```
Device: ←→ (45° tilt)
Card:   ←→ (balanced tilt)
```

**High Sensitivity (12)**
```
Device: ←→ (45° tilt)
Card:   ←→→ (dramatic tilt)
```

---

## Animation Timeline

```
Time: 0s ─────→ 5s ─────→ ∞
      │        │         │
      │        │         └── Hint hidden, gyroscope active
      │        └── Hint fades out
      └── Hint appears

Gyroscope: ███████████████████████████
           (Active throughout)

Hint:      ████████░░░░░░░░░░░░░░░░░░
           (Visible) (Hidden)
```

---

## Responsive Behavior

### Mobile Portrait
```
┌──────────┐
│          │
│  [Card]  │
│          │
│ 📱 Hint  │
│          │
└──────────┘
Width: 375-428px
Height: 667-926px
```

### Mobile Landscape
```
┌─────────────────────────┐
│  [Card]      [Info]     │
│              [Projects] │
│ 📱 Hint                 │
└─────────────────────────┘
Width: 667-926px
Height: 375-428px
```

### Tablet
```
┌───────────────────────────────┐
│  [Card]        [Info]         │
│                [Projects]     │
│                [Connect]      │
└───────────────────────────────┘
Width: 768-1024px
No hint shown (detected as desktop)
```

### Desktop
```
┌─────────────────────────────────────────┐
│  [Card]          [Info Section]         │
│  (hover          [Projects Section]     │
│   tilt)          [Connect Section]      │
└─────────────────────────────────────────┘
Width: 1024px+
Mouse-based tilt only
```

---

## Component Architecture

```
AboutCreator Page
├── Mobile Detection Logic
│   ├── useState(isMobile)
│   ├── useState(showMobileHint)
│   └── useEffect → setTimeout(5s)
│
├── ProfileCard Component
│   ├── enableTilt={true}
│   ├── enableMobileTilt={true}
│   ├── mobileTiltSensitivity={8}
│   └── Gyroscope Event Listeners
│
└── Mobile Hint Tooltip
    ├── Conditional Rendering
    ├── Framer Motion Animation
    └── Auto-dismiss Timer
```

---

## CSS Transform Breakdown

### Card Transformation
```css
transform: 
  perspective(1000px)           /* 3D space */
  rotateX(var(--rotate-x))     /* Vertical tilt */
  rotateY(var(--rotate-y))     /* Horizontal tilt */
  translateZ(20px);            /* Lift effect */

transition: 
  transform 0.3s ease-out;     /* Smooth movement */
```

### Shine Effect
```css
.pc-shine {
  background: linear-gradient(
    calc(var(--pointer-x) - 50%) 
    calc(var(--pointer-y) - 50%),
    rgba(255,255,255,0.5),
    transparent
  );
}
```

### Glare Effect
```css
.pc-glare {
  opacity: var(--pointer-from-center);
  background: radial-gradient(
    circle at 
    var(--pointer-x) 
    var(--pointer-y),
    rgba(255,255,255,0.3),
    transparent 50%
  );
}
```

---

## Interactive Demo Description

**What Users Experience:**

1. **Mobile Users See:**
   - Instant visual feedback as they tilt their device
   - Card smoothly follows device orientation
   - Helpful hint for first-time visitors
   - Shine and glare effects respond to tilt angle
   - Smooth 60 FPS animations

2. **Desktop Users See:**
   - Card tilts toward mouse cursor
   - Hover state activates smooth tracking
   - Mouse leave returns card to center
   - Same shine/glare effects follow cursor

3. **All Users Get:**
   - Consistent branding (QuestEd colors)
   - Accessible contact button
   - Profile information display
   - Smooth, performant animations

---

## Browser DevTools Testing

### Simulating Gyroscope in Chrome DevTools

1. **Open DevTools** (F12)
2. **Toggle Device Toolbar** (Ctrl+Shift+M)
3. **Click "..." menu** → More tools → Sensors
4. **Select "Custom orientation"**
5. **Adjust Alpha, Beta, Gamma sliders**

**Values to Test:**
```
Neutral:    β=0°,  γ=0°
Left tilt:  β=0°,  γ=-30°
Right tilt: β=0°,  γ=30°
Forward:    β=20°, γ=0°
Backward:   β=-20°, γ=0°
```

---

## Success Metrics

✅ **Functionality**
- Card responds to device orientation
- Smooth animations at 60 FPS
- No console errors
- Works on all supported browsers

✅ **User Experience**
- Hint appears and disappears correctly
- iOS permission flow works
- Graceful fallback on unsupported devices
- Desktop experience unchanged

✅ **Performance**
- No frame drops during tilt
- Memory usage stable
- Battery impact minimal
- Fast initial load

---

## Comparison: Before vs After

### Before
```
📱 Mobile: Touch/tap only
🖥️ Desktop: Mouse hover tilt
🔄 Interaction: Limited to 2D
```

### After
```
📱 Mobile: Gyroscope 3D tilt + touch/tap
🖥️ Desktop: Mouse hover tilt (unchanged)
🔄 Interaction: Full 3D immersive experience
✨ Bonus: Visual hints for discovery
```

---

## Accessibility Notes

- ✅ Works without motion (mouse/touch fallback)
- ✅ No motion for users who disabled it (iOS settings)
- ✅ Visual hint helps discovery
- ✅ Keyboard accessible contact button
- ✅ Screen reader compatible

---

## Related Documentation

- Main Feature Doc: `/docs/GYROSCOPE_CARD_FEATURE.md`
- Component Code: `/components/ProfileCard.tsx`
- Implementation: `/app/about-creator/page.tsx`
- Styling: `/components/ProfileCard.css`

---

**Enjoy the immersive experience! 🎉**

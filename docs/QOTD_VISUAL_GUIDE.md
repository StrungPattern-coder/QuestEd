# Question of the Day - Visual Guide

**Quick visual reference for the QOTD feature**

---

## 🎯 Feature Overview

```
Landing Page → Floating Button → Modal → Vote → See Results
     ↓              ↓              ↓       ↓         ↓
  Anytime      Bottom-right    Full UI   A or B   Live %
```

---

## 📱 User Interface Components

### 1. Floating Button

```
┌─────────────────────────────────────┐
│                                     │
│  Bottom-right corner of page        │
│                                     │
│            ┌─────────────┐          │
│            │             │          │
│            │  ┌───────┐  │          │
│            │  │   ❓  │  │ ← Icon   │
│            │  └───────┘  │          │
│            │             │          │
│            │  ◉ ◉ ◉ ◉   │ ← Pulse  │
│            └─────────────┘          │
│                  ↑                  │
│                  │                  │
│            Red "!" badge            │
│            (if not voted)           │
│                                     │
└─────────────────────────────────────┘

Size: 56px × 56px
Background: Linear gradient
  from-purple-500
  via-pink-500
  to-orange-500
Shadow: Large with purple glow
Animation: Infinite pulse ring
```

### 2. Auto-Popup Prompt

```
┌─────────────────────────────────────────┐
│                                     [X] │  ← Close
│  ┌───┐                                  │
│  │ ❓ │  Question of the Day!           │
│  └───┘                                  │
│                                         │
│  Answer today's fun question and        │
│  see what everyone thinks!              │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │     Answer Now!                 │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘

Position: Bottom-right (above button)
Size: 288px width
Background: White with purple border
Animation: Slide up + fade in
Timing: 3 seconds after page load
```

### 3. Vote Modal (Before Voting)

```
┌─────────────────────────────────────────────────┐
│  Gradient Header (purple→pink→orange)       [X] │
│                                                 │
│  ❓ Question of the Day                         │
│  [Sports]                                       │
├─────────────────────────────────────────────────┤
│                                                 │
│                                                 │
│          Messi or Ronaldo?                      │  ← 2xl font
│                                                 │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │                                           │ │
│  │           Messi                           │ │  ← Option A
│  │       (Blue gradient)                     │ │
│  │                                           │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │                                           │ │
│  │           Ronaldo                         │ │  ← Option B
│  │       (Pink gradient)                     │ │
│  │                                           │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
├─────────────────────────────────────────────────┤
│  New question every day! Come back tomorrow.    │
└─────────────────────────────────────────────────┘

Max-width: 512px
Border-radius: 24px
Backdrop: Black 60% opacity + blur
Button hover: Scale 1.02x
```

### 4. Results Modal (After Voting)

```
┌─────────────────────────────────────────────────┐
│  Gradient Header                            [X] │
│  ❓ Question of the Day                         │
│  [Sports]                                       │
├─────────────────────────────────────────────────┤
│                                                 │
│      📈 Here's what the community thinks!       │
│                                                 │
│  Messi                              43%         │  ← Large %
│  ████████████░░░░░░░░░░░░░░░░░░                │  ← Blue bar
│  ← Your choice                                  │  ← Indicator
│                                                 │
│  Ronaldo                            57%         │
│  ████████████████░░░░░░░░░░░░░░░░              │  ← Pink bar
│                                                 │
├─────────────────────────────────────────────────┤
│              234 total votes                    │
├─────────────────────────────────────────────────┤
│  New question every day! Come back tomorrow.    │
└─────────────────────────────────────────────────┘

Progress bars:
- Animated fill: 0% → final %
- Duration: 1 second
- Easing: ease-out
- Your choice: Colored (blue/pink)
- Other option: Gray
```

---

## 🔄 User Flow Diagram

### First-Time Visitor Journey

```
┌─────────────────────────────────────────────────┐
│           Landing Page Loads                    │
└─────────────────┬───────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────┐
│    Floating Button Appears (bottom-right)       │
│    - Gradient design                            │
│    - Pulse animation                            │
│    - Red "!" badge                              │
└─────────────────┬───────────────────────────────┘
                  │
        Wait 3 seconds
                  │
                  ↓
┌─────────────────────────────────────────────────┐
│    Auto-Prompt Pops Up                          │
│    - "Question of the Day!"                     │
│    - "Answer Now!" button                       │
│    - Can dismiss with X                         │
└─────────────────┬───────────────────────────────┘
                  │
        User clicks button/prompt
                  │
                  ↓
┌─────────────────────────────────────────────────┐
│    Modal Opens                                  │
│    - Backdrop darkens                           │
│    - Modal slides in                            │
│    - Question displayed                         │
└─────────────────┬───────────────────────────────┘
                  │
        User reads question
                  │
                  ↓
┌─────────────────────────────────────────────────┐
│    User Votes                                   │
│    - Clicks Option A or B                       │
│    - Button shows loading                       │
│    - Vote sent to API                           │
└─────────────────┬───────────────────────────────┘
                  │
        API processes vote
                  │
                  ↓
┌─────────────────────────────────────────────────┐
│    Results Appear                               │
│    - Progress bars animate                      │
│    - Percentages display                        │
│    - Your choice highlighted                    │
│    - Total votes shown                          │
└─────────────────┬───────────────────────────────┘
                  │
        User closes modal
                  │
                  ↓
┌─────────────────────────────────────────────────┐
│    Back to Landing Page                         │
│    - Red badge removed                          │
│    - Can reopen to see results                  │
│    - LocalStorage updated                       │
└─────────────────────────────────────────────────┘
```

### Returning Visitor Journey (Next Day)

```
┌─────────────────────────────────────────────────┐
│    User Returns (24h+ later)                    │
└─────────────────┬───────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────┐
│    Button Shows Red Badge Again                 │
│    - New question available                     │
│    - localStorage checked                       │
│    - Different date = can vote                  │
└─────────────────┬───────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────┐
│    Auto-Prompt Appears Again                    │
│    - Same 3-second delay                        │
│    - Same dismissible behavior                  │
└─────────────────┬───────────────────────────────┘
                  │
        User votes on new question
                  │
                  ↓
┌─────────────────────────────────────────────────┐
│    Streak Continues! 🔥                         │
│    (Future: Show streak counter)                │
└─────────────────────────────────────────────────┘
```

---

## 🎨 Color Palette

### Button & Header Gradient

```css
background: linear-gradient(
  to bottom-right,
  #a855f7,  /* purple-500 */
  #ec4899,  /* pink-500 */
  #fb923c   /* orange-500 */
);
```

### Vote Button Gradients

**Option A (Blue):**
```css
background: linear-gradient(
  to right,
  #3b82f6,  /* blue-500 */
  #06b6d4   /* cyan-500 */
);
```

**Option B (Pink):**
```css
background: linear-gradient(
  to right,
  #ec4899,  /* pink-500 */
  #f43f5e   /* rose-500 */
);
```

### Progress Bar Colors

**Your choice:**
- Option A voted: Blue gradient
- Option B voted: Pink gradient

**Other option:**
- Gray (#9ca3af, gray-400)

---

## 📊 State Diagram

```
┌─────────────────────────────────────┐
│         Initial State               │
│  - No vote today                    │
│  - Red badge visible                │
│  - Auto-prompt will show            │
└───────────────┬─────────────────────┘
                │
        User opens modal
                │
                ↓
┌─────────────────────────────────────┐
│         Voting State                │
│  - Question displayed               │
│  - Two vote buttons                 │
│  - Can click either option          │
└───────────────┬─────────────────────┘
                │
        User clicks option
                │
                ↓
┌─────────────────────────────────────┐
│        Loading State                │
│  - Button disabled                  │
│  - Spinner/loading indicator        │
│  - API call in progress             │
└───────────────┬─────────────────────┘
                │
        API responds
                │
                ↓
┌─────────────────────────────────────┐
│        Results State                │
│  - Progress bars visible            │
│  - Percentages shown                │
│  - Your choice highlighted          │
│  - Can't vote again                 │
└───────────────┬─────────────────────┘
                │
        User closes modal
                │
                ↓
┌─────────────────────────────────────┐
│       Completed State               │
│  - Red badge removed                │
│  - localStorage updated             │
│  - Can reopen for results           │
│  - Wait until tomorrow              │
└─────────────────────────────────────┘
```

---

## 🎭 Animation Timeline

### Modal Open Sequence

```
Time   | Element        | Animation
-------|----------------|-----------------------------
0ms    | Backdrop       | opacity: 0 → 1 (fade in)
0ms    | Modal          | scale: 0.9 → 1 (zoom in)
0ms    | Modal          | y: 20px → 0 (slide up)
0ms    | Modal          | opacity: 0 → 1 (fade in)
300ms  | Animation ends | All elements in place
```

### Vote Button Click Sequence

```
Time   | Element        | Animation
-------|----------------|-----------------------------
0ms    | Button         | scale: 1 → 0.98 (tap down)
50ms   | Button         | scale: 0.98 → 1 (release)
100ms  | Loading starts | Spinner appears
200ms  | API call       | Waiting for response
500ms  | API responds   | Results data received
500ms  | Results        | Fade in (opacity 0 → 1)
500ms  | Progress bars  | width: 0% (start)
1500ms | Progress bars  | width: final % (end)
```

### Progress Bar Fill

```
Progress: [░░░░░░░░░░░░░░░░░░░░]  0%
          [████░░░░░░░░░░░░░░░░] 20%   (200ms)
          [████████░░░░░░░░░░░░] 40%   (400ms)
          [████████████░░░░░░░░] 60%   (600ms)
          [████████████████░░░░] 80%   (800ms)
          [████████████████████] 100%  (1000ms)
                                       ↑
                              Ease-out easing
```

---

## 💾 LocalStorage Structure

### Keys & Values

```javascript
// After voting
localStorage.setItem('qotd_voted_date', 'Wed Oct 30 2025');

// After dismissing prompt
localStorage.setItem('qotd_dismissed_date', 'Wed Oct 30 2025');

// Check if can vote
const votedToday = localStorage.getItem('qotd_voted_date');
const today = new Date().toDateString();
const canVote = votedToday !== today;

// Check if should show prompt
const dismissedToday = localStorage.getItem('qotd_dismissed_date');
const shouldPrompt = dismissedToday !== today && canVote;
```

### Data Flow

```
Vote Action
    ↓
API Call (POST /api/qotd)
    ↓
Database Update (votesA += 1)
    ↓
Response with Results
    ↓
Update UI (show percentages)
    ↓
Save to localStorage (qotd_voted_date)
    ↓
Remove badge from button
    ↓
Done!
```

---

## 🌍 Multi-Language Support

### English Display

```
Button tooltip: "Question of the Day"
Prompt title:   "Question of the Day!"
Prompt text:    "Answer today's fun question..."
Button text:    "Answer Now!"
Results text:   "Here's what the community thinks!"
Your choice:    "Your choice"
Total votes:    "total votes"
Footer:         "New question every day! Come back tomorrow."
```

### German Display

```
Button tooltip: "Frage des Tages"
Prompt title:   "Frage des Tages!"
Prompt text:    "Beantworte die heutige Spaßfrage..."
Button text:    "Jetzt antworten!"
Results text:   "Das denkt die Community!"
Your choice:    "Deine Wahl"
Total votes:    "Stimmen insgesamt"
Footer:         "Jeden Tag eine neue Frage! Komm morgen wieder."
```

---

## 📱 Responsive Breakpoints

### Mobile (< 640px)

```
┌─────────────────────┐
│                     │
│  Full-screen modal  │
│  Max-width: 90vw    │
│                     │
│  Button:            │
│  - Bottom-right     │
│  - 56px × 56px      │
│  - Fixed position   │
│                     │
│  Prompt:            │
│  - Bottom-right     │
│  - 280px width      │
│  - Above button     │
│                     │
└─────────────────────┘
```

### Tablet (640px - 1024px)

```
┌───────────────────────────────┐
│                               │
│  Modal centered               │
│  Max-width: 512px             │
│  Padding: 32px                │
│                               │
│  Button:                      │
│  - Same as mobile             │
│                               │
│  Prompt:                      │
│  - Same width                 │
│  - Better spacing             │
│                               │
└───────────────────────────────┘
```

### Desktop (> 1024px)

```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│        Modal centered                   │
│        Max-width: 512px                 │
│        Nice spacing all around          │
│                                         │
│                                         │
│                      ┌──────┐           │
│                      │  ❓  │ Button    │
│                      └──────┘           │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎯 Example Questions & Results

### Example 1: Close Race

```
Question: Coffee or Tea?

Before voting:
┌─────────────────────────┐
│   ☕ Coffee             │
│   🍵 Tea                │
└─────────────────────────┘

After voting (Option A):
☕ Coffee              52%
████████████████░░░░░░░░░
← Your choice

🍵 Tea                 48%
███████████████░░░░░░░░░░

487 total votes
```

### Example 2: Landslide Victory

```
Question: Cats or Dogs?

After voting (Option B):
🐱 Cats               35%
████████░░░░░░░░░░░░░░░░

🐶 Dogs               65%
████████████████░░░░░░░░
← Your choice

1,243 total votes
```

### Example 3: Perfect Split

```
Question: Marvel or DC?

After voting (Option A):
Marvel                50%
████████████░░░░░░░░░░░░
← Your choice

DC                    50%
████████████░░░░░░░░░░░░

892 total votes
```

---

## 🔧 Technical Flow

### Component Lifecycle

```
Mount
  ↓
Check localStorage (voted? dismissed?)
  ↓
Fetch question from API
  ↓
Start 3-second timer for prompt
  ↓
Render floating button
  ↓
User interactions...
  ↓
Unmount (cleanup timers)
```

### API Request Flow

```
GET /api/qotd
  ↓
Connect to MongoDB
  ↓
Find question for today
  ↓
If not found:
  - Pick random from pool
  - Create new document
  - Return question
Else:
  - Return existing question
  ↓
Response with vote counts
```

### Vote Submission Flow

```
User clicks Option A
  ↓
POST /api/qotd
  { questionId, vote: 'A' }
  ↓
Connect to MongoDB
  ↓
Atomic increment: votesA += 1
  ↓
Calculate percentages:
  - total = votesA + votesB
  - percentageA = (votesA / total) * 100
  - percentageB = (votesB / total) * 100
  ↓
Return results
  ↓
Update UI with animated bars
  ↓
Save to localStorage
```

---

## 📈 Success Indicators

### Visual Feedback

**Vote Successful:**
- ✅ Progress bars animate smoothly
- ✅ Your choice highlighted in color
- ✅ Percentage shows immediately
- ✅ Total votes updated
- ✅ Badge removed from button

**Vote Failed:**
- ❌ Error message appears
- ❌ Buttons re-enabled
- ❌ Can try again
- ❌ Badge remains on button

### User Engagement Signals

**High Engagement:**
- 30%+ of visitors vote
- Low prompt dismissal rate
- Users return daily
- Questions shared socially

**Low Engagement:**
- < 10% voting rate
- High dismissal rate
- No repeat visitors
- Modal closed quickly

---

**Last Updated:** October 30, 2025  
**Version:** 1.0  
**Status:** Production Ready

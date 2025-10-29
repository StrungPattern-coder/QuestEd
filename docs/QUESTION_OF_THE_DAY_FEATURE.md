# Question of the Day (QOTD) Feature

**Date:** October 30, 2025  
**Status:** ✅ FULLY IMPLEMENTED  
**Feature Type:** Community Engagement & Daily Poll

---

## Overview

The **Question of the Day (QOTD)** is a fun, low-stakes community poll feature that appears on the landing page for all visitors. Each day, a new question with two options is presented, and users can vote to see what the community thinks. This creates a sense of shared community and provides an engaging, non-quiz interaction point.

### Key Benefits

✅ **Community Building** - Shared daily experience across all visitors  
✅ **Low Friction** - No signup required, just click and vote  
✅ **Daily Engagement** - New question every day brings users back  
✅ **Fun & Casual** - Hot trending questions (Cats vs Dogs, Marvel vs DC, etc.)  
✅ **Social Proof** - See what percentage of community chose each option  
✅ **Prominent Discovery** - Floating button + optional popup prompt

---

## User Experience

### Discovery Methods

1. **Floating Button (Always Visible)**
   - Fixed position: bottom-right corner
   - Gradient design: purple → pink → orange
   - Question mark icon
   - Pulse animation ring
   - Red "!" badge if not voted today

2. **Auto-Popup Prompt (First-Time)**
   - Appears 3 seconds after landing on homepage
   - Dismissible (won't show again today if dismissed)
   - Call-to-action to answer question
   - Only shows if user hasn't voted today

### User Flow

```
Landing Page → See Floating Button / Auto-Prompt
    ↓
Click Button/Prompt → Modal Opens
    ↓
Read Question (e.g., "Cats or Dogs?")
    ↓
Vote for Option A or B
    ↓
See Live Results with Percentages
    ↓
Your choice highlighted
    ↓
Close Modal → Badge disappears
    ↓
Come back tomorrow for new question!
```

### Visual Design

**Floating Button:**
- Size: 56px × 56px circle
- Background: Gradient (purple → pink → orange)
- Icon: HelpCircle (white)
- Shadow: Large, purple glow
- Animation: Pulse ring, hover scale
- Badge: Red circle with "!" (if not voted)

**Modal:**
- Max width: 512px
- Rounded corners: 24px
- Header: Gradient background matching button
- Question: Large, bold text (2xl)
- Vote buttons: Full-width, gradient (blue/pink)
- Results: Animated progress bars with percentages
- Footer: "New question every day" message

---

## Technical Implementation

### Database Schema

**Model:** `QuestionOfTheDay`

```typescript
interface IQuestionOfTheDay {
  question: string;        // e.g., "Cats or Dogs?"
  optionA: string;         // e.g., "🐱 Cats"
  optionB: string;         // e.g., "🐶 Dogs"
  date: Date;              // Unique per day (midnight UTC)
  votesA: number;          // Count of votes for A
  votesB: number;          // Count of votes for B
  isActive: boolean;       // Can be disabled
  category: string;        // Sports, Entertainment, Food, Tech, General
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:**
- `date` (descending) + `isActive` - Fast lookup for today's question
- `date` unique - Ensures one question per day

### API Endpoints

#### 1. Get Today's Question
**Endpoint:** `GET /api/qotd`

**Process:**
1. Get today's date (midnight UTC)
2. Find active question for today
3. If none exists, randomly select from question pool and create
4. Return question with current vote counts

**Response:**
```json
{
  "question": {
    "_id": "507f1f77bcf86cd799439011",
    "question": "Cats or Dogs?",
    "optionA": "🐱 Cats",
    "optionB": "🐶 Dogs",
    "votesA": 42,
    "votesB": 58,
    "category": "General"
  }
}
```

**Question Pool (15 questions):**
- Cats or Dogs?
- Marvel or DC?
- Messi or Ronaldo?
- Coffee or Tea?
- iOS or Android?
- Beach or Mountains?
- Pizza or Burger?
- Morning or Night?
- Books or Movies?
- Summer or Winter?
- Windows or Mac?
- Football or Basketball?
- Netflix or YouTube?
- City or Countryside?
- Sweet or Savory?

#### 2. Submit Vote
**Endpoint:** `POST /api/qotd`

**Request:**
```json
{
  "questionId": "507f1f77bcf86cd799439011",
  "vote": "A"  // or "B"
}
```

**Process:**
1. Validate questionId and vote (A or B)
2. Increment votesA or votesB by 1
3. Calculate percentages
4. Return updated results

**Response:**
```json
{
  "message": "Vote recorded successfully",
  "results": {
    "votesA": 43,
    "votesB": 58,
    "percentageA": 43,
    "percentageB": 57,
    "totalVotes": 101
  }
}
```

### Frontend Component

**File:** `/components/QuestionOfTheDay.tsx`

**Key Features:**
1. **State Management:**
   - Question data from API
   - Vote status (voted/not voted)
   - Selected option tracking
   - Modal open/close
   - Prompt visibility

2. **LocalStorage Tracking:**
   - `qotd_voted_date` - Stores date of last vote
   - `qotd_dismissed_date` - Stores date of last dismissal
   - Prevents duplicate votes per day
   - Controls prompt visibility

3. **Auto-Prompt Logic:**
   - Shows 3 seconds after page load
   - Only if user hasn't voted today
   - Only if user hasn't dismissed today
   - Dismissible with "X" button

4. **Vote Validation:**
   - Checks if already voted (localStorage)
   - Disables buttons during API call
   - Shows loading state
   - Prevents duplicate submissions

5. **Results Display:**
   - Animated progress bars (0% → final %)
   - Percentage text (large, bold)
   - "Your choice" indicator
   - Total vote count
   - Color-coded by option (blue/pink)

### Integration Points

**Landing Page (`/app/page.tsx`):**
```tsx
import QuestionOfTheDay from "@/components/QuestionOfTheDay";

export default function Home() {
  return (
    <main>
      {/* ... existing content ... */}
      
      <QuestionOfTheDay />
    </main>
  );
}
```

**Position:** Fixed bottom-right, z-index 50 (above all content)

---

## Question Management

### Current System: Auto-Rotation

**How It Works:**
- API checks if question exists for today
- If not, randomly selects from 15-question pool
- Creates new question document for today
- Question changes at midnight UTC

**Advantages:**
- Zero manual work
- Always has a question
- Variety from curated pool

### Future Enhancement: Manual Curation

**Admin Panel (Future):**
1. Create custom questions
2. Schedule questions for specific dates
3. Import questions from CSV
4. View vote statistics
5. Deactivate inappropriate questions

**Schema Addition:**
```typescript
{
  scheduledDate?: Date;    // Pre-schedule questions
  createdBy?: ObjectId;    // Admin who created it
  isCustom: boolean;       // User-created vs pool
}
```

---

## User Interface Details

### Floating Button States

**Default (Not Voted):**
- Gradient background
- Question mark icon
- Pulse animation
- Red "!" badge
- Shadow glow

**After Voted:**
- Same gradient background
- No badge
- Pulse animation continues
- Can still open to see results

**Hover:**
- Scale up (1.1x)
- Increased shadow
- Icon rotates 12 degrees

### Modal Sections

**Header:**
- Gradient background (purple → pink → orange)
- Title: "Question of the Day"
- Category badge (Sports, Food, etc.)
- Close button (X)

**Question Section:**
- Large text (2xl font)
- Centered
- Dark gray color

**Voting Section (Before Vote):**
- Two full-width buttons
- Option A: Blue gradient
- Option B: Pink gradient
- Large text (lg font)
- Hover effects (scale, brightness)
- Loading state when clicking

**Results Section (After Vote):**
- Success icon (TrendingUp)
- "Here's what the community thinks!"
- Two progress bars:
  * Option A: Blue bar, percentage
  * Option B: Pink bar, percentage
  * Your choice: Highlighted color
  * Other option: Gray
- Animated bar fill (1 second)
- Total votes count

**Footer:**
- Gray background
- Small text
- "New question every day! Come back tomorrow."

### Animations

**Button:**
- Pulse ring (infinite)
- Scale on hover
- Tap feedback

**Prompt:**
- Slide up from bottom
- Fade in
- Scale from 80% to 100%
- Exit: Reverse animation

**Modal:**
- Backdrop fade in
- Modal scale + fade
- Slide up slightly

**Progress Bars:**
- Fill from 0% to final %
- 1 second duration
- Ease-out timing

---

## Translations

### English (en)

```typescript
qotd: {
  title: "Question of the Day",
  promptTitle: "Question of the Day!",
  promptText: "Answer today's fun question and see what everyone thinks!",
  answerNow: "Answer Now!",
  resultsText: "Here's what the community thinks!",
  yourChoice: "Your choice",
  totalVotes: "total votes",
  loading: "Loading question...",
  newDaily: "New question every day! Come back tomorrow."
}
```

### German (de)

```typescript
qotd: {
  title: "Frage des Tages",
  promptTitle: "Frage des Tages!",
  promptText: "Beantworte die heutige Spaßfrage und sehe, was alle denken!",
  answerNow: "Jetzt antworten!",
  resultsText: "Das denkt die Community!",
  yourChoice: "Deine Wahl",
  totalVotes: "Stimmen insgesamt",
  loading: "Frage wird geladen...",
  newDaily: "Jeden Tag eine neue Frage! Komm morgen wieder."
}
```

---

## Testing Guide

### Manual Test Cases

#### Test 1: First-Time Visitor
1. Visit homepage for first time
2. ✅ See floating button (bottom-right)
3. ✅ Wait 3 seconds → Auto-prompt appears
4. ✅ Prompt has "Answer Now" button
5. Click prompt or floating button
6. ✅ Modal opens with question
7. ✅ Two voting options visible
8. Click Option A
9. ✅ See loading state
10. ✅ Results appear with percentages
11. ✅ Your choice highlighted in color
12. ✅ Other option grayed out
13. ✅ Total votes shown
14. Close modal
15. ✅ Red badge disappears from button
16. Reopen modal
17. ✅ Still shows results (can't vote again)

#### Test 2: Dismiss Prompt
1. Visit homepage
2. Wait for auto-prompt
3. Click "X" to dismiss
4. ✅ Prompt disappears
5. Refresh page
6. ✅ Prompt doesn't show again today
7. ✅ Floating button still visible

#### Test 3: Return Tomorrow
1. Vote today
2. Wait until next day (or change system time)
3. Visit homepage
4. ✅ Red badge back on button
5. ✅ Auto-prompt shows again
6. ✅ New question displayed
7. ✅ Can vote again
8. ✅ Previous votes not visible

#### Test 4: Multiple Users
1. User A votes for Option A
2. User B visits site
3. ✅ User B sees updated vote count
4. User B votes for Option B
5. User A refreshes
6. ✅ User A sees Option A = 50%, Option B = 50%

#### Test 5: Mobile Responsive
1. Open on mobile device (375px width)
2. ✅ Floating button visible and tappable
3. ✅ Button doesn't block content
4. Tap button
5. ✅ Modal fits screen
6. ✅ Buttons are full-width
7. ✅ Text is readable
8. Vote and see results
9. ✅ Progress bars display correctly

#### Test 6: Language Switch
1. Visit homepage (English)
2. Open QOTD modal
3. ✅ All text in English
4. Close modal
5. Switch language to German
6. Reopen modal
7. ✅ All text in German
8. ✅ Question options unchanged (emoji)

### Automated Tests (Future)

```typescript
describe('QOTD API', () => {
  test('GET /api/qotd - returns today\'s question', async () => {
    const response = await fetch('/api/qotd');
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.question).toBeDefined();
    expect(data.question.optionA).toBeDefined();
    expect(data.question.optionB).toBeDefined();
  });

  test('POST /api/qotd - records vote', async () => {
    const questionId = 'test-id';
    const response = await fetch('/api/qotd', {
      method: 'POST',
      body: JSON.stringify({ questionId, vote: 'A' })
    });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.results.votesA).toBeGreaterThan(0);
  });
});
```

---

## Performance Considerations

### Optimization Strategies

**Component:**
- Lazy load modal content (only render when open)
- Memoize question data
- Debounce vote button clicks
- Use AnimatePresence for smooth unmounting

**API:**
- Cache today's question (Redis in future)
- Atomic vote increments (no race conditions)
- Index on date field for fast queries

**LocalStorage:**
- Store only date strings (not full objects)
- Clear old entries periodically
- No PII stored

### Scalability

**Current Capacity:**
- Unlimited votes per question
- New question auto-created daily
- No server-side user tracking

**At Scale:**
- Add rate limiting (prevent spam)
- Use Redis for real-time vote counts
- Implement vote caching (update every 5s)
- Add CDN for static question pool

---

## Analytics & Insights

### Trackable Metrics

**Engagement:**
- Total votes per day
- Vote distribution (% for each option)
- Prompt-to-vote conversion rate
- Floating button click rate
- Modal open rate

**Retention:**
- Users who return next day
- Repeat voters (multi-day)
- Prompt dismissal rate

**Popular Questions:**
- Most voted questions
- Most controversial (50/50 split)
- Category preferences

### Future Dashboard

**Admin View:**
- Daily vote chart
- Top questions by engagement
- User return rate
- Best performing categories
- Vote distribution histogram

---

## Future Enhancements

### Phase 1: Enhanced Questions
- [ ] Add 3-option questions (A, B, C)
- [ ] Image-based questions (visual choices)
- [ ] Emoji reactions on results
- [ ] Share results on social media
- [ ] "Why did you choose?" text field

### Phase 2: Gamification
- [ ] Streak counter (voted X days in row)
- [ ] Badges (voted 7 days, 30 days, etc.)
- [ ] Minority/Majority badges
- [ ] Question predictions (guess %)
- [ ] Leaderboard for streaks

### Phase 3: Community Features
- [ ] User-submitted questions (moderated)
- [ ] Upvote/downvote questions
- [ ] Comment on results
- [ ] Create custom polls
- [ ] Follow users with similar votes

### Phase 4: Integration
- [ ] Weekly recap email
- [ ] Discord/Slack integration
- [ ] API for third-party apps
- [ ] Export vote history
- [ ] Question archives

---

## Security & Privacy

### What We Collect

**Per Vote:**
- Question ID
- Vote choice (A or B)
- Timestamp
- No user identification
- No IP tracking

**LocalStorage:**
- Last vote date (local only)
- Last dismissal date (local only)

### What We DON'T Collect

- ❌ User identity
- ❌ Email address
- ❌ IP addresses
- ❌ Device fingerprints
- ❌ Vote history across days

### Privacy Features

- Fully anonymous voting
- No tracking cookies
- No account required
- LocalStorage only (client-side)
- Can't link votes to users

### Spam Prevention (Future)

- Rate limiting per IP
- CAPTCHA for suspicious activity
- Vote validation
- Honeypot fields

---

## Question Pool Management

### Current Questions (15 total)

**General (5):**
- Cats or Dogs?
- Beach or Mountains?
- Morning or Night?
- City or Countryside?
- Summer or Winter?

**Entertainment (3):**
- Marvel or DC?
- Books or Movies?
- Netflix or YouTube?

**Sports (2):**
- Messi or Ronaldo?
- Football or Basketball?

**Food (3):**
- Coffee or Tea?
- Pizza or Burger?
- Sweet or Savory?

**Tech (2):**
- iOS or Android?
- Windows or Mac?

### Adding New Questions

**Process:**
1. Open `/app/api/qotd/route.ts`
2. Add to `questionPool` array:
   ```typescript
   {
     question: "Your question?",
     optionA: "Option A",
     optionB: "Option B",
     category: "General"
   }
   ```
3. Deploy
4. Question will appear randomly

**Best Practices:**
- Keep questions short (< 50 chars)
- Use universally understood topics
- Avoid controversial/political topics
- Include emojis for visual appeal
- Balance categories

---

## Known Limitations

### Current Constraints

1. **One Vote Per Day (Client-Side)**
   - Uses localStorage only
   - User can clear localStorage and vote again
   - No server-side tracking
   - **Acceptable for MVP** - trust-based

2. **No Vote History**
   - Can't see previous day's results
   - No personal vote archive
   - No trend analysis

3. **Fixed Question Pool**
   - Only 15 questions currently
   - Manual addition required
   - No dynamic sourcing

4. **No Moderation**
   - No user-submitted questions
   - No reporting system
   - No admin controls

### Future Solutions

**Vote Validation:**
- Add server-side fingerprinting
- Use IP-based rate limiting
- Implement CAPTCHA
- Require email (optional)

**Question Management:**
- Build admin dashboard
- Allow scheduled questions
- Import from external sources
- Community submission system

---

## Success Metrics

### Key Performance Indicators

**Engagement:**
- **Target:** 30% of visitors vote
- **Current:** Track with analytics

**Retention:**
- **Target:** 10% return next day
- **Current:** Track with localStorage

**Virality:**
- **Target:** 5% share results
- **Future:** Add share buttons

### Month 1 Goals

- 1,000 daily votes
- 100+ repeat voters
- 50/50 split on controversial questions
- < 1% spam votes
- 60% prompt-to-vote conversion

---

## Troubleshooting

### Common Issues

**Issue 1: Prompt doesn't appear**
- Check localStorage for `qotd_dismissed_date`
- Clear localStorage
- Ensure 3 seconds have passed
- Check if already voted today

**Issue 2: Can't vote**
- Check if already voted (localStorage)
- Verify API endpoint is running
- Check network tab for errors
- Clear localStorage to reset

**Issue 3: Results not updating**
- Refresh page
- Check API response
- Verify vote was recorded in DB
- Cache might be stale (future issue)

**Issue 4: Button not visible**
- Check z-index (should be 50)
- Verify fixed positioning
- Check if covered by other elements
- Try on different screen size

---

## Conclusion

The **Question of the Day** feature successfully adds a fun, engaging, low-stakes interaction to QuestEd's landing page. It builds community through shared daily experiences and provides a quick dopamine hit for visitors without requiring any commitment or signup.

### What's Complete ✅

- Floating button with badge
- Auto-popup prompt system
- Vote modal with results
- 15-question pool with auto-rotation
- LocalStorage-based vote tracking
- Animated progress bars
- English & German translations
- Mobile-responsive design
- API endpoints (GET + POST)

### Impact 🎯

This feature:
- **Increases engagement** - Visitors have reason to return daily
- **Builds community** - Shared experience across all users
- **Reduces friction** - No signup needed to participate
- **Creates habit** - Daily check-in for new question
- **Provides data** - Learn about user preferences

**"Come for the question, stay for the quizzes"** - A perfect gateway to deeper platform engagement!

---

**Documentation by:** GitHub Copilot  
**Last Updated:** October 30, 2025  
**Version:** 1.0.0  
**Status:** MVP Complete, Ready for Production

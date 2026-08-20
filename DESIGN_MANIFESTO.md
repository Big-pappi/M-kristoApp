# M-Kristo Design Manifesto: Anti-Vibe-Code Excellence

## 🎯 Our Mission: Real Faith, Real Design, Real People

We're building a Bible app for actual humans who want to grow their faith, not a portfolio piece for design Twitter. This document is our north star for creating something that feels authentic, meaningful, and distinctly ours.

---

## 🚫 The "Vibe Code" Ban List

**If you catch yourself doing any of these, stop and reconsider:**

### Visual Crimes We Won't Commit
- **AI-generated gradients** that look like someone vomited a color wheel
- **Lucide icons** - they're everywhere and we're not everywhere
- **Pure white backgrounds** - give our eyes some texture, for goodness sake
- **Rainbow coloring** - we're not a pride parade, we're a Bible app
- **Drop shadows** - 2020 called, they want their depth effects back
- **3 feature cards in a row** - lazy layout, lazy thinking
- **Emojis in UI** - we're grown-ups reading Scripture, not texting teens
- **Liquid glass effects** - this isn't a sci-fi interface from 2030
- **Em dashes everywhere** - use normal punctuation like a normal human
- **Bento grids** - Apple did it, everyone copied it, we won't
- **Terminal windows** - we're not hackers, we're building tools for believers
- **"It's not X, it's Y" copy** - just say what it is directly
- **Checkmark bullets** - we're not selling SaaS to enterprises
- **3 pricing tiers** - we have free and premium, that's it
- **Fake testimonials** - if we don't have real users yet, we don't have testimonials
- **Soft corner radius (12px-16px)** - pick a corner style and commit to it
- **Purple + black everything** - it's not 2016 anymore
- **Skeleton loaders** - show real content or show nothing
- **Radial orbs in backgrounds** - they don't mean anything
- **Dot grid patterns** - they don't make things look "technical"
- **Sparkle icons** - we're not fairy godmothers
- **Animated arrows pointing everywhere** - arrows should point where users need to go
- **No TOS/Privacy Policy** - we're a real app, we need real legal docs
- **Hover animations on everything** - not everything needs to dance when you touch it
- **Neon colors** - we're not a cyberpunk game
- **Basic pastel palettes** - they're safe and boring and we're neither

### Font Choices We Won't Make
- **Inter** - the default font of "I didn't think about typography"
- **Geist** - Vercel's font, not our font
- **Space Grotesk** - cool font, but it's everywhere now

---

## ✅ What We Actually Do

### Our Design Philosophy
> "Design should be invisible when it works well, and distinctive when it needs to be."

We're not here to win design awards. We're here to help people read the Bible, pray, and grow in their faith. Every design decision should pass this test:

**Does this help someone focus on God's Word, or does it distract from it?**

### Our Visual Identity

#### Color Palette: Earthy, Warm, Human
```css
/* Primary colors - warm earth tones */
--primary: #8B7355;        /* Warm brown like ancient parchment */
--primary-dark: #5D4E37;   /* Darker brown for text */
--primary-light: #C4A484;  /* Lighter brown for backgrounds */

/* Accent colors - subtle, not shouting */
--accent: #2E7D32;          /* Forest green - growth, life */
--accent-soft: #E8F5E9;     /* Light green background */

/* Supporting colors */
--surface: #F5F1E8;         /* Warm off-white, like aged paper */
--surface-alt: #EDE8D9;     /* Slightly darker surface */
--border: #D4C4A8;          /* Subtle border, not harsh black */

/* Text colors */
--text-primary: #2C2420;    /* Almost black, but warmer */
--text-secondary: #5D4E37;   /* Brown-gray for secondary text */
--text-muted: #8B7355;      /* Muted brown for hints */

/* Semantic colors */
--success: #2E7D32;         /* Same as accent - consistency */
--warning: #F57C00;         /* Warm orange, not neon */
--error: #C62828;           /* Deep red, not bright red */
```

#### Typography: Readable, Dignified, Timeless
```css
/* We use fonts that have stood the test of time */
--font-serif: 'Georgia', 'Times New Roman', serif;      /* For Scripture */
--font-sans: 'Helvetica Neue', 'Arial', sans-serif;      /* For UI */
--font-mono: 'Courier New', monospace;                   /* For references */

/* Size scale - meaningful, not arbitrary */
--text-xs: 0.75rem;     /* 12px - tiny labels */
--text-sm: 0.875rem;    /* 14px - captions */
--text-base: 1rem;      /* 16px - body text */
--text-lg: 1.125rem;    /* 18px - emphasized */
--text-xl: 1.25rem;     /* 20px - headings */
--text-2xl: 1.5rem;     /* 24px - section titles */
--text-3xl: 1.875rem;   /* 30px - page titles */
```

**Why these fonts?**
- **Georgia for Scripture**: It's dignified, readable at small sizes, and feels like you're reading a real Bible
- **Helvetica Neue for UI**: Clean, neutral, doesn't compete with the content
- **Courier New for references**: Monospace feels like it belongs in a study context

#### Corner Radius: Sharp, Intentional
```css
/* We don't do soft, rounded everything */
--radius-sm: 2px;    /* Subtle rounding */
--radius-md: 4px;    /* Noticeable but not pill-shaped */
--radius-lg: 8px;    /* Cards and containers */
--radius-full: 9999px; /* Only for buttons and avatars - very intentional */
```

**We use sharp corners because:**
- They feel more serious and dignified
- They're easier to implement consistently
- They don't look like every other app on the market

#### Shadows: Subtle, Purposeful
```css
/* Shadows that provide depth without being heavy */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 2px 4px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.12);
```

**We don't use drop shadows because:**
- They can look dated and heavy
- They don't always translate well to different screen sizes
- Subtle elevation through color and spacing is often more elegant

---

## 🎨 Component Design Guidelines

### Buttons: Purposeful, Not Decorative
```tsx
// BAD - Gradient, rounded, icon-heavy
<Button className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
  <SparkleIcon /> Get Started <ArrowRight className="animate-bounce" />
</Button>

// GOOD - Clear, honest, functional
<Button className="bg-primary text-white px-6 py-3 rounded-md">
  Get Started
</Button>
```

**Our button philosophy:**
- Primary actions use our primary color
- Secondary actions use outlined style
- Icons only when they add meaning (not decoration)
- No hover animations - clicks should feel responsive, not playful

### Cards: Content-First, Structure-Second
```tsx
// BAD - Bento grid, rounded corners, floating elements
<div className="grid grid-cols-3 gap-4">
  <Card className="rounded-2xl bg-white shadow-lg">
    <div className="absolute -top-4 -right-4 bg-purple-500 rounded-full p-2">
      <SparkleIcon />
    </div>
    <h3>Feature 1</h3>
  </Card>
</div>

// GOOD - Simple, content-focused
<div className="space-y-4">
  <Card className="border border-border bg-surface">
    <h3 className="font-serif text-xl">Feature 1</h3>
    <p className="text-secondary">Clear description of what this does.</p>
  </Card>
</div>
```

### Navigation: Clear Hierarchy, No Surprises
```tsx
// BAD - Hidden menus, animated icons, vague labels
<nav className="floating-bottom-nav">
  <NavItem icon={<AnimatedHome />} />
  <NavItem icon={<SparkleBible />} />
</nav>

// GOOD - Visible, labeled, consistent
<nav className="border-t border-border bg-surface">
  <NavLink href="/bible">Bible</NavLink>
  <NavLink href="/prayers">Prayers</NavLink>
  <NavLink href="/notes">Notes</NavLink>
</nav>
```

### Loading States: Honest, Not Deceptive
```tsx
// BAD - Skeleton loaders that pretend content is coming
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-gray-200 rounded" />
  <div className="h-4 bg-gray-200 rounded" />
</div>

// GOOD - Simple loading indicator or real partial content
<LoadingSpinner text="Loading Scripture..." />
// OR
<PartialContent />
```

---

## 📝 Copywriting Guidelines

### Voice: Warm, Direct, Faithful
**We write like humans talking to humans about things that matter.**

#### DO:
- Use plain language that anyone can understand
- Write directly to the user ("You can read the Bible" not "Users can access biblical content")
- Be specific about what things do
- Use Scripture references when appropriate
- Acknowledge the spiritual dimension without being preachy

#### DON'T:
- Use buzzwords or tech jargon
- Write vague marketing copy
- Make claims we can't back up
- Use exclamation points like they're going out of style
- Hide behind passive voice

### Examples

**BAD:**
> "Experience the transformative power of our revolutionary Bible engagement platform with AI-powered insights and community-driven features!"

**GOOD:**
> "Read the Bible in Swahili or English. Take notes. Save your favorite verses. Grow in your faith."

**BAD:**
> "It's not just a Bible app, it's your spiritual companion for the modern age."

**GOOD:**
> "A Bible app for Swahili speakers, with English support too."

---

## 🔧 Code Style: Clean, Commented, Considerate

### Our commenting philosophy
> "Code is read more than it's written. Write for the next person (which might be future you)."

```tsx
// BAD - No context, confusing variable names
const d = data.filter(x => x.active).map(y => y.id);

// GOOD - Clear intent, meaningful names, helpful comments
// Filter to only active devotionals and extract their IDs for the API call
const activeDevotionalIds = devotionals
  .filter(devotional => devotional.is_active)
  .map(devotional => devotional.id);
```

### Component structure
```tsx
// We organize components by responsibility, not by file size
/**
 * ChapterReader - Displays Bible chapter with verse-by-verse reading
 * 
 * Features:
 * - Verse-by-verse display with verse numbers
 * - Audio playback for each verse (when available)
 * - Favorite verses with star icon
 * - Share verses to Verse Studio
 * - Chapter navigation
 * 
 * @param bookId - The ID of the Bible book (e.g., "Genesis")
 * @param chapter - Chapter number (default: 1)
 * @param version - Bible version code (default: "KJV")
 */
export function ChapterReader({ bookId, chapter = 1, version = "KJV" }: ChapterReaderProps) {
  // State management
  const [verses, setVerses] = useState<Verse[]>([]);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  
  // Load chapter data when book or chapter changes
  useEffect(() => {
    loadChapterData(bookId, chapter, version);
  }, [bookId, chapter, version]);
  
  // Audio playback with cleanup
  const playAudio = useCallback(async (audioUrl: string) => {
    // Stop any currently playing audio
    if (currentAudio) {
      await stopAudio();
    }
    
    // Load and play new audio
    const { sound } = await Audio.Sound.createAsync(
      { uri: audioUrl },
      { shouldPlay: true }
    );
    
    setSound(sound);
    setCurrentAudio(audioUrl);
  }, [currentAudio]);
  
  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);
  
  // Render verse list with audio controls
  return (
    <VerseList verses={verses} onPlayAudio={playAudio} />
  );
}
```

### CSS organization
```css
/* We organize CSS by component, not by property type */

/* ============================================
   ChapterReader Styles
   ============================================ */

/* Container */
.chapter-reader {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Verse display */
.verse-row {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border);
}

.verse-number {
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--accent);
  min-width: 2rem;
}

.verse-text {
  font-family: var(--font-serif);
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--text-primary);
}

/* Audio controls */
.audio-button {
  background: var(--surface-alt);
  border: none;
  padding: 0.5rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color 0.2s;
}

.audio-button:hover {
  background: var(--border);
}

/* ============================================
   Utility Classes
   ============================================ */

.text-center { text-align: center; }
.mt-4 { margin-top: 1rem; }
.p-2 { padding: 0.5rem; }
```

---

## 🎯 Accessibility: Real Inclusion, Not Checkboxes

### Our approach
We don't do accessibility because it's required. We do it because it's the right thing to do and it makes our app better for everyone.

### Non-negotiables
- **Semantic HTML**: Use the right elements for the right job
- **Keyboard navigation**: Everything should work without a mouse
- **Screen reader support**: Test with actual screen readers, not just linters
- **Color contrast**: Meet WCAG AA standards (4.5:1 for normal text)
- **Focus indicators**: Make keyboard navigation visible and clear
- **Error messages**: Be specific about what went wrong and how to fix it

### We don't do
- Skip this because "our users don't use screen readers"
- Rely on color alone to convey information
- Make everything accessible but unusable
- Hide functionality behind complex gestures

---

## 📱 Mobile-First, But Not Mobile-Only

### Our responsive philosophy
> "Design for the smallest screen first, then enhance for larger screens."

### Breakpoints (when we need them)
```css
/* Mobile-first approach */
.content {
  padding: 1rem;
}

/* Tablet enhancement */
@media (min-width: 768px) {
  .content {
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
  }
}

/* Desktop enhancement */
@media (min-width: 1024px) {
  .content {
    padding: 3rem;
    max-width: 1000px;
  }
}
```

### Touch targets
- Minimum 44px × 44px for all interactive elements
- Generous spacing between clickable items
- No hover-only interactions (they don't work on touch)

---

## 🚀 Performance: Fast by Default

### What we optimize for
1. **First Contentful Paint**: Users should see something useful quickly
2. **Time to Interactive**: Users should be able to use the app quickly
3. **Smooth scrolling**: No janky animations or layout shifts
4. **Efficient data loading**: Load what's needed, when it's needed

### Strategies
- Lazy load Bible chapters (don't load the whole Bible at once)
- Cache frequently used content locally
- Optimize images and audio files
- Use native platform features when available
- Minimize JavaScript bundle size

---

## 🎯 Testing: Real Scenarios, Real Users

### What we test
- Happy paths: Things working as expected
- Edge cases: What happens with unusual inputs?
- Error states: How does the app handle failures?
- Performance: Does it work on older devices?
- Accessibility: Can people with disabilities use it?

### What we don't test
- Pixel-perfect design across every browser (impossible and not valuable)
- Features we haven't built yet
- Hypothetical scenarios that won't happen

---

## 📋 Our Design Review Checklist

Before we ship anything, we ask:

1. **Does this help users focus on God's Word?**
2. **Is this clear and direct, or confusing and vague?**
3. **Does this work without JavaScript?** (If no, is that justified?)
4. **Is this accessible to keyboard and screen reader users?**
5. **Does this look like every other app, or like our app?**
6. **Is the code clean and well-commented?**
7. **Will this be easy to maintain in 6 months?**
8. **Did we copy this from a trend, or did we think it through?**

If the answer to any of these is "no" or "I don't know," we don't ship.

---

## 🎉 Our Design Identity

**We are not:**
- A startup trying to get acquired
- Design portfolio pieces
- Followers of every trend on Twitter
- Afraid to be different

**We are:**
- Builders of tools for real people
- Students of timeless design principles
- Comfortable with simplicity
- Focused on what matters: helping people grow in faith

**Our app should feel like:**
- A well-worn Bible, not a shiny new gadget
- A conversation with a friend, not a marketing pitch
- A tool that gets out of the way, not one that demands attention
- Something built with care, not assembled from templates

---

## 📚 Resources We Actually Use

### Design Inspiration (Not Copying)
- **Classical book design**: Typography, spacing, hierarchy
- **Newspaper layouts**: Information density, readability
- **Academic papers**: Serious, content-first approach
- **Museum exhibitions: Clear labels, respectful presentation

### Tools We Trust
- **Browser DevTools**: Native debugging is underrated
- **Real devices**: Test on actual phones, not simulators
- **User feedback: Talk to real users, not just other developers**
- **Accessibility tools: But only as a starting point, not the final word**

### Things We Avoid
- **Design trend Twitter**: It's a distraction, not guidance
- **Template sites: They're for people who don't want to think**
- **"Best practices" without context: Every situation is different**
- **Awards and recognition: We serve users, not judges**

---

## 🔮 Looking Forward

### Our commitment
As we grow and evolve, we promise to:
- Keep asking "does this serve our users?"
- Stay true to our principles, even when it's harder
- Learn from mistakes without abandoning our identity
- Build for the long term, not for quick wins
- Remember why we started: to help people grow in faith

### What we won't do
- Chase trends because "everyone else is doing it"
- Compromise our values for growth metrics
- Add features just to have more features
- Lose sight of our core mission

---

## 📝 Final Words

> "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away." - Antoine de Saint-Exupéry

We're here to build something simple, honest, and useful. Something that helps real people read the Bible, pray, and grow in their faith. Everything else is noise.

Let's build something that matters.

---

*Last updated: 2026-08-20*
*Version: 1.0*
*Status: Living document - evolves as we learn*
# 🎨 BarberHub Mobile - Visual Design Guide

## Color System Reference

### Primary Palette - Midnight Studio

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  ████████  #0B0F14  Primary (Midnight)         │
│  Deep dark background, premium feel            │
│                                                 │
│  ████████  #111827  Secondary (Charcoal)       │
│  Card backgrounds, elevated surfaces           │
│                                                 │
│  ████████  #D4AF37  Accent (Gold)              │
│  CTAs, highlights, craft/premium signal        │
│                                                 │
│  ████████  #22C55E  Success                    │
│  Confirmations, positive states                │
│                                                 │
│  ████████  #EF4444  Error                      │
│  Warnings, destructive actions                 │
│                                                 │
│  ████████  #F59E0B  Warning                    │
│  Alerts, pending states                        │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Neutral Gray Scale

```
Gray 50  ████████  #F9FAFB  Lightest
Gray 100 ████████  #F3F4F6
Gray 200 ████████  #E5E7EB  Support/borders
Gray 300 ████████  #D1D5DB
Gray 400 ████████  #9CA3AF
Gray 500 ████████  #6B7280  Tertiary text
Gray 600 ████████  #4B5563
Gray 700 ████████  #374151
Gray 800 ████████  #1F2937  Input backgrounds
Gray 900 ████████  #111827  Darkest
```

---

## Typography Hierarchy

```
┌──────────────────────────────────────────┐
│  Hero (48px, Bold)                       │
│  Landing Page Headers                    │
│                                          │
│  H1 (30px, Bold)                        │
│  Screen Titles - "Find Your Barber"    │
│                                          │
│  H2 (24px, Bold)                        │
│  Section Headers - "Today's Overview"   │
│                                          │
│  H3 (20px, Semibold)                    │
│  Card Titles - "Marcus Johnson"         │
│                                          │
│  Body Large (18px, Regular)             │
│  Emphasized content                      │
│                                          │
│  Body (16px, Regular)                   │
│  Primary text, descriptions              │
│                                          │
│  Body Small (14px, Regular)             │
│  Secondary text, captions                │
│                                          │
│  Caption (12px, Medium)                 │
│  Labels, badges, tags                    │
└──────────────────────────────────────────┘
```

---

## Component Library

### Buttons

```
┌─────────────────────────────────────┐
│                                     │
│     Primary (Gold Background)       │
│  ┌───────────────────────────────┐  │
│  │  ███████  Book Now  ███████   │  │
│  └───────────────────────────────┘  │
│  Use: Main CTAs, confirmations      │
│                                     │
│     Secondary (Card Background)     │
│  ┌───────────────────────────────┐  │
│  │  Reschedule                   │  │
│  └───────────────────────────────┘  │
│  Use: Alternative actions           │
│                                     │
│     Outline (Gold Border)           │
│  ┌───────────────────────────────┐  │
│  │  ────  Cancel  ────           │  │
│  └───────────────────────────────┘  │
│  Use: Secondary/destructive         │
│                                     │
│     Ghost (Transparent)             │
│  ┌───────────────────────────────┐  │
│  │  See All →                    │  │
│  └───────────────────────────────┘  │
│  Use: Tertiary actions, links       │
│                                     │
└─────────────────────────────────────┘
```

### Sizes
- **Small**: 12px padding, 14px text
- **Medium**: 16px padding, 16px text
- **Large**: 24px padding, 18px text

---

## Screen Layouts

### 1. Discovery Screen Layout

```
┌─────────────────────────────────────────┐
│  Status Bar (System)                    │
├─────────────────────────────────────────┤
│  Header (140px)                         │
│  ┌─ Find Your Barber                   │
│  │  📍 Toronto, ON ▼           🔔      │
│  │  ┌──────────────────────────────┐   │
│  │  │ 🔍 Search barbers...      ✕ │   │
│  │  └──────────────────────────────┘   │
│  └─────────────────────────────────────│
│  Filters (56px)                         │
│  [Filters] [Skin Fade] [Taper] [+5]   │
├─────────────────────────────────────────┤
│  Stats Bar (32px)                       │
│  12 barbers found     Sort by ▼        │
├─────────────────────────────────────────┤
│  Scrollable List                        │
│  ┌────────────────────────────────┐    │
│  │ Barber Card (320px)            │    │
│  │ ┌─────────────────────────────┐│    │
│  │ │ [Portfolio Image 200px]     ││    │
│  │ │ ┌──┐ Marcus Johnson ✓       ││    │
│  │ │ │  │ ⭐ 4.9 • 0.8 km        ││    │
│  │ │ └──┘ [Tags] [Location]     ││    │
│  │ └─────────────────────────────┘│    │
│  └────────────────────────────────┘    │
│  [More cards...]                        │
├─────────────────────────────────────────┤
│  Tab Bar (65px)                         │
│  🔍 Discover  📅 Bookings  👤 Profile  │
└─────────────────────────────────────────┘
```

### 2. Barber Profile Layout

```
┌─────────────────────────────────────────┐
│  ⬅️  Header                           ⋯ │
├─────────────────────────────────────────┤
│  [Large Portfolio Image 400px]          │
│                                         │
│  Profile Header (120px)                 │
│  ┌──┐                                   │
│  │  │  Marcus Johnson ✓                │
│  └──┘  ⭐ 4.9 (347) │ ⏱️ 15 years      │
│                                         │
│  Services Preview (180px)               │
│  Signature Fade     45 min • $45.00    │
│  Beard Trim         30 min • $30.00    │
│                                         │
│  Tabs (44px)                            │
│  [Portfolio] [Reviews] [About]          │
├─────────────────────────────────────────┤
│  Scrollable Content                     │
│  (Portfolio Gallery / Reviews / About)  │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│  Sticky Booking Bar (80px)              │
│  From $45.00         [Book Now]        │
│  45 min • Next available today          │
└─────────────────────────────────────────┘
```

### 3. Booking Flow Layout (Modal)

```
┌─────────────────────────────────────────┐
│  ⬅️  Book Appointment               ✕  │
│  ━━━━━━━━━━━━░░░░░░░░  Step 1 of 4    │
├─────────────────────────────────────────┤
│                                         │
│  Step Title & Description               │
│  Select Services                        │
│  Choose one or more services            │
│                                         │
│  Step-Specific Content                  │
│  ┌────────────────────────────────┐    │
│  │ Service Card                   │    │
│  │ ┌──────────────────────────┐   │    │
│  │ │ Signature Fade      ✓    │   │    │
│  │ │ Precision fade with...   │   │    │
│  │ │ ⏱️ 45 min      $45.00     │   │    │
│  │ └──────────────────────────┘   │    │
│  └────────────────────────────────┘    │
│                                         │
│  [More content based on step...]        │
│                                         │
├─────────────────────────────────────────┤
│  Footer with CTA (100px)                │
│  $45.00                                 │
│  1 service • 45 min                     │
│  ┌──────────────────────────────────┐  │
│  │        [Continue]                 │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## Spacing System

```
┌────────────────────────────────────┐
│                                    │
│  XS     4px   ••                  │
│  SM     8px   ••••                │
│  MD    16px   ••••••••            │
│  LG    24px   ••••••••••••        │
│  XL    32px   ••••••••••••••••    │
│  2XL   48px   ••••••••••••••••••••│
│  3XL   64px   (Large gaps)        │
│                                    │
└────────────────────────────────────┘

Usage Guidelines:
- XS: Icon spacing, tight elements
- SM: Within components
- MD: Between sections (default)
- LG: Screen padding
- XL: Major section gaps
- 2XL: Empty state spacing
- 3XL: Hero sections
```

---

## Border Radius System

```
┌─────────────────────────────────────┐
│                                     │
│  SM     4px   ┌─┐  Tags, badges    │
│                └─┘                  │
│                                     │
│  MD     8px   ┌──┐  Buttons, chips │
│                └──┘                 │
│                                     │
│  LG    12px   ┌───┐  Cards         │
│                └───┘                │
│                                     │
│  XL    16px   ┌────┐  Large cards  │
│                └────┘               │
│                                     │
│  2XL   24px   ┌─────┐  Modals      │
│                └─────┘              │
│                                     │
│  Full  999px   (•)   Avatars       │
│                                     │
└─────────────────────────────────────┘
```

---

## Icon System (Ionicons)

### Navigation
- `search` - Discovery tab
- `calendar` - Appointments tab
- `person` - Profile tab

### Actions
- `checkmark-circle` - Verification, completion
- `star` - Ratings
- `location` - Address, distance
- `time-outline` - Duration, availability
- `cash-outline` - Pricing, revenue

### UI Elements
- `chevron-down` - Dropdowns
- `arrow-back` - Navigation
- `close` - Close modals
- `share-outline` - Sharing
- `notifications-outline` - Alerts

### Size Guide
- **Small**: 14-16px (inline)
- **Medium**: 20-24px (standard)
- **Large**: 32-40px (feature icons)

---

## Shadow Elevation

```
┌───────────────────────────────────────┐
│                                       │
│  Level 1 - Subtle (Cards at rest)    │
│  ┌─────────────────┐                 │
│  │                 │ ─── 2px blur    │
│  └─────────────────┘                 │
│                                       │
│  Level 2 - Medium (Interactive)      │
│  ┌─────────────────┐                 │
│  │                 │ ──── 4px blur   │
│  └─────────────────┘                 │
│                                       │
│  Level 3 - Large (Elevated panels)   │
│  ┌─────────────────┐                 │
│  │                 │ ───── 8px blur  │
│  └─────────────────┘                 │
│                                       │
│  Level 4 - Extra (Modals, dialogs)   │
│  ┌─────────────────┐                 │
│  │                 │ ────── 16px blur│
│  └─────────────────┘                 │
│                                       │
└───────────────────────────────────────┘
```

---

## Animation Timings

```
Fast     150ms   ━━▸       Hover, press
Normal   250ms   ━━━▸      Transitions
Slow     350ms   ━━━━▸     Modal open
Slowest  500ms   ━━━━━▸    Complex animations
```

### Easing Curves
- **ease-out**: UI entering (buttons, modals)
- **ease-in**: UI exiting
- **ease-in-out**: Movement, transforms

---

## Interaction States

### Button States
```
Default:  ████████  Gold background
Hover:    ████████  Slightly lighter
Pressed:  ████████  Scale 0.98
Disabled: ████████  50% opacity
Loading:  ⟳ ████  Spinner + disabled
```

### Card States
```
Default:  Card with shadow
Hover:    Increased shadow elevation
Pressed:  Scale 0.98, increased shadow
Selected: Gold border (2px)
Disabled: Reduced opacity
```

---

## Accessibility

### Color Contrast
- **Text on Dark**: 4.5:1 minimum (WCAG AA)
- **Gold on Dark**: 7.2:1 (AAA rated)
- **Status Colors**: Tested for color blindness

### Touch Targets
- **Minimum**: 44x44px (Apple HIG)
- **Recommended**: 48x48px
- **Spacing**: 8px minimum between targets

### Screen Reader Labels
```typescript
<TouchableOpacity
  accessibilityLabel="Book appointment with Marcus Johnson"
  accessibilityHint="Opens booking flow"
  accessibilityRole="button"
>
```

---

## Responsive Breakpoints

```
┌──────────────────────────────────────┐
│  Small Phones    < 375px             │
│  ├─ iPhone SE                        │
│  └─ Compact Android                  │
│                                      │
│  Standard       375-414px            │
│  ├─ iPhone 13/14                     │
│  └─ Most devices                     │
│                                      │
│  Large Phones    > 414px             │
│  ├─ iPhone 14 Pro Max                │
│  └─ Large Android                    │
│                                      │
│  Tablets         > 768px (future)    │
│  └─ iPad, Android tablets            │
└──────────────────────────────────────┘
```

---

## Image Guidelines

### Aspect Ratios
- **Portfolio Cover**: 16:9 (1200x675)
- **Portfolio Grid**: 1:1 (800x800)
- **Avatar**: 1:1 (400x400)
- **Shop Cover**: 21:9 (ultrawide)

### Optimization
- **Format**: WebP preferred, JPEG fallback
- **Loading**: Progressive with blurhash
- **Sizes**: 
  - Thumbnail: 200px
  - Medium: 800px
  - Large: 1200px

### Unsplash Keywords
```
"modern barbershop interior dark wood"
"barber fade close up professional"
"straight razor shave barbershop"
"grooming products flat lay"
"beard trim detail close up"
"taper fade haircut professional"
```

---

## Dark Mode Optimization

### Why Dark Mode Only?
1. **Barbershop Context**: Designed for low-light environments
2. **Premium Feel**: Dark = luxury, craft, sophistication
3. **Focus**: Highlights portfolio imagery
4. **Consistency**: Single theme = faster development

### Contrast Enhancement
- Text: White (#FFFFFF) on dark backgrounds
- Gold accent (#D4AF37) provides 7:1 contrast
- Cards (#111827) slightly lighter than background
- Borders (#2D3748) subtle separation

---

## Brand Voice in UI

### Tone
- **Professional** but approachable
- **Premium** without being pretentious
- **Clear** over clever
- **Confident** in craft

### Microcopy Examples
```
✅ Good: "Book Now"
❌ Avoid: "Schedule Your Transformation"

✅ Good: "Cancel or reschedule up to 24 hours before"
❌ Avoid: "We have a 24-hour cancellation policy"

✅ Good: "Next available: Today at 2:00 PM"
❌ Avoid: "Available slot detected"

✅ Good: "From $45.00 • 45 min"
❌ Avoid: "Starting at just $45!"
```

---

## Component Catalog

### Cards
- **BarberCard**: Discovery screen (320px height)
- **AppointmentCard**: Bookings list (variable)
- **ServiceCard**: Booking flow (120px height)
- **StatCard**: Dashboard metrics (140px height)

### Forms
- **SearchInput**: Global search (48px height)
- **TextInput**: Standard form fields (48px)
- **DatePicker**: Calendar interface
- **TimeSlotGrid**: Time selection

### Navigation
- **BottomTabBar**: Primary navigation (65px)
- **Header**: Screen titles with actions (60px)
- **Modal**: Full-screen booking flow

### Feedback
- **EmptyState**: No content placeholder
- **LoadingSpinner**: Async operations
- **Toast**: Success/error messages
- **Badge**: Notification count, status

---

<div align="center">

## 🎨 Design Complete

**Color System**: Midnight Studio palette  
**Typography**: 9-scale hierarchy  
**Components**: 15+ reusable elements  
**Accessibility**: WCAG AA compliant  
**Platform**: iOS & Android optimized  

**Built for the modern barber marketplace** ✂️

</div>

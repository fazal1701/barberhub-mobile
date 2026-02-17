# BarberHub Mobile - Wireframes & Screen Flows

## 📐 Design System Overview

### Visual Hierarchy
- **Primary Focus**: Bold gold (#D4AF37) for CTAs and key actions
- **Secondary Elements**: Charcoal cards (#111827) with subtle shadows
- **Background**: Deep midnight (#0B0F14) for premium feel
- **Text**: White primary, gray secondary for readability

### Typography Scale
```
Hero: 48px (Landing headers)
H1: 30px (Screen titles)
H2: 24px (Section headers)
H3: 20px (Card titles)
Body: 16px (Primary text)
Small: 14px (Secondary text)
Caption: 12px (Labels, badges)
```

---

## 🎯 Screen-by-Screen Breakdown

### 1. Discovery/Home Screen

**Purpose**: Help clients find the perfect barber based on location, specialty, and availability.

#### Layout
```
┌─────────────────────────────────┐
│  Find Your Barber               │
│  📍 Toronto, ON ▼        🔔    │
│  ┌───────────────────────────┐  │
│  │ 🔍 Search barbers...     ✕│  │
│  └───────────────────────────┘  │
│                                 │
│  [Filters] [Skin Fade] [Taper] │
│                                 │
│  12 barbers found  Sort by ▼   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ [Barber Portfolio Img]  │   │
│  │ ┌──┐ Marcus Johnson ✓   │   │
│  │ │  │ 0.8 km away        │   │
│  │ └──┘ ⭐ 4.9 (347)       │   │
│  │ [Skin Fade][Taper][+2] │   │
│  │ 📍 Northside Studio     │   │
│  │ ⏰ Next: Today at 2:00PM│   │
│  └─────────────────────────┘   │
│  [More barber cards...]        │
└─────────────────────────────────┘
```

#### Features
- **Smart Location**: Detects user location, shows distance
- **Real-time Search**: Filters as you type
- **Specialty Pills**: Quick filter by service type
- **Availability Indicators**: "Next available" prominently displayed
- **Verification Badges**: Checkmark for verified barbers
- **Rich Preview**: Portfolio image, rating, distance in one glance

---

### 2. Barber Profile Screen

**Purpose**: Showcase barber's craft, build trust, and facilitate booking.

#### Layout
```
┌─────────────────────────────────┐
│ ⬅️                           ⋯  │
│                                 │
│  [Large Portfolio Image]        │
│                                 │
│ ┌──┐                            │
│ │  │ Marcus Johnson ✓           │
│ └──┘                            │
│ ⭐ 4.9 (347) │ ⏱️ 15 years exp  │
│                                 │
│ Services ────────────────────── │
│ Signature Fade                  │
│ 45 min • $45.00                 │
│ ─────────────────────────────── │
│ Beard Trim & Shape              │
│ 30 min • $30.00                 │
│                                 │
│ [Portfolio][Reviews][About]     │
│                                 │
│ ┌─ Portfolio Gallery ─────────┐ │
│ │ [Large Selected Image]      │ │
│ │ [Thumbnail Grid]            │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌───────────────────────────┐  │
│ │ From $45.00  [Book Now]   │  │
│ │ 45 min • Next: Today      │  │
│ └───────────────────────────┘  │
└─────────────────────────────────┘
```

#### Tabs
1. **Portfolio**: 6+ images, zoomable gallery
2. **Reviews**: Client testimonials with ratings
3. **About**: Bio, experience, languages, location

#### Key Elements
- **Sticky Book Button**: Always visible at bottom
- **Portfolio Grid**: Tap to expand full-screen
- **Social Proof**: Rating, review count, years experience
- **Service Previews**: Quick pricing scan before booking

---

### 3. Booking Flow (4-Step Modal)

**Purpose**: Guide clients through a frictionless booking process with transparent pricing and policies.

#### Step 1: Service Selection
```
┌─────────────────────────────────┐
│ ⬅️  Book Appointment        ✕   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ [████░░░░░░░░░░░░] Step 1 of 4 │
│                                 │
│ Select Services                 │
│ Choose one or more services     │
│                                 │
│ ┌─────────────────────────┐    │
│ │ Signature Fade      ✓   │    │
│ │ Precision fade with...  │    │
│ │ ⏱️ 45 min         $45.00 │    │
│ └─────────────────────────┘    │
│                                 │
│ ┌─────────────────────────┐    │
│ │ Beard Trim & Shape      │    │
│ │ Professional beard...   │    │
│ │ ⏱️ 30 min         $30.00 │    │
│ └─────────────────────────┘    │
│                                 │
│ ┌───────────────────────────┐  │
│ │ $45.00          [Continue]│  │
│ │ 1 service • 45 min        │  │
│ └───────────────────────────┘  │
└─────────────────────────────────┘
```

#### Step 2: Date Selection
```
┌─────────────────────────────────┐
│ ⬅️  Book Appointment        ✕   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ [████████░░░░░░░] Step 2 of 4  │
│                                 │
│ Choose Date                     │
│ Select a date that works        │
│                                 │
│ [Mon][Tue][Wed][Thu][Fri][Sat] │
│  15   16   17✓  18   19   20   │
│                 Today           │
│                                 │
│ ℹ️ Showing available slots      │
│    for 45 min appointment       │
│                                 │
│ ┌───────────────────────────┐  │
│ │ $45.00          [Continue]│  │
│ │ 1 service • 45 min        │  │
│ └───────────────────────────┘  │
└─────────────────────────────────┘
```

#### Step 3: Time Selection
```
┌─────────────────────────────────┐
│ ⬅️  Book Appointment        ✕   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ [████████████░░░] Step 3 of 4  │
│                                 │
│ Select Time                     │
│ Wednesday, February 17, 2026    │
│                                 │
│ [9:00][9:30][10:00✓][10:30]    │
│ [11:00][11:30][12:00][12:30]   │
│ [1:00][1:30][2:00][2:30]       │
│ [3:00][3:30][4:00][4:30]       │
│                                 │
│ ┌───────────────────────────┐  │
│ │ $45.00          [Continue]│  │
│ │ Wed, Feb 17 at 10:00 AM   │  │
│ └───────────────────────────┘  │
└─────────────────────────────────┘
```

#### Step 4: Review & Payment
```
┌─────────────────────────────────┐
│ ⬅️  Book Appointment        ✕   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ [████████████████] Step 4 of 4 │
│                                 │
│ Review & Pay                    │
│ Confirm details and pay deposit │
│                                 │
│ Services ────────────────────── │
│ Signature Fade         $45.00   │
│                                 │
│ Appointment ─────────────────── │
│ 📅 Wed, February 17, 2026       │
│ ⏰ 10:00 AM (45 min)            │
│                                 │
│ Pricing ─────────────────────── │
│ Subtotal              $45.00    │
│ Deposit (20%)          $9.00    │
│ ───────────────────────────────│
│ Due now               $9.00     │
│ Remaining at appt     $36.00    │
│                                 │
│ 🛡️ Cancellation Policy          │
│ Cancel up to 24hrs for refund   │
│                                 │
│ ┌───────────────────────────┐  │
│ │         [Confirm & Pay]   │  │
│ └───────────────────────────┘  │
└─────────────────────────────────┘
```

---

### 4. Appointments Dashboard

**Purpose**: Manage current and past bookings, take quick actions.

#### Layout
```
┌─────────────────────────────────┐
│ Appointments              🔔    │
│                                 │
│ [Upcoming 1]  [Past]            │
│                                 │
│ ┌─────────────────────────┐    │
│ │ [Portfolio]  Marcus J.  │    │
│ │              Northside  │    │
│ │              ⭐ 4.9     │    │
│ │                   $45.00│    │
│ │                         │    │
│ │ 📅 Wed, Feb 18, 2026    │    │
│ │ ⏰ 2:00 PM              │    │
│ │ 📍 123 Queen St West    │    │
│ │                         │    │
│ │ [Signature Fade]        │    │
│ │                         │    │
│ │ [Cancel][Reschedule]    │    │
│ │       [Get Directions]  │    │
│ └─────────────────────────┘    │
│                                 │
│ [More appointments...]          │
└─────────────────────────────────┘
```

#### Features
- **Status Badges**: Confirmed, pending, completed
- **Quick Actions**: Cancel, reschedule, directions, review
- **Service Pills**: Visual service breakdown
- **Past Tab**: Review prompts, rebook option

---

### 5. Barber Dashboard

**Purpose**: Provide barbers with business insights and appointment management.

#### Layout
```
┌─────────────────────────────────┐
│ Good afternoon,           ⚙️    │
│ Marcus                          │
│                                 │
│ Today's Overview ───────────────│
│ ┌──────┐ ┌──────┐              │
│ │$385  │ │  8   │              │
│ │Today │ │Appts │              │
│ └──────┘ └──────┘              │
│ ┌──────┐ ┌──────┐              │
│ │ 4.9  │ │ 78%  │              │
│ │Rating│ │Repeat│              │
│ └──────┘ └──────┘              │
│                                 │
│ Week Performance ───────────────│
│ ┌─────────────────────────┐    │
│ │ $2,450 This Week        │    │
│ │ [Bar Chart by Day]      │    │
│ └─────────────────────────┘    │
│                                 │
│ Upcoming Today ─────────────────│
│ ┌─────────────────────────┐    │
│ │ 2:00PM  James Wilson    │    │
│ │ 45 min  Signature Fade  │    │
│ │         $45.00  💬 ✅   │    │
│ └─────────────────────────┘    │
│                                 │
│ Quick Actions ──────────────────│
│ [📅 Schedule][👥 Clients]      │
│ [📊 Analytics][🏷️ Services]    │
└─────────────────────────────────┘
```

#### Key Metrics
- **Revenue**: Daily, weekly, monthly trends
- **Appointments**: Count, status breakdown
- **Performance**: Rating, repeat client rate
- **Visualizations**: Bar charts for weekly trends

---

## 🎨 Interaction Patterns

### Animations & Transitions

1. **Card Hover/Press**
   - Scale: 0.98 on press
   - Shadow: Increase elevation
   - Duration: 150ms

2. **Screen Transitions**
   - Modal: Slide up from bottom
   - Stack: Slide from right
   - Tab: Fade with 250ms

3. **Loading States**
   - Skeleton screens for lists
   - Spinner for buttons
   - Progressive image loading

4. **Success States**
   - Checkmark animation
   - Confetti for booking confirmation
   - Haptic feedback

### Gestures

- **Swipe**: Navigate between tabs
- **Pull to Refresh**: Update appointment lists
- **Long Press**: Quick actions menu
- **Pinch/Zoom**: Portfolio image gallery

---

## 📱 Responsive Breakpoints

```
Small phones:  < 375px width
Standard:      375-414px
Large phones:  > 414px
Tablets:       > 768px (future)
```

### Adaptive Elements
- Image sizes scale proportionally
- Text remains legible (min 14px)
- Touch targets: minimum 44x44px
- Padding adjusts for screen size

---

## 🎯 Key UX Principles

### 1. Progressive Disclosure
- Show essential info first
- Hide complexity behind tabs/menus
- Use expandable sections

### 2. Clear Affordances
- Buttons look clickable
- Interactive elements have hover states
- Disabled states clearly visible

### 3. Immediate Feedback
- Loading indicators for async actions
- Success/error messages
- Haptic feedback on important actions

### 4. Trust Signals
- Verification badges
- Clear pricing (no hidden fees)
- Cancellation policy upfront
- Secure payment indicators

### 5. Error Prevention
- Confirmation dialogs for destructive actions
- Input validation before submission
- Clear constraints (e.g., "24 hours notice")

---

## 📐 Component Specifications

### Button Variants

**Primary (Gold)**
- Background: #D4AF37
- Text: #0B0F14
- Use: Main CTAs (Book Now, Confirm)

**Secondary (Card)**
- Background: #111827
- Text: #FFFFFF
- Use: Alternative actions (Reschedule)

**Outline (Gold Border)**
- Background: Transparent
- Border: #D4AF37
- Text: #D4AF37
- Use: Cancel, secondary actions

**Ghost**
- Background: Transparent
- Text: #FFFFFF
- Use: Tertiary actions, links

### Card Styles

**Elevation 1** (Shadows.sm)
- Use: Subtle separation
- Example: Service items

**Elevation 2** (Shadows.md)
- Use: Interactive cards
- Example: Barber cards, appointments

**Elevation 3** (Shadows.lg)
- Use: Modals, dialogs
- Example: Booking modal

---

## 🔧 Implementation Notes

### Image Optimization
- Use Expo Image for caching
- Lazy load off-screen images
- Blurhash placeholders
- WebP format preferred

### Performance
- FlatList for long scrolling lists
- React.memo for expensive components
- useCallback for event handlers
- Debounce search inputs

### Accessibility
- Screen reader labels
- Keyboard navigation
- Color contrast 4.5:1 minimum
- Touch target size 44x44px

---

## 📊 Success Metrics

### Client Funnel
```
Discovery → Profile → Booking → Confirmation
100%      → 70%     → 50%     → 45%
```

### Barber Engagement
- Daily active rate: 80%+
- Appointment acceptance: 95%+
- Response time: < 2 hours

### Business Metrics
- Average booking value: $50
- Repeat booking rate: 60%+
- No-show rate: < 5%

---

<div align="center">
  <p>Wireframes designed for premium barber marketplace experience</p>
  <p>Built with ❤️ and attention to craft</p>
</div>

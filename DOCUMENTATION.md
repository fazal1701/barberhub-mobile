# BarberHub Mobile - Professional Documentation

## Overview

BarberHub Mobile is a premium, Gen Z-focused barber marketplace built with React Native, TypeScript, and Expo. The application features advanced animations, haptic feedback, and modern UX patterns designed specifically for the mobile-first generation.

---

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Expo CLI (install globally: `npm install -g expo-cli`)
- iOS Simulator (macOS only) or Android Studio
- Expo Go app for physical device testing

### Installation

```bash
# Navigate to project directory
cd BarberHubMobile

# Install dependencies
npm install

# Start development server
npm start
```

### Running the App

**iOS Simulator**
```bash
npm run ios
```

**Android Emulator**
```bash
npm run android
```

**Web Browser**
```bash
npm run web
```

**Physical Device**
- Install Expo Go from App Store or Play Store
- Scan QR code displayed in terminal
- App will load automatically

---

## Architecture

### Project Structure

```
BarberHubMobile/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AnimatedButton.tsx
│   │   ├── BarberCard.tsx
│   │   ├── BarberStories.tsx
│   │   ├── Skeleton.tsx
│   │   └── SwipeableBarberCard.tsx
│   ├── screens/             # Screen components
│   │   ├── EnhancedDiscoveryScreen.tsx
│   │   ├── OnboardingScreen.tsx
│   │   ├── BarberProfileScreen.tsx
│   │   ├── BookingScreen.tsx
│   │   ├── AppointmentsScreen.tsx
│   │   └── BarberDashboardScreen.tsx
│   ├── navigation/          # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── constants/           # Theme and design tokens
│   │   └── theme.ts
│   ├── types/              # TypeScript definitions
│   │   └── index.ts
│   └── data/               # Mock data and utilities
│       └── mockData.ts
├── App.tsx                 # Application entry point
├── app.json               # Expo configuration
└── package.json           # Dependencies
```

### Technology Stack

**Core Technologies**
- React Native 0.74+
- TypeScript 5.0+
- Expo SDK 51+

**Navigation**
- React Navigation 6
- Native Stack Navigator
- Bottom Tab Navigator

**Animations & Gestures**
- React Native Reanimated 3
- React Native Gesture Handler
- Expo Haptics

**UI Components**
- Expo Linear Gradient
- Expo Blur
- Ionicons
- Custom design system

**State & Storage**
- AsyncStorage for persistence
- Zustand (planned for global state)

---

## Key Features

### 1. Interactive Onboarding

**Implementation**: 4-slide onboarding with parallax animations

**Features**:
- Smooth scroll animations with Reanimated
- Haptic feedback on interactions
- Skip functionality
- Persistent state with AsyncStorage
- Gradient icons with shadow effects

**File**: `src/screens/OnboardingScreen.tsx`

### 2. Stories-Style Showcase

**Implementation**: Instagram/Snapchat inspired barber stories

**Features**:
- Horizontal scrollable stories row
- Gradient ring around viewed profiles
- Full-screen story viewer
- Tap to advance, long press to pause
- Progress bars for multiple images
- Direct booking from stories

**Files**: 
- `src/components/BarberStories.tsx`

### 3. Swipeable Cards

**Implementation**: Tinder-style card swiping for barber discovery

**Features**:
- Pan gesture handling with spring animations
- Visual feedback (BOOK/SKIP indicators)
- Rotation and translation on swipe
- Threshold-based actions
- Haptic feedback on swipe
- Smooth card transitions

**File**: `src/components/SwipeableBarberCard.tsx`

### 4. Skeleton Loaders

**Implementation**: Shimmer effect loading states

**Features**:
- Gradient animation across skeleton
- Repeating animation loop
- Component-specific skeletons
- Smooth transitions from loading to content

**File**: `src/components/Skeleton.tsx`

### 5. Haptic Feedback

**Implementation**: Expo Haptics throughout the app

**Feedback Types**:
- Light: Button presses, filter toggles
- Medium: Primary actions, confirmations
- Success/Error: Notifications for swipe actions

**Integration**: All interactive components

### 6. Animated Button

**Implementation**: Enhanced button with animations and gradients

**Features**:
- Scale animation on press (0.96)
- Opacity feedback
- Spring physics for natural feel
- Gradient variant with LinearGradient
- Multiple sizes (sm, md, lg)
- Loading states with spinner

**File**: `src/components/AnimatedButton.tsx`

### 7. Enhanced Discovery

**Implementation**: Multi-mode discovery screen

**Features**:
- Swipe mode: Card-based browsing
- List mode: Traditional scrolling
- Real-time search with instant feedback
- Specialty filters with modal
- Location-based sorting
- Empty state handling

**File**: `src/screens/EnhancedDiscoveryScreen.tsx`

---

## Design System

### Color Palette

**Primary Colors**
- Background: #0B0F14 (Midnight)
- Card: #111827 (Charcoal)
- Accent: #D4AF37 (Gold)

**Semantic Colors**
- Success: #22C55E
- Error: #EF4444
- Warning: #F59E0B
- Info: #2563EB

**Text Colors**
- Primary: #FFFFFF
- Secondary: #E5E7EB
- Tertiary: #9CA3AF

### Typography

**Scale**
- xs: 12px
- sm: 14px
- base: 16px
- lg: 18px
- xl: 20px
- 2xl: 24px
- 3xl: 30px
- 4xl: 36px
- 5xl: 48px

**Weights**
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Extrabold: 800

### Spacing

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

### Border Radius

- sm: 4px
- md: 8px
- lg: 12px
- xl: 16px
- 2xl: 24px
- full: 9999px

---

## Components API

### AnimatedButton

```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  hapticFeedback?: boolean;
}
```

**Usage Example**:
```typescript
<AnimatedButton
  title="Book Now"
  onPress={handleBooking}
  variant="gradient"
  size="lg"
  fullWidth
/>
```

### SwipeableBarberCard

```typescript
interface SwipeableBarberCardProps {
  barber: BarberWithDistance;
  onSwipeLeft: (barber: BarberWithDistance) => void;
  onSwipeRight: (barber: BarberWithDistance) => void;
  onPress: (barber: BarberWithDistance) => void;
}
```

**Usage Example**:
```typescript
<SwipeableBarberCard
  barber={currentBarber}
  onSwipeLeft={handleSkip}
  onSwipeRight={handleBook}
  onPress={viewProfile}
/>
```

### Skeleton

```typescript
interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}
```

**Usage Example**:
```typescript
<Skeleton width="100%" height={200} borderRadius={16} />
<SkeletonBarberCard />
```

---

## Data Models

### Core Types

**Barber**
```typescript
interface Barber {
  barberId: UUID;
  bio: string;
  specialties: string[];
  languages: string[];
  yearsExperience: number;
  instagramHandle?: string;
  portfolioCoverUrl: string;
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  ratingAvg: number;
  ratingCount: number;
  user: User;
  portfolioImages: string[];
}
```

**Appointment**
```typescript
interface Appointment {
  id: UUID;
  clientUserId: UUID;
  barberUserId: UUID;
  shopId: UUID;
  locationId: UUID;
  status: 'draft' | 'confirmed' | 'checked_in' | 'completed' | 'canceled' | 'no_show' | 'disputed';
  startAt: string;
  endAt: string;
  quotedTotalCents: number;
  appliedDiscountCents: number;
  createdAt: string;
}
```

**Service**
```typescript
interface Service {
  id: UUID;
  shopId: UUID;
  name: string;
  description: string;
  durationMinutes: number;
  priceCents: number;
  currency: string;
  isAddon: boolean;
  active: boolean;
}
```

---

## Animation Patterns

### Spring Animations

**Configuration**:
```typescript
withSpring(value, {
  damping: 15,
  stiffness: 300
})
```

**Use Cases**:
- Button press feedback
- Card swipe return
- Modal presentations

### Timing Animations

**Configuration**:
```typescript
withTiming(value, {
  duration: 250
})
```

**Use Cases**:
- Fade transitions
- Slide animations
- Opacity changes

### Gesture-Driven Animations

**Pan Gesture Handler**:
```typescript
const gestureHandler = useAnimatedGestureHandler({
  onStart: () => { },
  onActive: (event) => {
    translateX.value = event.translationX;
  },
  onEnd: (event) => {
    // Spring back or complete action
  },
});
```

---

## Performance Optimization

### Image Loading

**Strategy**: Progressive loading with placeholders
```typescript
<Image
  source={{ uri: imageUrl }}
  style={styles.image}
  resizeMode="cover"
/>
```

### List Rendering

**FlatList Configuration**:
```typescript
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={item => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  windowSize={5}
/>
```

### Memoization

**React.memo for Expensive Components**:
```typescript
export const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
});
```

---

## Haptic Feedback Guidelines

### Impact Feedback

**Light**: Subtle, frequent interactions
- Filter toggles
- List item selections
- Checkbox toggles

**Medium**: Primary actions
- Button presses
- Tab switches
- Form submissions

**Heavy**: Significant actions
- Booking confirmations
- Error notifications

### Notification Feedback

**Success**: Positive outcomes
- Booking confirmed
- Profile updated
- Review submitted

**Warning**: Attention needed
- Form validation errors
- Connection issues

**Error**: Failed actions
- Payment declined
- Booking unavailable

---

## Testing Strategy

### Unit Tests

**Components**:
```bash
npm run test
```

**Coverage Requirements**:
- Components: 80%+
- Utilities: 90%+
- Data transformations: 95%+

### Integration Tests

**Navigation Flows**:
- Onboarding -> Discovery
- Discovery -> Profile -> Booking
- Appointments -> Details

### E2E Tests (Detox)

**Critical Paths**:
1. Complete onboarding
2. Search and filter barbers
3. View barber profile
4. Complete booking flow
5. View appointment history

---

## Deployment

### Build Configuration

**iOS**:
```bash
eas build --platform ios --profile production
```

**Android**:
```bash
eas build --platform android --profile production
```

### Environment Variables

```bash
# .env
API_BASE_URL=https://api.barberhub.com
STRIPE_PUBLIC_KEY=pk_live_...
GOOGLE_MAPS_API_KEY=...
```

### App Store Requirements

**iOS**:
- App icons (1024x1024)
- Screenshots (6.5" and 5.5" devices)
- Privacy policy URL
- App description

**Android**:
- Feature graphic (1024x500)
- Screenshots (phone and tablet)
- Privacy policy URL
- Content rating

---

## Troubleshooting

### Common Issues

**Metro Bundler Won't Start**
```bash
npm start -- --clear
```

**Module Resolution Errors**
```bash
rm -rf node_modules
npm install
```

**Reanimated Plugin Issues**
- Verify `babel.config.js` has reanimated plugin last
- Clear cache: `expo r -c`

**Gesture Handler Issues**
- Ensure `GestureHandlerRootView` wraps entire app
- Import 'react-native-gesture-handler' at top of App.tsx

**Haptics Not Working**
- Check device capabilities
- Test on physical device (simulators have limited haptic support)

---

## Contributing

### Code Style

**TypeScript**:
- Strict mode enabled
- Explicit return types for functions
- Interface over type for objects

**Formatting**:
- 2-space indentation
- Single quotes for strings
- Trailing commas in multiline

**Naming Conventions**:
- PascalCase: Components, types, interfaces
- camelCase: Functions, variables
- UPPER_SNAKE_CASE: Constants

### Pull Request Process

1. Create feature branch from `main`
2. Write tests for new features
3. Update documentation
4. Run linter: `npm run lint`
5. Run tests: `npm test`
6. Create PR with detailed description

---

## License

MIT License - see LICENSE file for details

---

## Support

**Documentation**: Check project README files
**Issues**: Create GitHub issue with detailed description
**Community**: Join Discord/Slack community (links in main README)

---

Last Updated: February 2026
Version: 2.0.0 (Gen Z Enhanced)

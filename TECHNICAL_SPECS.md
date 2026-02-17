# BarberHub Mobile - Technical Specifications

## Gen Z Experience Enhancements

### Overview

Version 2.0 introduces significant UX improvements specifically designed for Gen Z users, focusing on familiar interaction patterns, instant feedback, and social-first discovery.

---

## New Features

### 1. Interactive Onboarding

**Description**: Four-slide introduction with smooth parallax animations

**Technical Implementation**:
- Reanimated 3 scroll-driven animations
- Interpolated transforms for parallax effect
- AsyncStorage for persistent completion state
- Haptic feedback on all interactions

**Key Components**:
- Animated scroll handler with `useAnimatedScrollHandler`
- Shared values for scroll position tracking
- Spring animations for natural movement
- Gradient backgrounds with LinearGradient

**Performance Characteristics**:
- 60 FPS animations on all interactions
- Lazy loading of subsequent slides
- Minimal bundle size impact (< 50KB)

### 2. Stories Feature

**Description**: Instagram/Snapchat-inspired barber showcase

**Technical Implementation**:
- Horizontal `ScrollView` with snap points
- Full-screen modal viewer
- Progress bar system for multiple images
- Gesture detection (tap, long press)

**Interaction Patterns**:
- Tap right side: Next image
- Tap left side: Previous image
- Long press: Pause story
- Swipe down: Close viewer

**State Management**:
- Progress tracking per story
- Viewed state persistence
- Auto-advance with timer (optional)

### 3. Swipeable Cards

**Description**: Tinder-style card swiping for barber discovery

**Technical Implementation**:
- `PanGestureHandler` for swipe detection
- Animated transforms (rotation, translation)
- Threshold-based action triggering
- Spring physics for natural feel

**Animation Details**:
```typescript
// Rotation interpolation
const rotate = interpolate(
  translateX.value,
  [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
  [-15, 0, 15],
  Extrapolate.CLAMP
);

// Swipe indicators
const likeOpacity = interpolate(
  translateX.value,
  [0, SWIPE_THRESHOLD],
  [0, 1],
  Extrapolate.CLAMP
);
```

**Performance**:
- Native driver enabled
- 60 FPS gesture tracking
- Optimized re-renders with `useAnimatedGestureHandler`

### 4. Skeleton Loaders

**Description**: Shimmer effect loading states

**Technical Implementation**:
- LinearGradient with animated position
- Repeating animation loop
- Component-specific shapes
- Smooth content replacement

**Animation Configuration**:
```typescript
useEffect(() => {
  translateX.value = withRepeat(
    withTiming(1, { duration: 1500 }),
    -1,
    false
  );
}, []);
```

### 5. Haptic Feedback System

**Description**: Tactile feedback for all interactions

**Implementation Strategy**:
- Impact feedback: Button presses, selections
- Notification feedback: Success/error states
- Selection feedback: Picker scrolling

**Feedback Mapping**:
```typescript
// Light impact
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

// Medium impact
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

// Heavy impact
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)

// Success notification
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
```

---

## Component Architecture

### AnimatedButton

**Purpose**: Reusable button with animations and haptics

**Props Interface**:
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

**Animation Details**:
- Scale: 0.96 on press (spring physics)
- Opacity: 0.8 on press (timing animation)
- Duration: 100ms for opacity, spring for scale

**Variant Implementations**:
- Primary: Solid accent color
- Secondary: Card background
- Outline: Transparent with border
- Ghost: Fully transparent
- Gradient: LinearGradient with animated colors

### SwipeableBarberCard

**Purpose**: Card component with gesture-driven animations

**Gesture Handling**:
```typescript
const gestureHandler = useAnimatedGestureHandler({
  onStart: () => {
    runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
  },
  onActive: (event) => {
    translateX.value = event.translationX;
    translateY.value = event.translationY * 0.2;
  },
  onEnd: (event) => {
    if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
      // Trigger action
    } else {
      // Spring back
    }
  },
});
```

**Visual Feedback**:
- Rotation: -15° to 15° based on swipe
- Indicators: Fade in BOOK/SKIP labels
- Colors: Green for right, red for left

### Skeleton

**Purpose**: Loading placeholder with shimmer effect

**Animation Technique**:
```typescript
const animatedStyle = useAnimatedStyle(() => {
  const translateValue = interpolate(
    translateX.value,
    [-1, 1],
    [-300, 300]
  );
  
  return {
    transform: [{ translateX: translateValue }],
  };
});
```

**Variants**:
- Basic skeleton (width, height, borderRadius)
- SkeletonBarberCard (pre-built card shape)
- Custom skeletons via props

---

## Screen Architecture

### EnhancedDiscoveryScreen

**Features**:
- Dual view mode (swipe/list)
- Real-time search
- Specialty filters with modal
- Stories row integration
- Empty state handling

**State Management**:
```typescript
const [viewMode, setViewMode] = useState<'swipe' | 'list'>('swipe');
const [searchQuery, setSearchQuery] = useState('');
const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
const [currentIndex, setCurrentIndex] = useState(0);
```

**Performance Optimizations**:
- Lazy loading of off-screen content
- Memoized filter functions
- Debounced search input
- Optimized re-renders with React.memo

### OnboardingScreen

**Slide Structure**:
```typescript
const SLIDES = [
  {
    id: '1',
    title: 'Find Your Perfect Barber',
    description: '...',
    icon: 'search',
    gradient: ['#D4AF37', '#F4C542'],
  },
  // ... more slides
];
```

**Scroll Animation**:
```typescript
const scrollHandler = useAnimatedScrollHandler({
  onScroll: (event) => {
    scrollX.value = event.contentOffset.x;
  },
});
```

**Pagination Dots**:
- Animated width based on scroll position
- Active state styling
- Smooth transitions

---

## Animation Principles

### Spring Physics

**Default Configuration**:
```typescript
withSpring(value, {
  damping: 15,
  stiffness: 300,
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
})
```

**Use Cases**:
- Button press feedback
- Card return after incomplete swipe
- Modal dismissals

### Timing Animations

**Default Configuration**:
```typescript
withTiming(value, {
  duration: 250,
  easing: Easing.inOut(Easing.ease),
})
```

**Use Cases**:
- Opacity transitions
- Position changes
- Scale adjustments

### Gesture-Driven

**Pan Gesture**:
- Real-time position tracking
- Velocity-based decisions
- Threshold-triggered actions

**Tap Gesture**:
- Single tap detection
- Double tap handling
- Location-based actions

**Long Press**:
- Duration threshold
- Visual feedback during press
- Action on release

---

## Performance Benchmarks

### Target Metrics

**Animation Performance**:
- 60 FPS on all interactions
- < 16ms frame time
- Smooth gesture tracking

**Bundle Size**:
- Core app: < 10MB
- Assets: < 5MB
- Total install: < 15MB

**Memory Usage**:
- Idle: < 50MB
- Active scrolling: < 100MB
- Peak: < 150MB

**Load Times**:
- App startup: < 2s
- Screen transitions: < 300ms
- Image loading: Progressive with placeholders

---

## Testing Specifications

### Unit Tests

**Components**:
```typescript
describe('AnimatedButton', () => {
  it('triggers haptic feedback on press', () => {
    // Test implementation
  });
  
  it('scales down on press', () => {
    // Test animation values
  });
});
```

### Integration Tests

**Navigation**:
```typescript
describe('Onboarding Flow', () => {
  it('completes onboarding and navigates to main app', () => {
    // Test flow
  });
});
```

### E2E Tests

**Critical Paths**:
1. Open app → Complete onboarding → Reach discovery
2. Swipe cards → View profile → Book appointment
3. Search barbers → Apply filters → View results

---

## Accessibility

### Screen Reader Support

**Labels**:
```typescript
<TouchableOpacity
  accessibilityLabel="Book appointment with Marcus Johnson"
  accessibilityHint="Opens booking flow"
  accessibilityRole="button"
>
```

### Haptic Alternatives

**Visual Feedback**:
- Scale animations
- Color changes
- Opacity shifts

**Audio Feedback** (optional):
- Success sounds
- Error tones
- Notification chimes

---

## Future Enhancements

### Planned Features

**Short Term (1-2 months)**:
- Pull-to-refresh animations
- Booking confirmation animations
- Profile edit transitions
- Review submission feedback

**Medium Term (3-6 months)**:
- Advanced filtering with animations
- Map-based discovery
- Video portfolio support
- AR try-on integration

**Long Term (6+ months)**:
- Real-time chat animations
- Live availability updates
- Push notification animations
- Social sharing features

---

## Maintenance

### Dependency Updates

**React Native Reanimated**:
- Update frequency: Monthly
- Breaking changes: Review migration guide
- Testing required: Full animation suite

**Expo SDK**:
- Update frequency: Quarterly
- Compatibility: Check all Expo modules
- Testing required: Build and deployment

### Performance Monitoring

**Metrics to Track**:
- Animation frame rate
- Gesture responsiveness
- Memory usage patterns
- Battery consumption

**Tools**:
- React Native Performance Monitor
- Flipper for debugging
- Sentry for error tracking

---

## Conclusion

Version 2.0 represents a significant enhancement to the BarberHub mobile experience, introducing Gen Z-focused interaction patterns while maintaining performance and code quality standards.

**Key Achievements**:
- 60 FPS animations throughout
- Haptic feedback on all interactions
- Social-first discovery patterns
- Modern, familiar UI patterns
- Professional code architecture

---

Last Updated: February 2026
Version: 2.0.0

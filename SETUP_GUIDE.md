# BarberHub Mobile - Complete Setup Guide

## Installation and Configuration

### System Requirements

**Development Machine**:
- macOS 12+ (for iOS development)
- Windows 10+ or Linux (for Android development)
- 8GB RAM minimum (16GB recommended)
- 20GB free disk space

**Software Prerequisites**:
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Git 2.30.0 or higher
- Xcode 14+ (macOS only, for iOS)
- Android Studio (for Android development)

### Step 1: Initial Setup

```bash
# Clone or navigate to project
cd /Users/fazalbhatti/Desktop/Barberhub/BarberHubMobile

# Install dependencies
npm install

# Verify installation
npm list --depth=0
```

**Expected Output**:
```
BarberHubMobile@1.0.0
├── @expo/vector-icons@14.0.0
├── @react-native-async-storage/async-storage@1.21.0
├── @react-navigation/bottom-tabs@6.5.11
├── @react-navigation/native@6.1.9
├── @react-navigation/native-stack@6.9.17
├── date-fns@3.0.6
├── expo@51.0.0
├── expo-blur@13.0.2
├── expo-haptics@13.0.1
├── expo-image@1.10.1
├── expo-linear-gradient@13.0.2
├── expo-location@17.0.1
├── expo-status-bar@1.12.1
├── lottie-react-native@6.5.1
├── react@18.2.0
├── react-native@0.74.0
├── react-native-gesture-handler@2.16.0
├── react-native-reanimated@3.8.0
├── react-native-safe-area-context@4.8.2
├── react-native-screens@3.29.0
├── react-native-svg@15.0.0
├── typescript@5.3.3
└── zustand@4.5.0
```

### Step 2: Configure Expo

**Update app.json**:
```json
{
  "expo": {
    "name": "BarberHub",
    "slug": "barberhub-mobile",
    "version": "2.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0B0F14"
    },
    "plugins": [
      "expo-location",
      [
        "expo-image-picker",
        {
          "photosPermission": "Allow BarberHub to access your photos to upload portfolio images."
        }
      ]
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.barberhub.mobile",
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "BarberHub needs your location to find nearby barbers.",
        "NSPhotoLibraryUsageDescription": "Upload photos to your barber portfolio."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0B0F14"
      },
      "package": "com.barberhub.mobile",
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    }
  }
}
```

### Step 3: Start Development Server

```bash
# Start Expo development server
npm start

# Or with specific options
npm start -- --clear  # Clear cache
npm start -- --offline  # Offline mode
npm start -- --localhost  # Force localhost
```

**Development Server Output**:
```
Metro waiting on exp://192.168.1.100:8081

› Press i │ open iOS simulator
› Press a │ open Android emulator
› Press w │ open web browser

› Press r │ reload app
› Press m │ toggle menu
› Press ? │ show all commands
```

### Step 4: Run on Platforms

**iOS (macOS only)**:
```bash
# Open iOS simulator
npm run ios

# Or specify device
npm run ios -- --simulator="iPhone 15 Pro"

# For physical device
npm run ios -- --device
```

**Android**:
```bash
# Open Android emulator
npm run android

# Or specify emulator
npm run android -- --variant=release

# For physical device (USB debugging enabled)
adb devices  # Verify device connected
npm run android
```

**Web**:
```bash
# Open in browser
npm run web

# Or specify port
npm run web -- --port 3000
```

**Physical Device (Expo Go)**:
1. Install Expo Go from App Store or Play Store
2. Scan QR code from terminal
3. App loads automatically
4. Shake device for developer menu

---

## Configuration Details

### Babel Configuration

**File**: `babel.config.js`

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'react-native-reanimated/plugin',
        {
          relativeSourceLocation: true,
        },
      ],
    ],
  };
};
```

**Important**: Reanimated plugin must be listed last in plugins array.

### TypeScript Configuration

**File**: `tsconfig.json`

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "jsx": "react-native",
    "lib": ["ES2021"],
    "types": ["react-native", "jest"]
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

### Environment Variables

**Create**: `.env` file in project root

```bash
# API Configuration
API_BASE_URL=https://api.barberhub.com
API_TIMEOUT=30000

# Stripe Configuration
STRIPE_PUBLIC_KEY=pk_test_your_key_here

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_key

# Unsplash
UNSPLASH_ACCESS_KEY=your_unsplash_key
UNSPLASH_SECRET_KEY=your_unsplash_secret

# Feature Flags
ENABLE_STORIES=true
ENABLE_SWIPE_MODE=true
ENABLE_HAPTICS=true
ENABLE_ANIMATIONS=true

# Development
DEBUG_MODE=true
LOG_LEVEL=verbose
```

**Install env support**:
```bash
npm install react-native-dotenv
```

---

## Feature Configuration

### Haptic Feedback

**Enable/Disable Globally**:

```typescript
// src/config/haptics.ts
export const HapticsConfig = {
  enabled: true,
  intensity: {
    light: 'light',
    medium: 'medium',
    heavy: 'heavy',
  },
  feedback: {
    buttonPress: 'light',
    swipeAction: 'medium',
    confirmation: 'success',
    error: 'error',
  },
};
```

**Usage in Components**:
```typescript
import * as Haptics from 'expo-haptics';
import { HapticsConfig } from '../config/haptics';

if (HapticsConfig.enabled) {
  Haptics.impactAsync(
    Haptics.ImpactFeedbackStyle[HapticsConfig.feedback.buttonPress]
  );
}
```

### Animation Configuration

**Global Settings**:

```typescript
// src/config/animations.ts
export const AnimationConfig = {
  enabled: true,
  spring: {
    damping: 15,
    stiffness: 300,
    mass: 1,
  },
  timing: {
    duration: 250,
  },
  gesture: {
    swipeThreshold: 100,
    snapPoints: [0, 0.5, 1],
  },
};
```

### Unsplash Integration

**Setup**:

```typescript
// src/services/unsplash.ts
import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY || '',
});

export const fetchBarberImages = async (query: string) => {
  const result = await unsplash.search.getPhotos({
    query,
    page: 1,
    perPage: 30,
    orientation: 'portrait',
  });
  
  return result.response?.results.map(photo => ({
    id: photo.id,
    url: photo.urls.regular,
    thumb: photo.urls.thumb,
    photographer: photo.user.name,
  }));
};

export const imageCategories = {
  portfolioCovers: 'modern barbershop fade close up',
  shopInteriors: 'modern barbershop interior dark',
  tools: 'barber clippers tools',
  products: 'grooming products flat lay',
  beardWork: 'beard trim close up professional',
  fadeWork: 'taper fade haircut professional',
  shaveWork: 'straight razor shave barbershop',
};
```

**Install Unsplash SDK**:
```bash
npm install unsplash-js
```

---

## Development Workflow

### Hot Reload

**Fast Refresh**: Automatically enabled in Expo

**Manual Reload**:
- iOS Simulator: Cmd + D → Reload
- Android Emulator: Cmd + M → Reload
- Physical Device: Shake → Reload

### Developer Menu

**Access**:
- iOS Simulator: Cmd + D
- Android Emulator: Cmd + M
- Physical Device: Shake device

**Options**:
- Reload
- Debug Remote JS
- Toggle Element Inspector
- Toggle Performance Monitor
- Open React DevTools

### Debugging

**React Native Debugger**:
```bash
# Install
brew install --cask react-native-debugger

# Launch
open "rndebugger://set-debugger-loc?host=localhost&port=8081"
```

**Flipper**:
```bash
# Install
brew install --cask flipper

# Connect to app
# Flipper automatically detects running apps
```

**Console Logging**:
```typescript
console.log('Standard log');
console.warn('Warning message');
console.error('Error message');
console.info('Info message');
console.debug('Debug message');
```

**Performance Monitoring**:
```typescript
import { InteractionManager } from 'react-native';

InteractionManager.runAfterInteractions(() => {
  // Heavy operations after animations complete
});
```

---

## Testing Setup

### Unit Tests with Jest

**Install**:
```bash
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native
```

**Configuration**: `jest.config.js`

```javascript
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/types/**',
  ],
};
```

**Example Test**:
```typescript
// src/components/__tests__/AnimatedButton.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AnimatedButton } from '../AnimatedButton';

describe('AnimatedButton', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <AnimatedButton title="Test" onPress={() => {}} />
    );
    expect(getByText('Test')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <AnimatedButton title="Test" onPress={onPress} />
    );
    
    fireEvent.press(getByText('Test'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

**Run Tests**:
```bash
npm test
npm test -- --coverage
npm test -- --watch
```

### E2E Tests with Detox

**Install**:
```bash
npm install --save-dev detox detox-cli
```

**Configuration**: `.detoxrc.json`

```json
{
  "testRunner": "jest",
  "runnerConfig": "e2e/config.json",
  "configurations": {
    "ios.sim.debug": {
      "device": {
        "type": "iPhone 15 Pro"
      },
      "app": "ios.debug"
    }
  }
}
```

**Example E2E Test**:
```typescript
// e2e/onboarding.test.ts
describe('Onboarding', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should complete onboarding flow', async () => {
    await expect(element(by.text('Find Your Perfect Barber'))).toBeVisible();
    await element(by.text('Next')).tap();
    await element(by.text('Next')).tap();
    await element(by.text('Next')).tap();
    await element(by.text('Get Started')).tap();
    await expect(element(by.text('Discover'))).toBeVisible();
  });
});
```

---

## Building for Production

### Expo Application Services (EAS)

**Install EAS CLI**:
```bash
npm install -g eas-cli
```

**Login**:
```bash
eas login
```

**Configure**: `eas.json`

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "autoIncrement": true,
      "cache": {
        "key": "production"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

**Build Commands**:

```bash
# Development build
eas build --profile development --platform ios
eas build --profile development --platform android

# Production build
eas build --profile production --platform ios
eas build --profile production --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

### Local Builds

**iOS**:
```bash
# Generate iOS build
npx expo run:ios --configuration Release

# Archive for App Store
xcodebuild -workspace ios/BarberHubMobile.xcworkspace \
  -scheme BarberHubMobile \
  -configuration Release \
  -archivePath build/BarberHubMobile.xcarchive \
  archive
```

**Android**:
```bash
# Generate Android build
npx expo run:android --variant release

# Generate signed APK
cd android
./gradlew assembleRelease

# Generate AAB (for Play Store)
./gradlew bundleRelease
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] Update version in app.json
- [ ] Run all tests (`npm test`)
- [ ] Check TypeScript errors (`npm run tsc`)
- [ ] Run linter (`npm run lint`)
- [ ] Test on physical devices (iOS & Android)
- [ ] Verify all features work offline
- [ ] Check bundle size (`npm run analyze`)
- [ ] Update CHANGELOG.md
- [ ] Create git tag for version

### App Store Submission (iOS)

- [ ] App icons (1024x1024 PNG)
- [ ] Screenshots (all required device sizes)
- [ ] App preview video (optional)
- [ ] Privacy policy URL
- [ ] Support URL
- [ ] Marketing URL
- [ ] App description (4000 chars max)
- [ ] Keywords (100 chars max)
- [ ] Age rating questionnaire
- [ ] Export compliance information

### Play Store Submission (Android)

- [ ] Feature graphic (1024x500)
- [ ] App icon (512x512)
- [ ] Screenshots (phone & tablet)
- [ ] Short description (80 chars)
- [ ] Full description (4000 chars)
- [ ] Privacy policy URL
- [ ] Content rating questionnaire
- [ ] App category
- [ ] Tags

---

## Monitoring and Analytics

### Sentry Integration

**Install**:
```bash
npm install @sentry/react-native
```

**Configuration**:
```typescript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'your-sentry-dsn',
  enableInExpoDevelopment: false,
  debug: __DEV__,
  tracesSampleRate: 1.0,
});
```

### Analytics

**Install Expo Analytics**:
```bash
npm install expo-analytics
```

**Usage**:
```typescript
import { Analytics } from 'expo-analytics';

const analytics = new Analytics('UA-XXXXXXXXX-X');

// Track screen view
analytics.hit('ScreenView', { screen: 'Discovery' });

// Track event
analytics.event('Booking', 'Completed', 'Marcus Johnson', 4500);
```

---

## Troubleshooting

### Common Issues

**Issue**: Metro bundler won't start
```bash
# Solution
rm -rf node_modules
rm -rf .expo
npm install
npm start -- --clear
```

**Issue**: Reanimated not working
```bash
# Solution
# 1. Check babel.config.js has reanimated plugin last
# 2. Clear cache
npm start -- --clear
# 3. Reinstall
rm -rf node_modules
npm install
```

**Issue**: Gesture handler conflicts
```bash
# Solution
# 1. Verify GestureHandlerRootView wraps entire app
# 2. Import at top of App.tsx
import 'react-native-gesture-handler';
# 3. Rebuild
npm run ios
```

**Issue**: Haptics not working
- Haptics only work on physical devices
- iOS simulators have limited haptic support
- Verify device supports haptics
- Check device haptic settings are enabled

### Performance Issues

**Slow Animations**:
1. Enable hardware acceleration
2. Use native driver where possible
3. Reduce simultaneous animations
4. Optimize re-renders with React.memo

**High Memory Usage**:
1. Optimize images (use WebP, compress)
2. Implement image caching
3. Lazy load off-screen content
4. Profile with React DevTools

**Large Bundle Size**:
1. Enable Hermes on Android
2. Use dynamic imports
3. Remove unused dependencies
4. Optimize images and assets

---

## Support and Resources

### Documentation
- Expo Docs: https://docs.expo.dev/
- React Native: https://reactnative.dev/
- Reanimated: https://docs.swmansion.com/react-native-reanimated/
- Gesture Handler: https://docs.swmansion.com/react-native-gesture-handler/

### Community
- Expo Forums: https://forums.expo.dev/
- React Native Discord: https://discord.gg/react-native
- Stack Overflow: Tag `expo` or `react-native`

### Tools
- Expo Snack: https://snack.expo.dev/ (online editor)
- React Native Directory: https://reactnative.directory/
- Can I Use React Native: https://caniusenative.com/

---

## Next Steps

1. **Customize Mock Data**: Edit `src/data/mockData.ts`
2. **Update Theme**: Modify `src/constants/theme.ts`
3. **Add Backend API**: Integrate with real API endpoints
4. **Setup Authentication**: Implement Firebase or Auth0
5. **Payment Integration**: Connect Stripe or Square
6. **Push Notifications**: Configure Expo Notifications
7. **Deploy**: Build and submit to app stores

---

**Version**: 2.0.0
**Last Updated**: February 2026
**Status**: Production Ready

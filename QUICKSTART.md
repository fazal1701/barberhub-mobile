# BarberHub Mobile - Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Prerequisites Check
```bash
# Check Node.js version (need 18+)
node --version

# Check npm
npm --version

# Install Expo CLI globally (if needed)
npm install -g expo-cli
```

---

## 📱 Installation & First Run

### Step 1: Navigate to Project
```bash
cd /Users/fazalbhatti/Desktop/Barberhub/BarberHubMobile
```

### Step 2: Install Dependencies (Already Done)
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm start
```

This will:
- Start Metro bundler
- Open Expo DevTools in browser
- Display QR code for physical device testing

### Step 4: Run on Your Device

**Option A: iOS Simulator (Mac only)**
```bash
# Press 'i' in terminal, or:
npm run ios
```

**Option B: Android Emulator**
```bash
# Press 'a' in terminal, or:
npm run android
```

**Option C: Physical Device**
1. Install **Expo Go** app from App Store/Play Store
2. Scan QR code from terminal
3. App will load on your phone

**Option D: Web Browser**
```bash
# Press 'w' in terminal, or:
npm run web
```

---

## 🎯 What You'll See

### Home Screen (Discovery)
- Search bar at top
- Location: "Toronto, ON"
- Filter pills: Skin Fade, Taper, Beard Sculpting, etc.
- **4 barber cards** with:
  - Portfolio images
  - Ratings (4.8 - 4.95)
  - Distance (0.8 - 3.5 km)
  - Next available time

### Try These Actions:
1. **Search**: Type "Marcus" in search bar
2. **Filter**: Tap "Skin Fade" specialty pill
3. **View Profile**: Tap any barber card

---

## 🎨 Explore the App

### Main Navigation (Bottom Tabs)
1. **🔍 Discover**: Find barbers (you're here)
2. **📅 Bookings**: Your appointments
3. **👤 Profile**: Barber dashboard (mock)

### Key Flows to Test

#### **Flow 1: Browse Barber Profile**
```
Discovery → Tap Marcus Johnson → View Portfolio
→ Check Reviews → See Services → Scroll through About
```

#### **Flow 2: Complete a Booking**
```
Profile → Book Now → Select "Signature Fade"
→ Choose Wednesday → Pick 10:00 AM
→ Review $45 ($9 deposit) → Confirm & Pay
```

#### **Flow 3: View Appointments**
```
Bottom Tab → Bookings → See upcoming appointment
→ Tap for details → Try quick actions
```

#### **Flow 4: Barber Dashboard**
```
Bottom Tab → Profile → View revenue stats
→ Check week performance chart
→ See upcoming appointments
```

---

## 📂 Key Files to Customize

### Change Colors
**File**: `src/constants/theme.ts`
```typescript
export const Colors = {
  primary: '#0B0F14',    // Change dark background
  accent: '#D4AF37',     // Change gold accent
  // ... more colors
};
```

### Edit Mock Data
**File**: `src/data/mockData.ts`
```typescript
// Add more barbers
export const mockBarbers = [
  // Add your barber here
];

// Edit services
export const mockServices = [
  // Customize services
];
```

### Modify Screens
**Folder**: `src/screens/`
- `DiscoveryScreen.tsx` - Home/search
- `BarberProfileScreen.tsx` - Profile view
- `BookingScreen.tsx` - Booking flow
- `AppointmentsScreen.tsx` - Client dashboard
- `BarberDashboardScreen.tsx` - Barber analytics

---

## 🐛 Troubleshooting

### Issue: Metro bundler won't start
```bash
# Clear cache and restart
npm start -- --clear
```

### Issue: "Unable to resolve module"
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Issue: iOS simulator not opening
```bash
# Check Xcode is installed
xcode-select --install

# Reset Expo
expo r -c
```

### Issue: Android emulator not detected
```bash
# List available devices
adb devices

# Start emulator manually from Android Studio
```

### Issue: TypeScript errors
```bash
# Regenerate types
npm run tsc
```

---

## 📱 Testing on Physical Device

### iOS (iPhone/iPad)
1. Install **Expo Go** from App Store
2. Open Expo Go app
3. Tap "Scan QR Code"
4. Scan code from terminal
5. Wait for bundle to load

### Android
1. Install **Expo Go** from Play Store
2. Open Expo Go app
3. Tap "Scan QR Code"
4. Scan code from terminal
5. Wait for bundle to load

**Note**: Phone and computer must be on same WiFi network

---

## 🎨 Screenshot Locations

The app uses **Unsplash images** for all visuals:

### Barber Portfolios
- Marcus Johnson: Fade and lineup images
- Jay Martinez: Textured cuts and beard work
- DeAndre Williams: Classic cuts and razor shaves
- Alex Santos: Fashion-forward styles

All images are loaded via direct URLs, no local assets needed!

---

## 🔧 Development Commands

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web

# Run TypeScript check
npm run tsc

# Clear cache
npm start -- --clear

# Build for production (requires EAS)
eas build --platform ios
eas build --platform android
```

---

## 📚 Learn More

### Documentation
- [README.md](README.md) - Full features and setup
- [WIREFRAMES.md](WIREFRAMES.md) - Screen designs and flows
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical details
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Complete overview

### External Resources
- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🎯 Next Steps After Setup

### 1. Explore the App (5 mins)
- Navigate through all screens
- Try the booking flow
- Check barber profiles
- View appointments dashboard

### 2. Customize Mock Data (10 mins)
- Edit `src/data/mockData.ts`
- Add your own barbers
- Change services and pricing
- Update shop information

### 3. Modify Theme (5 mins)
- Edit `src/constants/theme.ts`
- Try different color accents
- Adjust spacing and typography

### 4. Plan Backend Integration
- Review API endpoints in ARCHITECTURE.md
- Set up database schema
- Integrate payment provider (Stripe)
- Add authentication (Firebase/Auth0)

---

## 🚀 Ready to Demo?

### 70-Second Demo Script

**Minute 0:00 - Discovery (15s)**
"Here's the home screen showing barbers near me in Toronto. I can search, filter by specialty, and see ratings and availability at a glance."

**Minute 0:15 - Profile (20s)**
"Let me tap Marcus Johnson - see his portfolio with real haircut examples, 347 five-star reviews, and services starting at $45. Everything's transparent upfront."

**Minute 0:35 - Booking (30s)**
"I'll book a Signature Fade. Pick Wednesday, select 10:00 AM. The system calculates a $9 deposit to protect against no-shows, with a clear 24-hour cancellation policy. Confirm and done."

**Minute 1:05 - Confirmation (5s)**
"Appointment confirmed! I can see it in my bookings, get directions, or reschedule if needed."

**Total: 70 seconds from discovery to confirmed booking**

---

## ✅ Checklist

- [ ] Node.js 18+ installed
- [ ] `npm install` completed
- [ ] `npm start` running successfully
- [ ] App loads on iOS/Android/Web
- [ ] Can navigate between screens
- [ ] Can complete booking flow
- [ ] Can view appointments
- [ ] Ready to customize

---

## 💡 Pro Tips

1. **Hot Reload**: Save any file and see changes instantly
2. **Shake Device**: Opens developer menu on physical device
3. **Cmd/Ctrl + D**: Opens developer menu in simulator
4. **Cmd/Ctrl + M**: Opens element inspector
5. **Expo DevTools**: Browser interface for logs and debugging

---

## 🎉 You're All Set!

The app is now running with:
- ✅ 4 barbers with real portfolios
- ✅ Complete booking flow
- ✅ Appointment management
- ✅ Business analytics dashboard
- ✅ Premium UI with gold accents

**Start exploring and building your vision! 🚀**

---

<div align="center">

### Need Help?

**Documentation**: Check README.md and ARCHITECTURE.md  
**Issues**: Common problems listed in Troubleshooting above  
**Expo Help**: https://docs.expo.dev/  

**Happy coding! 🎨**

</div>

/**
 * Gen Z Onboarding Experience
 * Engaging, interactive onboarding with animations
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { AnimatedButton } from '../components/AnimatedButton';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
}

const SLIDES = [
  {
    id: '1',
    title: 'Find Your Perfect Barber',
    description: 'Discover skilled barbers near you with portfolios and real reviews',
    icon: 'search',
    gradient: ['#D4AF37', '#F4C542'],
  },
  {
    id: '2',
    title: 'Swipe to Match',
    description: 'Browse barber profiles with a simple swipe. Right to book, left to skip',
    icon: 'heart',
    gradient: ['#22C55E', '#10B981'],
  },
  {
    id: '3',
    title: 'Book Instantly',
    description: 'Secure your spot with instant booking and deposit protection',
    icon: 'calendar',
    gradient: ['#2563EB', '#1E40AF'],
  },
  {
    id: '4',
    title: 'Never Miss a Cut',
    description: 'Get reminders, track appointments, and build your style history',
    icon: 'notifications',
    gradient: ['#D4AF37', '#F4C542'],
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const scrollViewRef = useRef<Animated.ScrollView>(null);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * SCREEN_WIDTH,
        animated: true,
      });
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onComplete();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Skip Button */}
      {currentIndex < SLIDES.length - 1 && (
        <Animated.View 
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.skipContainer}
        >
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Slides */}
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentIndex(index);
        }}
      >
        {SLIDES.map((slide, index) => (
          <Slide
            key={slide.id}
            slide={slide}
            index={index}
            scrollX={scrollX}
          />
        ))}
      </Animated.ScrollView>

      {/* Pagination */}
      <View style={styles.pagination}>
        {SLIDES.map((_, index) => (
          <PaginationDot
            key={index}
            index={index}
            scrollX={scrollX}
            currentIndex={currentIndex}
          />
        ))}
      </View>

      {/* Action Button */}
      <View style={styles.footer}>
        <AnimatedButton
          title={currentIndex === SLIDES.length - 1 ? "Get Started" : "Next"}
          onPress={handleNext}
          variant="gradient"
          size="lg"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
};

interface SlideProps {
  slide: typeof SLIDES[0];
  index: number;
  scrollX: Animated.SharedValue<number>;
}

const Slide: React.FC<SlideProps> = ({ slide, index, scrollX }) => {
  const inputRange = [
    (index - 1) * SCREEN_WIDTH,
    index * SCREEN_WIDTH,
    (index + 1) * SCREEN_WIDTH,
  ];

  const iconStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [50, 0, 50],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }, { translateY }],
    };
  });

  const textStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [50, 0, -50],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <View style={styles.slide}>
      <Animated.View style={[styles.iconContainer, iconStyle]}>
        <LinearGradient
          colors={slide.gradient}
          style={styles.iconGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons
            name={slide.icon as any}
            size={80}
            color={Colors.white}
          />
        </LinearGradient>
      </Animated.View>

      <Animated.View style={[styles.textContainer, textStyle]}>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description}>{slide.description}</Text>
      </Animated.View>
    </View>
  );
};

interface PaginationDotProps {
  index: number;
  scrollX: Animated.SharedValue<number>;
  currentIndex: number;
}

const PaginationDot: React.FC<PaginationDotProps> = ({ index, scrollX, currentIndex }) => {
  const inputRange = [
    (index - 1) * SCREEN_WIDTH,
    index * SCREEN_WIDTH,
    (index + 1) * SCREEN_WIDTH,
  ];

  const dotStyle = useAnimatedStyle(() => {
    const width = interpolate(
      scrollX.value,
      inputRange,
      [8, 24, 8],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.3, 1, 0.3],
      Extrapolate.CLAMP
    );

    return {
      width,
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        dotStyle,
        currentIndex === index && styles.dotActive,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  skipContainer: {
    position: 'absolute',
    top: Spacing.xl,
    right: Spacing.md,
    zIndex: 10,
  },
  skipButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  skipText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.tertiary,
    fontWeight: Typography.fontWeight.medium,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing['3xl'],
  },
  iconGradient: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: Typography.lineHeight.tight * Typography.fontSize['3xl'],
  },
  description: {
    fontSize: Typography.fontSize.lg,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.lg,
    maxWidth: 320,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xl,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  dotActive: {
    backgroundColor: Colors.accent,
  },
  footer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
});

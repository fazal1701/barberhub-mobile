/**
 * Swipeable Barber Card
 * Tinder-style swiping for Gen Z engagement
 */

import React, { useCallback } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BarberWithDistance } from '../types';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

interface SwipeableBarberCardProps {
  barber: BarberWithDistance;
  onSwipeLeft: (barber: BarberWithDistance) => void;
  onSwipeRight: (barber: BarberWithDistance) => void;
  onPress: (barber: BarberWithDistance) => void;
}

export const SwipeableBarberCard: React.FC<SwipeableBarberCardProps> = ({
  barber,
  onSwipeLeft,
  onSwipeRight,
  onPress,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const handleSwipeLeft = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSwipeLeft(barber);
  }, [barber, onSwipeLeft]);

  const handleSwipeRight = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSwipeRight(barber);
  }, [barber, onSwipeRight]);

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: () => {
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
    },
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.2;
    },
    onEnd: (event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        translateX.value = withTiming(
          event.translationX > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH,
          { duration: 300 },
          () => {
            if (event.translationX > 0) {
              runOnJS(handleSwipeRight)();
            } else {
              runOnJS(handleSwipeLeft)();
            }
          }
        );
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
  });

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      [-15, 0, 15],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const likeOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP
    ),
  }));

  const nopeOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolate.CLAMP
    ),
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.card, cardStyle]}>
        <Image
          source={{ uri: barber.portfolioCoverUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.9)']}
          style={styles.gradient}
        >
          {/* Like Indicator */}
          <Animated.View style={[styles.likeIndicator, likeOpacity]}>
            <LinearGradient
              colors={['#22C55E', '#10B981']}
              style={styles.indicatorGradient}
            >
              <Ionicons name="heart" size={40} color={Colors.white} />
              <Text style={styles.indicatorText}>BOOK</Text>
            </LinearGradient>
          </Animated.View>

          {/* Nope Indicator */}
          <Animated.View style={[styles.nopeIndicator, nopeOpacity]}>
            <LinearGradient
              colors={['#EF4444', '#DC2626']}
              style={styles.indicatorGradient}
            >
              <Ionicons name="close" size={40} color={Colors.white} />
              <Text style={styles.indicatorText}>SKIP</Text>
            </LinearGradient>
          </Animated.View>

          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{barber.user.displayName}</Text>
                {barber.verificationStatus === 'verified' && (
                  <Ionicons name="checkmark-circle" size={24} color={Colors.accent} />
                )}
              </View>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color={Colors.accent} />
                <Text style={styles.rating}>{barber.ratingAvg}</Text>
                <Text style={styles.reviews}>({barber.ratingCount})</Text>
                <Text style={styles.separator}>·</Text>
                <Text style={styles.distance}>{barber.distance?.toFixed(1)} km</Text>
              </View>
            </View>

            <View style={styles.specialties}>
              {barber.specialties.slice(0, 3).map((specialty, index) => (
                <View key={index} style={styles.specialtyTag}>
                  <Text style={styles.specialtyText}>{specialty}</Text>
                </View>
              ))}
            </View>

            {barber.nextAvailableSlot && (
              <View style={styles.availability}>
                <View style={styles.availabilityDot} />
                <Text style={styles.availabilityText}>
                  Available {new Date(barber.nextAvailableSlot).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            )}

            <View style={styles.stats}>
              <View style={styles.stat}>
                <Ionicons name="time-outline" size={18} color={Colors.accent} />
                <Text style={styles.statText}>{barber.yearsExperience}+ years</Text>
              </View>
              {barber.shop && (
                <View style={styles.stat}>
                  <Ionicons name="location-outline" size={18} color={Colors.accent} />
                  <Text style={styles.statText}>{barber.shop.name}</Text>
                </View>
              )}
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH - Spacing.md * 2,
    height: 600,
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    backgroundColor: Colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  likeIndicator: {
    position: 'absolute',
    top: Spacing.xl,
    right: Spacing.xl,
  },
  nopeIndicator: {
    position: 'absolute',
    top: Spacing.xl,
    left: Spacing.xl,
  },
  indicatorGradient: {
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    minWidth: 100,
  },
  indicatorText: {
    color: Colors.white,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    marginTop: Spacing.xs,
  },
  content: {
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  name: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  rating: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.white,
  },
  reviews: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray[300],
  },
  separator: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray[300],
  },
  distance: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray[300],
  },
  specialties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  specialtyTag: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  specialtyText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.accent,
    fontWeight: Typography.fontWeight.semibold,
  },
  availability: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  availabilityText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.success,
    fontWeight: Typography.fontWeight.semibold,
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.white,
    fontWeight: Typography.fontWeight.medium,
  },
});

/**
 * Skeleton Loader for loading states
 * Provides smooth shimmer effect for Gen Z experience
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Spacing } from '../constants/theme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = BorderRadius.md,
  style,
}) => {
  const translateX = useSharedValue(-1);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      false
    );
  }, []);

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

  return (
    <View
      style={[
        styles.container,
        { width, height, borderRadius },
        style,
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          colors={[
            Colors.card,
            Colors.gray[700],
            Colors.card,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
};

// Skeleton Card for Barber listings
export const SkeletonBarberCard: React.FC = () => (
  <View style={styles.card}>
    <Skeleton width="100%" height={200} borderRadius={BorderRadius.xl} />
    <View style={styles.cardContent}>
      <View style={styles.header}>
        <Skeleton width={48} height={48} borderRadius={BorderRadius.full} />
        <View style={styles.info}>
          <Skeleton width={120} height={20} />
          <Skeleton width={80} height={16} style={{ marginTop: Spacing.xs }} />
        </View>
      </View>
      <View style={styles.tags}>
        <Skeleton width={80} height={28} />
        <Skeleton width={70} height={28} />
        <Skeleton width={60} height={28} />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  cardContent: {
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  info: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  tags: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
});

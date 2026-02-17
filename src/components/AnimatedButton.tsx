/**
 * Enhanced Animated Button with Haptics
 * Gen Z focused with smooth interactions
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, BorderRadius, Spacing } from '../constants/theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

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

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  style,
  hapticFeedback = true,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = () => {
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(0.8, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(1, { duration: 100 });
  };

  const handlePress = () => {
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BorderRadius.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.sm,
      overflow: 'hidden',
    };

    const sizeStyles: Record<string, ViewStyle> = {
      sm: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, minHeight: 40 },
      md: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, minHeight: 48 },
      lg: { paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xl, minHeight: 56 },
    };

    const variantStyles: Record<string, ViewStyle> = {
      primary: { backgroundColor: Colors.accent },
      secondary: { backgroundColor: Colors.card },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: Colors.accent,
      },
      ghost: { backgroundColor: 'transparent' },
      gradient: { backgroundColor: 'transparent' },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(fullWidth && { width: '100%' }),
      ...(disabled && { opacity: 0.5 }),
    };
  };

  const getTextStyle = (): TextStyle => {
    const sizeStyles: Record<string, TextStyle> = {
      sm: { fontSize: Typography.fontSize.sm },
      md: { fontSize: Typography.fontSize.base },
      lg: { fontSize: Typography.fontSize.lg },
    };

    const variantStyles: Record<string, TextStyle> = {
      primary: { color: Colors.primary },
      secondary: { color: Colors.text.primary },
      outline: { color: Colors.accent },
      ghost: { color: Colors.text.primary },
      gradient: { color: Colors.white },
    };

    return {
      ...sizeStyles[size],
      ...variantStyles[variant],
      fontWeight: Typography.fontWeight.semibold,
      letterSpacing: 0.5,
    };
  };

  if (variant === 'gradient') {
    return (
      <AnimatedTouchable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[animatedStyle, getButtonStyle(), style]}
        activeOpacity={1}
      >
        <LinearGradient
          colors={['#D4AF37', '#F4C542', '#D4AF37']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              {icon}
              <Text style={getTextStyle()}>{title}</Text>
            </>
          )}
        </LinearGradient>
      </AnimatedTouchable>
    );
  }

  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[animatedStyle, getButtonStyle(), style]}
      activeOpacity={1}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? Colors.accent : Colors.text.primary} />
      ) : (
        <>
          {icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  gradient: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
});

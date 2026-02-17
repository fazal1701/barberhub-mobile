import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, BorderRadius, Spacing } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
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
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BorderRadius.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.sm,
    };

    // Size variations
    const sizeStyles: Record<string, ViewStyle> = {
      sm: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md },
      md: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg },
      lg: { paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xl },
    };

    // Variant variations
    const variantStyles: Record<string, ViewStyle> = {
      primary: { backgroundColor: Colors.accent },
      secondary: { backgroundColor: Colors.card },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.accent,
      },
      ghost: { backgroundColor: 'transparent' },
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
    };

    return {
      ...sizeStyles[size],
      ...variantStyles[variant],
      fontWeight: Typography.fontWeight.semibold,
    };
  };

  if (variant === 'primary' && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[getButtonStyle(), style]}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={Colors.primary} />
        ) : (
          <>
            {icon}
            <Text style={getTextStyle()}>{title}</Text>
          </>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyle(), style]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? Colors.accent : Colors.text.primary} />
      ) : (
        <>
          {icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradient: {
    borderRadius: BorderRadius.lg,
  },
});

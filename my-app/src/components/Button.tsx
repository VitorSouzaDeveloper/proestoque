import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  style,
  textStyle,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const variantStyles: Record<ButtonVariant, ViewStyle> = {
    primary: styles.primary,
    secondary: styles.secondary,
    outline: styles.outline,
    ghost: styles.ghost,
  };

  const sizeStyles: Record<ButtonSize, ViewStyle> = {
    sm: styles.size_sm,
    md: styles.size_md,
    lg: styles.size_lg,
  };

  const labelVariantStyles: Record<ButtonVariant, TextStyle> = {
    primary: styles.label_primary,
    secondary: styles.label_secondary,
    outline: styles.label_outline,
    ghost: styles.label_ghost,
  };

  const labelSizeStyles: Record<ButtonSize, TextStyle> = {
    sm: styles.labelSize_sm,
    md: styles.labelSize_md,
    lg: styles.labelSize_lg,
  };

  const containerStyle: (ViewStyle | undefined | false)[] = [
    styles.base,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? styles.fullWidth : undefined,
    isDisabled ? styles.disabled : undefined,
    style,
  ];

  const labelStyle: (TextStyle | undefined)[] = [
    styles.label,
    labelVariantStyles[variant],
    labelSizeStyles[size],
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={containerStyle as ViewStyle[]}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'primary' || variant === 'secondary'
              ? colors.textOnPrimary
              : colors.primary
          }
          size="small"
        />
      ) : (
        <Text style={labelStyle as TextStyle[]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },

  fullWidth: {
    width: '100%',
  },

  disabled: {
    opacity: 0.5,
  },

  // Variants
  primary: {
    backgroundColor: colors.primary,
  },

  secondary: {
    backgroundColor: colors.secondary,
  },

  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    shadowOpacity: 0,
    elevation: 0,
  },

  ghost: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },

  // Sizes
  size_sm: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    minHeight: 36,
  },

  size_md: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 48,
  },

  size_lg: {
    paddingVertical: spacing.base,
    paddingHorizontal: spacing['2xl'],
    minHeight: 56,
  },

  // Labels base
  label: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  label_primary: {
    color: colors.textOnPrimary,
  },

  label_secondary: {
    color: colors.textOnPrimary,
  },

  label_outline: {
    color: colors.primary,
  },

  label_ghost: {
    color: colors.primary,
  },

  // Label Sizes
  labelSize_sm: {
    fontSize: typography.fontSize.sm,
  },

  labelSize_md: {
    fontSize: typography.fontSize.base,
  },

  labelSize_lg: {
    fontSize: typography.fontSize.md,
  },
});

export default Button;

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  showPasswordToggle?: boolean;
}

export function Input({
  label,
  error,
  icon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  showPasswordToggle = false,
  secureTextEntry,
  ...rest
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePassword = () => setIsPasswordVisible((prev) => !prev);

  const hasError = Boolean(error);
  const isSecure = showPasswordToggle ? !isPasswordVisible : secureTextEntry;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.inputRow, hasError ? styles.inputRowError : undefined]}>
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color={hasError ? colors.borderError : colors.textMuted}
            style={styles.leftIcon as TextStyle}
          />
        )}

        <TextInput
          style={[
            styles.input,
            icon ? styles.inputWithLeftIcon : undefined,
            (showPasswordToggle || rightIcon) ? styles.inputWithRightIcon : undefined,
            inputStyle,
          ]}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={isSecure}
          autoCapitalize="none"
          {...rest}
        />

        {showPasswordToggle && (
          <TouchableOpacity
            onPress={togglePassword}
            style={styles.rightIconBtn}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        )}

        {rightIcon && !showPasswordToggle && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIconBtn}
            activeOpacity={0.7}
          >
            <Ionicons name={rightIcon} size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {hasError && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle-outline" size={13} color={colors.borderError} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.base,
  },

  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    minHeight: 50,
  },

  inputRowError: {
    borderColor: colors.borderError,
    backgroundColor: colors.errorLight,
  },

  leftIcon: {
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
  },

  input: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },

  inputWithLeftIcon: {
    paddingLeft: spacing.xs,
  },

  inputWithRightIcon: {
    paddingRight: 0,
  },

  rightIconBtn: {
    padding: spacing.md,
  },

  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: 4,
  },

  errorText: {
    fontSize: typography.fontSize.xs,
    color: colors.borderError,
    fontWeight: '500',
  },
});

export default Input;

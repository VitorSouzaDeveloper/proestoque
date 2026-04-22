import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../constants/theme';

type LogoSize = 'sm' | 'md' | 'lg';

interface LogoProEstoqueProps {
  size?: LogoSize;
}

const sizeConfig = {
  sm: {
    iconSize: 28,
    iconContainer: 52,
    titleSize: typography.fontSize.lg,
    subtitleSize: typography.fontSize.xs,
    gap: spacing.sm,
  },
  md: {
    iconSize: 38,
    iconContainer: 72,
    titleSize: typography.fontSize['2xl'],
    subtitleSize: typography.fontSize.sm,
    gap: spacing.md,
  },
  lg: {
    iconSize: 52,
    iconContainer: 96,
    titleSize: typography.fontSize['3xl'],
    subtitleSize: typography.fontSize.base,
    gap: spacing.base,
  },
} as const;

export function LogoProEstoque({ size = 'md' }: LogoProEstoqueProps) {
  const config = sizeConfig[size];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          {
            width: config.iconContainer,
            height: config.iconContainer,
            borderRadius: config.iconContainer / 4,
          },
        ]}
      >
        <Ionicons name="cube-outline" size={config.iconSize} color={colors.textOnPrimary} />
      </View>

      <View style={[styles.textBlock, { marginTop: config.gap }]}>
        <Text style={[styles.title, { fontSize: config.titleSize }]}>ProEstoque</Text>
        <Text style={[styles.subtitle, { fontSize: config.subtitleSize }]}>
          Bem-vindo de volta
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  textBlock: {
    alignItems: 'center',
  },
  title: {
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.textSecondary,
    fontWeight: '400',
    marginTop: 2,
  },
});

export default LogoProEstoque;

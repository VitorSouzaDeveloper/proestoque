import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../constants/theme';

// ─────────────────────────────────────────────
// SplashScreen — tela de carregamento estilizada
// Exibida enquanto o AsyncStorage é lido.
// Tempo mínimo de 1.5s garantido pelo AuthContext.
// ─────────────────────────────────────────────

export function SplashScreen() {
  // Animação da barra de progresso
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Animação de fade-in do conteúdo
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Animação de escala do ícone (efeito "pulse")
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // 1. Fade-in + scale do conteúdo
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Barra de progresso — preenche em 1.5s
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false, // width não suporta native driver
    }).start();
  }, []);

  // Largura interpolada da barra (0% → 100%)
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Ícone / Logo */}
        <View style={styles.logoIcon}>
          <Ionicons name="cube-outline" size={44} color={colors.textOnPrimary} />
        </View>

        {/* Nome do app */}
        <Text style={styles.appName}>ProEstoque</Text>
        <Text style={styles.tagline}>Gestão de estoque inteligente</Text>
      </Animated.View>

      {/* Barra de progresso */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[styles.progressBar, { width: progressWidth }]}
          />
        </View>
        <Text style={styles.loadingText}>Verificando sessão...</Text>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────
// Estilos
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
  },

  // Conteúdo central (logo + nome)
  content: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  logoIcon: {
    width: 88,
    height: 88,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
    marginBottom: spacing.lg,
  },
  appName: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  // Barra de progresso
  progressContainer: {
    width: '60%',
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: colors.primarySubtle,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
});

export default SplashScreen;

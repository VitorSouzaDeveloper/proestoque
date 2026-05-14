import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/src/components/Input';
import { Button } from '@/src/components/Button';
import { colors, typography, spacing, borderRadius } from '@/src/constants/theme';
import { useAuth } from '@/src/contexts/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    if (!email || !senha) return;
    // Chama o login do contexto — o redirecionamento para o dashboard
    // acontece automaticamente pelo NavigationGuard
    await login(email, senha);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={20}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoArea}>
            <View style={styles.logoIcon}>
              <Ionicons name="cube-outline" size={38} color={colors.textOnPrimary} />
            </View>
            <Text style={styles.logoTitle}>ProEstoque</Text>
          </View>

          {/* Form */}
          <View style={styles.card}>
            <Input
              label="E-mail"
              placeholder="joao@email.com"
              icon="mail-outline"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoComplete="email"
            />

            <Input
              label="Senha"
              placeholder="••••••••"
              icon="lock-closed-outline"
              showPasswordToggle
              value={senha}
              onChangeText={setSenha}
              autoComplete="password"
            />

            <TouchableOpacity
              onPress={() => router.push('/(auth)/recuperar-senha')}
              style={styles.forgotLink}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotText}>Esqueci minha senha</Text>
            </TouchableOpacity>

            <Button
              title="Entrar"
              fullWidth
              size="lg"
              onPress={handleLogin}
              loading={isLoading}
              disabled={!email || !senha}
              style={styles.btnEntrar}
            />

            <TouchableOpacity
              onPress={() => router.push('/(auth)/cadastro')}
              activeOpacity={0.7}
              style={styles.signupLink}
            >
              <Text style={styles.signupText}>
                Não tem conta?{' '}
                <Text style={styles.signupBold}>Criar conta</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['3xl'],
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  logoIcon: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  logoTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginTop: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.xl,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginTop: -spacing.sm,
    marginBottom: spacing.lg,
  },
  forgotText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: '600' as const,
  },
  btnEntrar: {
    marginTop: spacing.xs,
  },
  signupLink: {
    alignItems: 'center',
    marginTop: spacing.base,
  },
  signupText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  signupBold: {
    color: colors.primary,
    fontWeight: '700' as const,
  },
});

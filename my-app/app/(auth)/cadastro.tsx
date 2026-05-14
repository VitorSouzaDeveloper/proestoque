import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/src/components/Input';
import { Button } from '@/src/components/Button';
import { colors, typography, spacing, borderRadius } from '@/src/constants/theme';

export default function CadastroScreen() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [senhaError, setSenhaError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCriarConta = () => {
    setSenhaError('');

    if (senha !== confirmarSenha) {
      setSenhaError('As senhas não coincidem');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)/index' as never);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoArea}>
            <View style={styles.logoIcon}>
              <Ionicons name="cube-outline" size={28} color={colors.textOnPrimary} />
            </View>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.title}>Criar conta</Text>

            <Input
              label="Nome completo"
              placeholder="João Silva"
              icon="person-outline"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
              autoComplete="name"
            />

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
              placeholder="••••••"
              icon="lock-closed-outline"
              showPasswordToggle
              value={senha}
              onChangeText={setSenha}
              autoComplete="new-password"
            />

            <Input
              label="Confirmar senha"
              placeholder="••••"
              icon="lock-closed-outline"
              showPasswordToggle
              value={confirmarSenha}
              onChangeText={(t) => {
                setConfirmarSenha(t);
                if (senhaError) setSenhaError('');
              }}
              error={senhaError}
              autoComplete="new-password"
            />

            <Button
              title="Criar Conta"
              fullWidth
              size="lg"
              loading={loading}
              onPress={handleCriarConta}
              style={styles.btnCriar}
            />

            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              style={styles.loginLink}
            >
              <Text style={styles.loginText}>Já tenho conta</Text>
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
    paddingVertical: spacing['2xl'],
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoIcon: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
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
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: '800' as const,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  btnCriar: {
    marginTop: spacing.sm,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: spacing.base,
    paddingVertical: spacing.sm,
  },
  loginText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: '600' as const,
  },
});

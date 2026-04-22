import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Input } from '@/src/components/Input';
import { Button } from '@/src/components/Button';
import { LogoProEstoque } from '@/src/components/LogoProEstoque';
import { colors, typography, spacing, borderRadius } from '@/src/constants/theme';

type TelaEstado = 'formulario' | 'sucesso';

export default function RecuperarSenhaScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [tela, setTela] = useState<TelaEstado>('formulario');
  const [loading, setLoading] = useState(false);

  const handleEnviar = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setTela('sucesso');
    }, 1500);
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
          {/* Voltar */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={18} color={colors.primary} />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.logoArea}>
            <LogoProEstoque size="sm" />
          </View>

          {tela === 'formulario' ? (
            <View style={styles.card}>
              <Text style={styles.title}>Recuperar senha</Text>
              <Text style={styles.description}>
                Informe seu e-mail e enviaremos um link de recuperação
              </Text>

              <Input
                label="E-mail"
                placeholder="joao@email.com"
                icon="mail-outline"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoComplete="email"
              />

              <Button
                title="Enviar"
                fullWidth
                size="lg"
                loading={loading}
                onPress={handleEnviar}
                style={styles.btnEnviar}
              />

              <Button
                title="Voltar ao Login"
                variant="outline"
                fullWidth
                size="md"
                onPress={() => router.back()}
                style={styles.btnVoltar}
              />
            </View>
          ) : (
            /* Tela de sucesso */
            <View style={styles.card}>
              <View style={styles.successIconContainer}>
                <Ionicons name="mail" size={40} color={colors.primary} />
              </View>

              <Text style={styles.successTitle}>E-mail enviado!</Text>
              <Text style={styles.successDesc}>
                Verifique sua caixa de entrada
              </Text>

              <View style={styles.successBox}>
                <Ionicons name="checkmark-circle-outline" size={16} color={colors.success} />
                <Text style={styles.successBoxText}>
                  Link de recuperação enviado para{' '}
                  <Text style={styles.emailHighlight}>{email}</Text>
                </Text>
              </View>

              <Button
                title="Voltar ao Login"
                fullWidth
                size="lg"
                onPress={() => router.back()}
                style={styles.btnEnviar}
              />
            </View>
          )}
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
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['2xl'],
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xl,
  },
  backText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: '600' as const,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: spacing.xl,
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
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  btnEnviar: {
    marginTop: spacing.md,
  },
  btnVoltar: {
    marginTop: spacing.sm,
  },
  // Sucesso
  successIconContainer: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.base,
  },
  successTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '800' as const,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  successDesc: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.successLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.base,
  },
  successBoxText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  emailHighlight: {
    fontWeight: '700' as const,
    color: colors.primary,
  },
});

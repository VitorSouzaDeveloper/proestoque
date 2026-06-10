import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, borderRadius } from "@/src/constants/theme";

interface ErrorViewProps {
  mensagem: string;
  onRetry?: () => void;
}

export function ErrorView({ mensagem, onRetry }: ErrorViewProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={64} color={colors.textSecondary} />
      <Text style={styles.title}>Algo deu errado</Text>
      <Text style={styles.texto}>{mensagem}</Text>
      
      {onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Tentar novamente</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  title: {
    marginTop: spacing.lg,
    fontSize: typography.fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  texto: {
    marginTop: spacing.sm,
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  button: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    color: colors.textPrimary,
    fontWeight: "600",
    fontSize: typography.fontSize.sm,
  },
});

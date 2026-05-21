import { Stack } from 'expo-router';
import { colors, typography } from '@/src/constants/theme';

export default function ProdutosLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: typography.fontSize.lg,
          color: colors.textPrimary,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false, // O index desenha seu próprio header customizado
        }}
      />
      <Stack.Screen
        name="novo"
        options={{
          title: 'Novo Produto',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Editar Produto',
        }}
      />
    </Stack>
  );
}

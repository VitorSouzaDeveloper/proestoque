import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';
import { ProductsProvider } from '@/src/contexts/ProductsContext';
import { SplashScreen } from '@/src/components/SplashScreen';
import { solicitarPermissaoNotificacoes, agendarVerificacaoDiaria } from '@/src/services/notifications';

// ─────────────────────────────────────────────
// NavigationGuard — redireciona com base no auth
// ─────────────────────────────────────────────

function NavigationGuard() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Aguarda o AsyncStorage carregar

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Não logado e tentando acessar rota privada → vai pro login
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Já logado e está na tela de auth → vai pro dashboard
      router.replace('/(tabs)');
    }

    async function configurarNotificacoes() {
      const temPermissao = await solicitarPermissaoNotificacoes();
      if (temPermissao) {
        await agendarVerificacaoDiaria();
      }
    }

    if (isAuthenticated) {
      configurarNotificacoes();
    }
  }, [isAuthenticated, isLoading, segments]);

  // Splash Screen estilizada enquanto lê o AsyncStorage
  if (isLoading) {
    return <SplashScreen />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

// ─────────────────────────────────────────────
// RootLayout — envolve tudo com AuthProvider
// ─────────────────────────────────────────────

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <NavigationGuard />
        <StatusBar style="dark" />
      </ProductsProvider>
    </AuthProvider>
  );
}

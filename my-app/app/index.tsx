import { Redirect } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';

// O redirecionamento agora é controlado pelo NavigationGuard no _layout.tsx raiz.
// Este index serve apenas como fallback para a rota raiz "/".
export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}

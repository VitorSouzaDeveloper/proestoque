import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────

export interface User {
  nome: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

// ─────────────────────────────────────────────
// Chaves do AsyncStorage
// ─────────────────────────────────────────────

const STORAGE_KEYS = {
  TOKEN: '@proestoque:token',
  USER: '@proestoque:user',
};

// ─────────────────────────────────────────────
// Contexto
// ─────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-login: lê o token e user salvos no disco ao montar
  // Tempo mínimo de 1.5s para exibir a Splash Screen
  useEffect(() => {
    async function loadStoredAuth() {
      try {
        const minDelay = new Promise((resolve) => setTimeout(resolve, 1500));

        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
          AsyncStorage.getItem(STORAGE_KEYS.USER),
          minDelay, // garante 1.5s mínimo
        ]);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Erro ao restaurar sessão:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredAuth();
  }, []);

  // Login simulado — será substituído pela API real na Aula 11
  async function login(email: string, _senha: string) {
    setIsLoading(true);

    try {
      // Simula delay de rede
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Dados simulados (mock)
      const fakeToken = 'mock-jwt-token-proestoque-2024';
      const fakeUser: User = {
        nome: email.split('@')[0].replace(/^\w/, (c) => c.toUpperCase()),
        email,
      };

      // Persiste no disco
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, fakeToken);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(fakeUser));

      // Atualiza o estado
      setToken(fakeToken);
      setUser(fakeUser);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  // Logout: limpa disco e estado
  async function logout() {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─────────────────────────────────────────────
// Hook customizado
// ─────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth() deve ser usado dentro de um <AuthProvider>. ' +
      'Verifique se o Provider envolve o componente no _layout.tsx raiz.'
    );
  }

  return context;
}

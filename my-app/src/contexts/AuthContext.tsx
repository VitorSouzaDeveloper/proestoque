import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────

export interface User {
  id: string;
  nome: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  registrar: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

// ─────────────────────────────────────────────
// Chaves do AsyncStorage
// ─────────────────────────────────────────────

const STORAGE_KEYS = {
  TOKEN: '@ProEstoque:token',
  REFRESH_TOKEN: '@ProEstoque:refreshToken',
  USER: '@ProEstoque:user',
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
  useEffect(() => {
    async function loadStoredAuth() {
      try {
        const minDelay = new Promise((resolve) => setTimeout(resolve, 1500));

        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
          AsyncStorage.getItem(STORAGE_KEYS.USER),
          minDelay,
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

  // Intercepta erros 401 globalmente para deslogar o usuário e forçar o redirecionamento
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  async function registrar(nome: string, email: string, senha: string) {
    setIsLoading(true);

    try {
      const response = await api.post('/auth/registro', { nome, email, senha });
      const { usuario, token, refreshToken } = response.data;

      await AsyncStorage.multiSet([
        [STORAGE_KEYS.TOKEN, token],
        [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
        [STORAGE_KEYS.USER, JSON.stringify(usuario)],
      ]);

      setToken(token);
      setUser(usuario);
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, senha: string) {
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email, senha });
      const { usuario, token, refreshToken } = response.data;

      await AsyncStorage.multiSet([
        [STORAGE_KEYS.TOKEN, token],
        [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
        [STORAGE_KEYS.USER, JSON.stringify(usuario)],
      ]);

      setToken(token);
      setUser(usuario);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER,
      ]);
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
        registrar,
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

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Usar o IP local para testar no Expo Go (substitua pelo seu IP se necessário)
const BASE_URL = __DEV__ 
  ? "http://192.168.1.100:3333/api" // Exemplo de IP, pode precisar ajuste
  : "https://sua-api-em-producao.com/api";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@ProEstoque:token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem("@ProEstoque:refreshToken");
        if (refreshToken) {
          const response = await axios.post(`${BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { token, refreshToken: novoRefreshToken } = response.data;

          await AsyncStorage.multiSet([
            ["@ProEstoque:token", token],
            ["@ProEstoque:refreshToken", novoRefreshToken],
          ]);

          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          originalRequest.headers.Authorization = `Bearer ${token}`;

          return api(originalRequest);
        }
      } catch (refreshError) {
        // Se falhar o refresh, desloga
        await AsyncStorage.multiRemove([
          "@ProEstoque:token",
          "@ProEstoque:refreshToken",
          "@ProEstoque:user",
        ]);
        // A lógica de logout global via contexto ou redirecionamento pode ser necessária aqui.
        // No momento a página será recarregada ou o app reagirá à falta do token se o context perceber.
      }
    }
    return Promise.reject(error);
  }
);

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const API_URL = (Constants.expoConfig?.extra?.apiUrl as string) ?? "http://localhost:3333/api";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10_000,
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
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("@ProEstoque:token");
      await AsyncStorage.removeItem("@ProEstoque:user");
    }
    
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    } else if (error.response?.data?.error) {
      error.message = error.response.data.error;
    } else {
      error.message = "Erro de conexão com o servidor";
    }
    
    return Promise.reject(error);
  }
);

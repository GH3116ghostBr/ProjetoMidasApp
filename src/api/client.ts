import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// ─── Troque pelo IP da sua máquina na rede local ──────────
// Windows: rode "ipconfig" no terminal → use o IPv4
// Mac/Linux: ifconfig | grep inet
export const BASE_URL = 'https://danielhernanrpgapi.azurewebsites.net';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Injeta o Bearer token JWT em toda requisição protegida
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('midas_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Trata 401 globalmente — limpa o token para forçar novo login
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('midas_token');
    }
    return Promise.reject(error);
  }
);

export default api;

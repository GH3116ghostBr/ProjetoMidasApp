import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://danielhernanrpgapi.azurewebsites.net',
});

export const authService = {

  // =========================
  // LOGIN
  // =========================
  async autenticar(nomeUsuario: string, senha: string) {

    try {

      const response = await api.post(
        '/Usuario/Autenticar',
        {
          nomeUsuario,
          senha,
        }
      );

      const data = response.data;

      // salvar token
      await AsyncStorage.setItem(
        'token',
        data.token
      );

      // salvar usuário
      await AsyncStorage.setItem(
        'user',
        JSON.stringify(data.usuario)
      );

      return data;

    } catch (error: any) {

      console.log('ERRO LOGIN');
      console.log(error.response?.data);

      throw error;
    }
  },

  // =========================
  // CRIAR USUÁRIO
  // =========================
  async criarUsuario(nomeUsuario: string, senha: string) {

    try {

      const response = await api.post(
        '/Usuario/Registrar', // ⚠️ pode variar no Swagger
        {
          nomeUsuario,
          senha,
        }
      );

      return response.data;

    } catch (error: any) {

      console.log('ERRO CRIAR USUARIO');
      console.log(error.response?.data);

      throw error;
    }
  },

  // =========================
  // ALTERAR SENHA
  // =========================
  async alterarSenha(nomeUsuario: string, novaSenha: string) {

    try {

      const response = await api.put(
        '/Usuario/AlterarSenha', // ⚠️ confirme no Swagger
        {
          nomeUsuario,
          novaSenha,
        }
      );

      return response.data;

    } catch (error: any) {

      console.log('ERRO ALTERAR SENHA');
      console.log(error.response?.data);

      throw error;
    }
  },

  // =========================
  // TOKEN
  // =========================
  async getToken() {
    return AsyncStorage.getItem('token');
  },

  // =========================
  // USUÁRIO
  // =========================
  async getUser() {
    return AsyncStorage.getItem('user');
  },

  // =========================
  // LOGOUT
  // =========================
  async logout() {
    await AsyncStorage.clear();
  },
};
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { authService } from '../api/services';

interface AuthContextData {
  token: string | null;
  userName: string | null;
  isLoading: boolean;

  login: (nomeUsuario: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Recuperar sessão salva
  useEffect(() => {
    async function loadStorageData() {
      try {
        const savedToken = await authService.getToken();
        const savedUser = await authService.getUser();

        if (savedToken) {
          setToken(savedToken);
        }

        if (savedUser) {
          setUserName(savedUser);
        }
      } catch (error) {
        console.log('Erro ao carregar sessão', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStorageData();
  }, []);

  // LOGIN
  const login = async (
    nomeUsuario: string,
    senha: string
  ) => {
    try {
      const data = await authService.autenticar(
        nomeUsuario,
        senha
      );

      if (!data?.token) {
        throw new Error('Token não recebido');
      }

      setToken(data.token);
      setUserName(data.usuario);

    } catch (error) {
      console.log('Erro login:', error);
      throw error;
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await authService.logout();

      setToken(null);
      setUserName(null);

    } catch (error) {
      console.log('Erro logout:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userName,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
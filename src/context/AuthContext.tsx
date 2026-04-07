import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../api/services';

interface AuthContextData {
  token: string | null;
  userName: string | null;
  isLoading: boolean;
  login: (nomeUsuario: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken]       = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Recupera sessão salva ao abrir o app
  useEffect(() => {
    Promise.all([authService.getToken(), authService.getUser()])
      .then(([t, u]) => {
        setToken(t);
        setUserName(u);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (nomeUsuario: string, senha: string) => {
    const data = await authService.autenticar(nomeUsuario, senha);
    setToken(data.token);
    setUserName(data.usuario);
  };

  const logout = async () => {
    await authService.logout();
    setToken(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ token, userName, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// 1. Criando o Contexto
const AuthContext = createContext(null);

// Helper para configurar o token no cabeçalho do axios
const setAuthToken = (token) => {
  if (token) {
    // Aplica o token a todas as requisições se estiver logado
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    // Deleta o cabeçalho se não estiver logado
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

// 2. Criando o Provedor (o componente que vai gerenciar o estado)
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [loading, setLoading] = useState(true);

  // useEffect para verificar o token no localStorage sempre que a página carrega
  // e para setar o axios header com o token existente
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('token');
    if (tokenFromStorage) {
      setAuthToken(tokenFromStorage);
      setIsAuthenticated(true);
    }
    setLoading(false); // Acabamos de verificar a autenticação, não estamos mais carregando
  }, []); // O array vazio garante que isso só roda uma vez ao montar

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', { email, password });
      // Salva o token no localStorage E atualiza o estado
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setAuthToken(res.data.token); // Configura o token no axios
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Erro de login:', error.response.data);
      // Se houver erro, remove qualquer token antigo e desloga
      logout(); // Garante que o estado seja limpo em caso de falha de login
      return { success: false, message: error.response.data.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      await axios.post('http://localhost:4000/api/auth/register', { name, email, password });
      return { success: true };
    } catch (error) {
      console.error('Erro de registro:', error.response.data);
      return { success: false, message: error.response.data.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token'); // Remove o token do localStorage
    setToken(null);
    setAuthToken(null); // Limpa o token do axios
    setIsAuthenticated(false);
  };

  const value = {
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

// 3. Criando um Hook customizado para facilitar o uso do contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

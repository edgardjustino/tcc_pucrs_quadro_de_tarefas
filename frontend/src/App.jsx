import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './styles/global.css';

// Imporando páginas componentes
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LogoutButton from './components/LogoutButton';

// COMPONENTE 1 - ProtegeR rotas que SÓ um usuário LOGADO pode ver
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ color: 'white' }}>Carregando...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// COMPONENTE 2 - Proteger rotas que só um usuário DESLOGADO pode ver
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ color: 'white' }}>Carregando...</div>;
  return isAuthenticated ? <Navigate to="/" /> : children;
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <>
        {isAuthenticated && <LogoutButton />}
        
        <Routes>
          {/* Rotas Públicas protegidas pelo PublicRoute */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } 
          />
          
          {/* Rota Privada */}
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;

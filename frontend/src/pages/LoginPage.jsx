import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!auth || !auth.login) {
      setError('Contexto de autenticação não está pronto.');
      return;
    }

    const result = await auth.login(email, password);
    if (result && result.success) {
      navigate('/');
    } else {
      setError(result?.message || 'Falha no login. Verifique suas credenciais.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', }}>
      <form onSubmit={handleSubmit} style={{ background: '#1f2937', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.4)', width: '350px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ color: 'white', margin: 0, fontSize: '28px' }}>
            📌 Quadro de Tarefas
          </h1>
          <p style={{ color: '#9ca3af', margin: '5px 0 0 0' }}>
            Faça login para continuar
          </p>
        </div>
        
        {error && <p style={{ color: '#fca5a5', textAlign: 'center', margin: 0 }}>{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #4b5563', background: '#374151', color: 'white', outline: 'none' }} />
        <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #4b5563', background: '#374151', color: 'white', outline: 'none' }} />
        <button type="submit" style={{ padding: '12px', borderRadius: '6px', border: 'none', background: '#facc15', color: '#1f2937', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>Entrar</button>
        <p style={{ color: '#9ca3af', textAlign: 'center', marginTop: '10px' }}>
          Não tem uma conta? <Link to="/register" style={{ color: '#facc15', textDecoration: 'none' }}>Crie uma</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!auth || !auth.register) {
      setError('Contexto de autenticação não está pronto.');
      return;
    }

    const result = await auth.register(name, email, password);
    if (result && result.success) {
      alert('Registro bem-sucedido! Agora você pode fazer o login.');
      navigate('/login');
    } else {
      setError(result?.message || 'Falha no registro.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ background: '#1f2937', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.4)', width: '350px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ color: 'white', margin: 0, fontSize: '28px' }}>
            📌 Quadro de Tarefas
          </h1>
          <p style={{ color: '#9ca3af', margin: '5px 0 0 0' }}>
            Crie sua conta gratuitamente
          </p>
        </div>
        
        {error && <p style={{ color: '#fca5a5', textAlign: 'center', margin: 0 }}>{error}</p>}
        <input type="text" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #4b5563', background: '#374151', color: 'white', outline: 'none' }} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #4b5563', background: '#374151', color: 'white', outline: 'none' }} />
        <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #4b5563', background: '#374151', color: 'white', outline: 'none' }} />
        <button type="submit" style={{ padding: '12px', borderRadius: '6px', border: 'none', background: '#facc15', color: '#1f2937', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>Registrar</button>
        <p style={{ color: '#9ca3af', textAlign: 'center', marginTop: '10px' }}>
          Já tem uma conta? <Link to="/login" style={{ color: '#facc15', textDecoration: 'none' }}>Faça login</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;

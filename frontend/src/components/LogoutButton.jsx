import React from 'react';
import { useAuth } from '../context/AuthContext';

const LogoutButton = () => {
  const { logout } = useAuth();

  const buttonStyle = {
    position: 'fixed', 
    top: '20px',       
    right: '20px',      
    zIndex: 1000,      
    background: '#4b5563', 
    color: 'white', 
    border: 'none', 
    padding: '10px 18px', 
    borderRadius: '8px', 
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '15px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
  };

  return (
    <button onClick={logout} style={buttonStyle}>
      Sair
    </button>
  );
};

export default LogoutButton;

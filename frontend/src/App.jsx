import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppRoutes from './Routes';
import './App.css';

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });

  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setUser(userData);
    navigate('/general');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AppRoutes user={user} onLogin={handleLogin} onLogout={handleLogout} />
  );
}
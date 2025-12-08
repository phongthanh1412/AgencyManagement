import React, { useState } from 'react';
import Login from './components/Login';
import SignUp from './components/SignUp';
import General from './components/General';
import DebtReport from './components/DebtReport';
import ExportReceipt from './components/ExportReceipt';
import PaymentReceipt from './components/PaymentReceipt';
import './App.css';

const Agency = ({ user, onLogout, onNavigate }) => (
  <General user={user} onLogout={onLogout} onNavigate={onNavigate} />
);

const RevenueReport = ({ user, onLogout, onNavigate }) => (
  <General user={user} onLogout={onLogout} onNavigate={onNavigate} />
);

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('general'); // Redirect to General dashboard after login
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  return (
    <>
      {currentPage === 'login' && (
        <Login onNavigate={setCurrentPage} onLogin={handleLogin} />
      )}
      {currentPage === 'signup' && (
        <SignUp onNavigate={setCurrentPage} />
      )}
      {currentPage === 'general' && user && (
        <General user={user} onLogout={handleLogout} onNavigate={setCurrentPage} />
      )}
      {currentPage === 'agency' && user && (
        <Agency user={user} onLogout={handleLogout} onNavigate={setCurrentPage} />
      )}
      {currentPage === 'debt-report' && user && (
        <DebtReport user={user} onLogout={handleLogout} onNavigate={setCurrentPage} />
      )}
      {currentPage === 'export-receipt' && user && (
        <ExportReceipt user={user} onLogout={handleLogout} onNavigate={setCurrentPage} currentPage="export-receipt" />
      )}
      {currentPage === 'create-export-receipt' && user && (
        <ExportReceipt user={user} onLogout={handleLogout} onNavigate={setCurrentPage} currentPage="create-export-receipt" />
      )}
      {currentPage === 'payment-receipt' && user && (
        <PaymentReceipt user={user} onLogout={handleLogout} onNavigate={setCurrentPage} currentPage="payment-receipt" />
      )}
      {currentPage === 'create-payment-receipt' && user && (
        <PaymentReceipt user={user} onLogout={handleLogout} onNavigate={setCurrentPage} currentPage="create-payment-receipt" />
      )}
      {currentPage === 'revenue-report' && user && (
        <RevenueReport user={user} onLogout={handleLogout} onNavigate={setCurrentPage} />
      )}
    </>
  );
}
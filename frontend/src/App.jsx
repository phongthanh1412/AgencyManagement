import React, { useState } from 'react';
import Login from './components/Login';
import SignUp from './components/SignUp';
import General from './components/General';
import AgencyDirectory from './components/AgencyDirectory';
import AddAgency from './components/AddAgency';
import EditAgency from './components/EditAgency';
import AgencyDetails from './components/AgencyDetails';
import SystemRegulation from './components/SystemRegulation';
import DebtReport from './components/DebtReport';
import ExportReceiptList from './components/ExportReceiptList';
import ExportReceipt from './components/ExportReceipt';
import PaymentReceiptList from './components/PaymentReceiptList';
import PaymentReceipt from './components/PaymentReceipt';
import RevenueReport from './components/RevenueReport';
import './App.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });
  const [editingAgency, setEditingAgency] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('general'); // Redirect to General dashboard after login
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
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
        <AgencyDirectory
          user={user}
          onLogout={handleLogout}
          onNavigate={setCurrentPage}
          onViewAgency={(agency) => {
            setEditingAgency(agency);
            setCurrentPage('agency-details');
          }}
          onEditAgency={(agency) => {
            setEditingAgency(agency);
            setCurrentPage('edit-agency');
          }}
        />
      )}
      {currentPage === 'debt-report' && user && (
        <DebtReport user={user} onLogout={handleLogout} onNavigate={setCurrentPage} />
      )}
      {currentPage === 'export-receipt' && user && (
        <ExportReceiptList user={user} onLogout={handleLogout} onNavigate={setCurrentPage} />
      )}
      {currentPage === 'create-export-receipt' && user && (
        <ExportReceipt user={user} onLogout={handleLogout} onNavigate={setCurrentPage} currentPage="create-export-receipt" />
      )}
      {currentPage === 'payment-receipt' && user && (
        <PaymentReceiptList user={user} onLogout={handleLogout} onNavigate={setCurrentPage} />
      )}
      {currentPage === 'create-payment-receipt' && user && (
        <PaymentReceipt user={user} onLogout={handleLogout} onNavigate={setCurrentPage} currentPage="create-payment-receipt" />
      )}
      {currentPage === 'revenue-report' && user && (
        <RevenueReport user={user} onLogout={handleLogout} onNavigate={setCurrentPage} />
      )}
      {currentPage === 'add-agency' && user && (
        <AddAgency user={user} onLogout={handleLogout} onNavigate={setCurrentPage} />
      )}
      {currentPage === 'agency-details' && user && (
        <AgencyDetails
          user={user}
          agency={editingAgency}
          onLogout={handleLogout}
          onNavigate={setCurrentPage}
          onEdit={() => setCurrentPage('edit-agency')}
        />
      )}
      {currentPage === 'edit-agency' && user && (
        <EditAgency
          user={user}
          agency={editingAgency}
          onLogout={handleLogout}
          onNavigate={setCurrentPage}
        />
      )}
      {currentPage === 'system-regulation' && user && (
        <SystemRegulation user={user} onLogout={handleLogout} onNavigate={setCurrentPage} />
      )}
    </>
  );
}
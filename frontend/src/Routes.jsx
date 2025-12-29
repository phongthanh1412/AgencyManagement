import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import General from './pages/General';
import AgencyDirectory from './pages/AgencyDirectory';
import AddAgency from './pages/AddAgency';
import EditAgency from './pages/EditAgency';
import AgencyDetails from './pages/AgencyDetails';
import SystemRegulation from './pages/SystemRegulation';
import DebtReport from './pages/DebtReport';
import ExportReceiptList from './pages/ExportReceiptList';
import ExportReceipt from './pages/ExportReceipt';
import PaymentReceiptList from './pages/PaymentReceiptList';
import PaymentReceipt from './pages/PaymentReceipt';
import RevenueReport from './pages/RevenueReport';

// Protected Route Wrapper
const ProtectedRoute = ({ user, children }) => {
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const AppRoutes = ({ user, onLogin, onLogout }) => {
    const [editingAgency, setEditingAgency] = useState(null);
    const navigate = useNavigate();

    // Helper to standard props passed to pages
    const pageProps = {
        user,
        onLogout,
        onNavigate: (path) => navigate(path === 'login' ? '/login' : path === 'signup' ? '/signup' : `/${path}`)
    };

    return (
        <Routes>
            <Route path="/login" element={<Login onNavigate={(path) => navigate(`/${path}`)} onLogin={onLogin} />} />
            <Route path="/signup" element={<SignUp onNavigate={(path) => navigate(`/${path}`)} />} />

            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/general" element={
                <ProtectedRoute user={user}>
                    <General {...pageProps} />
                </ProtectedRoute>
            } />

            <Route path="/agency" element={
                <ProtectedRoute user={user}>
                    <AgencyDirectory
                        {...pageProps}
                        onViewAgency={(agency) => {
                            setEditingAgency(agency);
                            navigate('/agency-details');
                        }}
                        onEditAgency={(agency) => {
                            setEditingAgency(agency);
                            navigate('/edit-agency');
                        }}
                    />
                </ProtectedRoute>
            } />

            <Route path="/add-agency" element={
                <ProtectedRoute user={user}>
                    <AddAgency {...pageProps} />
                </ProtectedRoute>
            } />

            <Route path="/agency-details" element={
                <ProtectedRoute user={user}>
                    <AgencyDetails
                        {...pageProps}
                        agency={editingAgency}
                        onEdit={() => navigate('/edit-agency')}
                    />
                </ProtectedRoute>
            } />

            <Route path="/edit-agency" element={
                <ProtectedRoute user={user}>
                    <EditAgency {...pageProps} agency={editingAgency} />
                </ProtectedRoute>
            } />

            <Route path="/debt-report" element={
                <ProtectedRoute user={user}>
                    <DebtReport {...pageProps} />
                </ProtectedRoute>
            } />

            <Route path="/export-receipt" element={
                <ProtectedRoute user={user}>
                    <ExportReceiptList {...pageProps} />
                </ProtectedRoute>
            } />

            <Route path="/create-export-receipt" element={
                <ProtectedRoute user={user}>
                    <ExportReceipt {...pageProps} currentPage="create-export-receipt" />
                </ProtectedRoute>
            } />

            <Route path="/payment-receipt" element={
                <ProtectedRoute user={user}>
                    <PaymentReceiptList {...pageProps} />
                </ProtectedRoute>
            } />

            <Route path="/create-payment-receipt" element={
                <ProtectedRoute user={user}>
                    <PaymentReceipt {...pageProps} currentPage="create-payment-receipt" />
                </ProtectedRoute>
            } />

            <Route path="/revenue-report" element={
                <ProtectedRoute user={user}>
                    <RevenueReport {...pageProps} />
                </ProtectedRoute>
            } />

            <Route path="/system-regulation" element={
                <ProtectedRoute user={user}>
                    <SystemRegulation {...pageProps} />
                </ProtectedRoute>
            } />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;

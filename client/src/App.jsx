import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import TenantDashboard from './pages/TenantDashboard.jsx';
import Bills from './pages/Bills.jsx';
import Complaints from './pages/Complaints.jsx';
import OwnerDashboard from './pages/OwnerDashboard.jsx';
import OwnerProperties from './pages/OwnerProperties.jsx';
import OwnerComplaints from './pages/OwnerComplaints.jsx';

export default function App() {
  const { user } = useAuth();

  const home = !user ? '/login' : user.role === 'owner' ? '/owner' : '/dashboard';

  return (
    <Routes>
      <Route path="/" element={<Navigate to={home} replace />} />
      <Route path="/login" element={user ? <Navigate to={home} replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={home} replace /> : <Register />} />

      <Route
        element={
          <ProtectedRoute role="tenant">
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<TenantDashboard />} />
        <Route path="/bills" element={<Bills />} />
        <Route path="/complaints" element={<Complaints />} />
      </Route>

      <Route
        element={
          <ProtectedRoute role="owner">
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/owner/properties" element={<OwnerProperties />} />
        <Route path="/owner/complaints" element={<OwnerComplaints />} />
      </Route>

      <Route path="*" element={<Navigate to={home} replace />} />
    </Routes>
  );
}
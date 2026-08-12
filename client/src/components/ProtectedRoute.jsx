import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/* Wraps private routes. `role` optionally restricts a branch of the
   app to one user type - this is the client half of role-based access.
   The server must check the role too; a guard in the browser is a
   convenience, never a security boundary. Say that in your viva. */
export default function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth();

  if (loading) return null; // wait for the session check to finish

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'owner' ? '/owner' : '/dashboard'} replace />;
  }

  return children;
}

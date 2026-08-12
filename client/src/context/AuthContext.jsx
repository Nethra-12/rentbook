import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client.js';

/* ---------------------------------------------------------------
   Context API in three moves:
   1. createContext  - makes the box
   2. AuthProvider   - puts the value in the box, wraps the app
   3. useAuth        - any component opens the box, no prop drilling
   This is the state-management answer for your rubric. Be ready to
   explain why: auth state is needed by nearly every screen, and
   passing it down through props would be unreadable.
   --------------------------------------------------------------- */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Runs once on mount. Restores the session from localStorage so a
  // page refresh does not log the user out.
  useEffect(() => {
    const stored = localStorage.getItem('rentbook_user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const persist = ({ token, user }) => {
    localStorage.setItem('rentbook_token', token);
    localStorage.setItem('rentbook_user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const login = async (email, password) => persist(await api.login(email, password));
  const register = async (payload) => persist(await api.register(payload));

  const logout = () => {
    localStorage.removeItem('rentbook_token');
    localStorage.removeItem('rentbook_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

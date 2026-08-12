import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const tenantLinks = [
  { to: '/dashboard', label: 'Overview' },
  { to: '/bills', label: 'Bills & payments' },
  { to: '/complaints', label: 'Maintenance' },
];

const ownerLinks = [
  { to: '/owner', label: 'Overview' },
  { to: '/owner/properties', label: 'Properties' },
  { to: '/owner/complaints', label: 'Maintenance' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = user?.role === 'owner' ? ownerLinks : tenantLinks;

  const signOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar. Collapses to a horizontal bar on small screens. */}
      <aside className="lg:w-60 lg:min-h-screen bg-ink text-white flex lg:flex-col justify-between px-5 py-4 lg:py-7">
        <div className="flex lg:block items-center gap-6">
          <div>
            <p className="font-display text-xl font-extrabold tracking-tight">RentBook</p>
            <p className="hidden lg:block text-[11px] uppercase tracking-[0.18em] text-white/45 mt-0.5">
              {user?.role === 'owner' ? 'Owner' : 'Tenant'}
            </p>
          </div>

          <nav className="flex lg:flex-col gap-1 lg:mt-10">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm transition ${
                    isActive ? 'bg-white/15 text-white font-medium' : 'text-white/60 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 lg:block">
          <p className="hidden lg:block text-sm font-medium">{user?.name}</p>
          <button
            onClick={signOut}
            className="text-sm text-white/60 hover:text-white lg:mt-1"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Outlet renders whichever child route is currently active. */}
      <main className="flex-1 px-5 sm:px-8 py-8 max-w-5xl w-full">
        <Outlet />
      </main>
    </div>
  );
}

import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, Dumbbell, LogOut, LayoutDashboard } from 'lucide-react';

export default function Layout() {
  const { role, username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-900">GDE Training</h1>
          <p className="text-xs text-gray-500 mt-0.5">{username}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {role === 'admin' && (
            <>
              <NavLink to="/admin/users" className={navClass}>
                <Users size={16} />
                Usuarios
              </NavLink>
              <NavLink to="/admin/routines" className={navClass}>
                <Dumbbell size={16} />
                Rutinas
              </NavLink>
            </>
          )}
          {role === 'athlete' && (
            <NavLink to="/athlete/routines" className={navClass}>
              <LayoutDashboard size={16} />
              Mis Rutinas
            </NavLink>
          )}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}

import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, Dumbbell, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';

export default function Layout() {
  const { role, username, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-60 bg-white border-r border-gray-200 flex flex-col
          transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:static md:translate-x-0
        `}
      >
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">GDE Training</h1>
            <p className="text-xs text-gray-500 mt-0.5">{username}</p>
          </div>
          <button
            onClick={closeSidebar}
            className="md:hidden p-1 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {role === 'admin' && (
            <>
              <NavLink to="/admin/users" className={navClass} onClick={closeSidebar}>
                <Users size={16} />
                Usuarios
              </NavLink>
              <NavLink to="/admin/routines" className={navClass} onClick={closeSidebar}>
                <Dumbbell size={16} />
                Rutinas
              </NavLink>
            </>
          )}
          {role === 'athlete' && (
            <NavLink to="/athlete/routines" className={navClass} onClick={closeSidebar}>
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

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={20} />
          </button>
          <span className="font-bold text-gray-900 text-sm">GDE Training</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

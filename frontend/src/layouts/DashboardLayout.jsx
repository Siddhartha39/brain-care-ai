import { useState } from 'react';
import { BarChart3, BrainCircuit, FileText, History, Home, LogOut, Menu, UserRound, X } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: Home },
  { label: 'Analyze MRI', to: '/analyze', icon: BrainCircuit },
  { label: 'Scan History', to: '/history', icon: History },
  { label: 'Reports', to: '/reports', icon: FileText },
  { label: 'Profile', to: '/profile', icon: UserRound },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white p-5 transition lg:static lg:translate-x-0`}>
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3 font-semibold text-slate-900">
              <BarChart3 className="h-6 w-6 text-primary-500" />
              BrainCare AI
            </div>
            <button className="rounded-xl border p-2 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `${isActive ? 'bg-primary-50 text-primary-600' : 'text-slate-700'} flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition hover:bg-slate-50`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 border-t border-slate-200 pt-5">
            <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        <div className="flex-1">
          <header className="border-b border-slate-200 bg-white px-4 py-4 lg:px-8">
            <button className="rounded-xl border border-slate-200 p-2 lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
              <Menu className="h-5 w-5" />
            </button>
          </header>
          <main className="p-4 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

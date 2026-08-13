import { BrainCircuit, LogOut, Menu, UserCircle2 } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            className="rounded-xl border border-slate-200 p-2 text-slate-700 lg:hidden"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <BrainCircuit className="h-6 w-6 text-primary-500" />
            BrainCare AI
          </Link>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-primary-600' : ''}>Home</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'text-primary-600' : ''}>About</NavLink>
          <NavLink to="/how-it-works" className={({ isActive }) => isActive ? 'text-primary-600' : ''}>How It Works</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard" className="hidden items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 sm:flex">
                <UserCircle2 className="h-4 w-4" />
                {user.displayName || 'Profile'}
              </Link>
              <button onClick={logout} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 sm:inline-flex">Login</Link>
              <Link to="/register" className="inline-flex rounded-full bg-primary-500 px-4 py-2 text-sm font-medium text-white">Create account</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

import { useState } from 'react';
import { BrainCircuit, LogOut, Menu, UserCircle2, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            className="rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-slate-900 tracking-tight transition hover:opacity-90">
            <BrainCircuit className="h-6 w-6 text-primary-500 animate-pulse" />
            BrainCare AI
          </Link>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-primary-600 font-semibold' : 'hover:text-primary-500 transition'}>Home</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'text-primary-600 font-semibold' : 'hover:text-primary-500 transition'}>About</NavLink>
          <NavLink to="/how-it-works" className={({ isActive }) => isActive ? 'text-primary-600 font-semibold' : 'hover:text-primary-500 transition'}>How It Works</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard" className="hidden items-center gap-2 rounded-full border border-slate-200 px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition sm:flex">
                <UserCircle2 className="h-4 w-4 text-primary-500" />
                {user.displayName || 'Dashboard'}
              </Link>
              <button onClick={logout} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition">
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition sm:inline-flex">Login</Link>
              <Link to="/register" className="inline-flex rounded-full bg-primary-500 px-4.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-600 transition hover:shadow">Launch Portal</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden shadow-lg animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 font-medium text-slate-700">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-slate-100">Home</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-slate-100">About Platform</Link>
            <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-slate-100">How It Works</Link>
            {user ? (
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm text-primary-600 font-semibold hover:bg-primary-50">Dashboard Portal</Link>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm text-primary-600 font-semibold hover:bg-primary-50">Clinical Login</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}


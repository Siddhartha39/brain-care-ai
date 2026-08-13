import { LogOut, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Profile</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Account profile</h1>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-600">
            <UserRound className="h-8 w-8" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">{user?.displayName || 'User'}</p>
            <p className="text-slate-600">{user?.email}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Name</p>
            <p className="mt-2 font-medium text-slate-800">{user?.displayName || 'Not provided'}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Email</p>
            <p className="mt-2 font-medium text-slate-800">{user?.email || 'Not available'}</p>
          </div>
        </div>

        <button onClick={logout} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { AlertCircle, BrainCircuit, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register, loginGoogle } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setSubmitError('');
      await loginGoogle();
      navigate('/dashboard');
    } catch (error) {
      setSubmitError(error?.message || 'Failed to sign in with Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = 'Full name is required';
    if (!form.email.trim()) nextErrors.email = 'Email is required';
    if (!form.password) nextErrors.password = 'Password is required';
    if (form.password !== form.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setLoading(true);
      setSubmitError('');
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (error) {
      setSubmitError(error?.message || 'Unable to create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-soft lg:grid-cols-2">
        <div className="hidden bg-slate-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex items-center gap-3 text-xl font-semibold">
              <BrainCircuit className="h-7 w-7 text-indigo-400" />
              BrainCare AI
            </div>
            <h1 className="mt-8 text-3xl font-bold">Create your profile</h1>
            <p className="mt-4 text-slate-300">Securely store your brain MRI scans, Grad-CAM maps, and reports in a private workspace.</p>
          </div>

          <div className="my-6 w-full max-w-[500px] mx-auto flex items-center justify-center overflow-hidden">
            <DotLottieReact
              src="https://lottie.host/325fe865-0c7e-4761-8678-33c468bfa022/AEQBhU2nIE.json"
              loop
              autoplay
              className="w-full h-[320px] object-contain scale-105"
            />
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5 text-sm text-slate-200">
            <div className="mb-2 flex items-center gap-2 text-emerald-400"><CheckCircle2 className="h-4 w-4" /> Protected account access</div>
            <div className="mb-2 flex items-center gap-2 text-emerald-400"><CheckCircle2 className="h-4 w-4" /> Private scan history</div>
            <div className="flex items-center gap-2 text-emerald-400"><CheckCircle2 className="h-4 w-4" /> Clinical decision support</div>
          </div>
        </div>


        <div className="p-6 sm:p-10">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Register</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Create an account</h2>
          </div>

          {submitError && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4" />
              {submitError}
            </div>
          )}

          <div className="mb-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-70"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              {googleLoading ? 'Signing in with Google...' : 'Continue with Google'}
            </button>

            <div className="relative my-6 flex items-center justify-center">
              <div className="w-full border-t border-slate-200" />
              <span className="absolute bg-white px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">or register with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} type="text" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary-500" placeholder="John Smith" />
              {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input id="email" name="email" value={form.email} onChange={handleChange} type="email" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary-500" placeholder="name@example.com" />
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <input id="password" name="password" value={form.password} onChange={handleChange} type="password" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary-500" placeholder="••••••••" />
              {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-700">Confirm Password</label>
              <input id="confirmPassword" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} type="password" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary-500" placeholder="••••••••" />
              {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={loading} className="w-full rounded-xl bg-primary-500 px-4 py-3 font-medium text-white disabled:opacity-70">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}


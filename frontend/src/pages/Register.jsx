import { useState } from 'react';
import { AlertCircle, BrainCircuit, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
              <BrainCircuit className="h-7 w-7 text-sky-400" />
              BrainCare AI
            </div>
            <h1 className="mt-8 text-3xl font-bold">Create your profile</h1>
            <p className="mt-4 text-slate-300">Securely store your brain MRI scans and reports in a private workspace.</p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5 text-sm text-slate-200">
            <div className="mb-3 flex items-center gap-2 text-sky-300"><CheckCircle2 className="h-4 w-4" /> Protected account access</div>
            <div className="mb-3 flex items-center gap-2 text-sky-300"><CheckCircle2 className="h-4 w-4" /> Private scan history</div>
            <div className="flex items-center gap-2 text-sky-300"><CheckCircle2 className="h-4 w-4" /> Educational AI insights</div>
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

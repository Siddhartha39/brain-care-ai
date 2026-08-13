import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">404</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-3 text-slate-600">The page you are looking for does not exist.</p>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-primary-500 px-5 py-3 font-medium text-white">Back to home</Link>
      </div>
    </div>
  );
}

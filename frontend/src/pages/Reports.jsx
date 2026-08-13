import Disclaimer from '../components/Disclaimer';

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Reports</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Saved analysis reports</h1>
      </div>
      <div className="card p-6">
        <p className="text-slate-600">No reports generated yet.</p>
      </div>
      <Disclaimer />
    </div>
  );
}

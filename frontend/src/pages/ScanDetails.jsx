import { useParams } from 'react-router-dom';

export default function ScanDetails() {
  const { scanId } = useParams();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Scan Details</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Scan ID {scanId}</h1>
      </div>
      <div className="card p-6">
        <p className="text-slate-600">Detailed scan data will appear here after a saved result is selected.</p>
      </div>
    </div>
  );
}

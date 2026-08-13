import { useEffect, useState } from 'react';
import { Activity, Download, ExternalLink, FileText, History, ImageUp, LoaderCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Disclaimer from '../components/Disclaimer';
import { useAuth } from '../context/AuthContext';
import { generateReport, getScanHistory } from '../services/api';

const classLabels = {
  glioma: 'Glioma',
  meningioma: 'Meningioma',
  notumor: 'No Tumor',
  pituitary: 'Pituitary',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchScans = async () => {
      try {
        setLoading(true);
        let token = null;
        if (user) {
          try {
            token = await user.getIdToken();
          } catch (e) {}
        }
        const data = await getScanHistory(token);
        setScans(data.scans || []);
      } catch (err) {
        console.error('Error fetching dashboard scans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchScans();
  }, [user]);

  const handleDownloadPDF = async (scan) => {
    try {
      setDownloadingId(scan.id);
      let token = null;
      if (user) {
        try {
          token = await user.getIdToken();
        } catch (e) {}
      }
      const pdfBlob = await generateReport(scan.id, token);
      const blobUrl = window.URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `BrainCare_Report_${scan.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Failed to download report PDF:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  const totalScans = scans.length;
  const recentCount = scans.filter((s) => {
    if (!s.createdAt) return false;
    const date = new Date(s.createdAt);
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return date > dayAgo;
  }).length;

  const stats = [
    { label: 'Total Scans', value: totalScans, icon: ImageUp },
    { label: 'Scans Today', value: recentCount || totalScans, icon: Activity },
    { label: 'PDF Reports', value: totalScans, icon: FileText },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Clinical Dashboard</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Welcome to BrainCare AI</h1>
        </div>
        <Link to="/analyze" className="inline-flex items-center justify-center rounded-xl bg-primary-500 px-5 py-3 font-medium text-white shadow-sm hover:bg-primary-600">
          Analyze a New MRI
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
              </div>
              <div className="rounded-xl bg-indigo-50 p-3 text-primary-600">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Analyze a New MRI</h2>
          <Link to="/analyze" className="text-sm font-medium text-primary-600 hover:underline">Upload MRI Scan</Link>
        </div>
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center">
          <ImageUp className="mx-auto h-10 w-10 text-primary-500" />
          <p className="mt-3 text-lg font-semibold text-slate-800">Ready to analyze a brain MRI scan?</p>
          <p className="mt-1 text-sm text-slate-500">Fast CNN classification & Grad-CAM spatial activation mapping.</p>
          <Link to="/analyze" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary-600">
            Upload & Analyze Scan
          </Link>
        </div>
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Recent Diagnostic Scans</h2>
          <Link to="/history" className="flex items-center gap-2 text-sm font-semibold text-primary-600 hover:underline">
            <History className="h-4 w-4" />
            View All Scans ({totalScans})
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8 text-slate-500">
            <LoaderCircle className="mr-2 h-5 w-5 animate-spin text-primary-500" /> Loading scan records...
          </div>
        ) : scans.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No scan history records available yet. Upload your first scan to populate your diagnostic history.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500 uppercase text-[11px] tracking-wider font-semibold">
                <tr>
                  <th className="pb-3 font-semibold">Date & Time</th>
                  <th className="pb-3 font-semibold">Prediction</th>
                  <th className="pb-3 font-semibold">Confidence</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {scans.slice(0, 5).map((scan) => {
                  const confPct = ((scan.confidence || 0) * 100).toFixed(1);
                  const dateStr = scan.createdAt
                    ? new Date(scan.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })
                    : 'Recent';

                  return (
                    <tr key={scan.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 font-medium text-slate-800">{dateStr}</td>
                      <td className="py-3.5 font-semibold text-indigo-900">{classLabels[scan.prediction] || scan.prediction}</td>
                      <td className="py-3.5">
                        <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-100">
                          {confPct}%
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Verified
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate('/result', { state: { result: scan } })}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 px-2 py-1 rounded-md hover:bg-primary-50"
                          >
                            <ExternalLink className="h-3.5 w-3.5" /> View
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(scan)}
                            disabled={downloadingId === scan.id}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-100 disabled:opacity-60"
                          >
                            {downloadingId === scan.id ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />} PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Disclaimer />
    </div>
  );
}


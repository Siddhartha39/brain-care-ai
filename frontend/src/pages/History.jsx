import { useEffect, useState } from 'react';
import { Download, ExternalLink, FileText, Image as ImageIcon, LoaderCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Disclaimer from '../components/Disclaimer';
import { useAuth } from '../context/AuthContext';
import { generateReport, getScanHistory } from '../services/api';

const classLabels = {
  glioma: 'Glioma',
  meningioma: 'Meningioma',
  notumor: 'No Tumor',
  pituitary: 'Pituitary',
};

export default function History() {
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
        console.error('Error loading scan history:', err);
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Scan History</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Your Diagnostic Records</h1>
        </div>
        <button
          onClick={() => navigate('/analyze')}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-2.5 font-medium text-white shadow-sm hover:bg-primary-600"
        >
          <RefreshCw className="h-4 w-4" /> New MRI Scan
        </button>
      </div>

      {loading ? (
        <div className="card flex items-center justify-center p-12 text-slate-500">
          <LoaderCircle className="mr-3 h-6 w-6 animate-spin text-primary-500" /> Loading scan history records...
        </div>
      ) : scans.length === 0 ? (
        <div className="card p-12 text-center text-slate-700">
          <FileText className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-xl font-semibold text-slate-900">No scan history records found</h3>
          <p className="mt-2 text-slate-500">Upload a brain MRI scan to view complete diagnostic records and Grad-CAM analytics.</p>
          <button
            onClick={() => navigate('/analyze')}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 font-medium text-white shadow-sm hover:bg-primary-600"
          >
            Upload Your First Scan
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {scans.map((scan) => {
            const confPct = ((scan.confidence || 0) * 100).toFixed(1);
            const formattedDate = scan.createdAt
              ? new Date(scan.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
              : 'Recent Scan';

            return (
              <div key={scan.id} className="card p-6 transition hover:shadow-md">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-lg text-slate-900">
                        {classLabels[scan.prediction] || scan.prediction}
                      </span>
                      <span className="rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-semibold text-indigo-600 border border-indigo-100">
                        {confPct}% Confidence
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">Scan Ref: {scan.id} | {formattedDate}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate('/result', { state: { result: scan } })}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> View Analytics
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(scan)}
                      disabled={downloadingId === scan.id}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary-500 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-600 disabled:opacity-60"
                    >
                      {downloadingId === scan.id ? (
                        <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Download className="h-3.5 w-3.5" />
                      )}
                      Download PDF
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <p className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1.5">
                      <ImageIcon className="h-3.5 w-3.5 text-primary-500" /> Original Scan
                    </p>
                    {scan.original_image ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}${scan.original_image}`}
                        alt="Original scan"
                        className="h-32 w-full rounded-lg object-contain bg-black"
                      />
                    ) : (
                      <div className="h-32 rounded-lg bg-slate-200 flex items-center justify-center text-xs text-slate-400">No Image</div>
                    )}
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <p className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-primary-500" /> Grad-CAM Heatmap
                    </p>
                    {scan.gradcam_image ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}${scan.gradcam_image}`}
                        alt="Grad-CAM scan"
                        className="h-32 w-full rounded-lg object-contain bg-black"
                      />
                    ) : (
                      <div className="h-32 rounded-lg bg-slate-200 flex items-center justify-center text-xs text-slate-400">No Heatmap</div>
                    )}
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 sm:col-span-2 lg:col-span-1">
                    <p className="text-xs font-medium text-slate-500 mb-2">Diagnostic Summary</p>
                    <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed">
                      {scan.explanation || 'Processed by BrainCare AI Deep Diagnostic Engine with spatial feature mapping.'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Disclaimer />
    </div>
  );
}


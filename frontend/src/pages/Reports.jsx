import { useEffect, useState } from 'react';
import { Download, FileText, LoaderCircle, RefreshCw } from 'lucide-react';
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

export default function Reports() {
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
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchScans();
  }, [user]);

  const handleDownloadPDF = async (scanId) => {
    try {
      setDownloadingId(scanId);
      let token = null;
      if (user) {
        try {
          token = await user.getIdToken();
        } catch (e) {}
      }
      const pdfBlob = await generateReport(scanId, token);
      const blobUrl = window.URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `BrainCare_Report_${scanId}.pdf`);
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
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Medical Reports</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Generated PDF Diagnostic Reports</h1>
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
          <LoaderCircle className="mr-3 h-6 w-6 animate-spin text-primary-500" /> Loading diagnostic reports...
        </div>
      ) : scans.length === 0 ? (
        <div className="card p-12 text-center text-slate-700">
          <FileText className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-xl font-semibold text-slate-900">No medical reports generated yet</h3>
          <p className="mt-2 text-slate-500">Upload a brain MRI scan to instantly generate and download official PDF medical reports.</p>
          <button
            onClick={() => navigate('/analyze')}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 font-medium text-white shadow-sm hover:bg-primary-600"
          >
            Analyze First MRI Scan
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {scans.map((scan) => {
            const confPct = ((scan.confidence || 0) * 100).toFixed(1);
            const dateStr = scan.createdAt
              ? new Date(scan.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
              : 'Recent Report';

            return (
              <div key={scan.id} className="card p-6 flex flex-col justify-between transition hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100">
                      <FileText className="h-3.5 w-3.5" /> PDF Medical Report
                    </div>
                    <span className="text-xs font-medium text-slate-400">{dateStr}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    {classLabels[scan.prediction] || scan.prediction} ({confPct}%)
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 font-mono">Scan Ref: {scan.id}</p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs font-medium text-emerald-600 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Ready to Download
                  </span>
                  <button
                    onClick={() => handleDownloadPDF(scan.id)}
                    disabled={downloadingId === scan.id}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-600 disabled:opacity-60"
                  >
                    {downloadingId === scan.id ? (
                      <>
                        <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> Generating...
                      </>
                    ) : (
                      <>
                        <Download className="h-3.5 w-3.5" /> Download PDF
                      </>
                    )}
                  </button>
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


import { useEffect, useState } from 'react';
import { Download, ExternalLink, FileText, Image as ImageIcon, LoaderCircle, RefreshCw, ShieldAlert } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Disclaimer from '../components/Disclaimer';
import { useAuth } from '../context/AuthContext';
import { generateReport, getScanById } from '../services/api';

const classLabels = {
  glioma: 'Glioma',
  meningioma: 'Meningioma',
  notumor: 'No Tumor',
  pituitary: 'Pituitary',
};

export default function ScanDetails() {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchScan = async () => {
      try {
        setLoading(true);
        let token = null;
        if (user) {
          try {
            token = await user.getIdToken();
          } catch (e) {}
        }
        const res = await getScanById(scanId, token);
        setScan(res.scan || null);
      } catch (err) {
        console.error('Error loading scan details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (scanId) {
      fetchScan();
    }
  }, [scanId, user]);

  const handleDownloadPDF = async () => {
    if (!scanId) return;
    try {
      setDownloading(true);
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
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="card flex items-center justify-center p-12 text-slate-500">
        <LoaderCircle className="mr-3 h-6 w-6 animate-spin text-primary-500" /> Loading diagnostic scan record...
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="card p-8 text-center text-slate-700">
        <p className="text-lg font-semibold text-slate-900">Scan Record Not Found</p>
        <p className="mt-2 text-sm text-slate-500">The requested scan ID ({scanId}) was not found in your diagnostic records.</p>
        <button
          onClick={() => navigate('/history')}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary-600"
        >
          Back to History
        </button>
      </div>
    );
  }

  const entries = Object.entries(scan.probabilities || {});
  const confPct = ((scan.confidence || 0) * 100).toFixed(1);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Scan Analytics (ID: {scanId})</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Prediction: {classLabels[scan.prediction] || scan.prediction}</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {downloading ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin text-primary-500" /> Downloading PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" /> Download PDF Report
              </>
            )}
          </button>
          <button
            onClick={() => navigate('/analyze')}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2 font-medium text-white shadow-sm hover:bg-primary-600"
          >
            <RefreshCw className="h-4 w-4" /> New Scan
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="card p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Probability Breakdown</h2>
            <span className="rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-600">Confidence {confPct}%</span>
          </div>

          <div className="space-y-4">
            {entries.map(([className, value]) => (
              <div key={className}>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-700">
                  <span className="font-medium">{classLabels[className] || className}</span>
                  <span>{(value * 100).toFixed(1)}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${value * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-semibold text-slate-900">Clinical Diagnostic Summary</h2>
          <p className="mt-4 leading-relaxed text-slate-600">{scan.explanation || 'BrainCare AI Deep Diagnostic Engine processed the scan using convolutional neural network spatial feature maps.'}</p>
          <div className="mt-5 rounded-xl border border-indigo-200 bg-indigo-50/70 p-4 text-sm text-slate-700">
            <div className="flex items-center gap-2 font-semibold text-indigo-900"><ShieldAlert className="h-4 w-4 text-indigo-600" /> Clinical Insights</div>
            <p className="mt-2 text-slate-600">{scan.educational_info || 'Grad-CAM spatial activation map displays spatial feature correlation for clinician decision support.'}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="card p-5">
          <div className="mb-3 flex items-center gap-2 text-slate-800">
            <ImageIcon className="h-5 w-5 text-primary-500" />
            <h3 className="font-semibold text-base">Original Input MRI Scan</h3>
          </div>
          {scan.original_image ? (
            <img
              src={`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}${scan.original_image}`}
              alt="Original MRI scan"
              className="max-h-96 w-full rounded-xl object-contain border border-slate-200 bg-black"
            />
          ) : (
            <div className="h-60 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">No Image Preview</div>
          )}
        </div>

        <div className="card p-5">
          <div className="mb-3 flex items-center gap-2 text-slate-800">
            <FileText className="h-5 w-5 text-primary-500" />
            <h3 className="font-semibold text-base">Grad-CAM Explainability Heatmap</h3>
          </div>
          {scan.gradcam_image ? (
            <img
              src={`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}${scan.gradcam_image}`}
              alt="Grad-CAM heatmap"
              className="max-h-96 w-full rounded-xl object-contain border border-slate-200 bg-black"
            />
          ) : (
            <div className="h-60 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">No Heatmap Preview</div>
          )}
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}


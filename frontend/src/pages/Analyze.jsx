import { useState } from 'react';
import { AlertCircle, BrainCircuit, FileImage, LoaderCircle, Trash2, UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Disclaimer from '../components/Disclaimer';
import { useAuth } from '../context/AuthContext';
import { analyzeMRI } from '../services/api';

export default function Analyze() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setError('Please upload a valid MRI image.');
      return;
    }

    setSelectedFile(file);
    setError('');
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please upload a valid MRI image.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      let token = null;
      if (user) {
        try {
          token = await user.getIdToken();
        } catch (tokenErr) {
          // Fallback to guest mode
        }
      }
      const response = await analyzeMRI(selectedFile, token);
      const result = response.data;
      navigate('/result', { state: { result } });
    } catch (err) {
      setError(err?.response?.data?.detail || 'Unable to analyze the image. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Analyze MRI</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Upload a brain scan</h1>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card p-6">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-primary-500 hover:bg-primary-50">
            <UploadCloud className="h-10 w-10 text-primary-500" />
            <span className="mt-4 text-base font-medium text-slate-700">Drag and drop or click to upload</span>
            <span className="mt-2 text-sm text-slate-500">JPG, JPEG, or PNG</span>
            <input type="file" accept="image/png,image/jpeg,image/jpg" onChange={handleFileChange} className="hidden" aria-label="Upload MRI image" />
          </label>

          {preview && (
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-medium text-slate-700">Preview</p>
                <button onClick={() => { setSelectedFile(null); setPreview(''); }} className="inline-flex items-center gap-2 text-sm text-red-600">
                  <Trash2 className="h-4 w-4" /> Remove
                </button>
              </div>
              <img src={preview} alt="MRI preview" className="max-h-80 w-full rounded-2xl object-contain border border-slate-200 bg-white" />
            </div>
          )}
        </div>

        <div className="card p-6">
          <div className="mb-4 flex items-center gap-3 text-slate-800">
            <BrainCircuit className="h-5 w-5 text-primary-500" />
            <h2 className="text-lg font-semibold">Analysis status</h2>
          </div>

          <div className="space-y-4 text-sm text-slate-600">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="font-medium text-slate-800">Preparing MRI</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="font-medium text-slate-800">Running CNN</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="font-medium text-slate-800">Generating Grad-CAM</p>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!selectedFile || loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3 font-medium text-white disabled:opacity-60"
          >
            {loading ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Analyzing MRI...
              </>
            ) : (
              <>
                <FileImage className="h-4 w-4" />
                Analyze MRI
              </>
            )}
          </button>
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}

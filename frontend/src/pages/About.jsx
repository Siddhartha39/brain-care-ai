import { FileText, Download, ShieldCheck, Cpu } from 'lucide-react';

export default function About() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 animate-fade-in">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">About BrainCare AI</p>
      <h1 className="mt-3 text-4xl font-bold text-slate-900">Clinical-Grade Brain MRI Diagnostic Support Platform</h1>
      <p className="mt-5 text-lg text-slate-600 leading-relaxed">
        BrainCare AI is an enterprise-grade clinical decision support platform engineered for automated brain MRI classification, spatial feature analytics, and radiologist report generation.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <div className="flex items-center gap-3 text-primary-600 font-semibold text-lg">
            <Cpu className="h-6 w-6" /> Enterprise Mission
          </div>
          <p className="mt-3 text-slate-600 leading-relaxed">The platform delivers secure scan processing, MobileNetV2 deep learning multi-class probability scoring, Grad-CAM spatial activation mapping, and automated PDF medical report creation.</p>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-3 text-primary-600 font-semibold text-lg">
            <ShieldCheck className="h-6 w-6" /> Clinical Integration
          </div>
          <p className="mt-3 text-slate-600 leading-relaxed">Engineered for seamless integration with clinical radiological workflows, decision support, and neurological scan review systems.</p>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary-600" /> Full Technical & Clinical Documentation
          </h3>
          <p className="mt-1 text-sm text-slate-600">Download the complete presentation PDF covering system architecture, MobileNetV2 specifications, Grad-CAM mechanics, and Q&A defense guide.</p>
        </div>
        <a
          href="http://localhost:8000/api/documentation/pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 transition shrink-0"
        >
          <Download className="h-4 w-4" /> Download PDF
        </a>
      </div>
    </div>
  );
}



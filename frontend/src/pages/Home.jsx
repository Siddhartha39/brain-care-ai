import { ArrowRight, BrainCircuit, CheckCircle2, ShieldCheck, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import Disclaimer from '../components/Disclaimer';

const steps = [
  'Upload High-Res MRI Scan',
  'Run CNN Spatial Analytics Engine',
  'Review Class Probabilities & Grad-CAM',
  'Generate Clinical PDF Report',
];

const features = [
  { icon: BrainCircuit, title: 'Deep Learning Classification', text: 'Multi-class identification across Glioma, Meningioma, Pituitary, and Normal Brain Tissue.' },
  { icon: Stethoscope, title: 'Grad-CAM Explainable AI', text: 'Spatial visual analytics highlighting feature activation maps for clinician review.' },
  { icon: ShieldCheck, title: 'Enterprise Security & Isolation', text: 'Encrypted patient records, Firebase token authentication, and HIPAA-ready data pipeline.' },
];

export default function Home() {
  return (
    <div className="animate-fade-in">
      <section className="gradient-bg px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-indigo-200 bg-indigo-100 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-800">
              Enterprise Clinical AI System
            </div>
            <h1 className="max-w-xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Clinical-Grade Brain MRI Diagnostic Platform
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600 leading-relaxed">
              BrainCare AI empowers radiologists and healthcare specialists with deep convolutional classification, spatial Grad-CAM heatmaps, and decision support analytics.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/analyze" className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-6 py-3 font-medium text-white shadow-soft hover:bg-primary-600">
                Launch Diagnostic Engine <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/how-it-works" className="inline-flex rounded-full border border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 hover:bg-slate-50">
                Platform Architecture
              </Link>
            </div>
            <div className="mt-8">
              <Disclaimer />
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-soft">
            <div className="rounded-[22px] bg-slate-900 p-5 text-white">
              <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.12em] text-slate-300">
                <span>MRI Scan Diagnostics</span>
                <span>Clinical Deep Engine</span>
              </div>
              <div className="rounded-2xl bg-slate-800 p-4">
                <div className="h-56 rounded-xl bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.55),_rgba(15,23,42,1)_45%,_rgba(15,23,42,1)_100%)]"></div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-800 p-3">
                  <p className="text-slate-300 text-xs">Primary Prediction</p>
                  <p className="mt-1 font-semibold text-indigo-400">Glioma</p>
                </div>
                <div className="rounded-xl bg-slate-800 p-3">
                  <p className="text-slate-300 text-xs">Confidence Score</p>
                  <p className="mt-1 font-semibold text-emerald-400">98.8%</p>
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-slate-800 p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-300">Grad-CAM Activation Map</p>
                <div className="mt-2 h-20 rounded-lg bg-gradient-to-r from-indigo-500/80 via-emerald-500/60 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Workflow</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Seamless Clinical Scan Processing</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step} className="card p-6">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary-600">0{index + 1}</div>
              <p className="text-base font-semibold text-slate-900">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">System Capabilities</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Engineered for Radiologists & Neurological Specialists</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card p-6">
                <div className="mb-4 inline-flex rounded-xl bg-indigo-100 p-3 text-primary-600">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
                <p className="mt-3 text-slate-600 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Explainable AI Engine</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Grad-CAM Spatial Feature Activation</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">Grad-CAM spatial activation mapping highlights image regions that heavily influence neural network inference.</p>
            <p className="mt-3 text-slate-600 leading-relaxed">Provides clear visual correlation between localized image intensity and tumor classification confidence.</p>
          </div>
          <div className="card p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Enterprise Security</p>
            <ul className="mt-5 space-y-4 text-slate-700">
              {['Firebase Token Authorization & Encrypted Storage', 'Patient Scan Record Auditing & History Logs', 'Protected RESTful API Endpoints', 'Clinical-Grade PDF Medical Report Downloads'].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold">Ready to Launch BrainCare AI Diagnostic Engine?</h2>
          <p className="mt-4 text-slate-300">Access secure clinical decision support and instant Grad-CAM visual analytics.</p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/analyze" className="rounded-full bg-primary-500 px-6 py-3 font-medium text-white shadow-lg hover:bg-primary-600">Launch Diagnostic Engine</Link>
            <Link to="/login" className="rounded-full border border-slate-600 px-6 py-3 font-medium text-white hover:bg-slate-800">Clinical Portal Login</Link>
          </div>
        </div>
      </section>
    </div>
  );
}


export default function About() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">About BrainCare AI</p>
      <h1 className="mt-3 text-4xl font-bold text-slate-900">Clinical-Grade Brain MRI Diagnostic Support Platform</h1>
      <p className="mt-5 text-lg text-slate-600 leading-relaxed">
        BrainCare AI is an enterprise-grade clinical decision support platform engineered for automated brain MRI classification, spatial feature analytics, and radiologist report generation.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-slate-900">Enterprise Mission</h2>
          <p className="mt-3 text-slate-600 leading-relaxed">The platform delivers secure scan processing, convolutional multi-class probability scoring, Grad-CAM spatial activation mapping, and automated PDF medical report creation.</p>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-slate-900">Clinical Integration</h2>
          <p className="mt-3 text-slate-600 leading-relaxed">Engineered for seamless integration with clinical radiological workflows, decision support, and neurological scan review systems.</p>
        </div>
      </div>
    </div>
  );
}


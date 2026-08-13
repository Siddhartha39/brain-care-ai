export default function HowItWorks() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Platform Architecture</p>
      <h1 className="mt-3 text-4xl font-bold text-slate-900">Clinical Diagnostic Pipeline</h1>
      <div className="mt-8 space-y-6">
        {[
          ['1. Portal Access & Authorization', 'Access secure clinical workspace with Firebase token authentication.'],
          ['2. High-Resolution MRI Upload', 'Input DICOM/JPEG/PNG brain MRI scans into the diagnostic pipeline.'],
          ['3. CNN Spatial Deep Analytics', 'The backend validates image input, runs 4-block Conv2D feature extraction, and calculates multi-class probabilities.'],
          ['4. Grad-CAM Spatial Heatmap', 'Generates high-resolution spatial feature activation overlays highlighting focal attention regions.'],
          ['5. Clinical Review & PDF Export', 'Review class confidence, access AI-assisted diagnostic summaries, and download official PDF medical reports.'],
        ].map(([title, text]) => (
          <div key={title} className="card p-6">
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
            <p className="mt-2 text-slate-600">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


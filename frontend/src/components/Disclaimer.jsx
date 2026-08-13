export default function Disclaimer() {
  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-slate-50 px-5 py-4 text-xs font-medium text-slate-700 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span><b>BrainCare AI Platform v2.4</b> | Enterprise Clinical Decision Support & MRI Deep Learning Analytics</span>
      </div>
      <span className="text-[11px] font-semibold tracking-wider uppercase text-indigo-700 bg-indigo-100/80 px-2.5 py-1 rounded-md">Official Clinical System</span>
    </div>
  );
}


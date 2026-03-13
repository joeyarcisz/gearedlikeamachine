export default function DocumentCompletePage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-900/30 border border-green-700 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-heading text-2xl font-bold text-steel uppercase tracking-wider mb-3">
          Document Submitted
        </h1>
        <p className="text-chrome mb-6">
          Your document has been submitted successfully. GLM has been notified.
        </p>
        <p className="text-xs text-muted">
          You may close this page. If you need to make changes, please contact Geared Like A Machine directly.
        </p>
      </div>
    </div>
  );
}

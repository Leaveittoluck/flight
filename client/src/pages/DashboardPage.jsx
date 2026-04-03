export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Your trip history and saved searches</p>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
          <p className="text-2xl mb-2">📊</p>
          <p className="font-semibold text-slate-700">Coming soon</p>
          <p className="text-sm text-slate-500 mt-1">
            Trip history and insights will appear here.
          </p>
        </div>
      </main>
    </div>
  )
}

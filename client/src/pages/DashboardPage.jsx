function DashboardCard({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-6 ${className}`}>
      {children}
    </div>
  )
}

function CardLabel({ children }) {
  return (
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
      {children}
    </p>
  )
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Your plan, usage, and rewards</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-4">
        {/* Current plan */}
        <DashboardCard>
          <CardLabel>Current plan</CardLabel>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xl font-bold text-slate-900">Free</p>
              <p className="text-sm text-slate-500 mt-0.5">5 destination clicks per month</p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
              Free plan
            </span>
          </div>
        </DashboardCard>

        {/* Click usage + Coins */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DashboardCard>
            <CardLabel>Click usage</CardLabel>
            <p className="text-2xl font-extrabold text-slate-900">
              —{' '}
              <span className="text-base font-medium text-slate-400">/ 5 this month</span>
            </p>
            <p className="text-xs text-slate-400 mt-1.5">
              Usage updates after your first travel click
            </p>
          </DashboardCard>

          <DashboardCard>
            <CardLabel>Coins</CardLabel>
            <p className="text-2xl font-extrabold text-slate-900">
              0{' '}
              <span className="text-base font-medium text-slate-400">coins</span>
            </p>
            <p className="text-xs text-slate-400 mt-1.5">
              Earn coins from verified bookings in a future update
            </p>
          </DashboardCard>
        </div>

        {/* Rewards progress */}
        <DashboardCard>
          <CardLabel>Rewards progress</CardLabel>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-700">0 / 50 coins toward 5% discount</p>
            <p className="text-xs text-slate-400">0%</p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }} />
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Collect 50 coins to unlock a 5% discount on your next booking
          </p>
        </DashboardCard>

        {/* Recent activity */}
        <DashboardCard>
          <CardLabel>Recent activity</CardLabel>
          <div className="py-8 text-center">
            <p className="text-sm text-slate-500">
              Your recent travel activity will appear here
            </p>
          </div>
        </DashboardCard>
      </main>
    </div>
  )
}

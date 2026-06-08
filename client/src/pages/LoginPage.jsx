import { Link } from 'react-router-dom'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8">
          <div className="text-center mb-8">
            <Link
              to="/"
              className="text-sm font-semibold text-stone-900 tracking-tight hover:text-amber-600 transition-colors"
            >
              LITL
            </Link>
            <h1 className="text-xl font-semibold text-stone-900 mt-4 mb-1">Welcome back</h1>
            <p className="text-sm text-stone-500">Sign in to continue your discoveries</p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-stone-600 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 focus:bg-white transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-stone-600 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-stone-400 hover:text-amber-600 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 focus:bg-white transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold transition-colors mt-1"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-stone-100 text-center">
            <p className="text-sm text-stone-500">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-stone-900 font-medium hover:text-amber-600 transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

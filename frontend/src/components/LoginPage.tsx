import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Zap } from 'lucide-react'
import { login } from '../api/client'
import { useAuthStore } from '../store/useAuthStore'

export default function LoginPage() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const setAuth = useAuthStore((s) => s.setAuth)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await login(username, password)
      setAuth(data.access_token, data.role, data.full_name)
    } catch {
      setError('Invalid credentials. Try admin / admin123')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-transparent to-cyan-950/30" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-10 w-full max-w-md relative z-10"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-400/40 shadow-glow">
            <Zap className="w-7 h-7 text-nexus-cyan" />
          </div>
          <div>
            <h1 className="hud-text text-2xl text-nexus-glow">NEXUS</h1>
            <p className="text-sm text-slate-400">Digital Twin Smart City Platform</p>
          </div>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="w-full bg-slate-900/80 border border-blue-500/30 rounded px-4 py-3 text-white focus:outline-none focus:border-nexus-cyan"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="password"
            className="w-full bg-slate-900/80 border border-blue-500/30 rounded px-4 py-3 text-white focus:outline-none focus:border-nexus-cyan"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded bg-gradient-to-r from-blue-600 to-cyan-600 hud-text text-sm font-semibold hover:shadow-cyan transition-shadow disabled:opacity-50"
          >
            {loading ? 'AUTHENTICATING...' : 'ENTER COMMAND CENTER'}
          </button>
        </form>
        <div className="mt-6 flex items-start gap-2 text-xs text-slate-500">
          <Shield className="w-4 h-4 shrink-0 text-nexus-primary" />
          <span>Demo: admin/admin123 · operator/ops123 · analyst/ai123</span>
        </div>
      </motion.div>
    </div>
  )
}

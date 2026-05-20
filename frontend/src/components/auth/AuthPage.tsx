import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Zap, UserPlus, LogIn, Eye, EyeOff } from 'lucide-react'
import { loginUser, registerUser } from '../../api/auth'
import { getApiErrorMessage } from '../../api/client'
import { useAuthStore } from '../../store/useAuthStore'
import { validateRegisterForm } from '../../utils/validation'

type Mode = 'login' | 'register'

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const setSession = useAuthStore((s) => s.setSession)

  const resetErrors = () => setError('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const tokens = await loginUser({ username: username.trim(), password })
      setSession(tokens)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    resetErrors()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const tokens = await registerUser({
        username: username.trim(),
        email: email.trim(),
        password,
        full_name: fullName.trim(),
      })
      setSession(tokens)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center relative overflow-hidden p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-transparent to-cyan-950/30" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 md:p-10 w-full max-w-md relative z-10"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-400/40 shadow-glow">
            <Zap className="w-7 h-7 text-nexus-cyan" />
          </div>
          <div>
            <h1 className="hud-text text-2xl text-nexus-glow">NEXUS</h1>
            <p className="text-sm text-slate-400">Secure Command Center Access</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 p-1 bg-slate-900/60 rounded-lg">
          <button
            type="button"
            onClick={() => { setMode('login'); resetErrors() }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm transition-all ${
              mode === 'login' ? 'bg-blue-600/40 text-nexus-cyan' : 'text-slate-500'
            }`}
          >
            <LogIn className="w-4 h-4" /> Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); resetErrors() }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm transition-all ${
              mode === 'register' ? 'bg-blue-600/40 text-nexus-cyan' : 'text-slate-500'
            }`}
          >
            <UserPlus className="w-4 h-4" /> Register
          </button>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'login' ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleLogin}
              className="space-y-4"
            >
              <Field label="Username" value={username} onChange={setUsername} placeholder="admin" autoComplete="username" />
              <PasswordField
                value={password}
                onChange={setPassword}
                show={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
              />
              {error && <ErrorText message={error} />}
              <SubmitButton loading={loading} label="ENTER COMMAND CENTER" />
            </motion.form>
          ) : (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onSubmit={handleRegister}
              className="space-y-3"
            >
              <Field label="Full name" value={fullName} onChange={setFullName} placeholder="Jane Operator" />
              <Field label="Username" value={username} onChange={setUsername} placeholder="jane_ops" autoComplete="username" />
              <Field label="Email" value={email} onChange={setEmail} placeholder="jane@nexus.city" type="email" autoComplete="email" />
              <PasswordField
                value={password}
                onChange={setPassword}
                show={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
                hint="Min 8 characters with uppercase, lowercase, and a number (e.g. Nexus123!)"
              />
              <Field
                label="Confirm password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
              />
              {error && <ErrorText message={error} />}
              <SubmitButton loading={loading} label="CREATE ACCOUNT" />
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-6 flex items-start gap-2 text-xs text-slate-500 border-t border-slate-800 pt-4">
          <Shield className="w-4 h-4 shrink-0 text-nexus-primary" />
          <div>
            <p>Seeded accounts (change after first login):</p>
            <p className="mt-1 text-slate-600">admin / Admin123! · operator / Ops12345! · analyst / Analyst123!</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  autoComplete,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  autoComplete?: string
  hint?: string
}) {
  return (
    <div>
      <label className="text-xs text-slate-500 uppercase tracking-wider">{label}</label>
      <input
        type={type}
        required
        autoComplete={autoComplete}
        className="w-full mt-1 bg-slate-900/80 border border-blue-500/30 rounded px-4 py-2.5 text-white focus:outline-none focus:border-nexus-cyan"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {hint && <p className="text-[10px] text-slate-600 mt-1">{hint}</p>}
    </div>
  )
}

function PasswordField({
  value,
  onChange,
  show,
  onToggle,
  hint,
}: {
  value: string
  onChange: (v: string) => void
  show: boolean
  onToggle: () => void
  hint?: string
}) {
  return (
    <div>
      <label className="text-xs text-slate-500 uppercase tracking-wider">Password</label>
      <div className="relative mt-1">
        <input
          type={show ? 'text' : 'password'}
          required
          autoComplete={hint ? 'new-password' : 'current-password'}
          className="w-full bg-slate-900/80 border border-blue-500/30 rounded px-4 py-2.5 pr-10 text-white focus:outline-none focus:border-nexus-cyan"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {hint && <p className="text-[10px] text-slate-600 mt-1">{hint}</p>}
    </div>
  )
}

function ErrorText({ message }: { message: string }) {
  return <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded px-3 py-2">{message}</p>
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3 rounded bg-gradient-to-r from-blue-600 to-cyan-600 hud-text text-sm font-semibold hover:shadow-cyan transition-shadow disabled:opacity-50"
    >
      {loading ? 'PROCESSING...' : label}
    </button>
  )
}

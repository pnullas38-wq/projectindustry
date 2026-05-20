import { useAuthStore } from './store/useAuthStore'
import AuthPage from './components/auth/AuthPage'
import AuthProvider from './components/auth/AuthProvider'
import Dashboard from './components/Dashboard'

export default function App() {
  const accessToken = useAuthStore((s) => s.accessToken)

  if (!accessToken) {
    return <AuthPage />
  }

  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  )
}

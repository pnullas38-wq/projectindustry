import { useAuthStore } from './store/useAuthStore'
import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard'

export default function App() {
  const token = useAuthStore((s) => s.token)
  return token ? <Dashboard /> : <LoginPage />
}

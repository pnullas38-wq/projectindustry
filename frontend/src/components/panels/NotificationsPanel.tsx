import { motion, AnimatePresence } from 'framer-motion'

interface Notification {
  id: string
  level: string
  message: string
  timestamp: string
}

export default function NotificationsPanel({ notifications }: { notifications: Notification[] }) {
  const levelStyle: Record<string, string> = {
    critical: 'text-red-400 border-red-500/40',
    warning: 'text-amber-400 border-amber-500/40',
    info: 'text-nexus-cyan border-cyan-500/40',
  }

  return (
    <div className="glass-panel p-3 max-h-40 overflow-y-auto">
      <h4 className="hud-text text-xs text-slate-500 mb-2">LIVE ALERTS</h4>
      <AnimatePresence>
        {notifications.slice(0, 5).map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0 }}
            className={`text-xs py-2 border-b ${levelStyle[n.level] || levelStyle.info}`}
          >
            {n.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

import { AlertTriangle } from 'lucide-react'
import type { Emergency } from '../../types/city'

const severityColor: Record<string, string> = {
  critical: 'border-red-500 bg-red-500/10',
  high: 'border-orange-500 bg-orange-500/10',
  medium: 'border-amber-500 bg-amber-500/10',
}

export default function EmergencyPanel({ emergencies }: { emergencies: Emergency[] }) {
  return (
    <div className="glass-panel p-4 h-full">
      <h3 className="hud-text text-sm text-red-400 mb-4 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" /> EMERGENCY RESPONSE AI
      </h3>
      {emergencies.length === 0 ? (
        <p className="text-slate-500 text-sm text-center py-8">No active emergencies — all zones nominal</p>
      ) : (
        <div className="space-y-3">
          {emergencies.map((e) => (
            <div key={e.id} className={`p-3 rounded border ${severityColor[e.severity] || severityColor.medium}`}>
              <div className="flex justify-between">
                <span className="hud-text text-sm uppercase">{e.type.replace('_', ' ')}</span>
                <span className="text-xs text-red-300">{e.severity}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{e.description}</p>
              <p className="text-xs text-nexus-cyan mt-2">🤖 {e.ai_recommendation}</p>
              <p className="text-[10px] text-slate-500 mt-1">Confidence: {(e.confidence * 100).toFixed(0)}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

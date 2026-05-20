import { motion } from 'framer-motion'
import { Brain, Sparkles } from 'lucide-react'
import type { AIInsight } from '../../types/city'

export default function AIInsightsPanel({ insights }: { insights: AIInsight[] }) {
  return (
    <div className="glass-panel p-4 h-full flex flex-col">
      <h3 className="hud-text text-sm text-nexus-glow mb-3 flex items-center gap-2">
        <Brain className="w-4 h-4" /> MULTI-AGENT AI INSIGHTS
      </h3>
      <div className="flex-1 overflow-y-auto space-y-3">
        {insights.map((ins, i) => (
          <motion.div
            key={ins.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-900/60 p-3 rounded border border-blue-500/20"
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3 h-3 text-nexus-cyan" />
              <span className="text-xs text-nexus-cyan">{ins.agent}</span>
              <span className="text-[10px] text-slate-500 ml-auto">{(ins.confidence * 100).toFixed(0)}%</span>
            </div>
            <p className="text-sm font-medium text-white">{ins.title}</p>
            <p className="text-xs text-slate-400 mt-1">{ins.detail}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {ins.explainable_factors?.map((f) => (
                <span key={f} className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-300 rounded">
                  {f}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

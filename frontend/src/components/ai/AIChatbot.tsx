import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Bot } from 'lucide-react'
import { chatAI } from '../../api/client'

interface Message {
  role: 'user' | 'assistant'
  text: string
}

export default function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'NEXUS AI Assistant online. Ask about traffic, emergencies, pollution, or drone operations.' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages((m) => [...m, { role: 'user', text: userMsg }])
    setLoading(true)
    try {
      const res = await chatAI(userMsg)
      setMessages((m) => [...m, { role: 'assistant', text: res.response }])
    } catch {
      setMessages((m) => [...m, { role: 'assistant', text: 'Connection error. Ensure backend is running on port 8000.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-panel p-4 flex flex-col h-full min-h-[300px]">
      <h3 className="hud-text text-sm text-nexus-glow mb-3 flex items-center gap-2">
        <Bot className="w-4 h-4" /> NEXUS AI ASSISTANT
      </h3>
      <div className="flex-1 overflow-y-auto space-y-2 mb-3">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-xs p-2 rounded max-w-[90%] ${
              msg.role === 'user' ? 'ml-auto bg-blue-600/30 text-white' : 'bg-slate-900/80 text-slate-300'
            }`}
          >
            {msg.text}
          </motion.div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 bg-slate-900/80 border border-blue-500/30 rounded px-3 py-2 text-sm text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Ask NEXUS AI..."
        />
        <button onClick={send} disabled={loading} className="p-2 bg-blue-600 rounded hover:bg-blue-500 disabled:opacity-50">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

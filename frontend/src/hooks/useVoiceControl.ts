import { useEffect } from 'react'
import { useCityStore } from '../store/useCityStore'

type SpeechRecognitionInstance = {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null
  start: () => void
  stop: () => void
}

const COMMANDS: Record<string, string> = {
  traffic: 'traffic',
  crowd: 'crowd',
  emergency: 'emergency',
  environment: 'environment',
  pollution: 'environment',
  drone: 'drones',
  drones: 'drones',
  overview: 'overview',
  dashboard: 'overview',
  twin: 'twin',
  digital: 'twin',
  ai: 'ai',
}

export function useVoiceControl() {
  const { voiceEnabled, setActiveModule } = useCityStore()

  useEffect(() => {
    if (!voiceEnabled) return
    const win = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionInstance
      webkitSpeechRecognition?: new () => SpeechRecognitionInstance
    }
    const SR = win.SpeechRecognition || win.webkitSpeechRecognition
    if (!SR) return

    const recognition = new SR()
    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      const keys = Object.keys(event.results)
      const last = event.results[Number(keys[keys.length - 1])]
      const transcript = last[0].transcript.toLowerCase()
      for (const [word, module] of Object.entries(COMMANDS)) {
        if (transcript.includes(word)) {
          setActiveModule(module)
          break
        }
      }
    }

    recognition.start()
    return () => recognition.stop()
  }, [voiceEnabled, setActiveModule])
}

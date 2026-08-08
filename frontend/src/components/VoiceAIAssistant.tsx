import React, { useState } from 'react'
import { Bot, Mic, MicOff, Send, X, Sparkles } from 'lucide-react'

export const VoiceAIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [inputQuery, setInputQuery] = useState('')
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: 'Hi Kartik! I am UniSphere AI Assistant. Ask me spoken or typed questions about faculty office hours, campus venues, bus schedules, or event passes!'
    }
  ])

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery
    if (!query.trim()) return

    const newMessages = [...messages, { sender: 'user' as const, text: query }]
    setMessages(newMessages)
    if (!textToSend) setInputQuery('')

    setTimeout(() => {
      let botAnswer = 'I searched UPES Dehradun campus systems.'
      const lower = query.toLowerCase()

      if (lower.includes('hitesh') || lower.includes('chatterjee') || lower.includes('faculty') || lower.includes('office')) {
        botAnswer = 'Dr. Subhrasankar Chatterjee is available in CS Block Room 302 during Office Hours (Tue/Thu 2:00 PM). Dr. Hitesh Kumar Sharma is in CS Block A Auditorium!'
      } else if (lower.includes('event') || lower.includes('hackathon') || lower.includes('today')) {
        botAnswer = 'Today at Bidholi Main Auditorium: UPES ACM Hack-a-Sphere 2026 starts at 09:00 AM! You have 1 registered seat.'
      } else if (lower.includes('bus') || lower.includes('shuttle') || lower.includes('eta')) {
        botAnswer = 'Bidholi Express Shuttle (UK-07-UPES-01) is approaching in 4 minutes at Energy Acres Stop!'
      } else if (lower.includes('pass') || lower.includes('ticket') || lower.includes('qr')) {
        botAnswer = 'Your active Digital Pass Code is PASS-1-100432 for Hack-a-Sphere 2026. Accessible in Academic Record.'
      } else {
        botAnswer = `Found relevant UPES info for "${query}": School of Computer Science & Engineering modules are synced.`
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botAnswer }])
    }, 600)
  }

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. You can type your query below!')
      return
    }

    if (isListening) {
      setIsListening(false)
      return
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      setIsListening(true)

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setIsListening(false)
        handleSend(transcript)
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } catch (e) {
      setIsListening(false)
    }
  }

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-20 h-12 w-12 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-xl shadow-purple-600/30 active:scale-95 transition-all hover:scale-105 z-40 cursor-pointer border border-purple-400/40"
        title="UniSphere Voice & AI Assistant"
      >
        <Bot className="h-6 w-6 text-white animate-bounce" />
      </button>

      {/* Floating Assistant Modal Window */}
      {isOpen && (
        <div className="fixed bottom-22 right-6 z-50 w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-left">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-purple-500/20 rounded-xl text-purple-400 border border-purple-500/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-1">
                  <span>UniSphere AI Voice Assistant</span>
                  <Sparkles className="w-3 h-3 text-purple-400" />
                </h3>
                <p className="text-[10px] text-slate-400">Powered by UPES Heuristics Engine</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Action Prompts */}
          <div className="p-2.5 bg-slate-950/60 border-b border-slate-800 flex gap-1.5 overflow-x-auto text-[10px] scrollbar-none">
            <button
              onClick={() => handleSend('Where is Dr Hitesh Sharma office?')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-purple-900/40 text-purple-300 rounded-lg whitespace-nowrap border border-slate-700 transition"
            >
              📍 Faculty Office
            </button>
            <button
              onClick={() => handleSend('What events are happening today?')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-purple-900/40 text-purple-300 rounded-lg whitespace-nowrap border border-slate-700 transition"
            >
              🗓️ Today Events
            </button>
            <button
              onClick={() => handleSend('Next bus ETA to Kandoli')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-purple-900/40 text-purple-300 rounded-lg whitespace-nowrap border border-slate-700 transition"
            >
              🚌 Shuttle Bus
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="p-4 space-y-3 max-h-72 overflow-y-auto text-xs bg-slate-950/40">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-purple-600 text-white rounded-br-none font-medium'
                      : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2">
            <button
              onClick={toggleListening}
              className={`p-2.5 rounded-xl border transition ${
                isListening
                  ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
                  : 'bg-slate-800 text-purple-400 border-slate-700 hover:bg-slate-700'
              }`}
              title="Voice Microphone Input"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <input
              type="text"
              placeholder={isListening ? 'Listening...' : 'Type campus question...'}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={() => handleSend()}
              className="p-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

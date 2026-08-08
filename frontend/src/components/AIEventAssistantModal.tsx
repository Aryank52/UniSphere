import React, { useState } from 'react'
import { X, Sparkles, Check, Wand2, Lightbulb } from 'lucide-react'

interface AIEventAssistantModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyGeneratedContent: (title: string, description: string, category: string) => void
}

export const AIEventAssistantModal: React.FC<AIEventAssistantModalProps> = ({
  isOpen,
  onClose,
  onApplyGeneratedContent
}) => {
  const [topicPrompt, setTopicPrompt] = useState('')
  const [category, setCategory] = useState('TECH')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTitle, setGeneratedTitle] = useState('')
  const [generatedDesc, setGeneratedDesc] = useState('')

  if (!isOpen) return null

  const handleGenerate = () => {
    if (!topicPrompt.trim()) return
    setIsGenerating(true)

    setTimeout(() => {
      let title = ''
      let desc = ''

      if (category === 'TECH') {
        title = `UniSphere ${topicPrompt.split(' ')[0] || 'Tech'} Nexus 2026: AI & Systems Masterclass`
        desc = `Join us for an immersive hands-on symposium focusing on ${topicPrompt}. Learn cutting-edge industry frameworks, collaborate on live project hackathons, and connect with lead campus researchers. Free refreshments and digital certificates provided.`
      } else if (category === 'SPORTS') {
        title = `UPES ${topicPrompt.split(' ')[0] || 'Sports'} Championship & Athletic Clash`
        desc = `Get ready for high-octane intramural competition in ${topicPrompt}! Open tryouts, professional refereeing, dynamic sports analytics tracking, and cash prizes for winning campus squads.`
      } else if (category === 'CULTURAL') {
        title = `Spandan ${topicPrompt.split(' ')[0] || 'Cultural'} Gala & Musical Extravaganza`
        desc = `Celebrate creativity and diversity at our annual ${topicPrompt} showcase. Featuring live acoustic performances, open mic sessions, digital art galleries, and student food pop-ups!`
      } else {
        title = `Academic Leadership Forum: ${topicPrompt}`
        desc = `An interactive academic panel exploring ${topicPrompt}. Top faculty speakers will breakdown key concepts, research methodology, and career paths in emerging technologies.`
      }

      setGeneratedTitle(title)
      setGeneratedDesc(desc)
      setIsGenerating(false)
    }, 800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI Event Copywriter Assistant</h3>
              <p className="text-xs text-slate-400">Generate high-converting event titles & descriptions instantly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Target Event Category</label>
            <div className="grid grid-cols-4 gap-2">
              {['TECH', 'SPORTS', 'CULTURAL', 'ACADEMIC'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 text-xs font-bold rounded-xl border transition ${
                    category === cat
                      ? 'bg-purple-600 text-white border-purple-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Event Topic or Key Idea</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={topicPrompt}
                onChange={(e) => setTopicPrompt(e.target.value)}
                placeholder="e.g. 24 hour Web3 hackathon or Badminton singles"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !topicPrompt.trim()}
                className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-purple-600/30 transition disabled:opacity-50"
              >
                <Wand2 className="w-4 h-4" />
                <span>{isGenerating ? 'Drafting...' : 'Generate'}</span>
              </button>
            </div>
          </div>

          {/* Generated Result Preview */}
          {generatedTitle && (
            <div className="bg-slate-950 p-4 rounded-2xl border border-purple-500/30 space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 flex items-center space-x-1">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>AI Generated Copy</span>
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500">Title</span>
                <p className="text-sm font-bold text-white mt-0.5">{generatedTitle}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500">Description</span>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{generatedDesc}</p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    onApplyGeneratedContent(generatedTitle, generatedDesc, category)
                    onClose()
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-purple-600/30 transition"
                >
                  <Check className="w-4 h-4" />
                  <span>Apply to Event Form</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-950/50 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

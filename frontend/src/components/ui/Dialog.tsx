import React from 'react'
import { X } from 'lucide-react'

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Content Card */}
      <div className="relative w-full max-w-lg glass rounded-3xl p-6 shadow-2xl border border-white/25 dark:border-slate-800/40 animate-in fade-in zoom-in duration-300 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-all active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  )
}

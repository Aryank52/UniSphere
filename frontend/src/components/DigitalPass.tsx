import React from 'react'
import { Calendar, MapPin, User, Printer, Copy, Check } from 'lucide-react'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { useState } from 'react'
import { Badge } from './ui/Badge'
import type { Event } from '../types'

interface DigitalPassProps {
  event: Event
  studentName: string
  passCode: string
}

export const DigitalPass: React.FC<DigitalPassProps> = ({ event, studentName, passCode }) => {
  const [copied, setCopied] = useState(false)

  // Generate a realistic, unique 15x15 QR pattern based on the passCode string
  const generateQRMatrix = (code: string) => {
    // Generate simple hash from string
    let hash = 0
    for (let i = 0; i < code.length; i++) {
      hash = code.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    const size = 17
    const matrix: boolean[][] = []
    
    for (let r = 0; r < size; r++) {
      matrix[r] = []
      for (let c = 0; c < size; c++) {
        // Corners are static alignment patterns
        const isCorner = 
          (r < 5 && c < 5) || 
          (r < 5 && c >= size - 5) || 
          (r >= size - 5 && c < 5)
        
        if (isCorner) {
          // Alignment outer border and center square
          const innerR = r < 5 ? r : r - (size - 5)
          const innerC = c < 5 ? c : c - (size - 5)
          const isBorder = innerR === 0 || innerR === 4 || innerC === 0 || innerC === 4
          const isCenter = innerR === 2 && innerC === 2
          matrix[r][c] = isBorder || isCenter
        } else {
          // Heuristic bit generator
          const seed = Math.sin(hash + r * 19 + c * 37) * 10000
          matrix[r][c] = (seed - Math.floor(seed)) > 0.45
        }
      }
    }
    return matrix
  }

  const qrMatrix = generateQRMatrix(passCode)
  const cellSize = 12
  const padding = 16
  const svgSize = qrMatrix.length * cellSize + padding * 2

  const handleCopyCode = () => {
    navigator.clipboard.writeText(passCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* Boarding Pass Container */}
      <Card variant="glow" className="relative w-full max-w-sm overflow-hidden bg-gradient-to-br from-[#006680] via-[#00556c] to-cyan-950 text-white border border-cyan-500/20 shadow-2xl p-6 flex flex-col gap-6">
        
        {/* Glow Effects */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Ticket Header */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-cyan-300">BOARDING PASS</span>
            <h5 className="font-extrabold text-md tracking-tight text-white truncate max-w-[200px]">
              {event?.title}
            </h5>
          </div>
          <Badge variant="info" className="font-extrabold text-[9px] bg-cyan-400/20 text-cyan-200 border-cyan-400/30">
            {event?.category}
          </Badge>
        </div>

        {/* Ticket Body details */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] text-cyan-200 font-semibold uppercase">Attendee</span>
            <div className="flex items-center gap-1.5 font-bold text-white">
              <User className="h-3.5 w-3.5 text-cyan-300" />
              <span className="truncate">{studentName}</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-cyan-200 font-semibold uppercase">Location</span>
            <div className="flex items-center gap-1.5 font-bold text-white">
              <MapPin className="h-3.5 w-3.5 text-cyan-300" />
              <span className="truncate">{event?.location}</span>
            </div>
          </div>
          <div className="space-y-1 col-span-2">
            <span className="text-[10px] text-cyan-200 font-semibold uppercase">Date & Time</span>
            <div className="flex items-center gap-1.5 font-bold text-white">
              <Calendar className="h-3.5 w-3.5 text-cyan-300" />
              <span>{event?.date} — {event?.time}</span>
            </div>
          </div>
        </div>

        {/* Dashed separator */}
        <div className="relative border-t-2 border-dashed border-white/10 my-1">
          <div className="absolute -left-[30px] -top-3 w-6 h-6 rounded-full bg-background dark:bg-background border-r border-cyan-500/20" />
          <div className="absolute -right-[30px] -top-3 w-6 h-6 rounded-full bg-background dark:bg-background border-l border-cyan-500/20" />
        </div>

        {/* QR Section */}
        <div className="flex flex-col items-center gap-3">
          <div className="bg-white p-4 rounded-2xl shadow-inner border border-white/20 select-none">
            {/* SVG Rendered QR Code */}
            <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`} className="w-40 h-40">
              <rect width="100%" height="100%" fill="white" />
              {qrMatrix.map((row, r) => 
                row.map((val, c) => 
                  val ? (
                    <rect
                      key={`${r}-${c}`}
                      x={padding + c * cellSize}
                      y={padding + r * cellSize}
                      width={cellSize}
                      height={cellSize}
                      fill="#00556c" // Deep Teal/Cyan
                      rx={2}
                    />
                  ) : null
                )
              )}
            </svg>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-cyan-200 font-semibold tracking-wide uppercase">Digital Pass Code</p>
            <p className="text-sm font-extrabold font-mono tracking-wider text-cyan-300">{passCode}</p>
          </div>
        </div>
      </Card>

      {/* Action Controls */}
      <div className="flex gap-2 w-full max-w-sm justify-center">
        <Button variant="glass" size="sm" onClick={handleCopyCode} className="flex-1 flex gap-1.5 items-center">
          {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied' : 'Copy Code'}
        </Button>
        <Button variant="glass" size="sm" onClick={handlePrint} className="flex-1 flex gap-1.5 items-center">
          <Printer className="h-4 w-4" />
          Print Pass
        </Button>
      </div>
    </div>
  )
}

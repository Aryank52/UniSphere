import React, { useState } from 'react'
import { 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Award,
  BookOpen, 
  AlertCircle, 
  CheckSquare, 
  CalendarDays, 
  Plus
} from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Dialog } from '../components/ui/Dialog'
import { useEvents, useMyRegistrations, useAIRecommendations, useRegisterForEvent } from '../hooks/useApi'
import { EventCard } from '../components/EventCard'
import { useAuthStore } from '../store/authStore'
import { DigitalPass } from '../components/DigitalPass'
import type { Event } from '../types'

interface RecommendationItem {
  event: Event
  score: number
  recommendationReason: string
}

export const StudentDashboard: React.FC = () => {
  const { user } = useAuthStore()
  const { data: events = [] } = useEvents()
  const { data: registrations = [] } = useMyRegistrations()
  const { data: recommendations = [] } = useAIRecommendations()
  const registerMutation = useRegisterForEvent()

  // Selected recommendation detail for match analyzer modal
  const [recommendationDetail, setRecommendationDetail] = useState<{ event: Event; score: number; reason: string } | null>(null)
  const [selectedPass, setSelectedPass] = useState<{ event: Event; passCode: string } | null>(null)
  
  // Active Featured Events Category filter
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'ACADEMIC' | 'SOCIAL' | 'SPORTS'>('ALL')

  const handleRegister = (eventId: number) => {
    registerMutation.mutate(eventId)
  }

  // Filtered upcoming events based on chosen category
  const filteredEvents = events.filter((event: Event) => {
    // Filter out already registered events
    if (registrations.some((r: Event) => r.id === event.id)) return false
    if (categoryFilter === 'ALL') return true
    return event.category?.toUpperCase() === categoryFilter
  })

  return (
    <div className="space-y-10 animate-in fade-in duration-500 font-sans select-none pb-16 relative">
      
      {/* Top Section: Welcome message & Credits Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Welcome message */}
        <div className="lg:col-span-8 bg-[#0b0e17] border border-slate-900 rounded-3xl p-8 flex flex-col justify-center">
          <h1 className="text-3xl font-black text-white tracking-tight mb-3">
            Welcome back, Alex!
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
            Your research paper on Quantum Computing was cited twice this week. You're 12 credits away from your Honors thesis.
          </p>
        </div>

        {/* Progress Stats Cards */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Card 1: Credits Earned */}
          <div className="bg-[#0b0e17] border border-slate-900 rounded-2xl p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-violet-600/10 flex items-center justify-center text-violet-400 shrink-0">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <span>Credits Earned</span>
                <span className="text-white">108 / 120</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-violet-500 rounded-full" style={{ width: '90%' }} />
              </div>
            </div>
          </div>

          {/* Card 2: Student Points XP */}
          <div className="bg-[#0b0e17] border border-slate-900 rounded-2xl p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-600/10 flex items-center justify-center text-emerald-400 shrink-0">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Student Points</div>
              <h3 className="text-lg font-black text-emerald-400 mt-0.5">2,450 XP</h3>
              <p className="text-[9px] text-emerald-500 font-bold mt-0.5">+150 since Monday</p>
            </div>
          </div>

        </div>

      </div>

      {/* Row 2: AI Recommendations & Ticket Wallet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* AI Match Recommendations (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
              AI Match Recommendations
            </h3>
            {/* Scroll indicators */}
            <div className="flex gap-2">
              <button onClick={() => alert("Previous recommendations...")} className="p-1.5 rounded-xl border border-slate-800 bg-[#0d111d] text-slate-400 hover:text-white transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => alert("Next recommendations...")} className="p-1.5 rounded-xl border border-slate-800 bg-[#0d111d] text-slate-400 hover:text-white transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Scroller Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {recommendations.length > 0 ? (
              recommendations.slice(0, 2).map((rec: RecommendationItem) => (
                <div 
                  key={rec.event.id}
                  className="bg-[#0b0e17] border border-slate-900 hover:border-slate-800 rounded-3xl overflow-hidden flex flex-col p-5 justify-between relative group cursor-pointer transition-all duration-300 min-h-[260px]"
                  onClick={() => setRecommendationDetail({ event: rec.event, score: rec.score, reason: rec.recommendationReason })}
                >
                  <div>
                    {/* Badge Match Rate Overlay */}
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Interactive Match</span>
                      <Badge variant="purple" className="px-2 py-0.5 font-extrabold text-[9px] uppercase">
                        {(rec.score * 100).toFixed(0)}% Match
                      </Badge>
                    </div>

                    <h4 className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors line-clamp-1 mb-2">
                      {rec.event.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {rec.event.description}
                    </p>
                  </div>

                  {/* Actions & Attendees list */}
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-900/60">
                    <div className="flex items-center -space-x-2">
                      <div className="h-6 w-6 rounded-full bg-indigo-600 border border-slate-900 flex items-center justify-center text-[8px] font-black text-white">CS</div>
                      <div className="h-6 w-6 rounded-full bg-violet-600 border border-slate-900 flex items-center justify-center text-[8px] font-black text-white font-sans">AI</div>
                      <div className="h-6 w-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[8px] text-slate-500 font-bold">+4</div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleRegister(rec.event.id); }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
                    >
                      Join Now
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <Card className="col-span-2 p-8 text-center text-slate-500 border-dashed bg-card/40">
                No AI recommendation matches calculated yet.
              </Card>
            )}

          </div>

        </div>

        {/* Ticket Wallet (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="font-extrabold text-base tracking-tight text-white">
            Ticket Wallet
          </h3>

          <div className="bg-[#0b0e17] border border-slate-900 rounded-3xl p-5 space-y-4">
            
            {/* Wallet passes list */}
            {registrations.length > 0 ? (
              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 scrollbar-none">
                {registrations.map((event: Event) => (
                  <div 
                    key={event.id}
                    onClick={() => setSelectedPass({
                      event,
                      passCode: event.passCode || `PASS-${event.id}-${100000 + event.id * 73}`
                    })}
                    className="bg-[#121624]/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between cursor-pointer hover:border-indigo-500/50 hover:bg-[#121624]/90 transition-all duration-200 active:scale-[0.98] group select-none"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">
                          {event.category || 'EVENT'} PASS
                        </span>
                        <h4 className="font-black text-xs text-white leading-snug mt-0.5">{event.title}</h4>
                      </div>
                      {/* Mock QR Code Badge */}
                      <div className="h-6 w-6 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded flex items-center justify-center group-hover:bg-indigo-500/20 transition-all">
                        <Sparkles className="h-3.5 w-3.5" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold border-t border-slate-900/60 pt-3 mt-1">
                      <span>Seat G-{10 + event.id}</span>
                      <span className="text-[9px] text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">View Pass →</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#121624]/30 border border-slate-800/60 border-dashed rounded-2xl p-6 text-center text-xs text-slate-500">
                No active boarding passes. Register for events to unlock passes.
              </div>
            )}

            {/* Import Button */}
            <button
              onClick={() => alert("Import Ticket scanner modal opened.")}
              className="w-full py-4 border border-dashed border-slate-800 hover:border-slate-700 bg-slate-900/20 hover:bg-slate-900/40 text-slate-400 hover:text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Import External Ticket</span>
            </button>

          </div>
        </div>

      </div>

      {/* Row 3: Featured Events & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Featured Events (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <h3 className="font-extrabold text-base tracking-tight text-white">
              Featured Events
            </h3>
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-1.5 bg-[#0b0e17] border border-slate-900 rounded-xl p-1 max-w-max">
              {(['ALL', 'ACADEMIC', 'SOCIAL', 'SPORTS'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                    categoryFilter === cat 
                      ? 'bg-slate-900 text-indigo-400 border border-slate-800/80 shadow-md' 
                      : 'text-slate-500 hover:text-white'
                  }`}
                >
                  {cat === 'ALL' ? 'All' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.slice(0, 4).map((event: Event) => (
              <EventCard
                key={event.id}
                event={event}
                actionLabel="Register Seat"
                onAction={() => handleRegister(event.id)}
              />
            ))}
            {filteredEvents.length === 0 && (
              <Card className="col-span-2 p-10 text-center text-slate-500 border-dashed bg-card/40">
                No events found matching this filter category.
              </Card>
            )}
          </div>

        </div>

        {/* Upcoming Deadlines (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="font-extrabold text-base tracking-tight text-white">
            Upcoming Deadlines
          </h3>

          <div className="bg-[#0b0e17] border border-slate-900 rounded-3xl p-5 space-y-4 flex flex-col justify-between min-h-[300px]">
            
            <div className="space-y-4">
              
              {/* Item 1 */}
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[9px] font-bold text-rose-400 uppercase tracking-widest">Tomorrow</div>
                  <h4 className="font-bold text-xs text-white mt-0.5">Linear Algebra Problem Set #8</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Due by 11:59 PM • Canvas</p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                  <CheckSquare className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">In 3 Days</div>
                  <h4 className="font-bold text-xs text-white mt-0.5">Neuroscience Lab Report</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Submit to Dr. Arisaka's portal</p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 shrink-0 mt-0.5">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[9px] font-bold text-violet-400 uppercase tracking-widest">Next Week</div>
                  <h4 className="font-bold text-xs text-white mt-0.5">Ethics in AI: Group Draft</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Check Notion for team updates</p>
                </div>
              </div>

            </div>

            {/* Footer Calendar Link */}
            <button
              onClick={() => alert("Redirecting to full student academic calendar...")}
              className="w-full mt-6 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs py-3 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <span>View Full Calendar</span>
            </button>

          </div>
        </div>

      </div>

      {/* Floating Sparkle Action button (bottom right) */}
      <button 
        onClick={() => alert("UniSphere AI Sparkle helper opened.")}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 active:scale-[0.95] transition-all hover:scale-105 z-40 cursor-pointer"
        title="AI Assistant Helper"
      >
        <Sparkles className="h-5 w-5 text-white animate-pulse" />
      </button>

      {/* AI Recommendation Details Modal */}
      <Dialog
        isOpen={!!recommendationDetail}
        onClose={() => setRecommendationDetail(null)}
        title="AI Match Analysis"
      >
        {recommendationDetail && (
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-start gap-4">
              <h4 className="font-extrabold text-base text-foreground">{recommendationDetail.event.title}</h4>
              <Badge variant="purple" className="shrink-0 font-extrabold text-[10px]">
                {(recommendationDetail.score * 100).toFixed(0)}% Match
              </Badge>
            </div>
            <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-400 font-semibold flex items-start gap-2">
              <Sparkles className="h-4 w-4 shrink-0 text-violet-400" />
              <div>
                <p className="font-bold text-foreground">AI Match Rationale:</p>
                <p className="text-muted-foreground mt-0.5">{recommendationDetail.reason}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{recommendationDetail.event.description}</p>
            <div className="space-y-1.5 text-xs text-muted-foreground pt-2 border-t border-border/40">
              <p>🗓️ <strong>Schedule:</strong> {recommendationDetail.event.date} at {recommendationDetail.event.time}</p>
              <p>📍 <strong>Location:</strong> {recommendationDetail.event.location}</p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setRecommendationDetail(null)}>
                Close
              </Button>
              <Button 
                variant="primary" 
                className="flex-1" 
                onClick={() => {
                  handleRegister(recommendationDetail.event.id)
                  setRecommendationDetail(null)
                }}
              >
                Register Seat
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      {/* Digital Pass Ticket Dialog */}
      <Dialog
        isOpen={!!selectedPass}
        onClose={() => setSelectedPass(null)}
        title="Event Boarding Ticket"
      >
        {selectedPass && (
          <DigitalPass
            event={selectedPass.event}
            studentName={user?.name || 'Student Name'}
            passCode={selectedPass.passCode}
          />
        )}
      </Dialog>

    </div>
  )
}

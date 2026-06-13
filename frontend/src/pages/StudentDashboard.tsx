import React, { useState } from 'react'
import { 
  Sparkles, 
  MoreVertical,
  ChevronRight,
  ExternalLink,
  Zap
} from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Dialog } from '../components/ui/Dialog'
import { useAuthStore } from '../store/authStore'
import { useAIRecommendations, useMyRegistrations, useRegisterForEvent } from '../hooks/useApi'

export const StudentDashboard: React.FC = () => {
  const { user } = useAuthStore()

  const { data: recommendations = [], isLoading: isAIRecommendationsLoading } = useAIRecommendations()
  const { data: registrations = [] } = useMyRegistrations()
  const registerMutation = useRegisterForEvent()

  // Selected mock card states
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalMessage, setModalMessage] = useState('')

  const handleActionClick = (title: string, msg: string) => {
    setModalTitle(title)
    setModalMessage(msg)
    setModalOpen(true)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans select-none pb-12">
      
      {/* Top Welcome Title Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white border border-sky-100 rounded-3xl p-6 md:p-8 shadow-travel">
        <div className="text-left">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Welcome back, {user?.name.split(' ')[0] || 'Alex'}!
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 font-bold">
            You have 4 critical itinerary deadlines this week and 2 new club matches.
          </p>
        </div>
        <div className="shrink-0 flex justify-start">
          <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-50 border border-sky-100 rounded-2xl text-xs font-bold text-sky-600 shadow-sm hover:bg-sky-100/60 transition-colors">
            <Zap className="h-4.5 w-4.5 text-sky-500 fill-sky-200" />
            <span>Semester Streak: 42 Days</span>
          </div>
        </div>
      </div>

      {/* Main Grid Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Credits & Skill Metrics (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: Academic Credits */}
          <div className="bg-white border border-sky-100 rounded-3xl p-6 shadow-travel flex flex-col justify-between min-h-[180px] text-left">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Academic Credits</span>
                  <h3 className="text-3xl font-black text-slate-800 mt-2">112 / 120</h3>
                </div>
                {/* Circular progress SVG */}
                <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
                  <svg className="w-14 h-14 transform -rotate-90">
                    <circle cx="28" cy="28" r="24" stroke="#f1f5f9" strokeWidth="4" fill="transparent" />
                    <circle 
                      cx="28" 
                      cy="28" 
                      r="24" 
                      stroke="#0ea5e9" 
                      strokeWidth="4" 
                      fill="transparent" 
                      strokeDasharray={150.8} 
                      strokeDashoffset={150.8 * (1 - 0.93)} 
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-[11px] font-black text-slate-800">93%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full transition-all duration-500" style={{ width: '93%' }} />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold mt-4 border-t border-slate-100 pt-3">
              8 credits remaining for graduation eligibility.
            </p>
          </div>

          {/* Card 2: Tech Skills Mastery */}
          <div className="bg-white border border-sky-100 rounded-3xl p-6 shadow-travel space-y-4 text-left">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Tech Skills Mastery</span>
            
            <div className="space-y-4">
              {/* Skill 1 */}
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-650 mb-1.5">
                  <span>Full-Stack Development</span>
                  <span className="text-slate-850 font-black">85%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500" style={{ width: '85%' }} />
                </div>
              </div>

              {/* Skill 2 */}
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-650 mb-1.5">
                  <span>UI/UX Architecture</span>
                  <span className="text-slate-850 font-black">70%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-400" style={{ width: '70%' }} />
                </div>
              </div>

              {/* Skill 3 */}
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-650 mb-1.5">
                  <span>Cloud Infrastructure</span>
                  <span className="text-slate-850 font-black">55%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500" style={{ width: '55%' }} />
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleActionClick("Tech Skills Matrix", "Viewing the expanded skills roadmap matrix including Java Spring Boot and React specifications.")}
              className="text-sky-600 hover:text-sky-700 text-[11px] font-extrabold flex items-center gap-1.5 mt-2 transition-colors cursor-pointer hover:underline"
            >
              <span>View Skill Matrix</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>

        {/* Middle Column: Critical Deadlines Checklist (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-sky-100 rounded-3xl p-6 shadow-travel flex flex-col justify-between min-h-[380px] text-left">
          
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-sm text-slate-800">Critical Deadlines</h3>
              <Badge variant="warning" className="px-1.5 py-0.5 font-bold text-[8px] uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-100">
                Action Required
              </Badge>
            </div>

            {/* Checklist timeline */}
            <div className="space-y-2">
              
              {/* Item 1 */}
              <div className="flex items-center justify-between p-3 bg-slate-50/50 hover:bg-sky-50/30 border border-slate-100 rounded-2xl gap-3 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-2 w-2 rounded-full bg-orange-500 shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono text-slate-400 font-bold uppercase shrink-0">CS-402</span>
                      <h4 className="font-extrabold text-xs text-slate-700 truncate">Campus AI Assistant Project</h4>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Due Oct 24 • 11:59 PM</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600 shrink-0 p-1">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>

              {/* Item 2 */}
              <div className="flex items-center justify-between p-3 bg-slate-50/50 hover:bg-sky-50/30 border border-slate-100 rounded-2xl gap-3 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-2 w-2 rounded-full bg-sky-500 shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono text-slate-400 font-bold uppercase shrink-0">ADM-09</span>
                      <h4 className="font-extrabold text-xs text-slate-700 truncate">Fall Semester Registration</h4>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Due Oct 26 • Mandatory</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600 shrink-0 p-1">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>

              {/* Item 3 */}
              <div className="flex items-center justify-between p-3 bg-slate-50/50 hover:bg-sky-50/30 border border-slate-100 rounded-2xl gap-3 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-2 w-2 rounded-full bg-slate-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono text-slate-400 font-bold uppercase shrink-0">FIN-22</span>
                      <h4 className="font-extrabold text-xs text-slate-700 truncate">Scholarship Renewal Form B</h4>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Due Oct 30 • Financial Aid</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600 shrink-0 p-1">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>

            </div>
          </div>

          <button 
            onClick={() => handleActionClick("Calendar Sync", "Google Calendar synchronization completed. All 4 academic deadlines have been pushed to your primary calendar.")}
            className="w-full mt-6 bg-sky-50 border border-sky-200 hover:bg-sky-100 text-sky-600 font-bold text-xs py-3 rounded-2xl transition-all text-center cursor-pointer shadow-sm"
          >
            Synchronize with Google Calendar
          </button>

        </div>

        {/* Right Column: Campus Timeline Feed (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-sky-100 rounded-3xl p-6 shadow-travel min-h-[380px] flex flex-col justify-between text-left">
          <div>
            <h3 className="font-extrabold text-sm text-slate-800 mb-6">Campus Feed</h3>
            
            {/* Timeline wrapper */}
            <div className="relative border-l border-slate-100 pl-6 space-y-6 ml-2 text-xs">
              
              {/* Item 1 */}
              <div className="relative">
                {/* Dot */}
                <div className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full bg-sky-500 ring-4 ring-sky-50" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">2 hours ago</span>
                <p className="text-slate-600 font-semibold leading-relaxed mt-1">
                  Research Lab "NeuralNet" just published a new opening for Junior Researchers.
                </p>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); handleActionClick("Research Lab Application", "Redirecting to application portal for Junior Researcher position at NeuralNet Lab."); }}
                  className="inline-flex items-center gap-1 text-sky-600 font-extrabold mt-1.5 hover:underline"
                >
                  <span>Learn More</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* Item 2 */}
              <div className="relative">
                {/* Dot */}
                <div className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full bg-slate-300 ring-4 ring-slate-100" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">5 hours ago</span>
                <p className="text-slate-500 font-medium leading-relaxed mt-1">
                  New guest lecture: "Ethical AI in Modern Academia" scheduled for Friday.
                </p>
              </div>

              {/* Item 3 */}
              <div className="relative">
                {/* Dot */}
                <div className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full bg-slate-300 ring-4 ring-slate-100" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Yesterday</span>
                <p className="text-slate-500 font-medium leading-relaxed mt-1">
                  Your paper "Edge Computing in IoT" was cited by 3 new researchers.
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Row 3: Smart Match Recommendation Grid */}
      <div className="space-y-4 pt-4 text-left">
        
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Smart Match recommendations</h2>
            <p className="text-xs text-slate-500 font-bold mt-1">Curated for your profile and career path.</p>
          </div>
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); handleActionClick("Explore Chapters", "Redirecting to explore portal containing 14 active campus clubs."); }}
            className="text-sky-600 hover:text-sky-700 text-xs font-bold hover:underline cursor-pointer"
          >
            Explore More
          </a>
        </div>

        {/* Matches cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isAIRecommendationsLoading ? (
            <div className="col-span-3 text-center py-12 text-slate-400 font-bold">
              Calculating profile similarities...
            </div>
          ) : recommendations.length === 0 ? (
            <div className="col-span-3 text-center py-12 text-slate-450 border border-dashed border-slate-200 bg-white rounded-3xl shadow-travel">
              No matching events found for your interests yet.
            </div>
          ) : (
            recommendations.slice(0, 3).map((rec: any) => {
              const event = rec.event
              const matchPercent = Math.round(rec.score * 100)
              const isRegistered = registrations.some((r: any) => r.id === event.id)
              
              return (
                <div key={rec.id} className="bg-white border border-sky-100 rounded-3xl overflow-hidden shadow-travel flex flex-col justify-between min-h-[340px] hover:border-sky-300 transition-colors">
                  <div className="relative h-40 overflow-hidden bg-slate-105">
                    <img 
                      src={event.bannerImage || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500"} 
                      alt={event.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    {/* Match Badge */}
                    <span className="absolute top-4 right-4 bg-sky-50 border border-sky-105 text-sky-600 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg shadow-sm">
                      {matchPercent}% Match
                    </span>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col justify-between text-left">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                        {event.category} • {event.location}
                      </span>
                      <h4 className="font-extrabold text-base text-slate-800 mt-1 line-clamp-2">{event.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-2 font-semibold leading-relaxed">
                        {rec.recommendationReason}
                      </p>
                    </div>

                    <button 
                      onClick={() => {
                        if (isRegistered) {
                          handleActionClick("Boarding Pass", `You are registered! Head to 'Academic Record' in the sidebar or 'Explore Events' to grab your Boarding ticket pass.`)
                        } else {
                          registerMutation.mutate(event.id, {
                            onSuccess: () => {
                              handleActionClick("Registration Complete", `Successfully registered for "${event.title}"! Your seat has been reserved and your ticket boarding pass is now in your wallet.`)
                            }
                          })
                        }
                      }}
                      disabled={registerMutation.isPending}
                      className={`w-full mt-6 font-extrabold text-xs py-3 rounded-2xl transition-all text-center cursor-pointer shadow-sm active:scale-[0.98] ${
                        isRegistered 
                          ? 'bg-sky-50 border border-sky-205 text-sky-600 hover:bg-sky-100'
                          : 'bg-sky-500 hover:bg-sky-600 text-white'
                      }`}
                    >
                      {registerMutation.isPending ? 'Processing...' : isRegistered ? 'View Boarding Pass' : 'Register Seat'}
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

      </div>

      {/* Campus Support Action helper */}
      <div className="flex justify-end pt-4">
        <button 
          onClick={() => handleActionClick("UniSphere Sparkle AI", "UniSphere Sparkle assistant ready to compute student timelines or compile event stats.")}
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center shadow-lg shadow-sky-200 active:scale-[0.95] transition-all hover:scale-105 z-40 cursor-pointer"
          title="AI Assistant Helper"
        >
          <Sparkles className="h-5 w-5 text-white animate-pulse" />
        </button>
      </div>

      {/* Global Student Dashboard Footer */}
      <footer className="border-t border-sky-100 mt-12 pt-8 pb-4 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-sm text-slate-700 mr-2">UniSphere</span>
          <span>&copy; 2026 UniSphere Systems Inc. All rights reserved.</span>
        </div>
        <div className="flex gap-6 font-semibold">
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-sky-500 transition-colors">Privacy Policy</a>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-sky-500 transition-colors">Terms of Service</a>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-sky-500 transition-colors">Contact Support</a>
        </div>
      </footer>

      {/* Dialogue Notification Modal */}
      <Dialog
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
      >
        <div className="space-y-4 text-sm text-slate-655 text-left bg-white">
          <p className="leading-relaxed">{modalMessage}</p>
          <div className="flex justify-end pt-2">
            <Button variant="primary" className="bg-sky-500 hover:bg-sky-600 text-white font-extrabold px-6" onClick={() => setModalOpen(false)}>
              Okay, Got It
            </Button>
          </div>
        </div>
      </Dialog>

    </div>
  )
}

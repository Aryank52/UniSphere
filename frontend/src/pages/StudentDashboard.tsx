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

export const StudentDashboard: React.FC = () => {
  const { user } = useAuthStore()

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
    <div className="space-y-8 animate-in fade-in duration-500 font-sans select-none pb-12 bg-slate-50/50">
      
      {/* Top Welcome Title Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, {user?.name.split(' ')[0] || 'Alex'}!
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">
            You have 4 critical deadlines this week and 2 new club matches.
          </p>
        </div>
        <div className="shrink-0">
          <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 shadow-sm hover:bg-slate-50 transition-colors">
            <Zap className="h-4.5 w-4.5 text-[#006680] fill-[#006680]/20" />
            <span>Semester Streak: 42 Days</span>
          </div>
        </div>
      </div>

      {/* Main Grid Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Credits & Skill Metrics (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: Academic Credits */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[180px]">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Academic Credits</span>
                  <h3 className="text-3xl font-black text-slate-900 mt-2">112 / 120</h3>
                </div>
                {/* Circular progress SVG */}
                <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
                  <svg className="w-14 h-14 transform -rotate-90">
                    <circle cx="28" cy="28" r="24" stroke="#f1f5f9" strokeWidth="4.5" fill="transparent" />
                    <circle 
                      cx="28" 
                      cy="28" 
                      r="24" 
                      stroke="#006680" 
                      strokeWidth="4.5" 
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
              <div className="h-2 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-[#006680] rounded-full transition-all duration-500" style={{ width: '93%' }} />
              </div>
            </div>
            <p className="text-[10px] text-slate-500 font-bold mt-4 border-t border-slate-100 pt-3">
              8 credits remaining for graduation eligibility.
            </p>
          </div>

          {/* Card 2: Tech Skills Mastery */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Tech Skills Mastery</span>
            
            <div className="space-y-4">
              {/* Skill 1 */}
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1.5">
                  <span>Full-Stack Development</span>
                  <span className="text-slate-900 font-black">85%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#006680] rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              {/* Skill 2 */}
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1.5">
                  <span>UI/UX Architecture</span>
                  <span className="text-slate-900 font-black">70%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#006680] rounded-full" style={{ width: '70%' }} />
                </div>
              </div>

              {/* Skill 3 */}
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1.5">
                  <span>Cloud Infrastructure</span>
                  <span className="text-slate-900 font-black">55%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#006680] rounded-full" style={{ width: '55%' }} />
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleActionClick("Tech Skills Matrix", "Viewing the expanded skills roadmap matrix including Java Spring Boot and React specifications.")}
              className="text-[#006680] hover:text-[#00556c] text-[11px] font-extrabold flex items-center gap-1.5 mt-2 transition-colors cursor-pointer hover:underline"
            >
              <span>View Skill Matrix</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>

        {/* Middle Column: Critical Deadlines Checklist (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[380px]">
          
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-sm text-slate-950">Critical Deadlines</h3>
              <Badge variant="warning" className="px-1.5 py-0.5 font-bold text-[9px] uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100">
                Action Required
              </Badge>
            </div>

            {/* Timeline checklist */}
            <div className="space-y-4">
              
              {/* Item 1 */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl gap-3 transition-colors border-l-4 border-l-rose-500 pl-3">
                <div className="flex items-center gap-3">
                  <div className="text-center bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shrink-0">
                    <span className="text-[8px] font-black text-slate-400 uppercase block leading-none">OCT</span>
                    <span className="text-sm font-black text-slate-800 block leading-none mt-1">24</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 line-clamp-1">Project: Campus AI Assistant</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">CS402 Senior Design Project • 11:59 PM</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-700 shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>

              {/* Item 2 */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl gap-3 transition-colors border-l-4 border-l-sky-500 pl-3">
                <div className="flex items-center gap-3">
                  <div className="text-center bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shrink-0">
                    <span className="text-[8px] font-black text-slate-400 uppercase block leading-none">OCT</span>
                    <span className="text-sm font-black text-slate-800 block leading-none mt-1">26</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 line-clamp-1">Exam Registration: Fall 2024</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Global Academic Portal • Mandatory</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-700 shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>

              {/* Item 3 */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl gap-3 transition-colors border-l-4 border-l-slate-400 pl-3">
                <div className="flex items-center gap-3">
                  <div className="text-center bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shrink-0">
                    <span className="text-[8px] font-black text-slate-400 uppercase block leading-none">OCT</span>
                    <span className="text-sm font-black text-slate-800 block leading-none mt-1">30</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 line-clamp-1">Scholarship Renewal Deadline</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Financial Aid Office • Form B-122</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-700 shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>

            </div>
          </div>

          <button 
            onClick={() => handleActionClick("Calendar Sync", "Google Calendar synchronization completed. All 4 academic deadlines have been pushed to your primary calendar.")}
            className="w-full mt-6 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-3 rounded-2xl transition-all text-center cursor-pointer shadow-sm"
          >
            Synchronize with Google Calendar
          </button>

        </div>

        {/* Right Column: Campus Timeline Feed (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm min-h-[380px] flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-slate-950 mb-6">Campus Feed</h3>
            
            {/* Timeline wrapper */}
            <div className="relative border-l border-slate-100 pl-6 space-y-6 ml-2 text-xs">
              
              {/* Item 1 */}
              <div className="relative">
                {/* Dot */}
                <div className="absolute -left-[30px] top-1.5 h-3 w-3 rounded-full bg-[#006680] ring-4 ring-[#e6f2f5]" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">2 hours ago</span>
                <p className="text-slate-600 font-medium leading-relaxed mt-1">
                  Research Lab "NeuralNet" just published a new opening for Junior Researchers.
                </p>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); handleActionClick("Research Lab Application", "Redirecting to application portal for Junior Researcher position at NeuralNet Lab."); }}
                  className="inline-flex items-center gap-1 text-[#006680] font-extrabold mt-1.5 hover:underline"
                >
                  <span>Learn More</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* Item 2 */}
              <div className="relative">
                {/* Dot */}
                <div className="absolute -left-[30px] top-1.5 h-3 w-3 rounded-full bg-slate-300 ring-4 ring-slate-100" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">5 hours ago</span>
                <p className="text-slate-600 font-medium leading-relaxed mt-1">
                  New guest lecture: "Ethical AI in Modern Academia" scheduled for Friday.
                </p>
              </div>

              {/* Item 3 */}
              <div className="relative">
                {/* Dot */}
                <div className="absolute -left-[30px] top-1.5 h-3 w-3 rounded-full bg-slate-300 ring-4 ring-slate-100" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Yesterday</span>
                <p className="text-slate-600 font-medium leading-relaxed mt-1">
                  Your paper "Edge Computing in IoT" was cited by 3 new researchers.
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Row 3: Smart Match Recommendation Grid */}
      <div className="space-y-4 pt-4">
        
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Smart Match</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">Curated for your profile and career path.</p>
          </div>
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); handleActionClick("Explore Chapters", "Redirecting to explore portal containing 14 active campus clubs."); }}
            className="text-[#006680] hover:text-[#00556c] text-xs font-bold hover:underline cursor-pointer"
          >
            Explore More
          </a>
        </div>

        {/* Matches cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between min-h-[340px]">
            <div className="relative h-40 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500" 
                alt="AI & Robotics Society" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              {/* Badge */}
              <span className="absolute top-4 right-4 bg-[#e6f2f5] text-[#006680] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                98% Match
              </span>
            </div>
            
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Active Research Group • 140 Members</span>
                <h4 className="font-extrabold text-base text-slate-900 mt-1">AI & Robotics Society</h4>
                {/* tags */}
                <div className="flex gap-1.5 mt-3">
                  <Badge variant="default" className="px-2 py-0.5 text-[9px] font-bold border-slate-200 bg-slate-50 text-slate-600 rounded-lg">Engineering</Badge>
                  <Badge variant="default" className="px-2 py-0.5 text-[9px] font-bold border-slate-200 bg-slate-50 text-slate-600 rounded-lg">Python</Badge>
                </div>
              </div>

              <button 
                onClick={() => handleActionClick("Club Proposal Request", "Join request for AI & Robotics Society sent. The student board will notify you shortly.")}
                className="w-full mt-6 bg-[#006680] hover:bg-[#00556c] text-white font-extrabold text-xs py-3 rounded-2xl transition-all text-center cursor-pointer shadow-sm active:scale-[0.98]"
              >
                Request to Join
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between min-h-[340px]">
            <div className="relative h-40 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500" 
                alt="Human-Computer Lab" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              {/* Badge */}
              <span className="absolute top-4 right-4 bg-[#e6f2f5] text-[#006680] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                85% Match
              </span>
            </div>
            
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Faculty Research • Paid Fellowship</span>
                <h4 className="font-extrabold text-base text-slate-900 mt-1">Human-Computer Lab</h4>
                {/* tags */}
                <div className="flex gap-1.5 mt-3">
                  <Badge variant="default" className="px-2 py-0.5 text-[9px] font-bold border-slate-200 bg-slate-50 text-slate-600 rounded-lg">UX Design</Badge>
                  <Badge variant="default" className="px-2 py-0.5 text-[9px] font-bold border-slate-200 bg-slate-50 text-slate-600 rounded-lg">Cognitive Sci</Badge>
                </div>
              </div>

              <button 
                onClick={() => handleActionClick("Research Lab Fellowship Application", "Application form for Paid Fellowship position at Human-Computer Lab has been submitted to Dr. Sarah Jenkins.")}
                className="w-full mt-6 bg-[#006680] hover:bg-[#00556c] text-white font-extrabold text-xs py-3 rounded-2xl transition-all text-center cursor-pointer shadow-sm active:scale-[0.98]"
              >
                Apply for Fellowship
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between min-h-[340px]">
            <div className="relative h-40 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=500" 
                alt="Campus Startup Weekend" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              {/* Badge */}
              <span className="absolute top-4 right-4 bg-sky-50 text-sky-600 border border-sky-100 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                Trending
              </span>
            </div>
            
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Oct 28 - 30 • Business Center</span>
                <h4 className="font-extrabold text-base text-slate-900 mt-1">Campus Startup Weekend</h4>
                {/* tags */}
                <div className="flex gap-1.5 mt-3">
                  <Badge variant="default" className="px-2 py-0.5 text-[9px] font-bold border-slate-200 bg-slate-50 text-slate-600 rounded-lg">Entrepreneurship</Badge>
                  <Badge variant="default" className="px-2 py-0.5 text-[9px] font-bold border-slate-200 bg-slate-50 text-slate-600 rounded-lg">Prizes</Badge>
                </div>
              </div>

              <button 
                onClick={() => handleActionClick("Registration Complete", "Seat registered successfully for Campus Startup Weekend! Check your Academic Record tab in the sidebar to download your Ticket Boarding Pass.")}
                className="w-full mt-6 bg-white border border-[#006680] hover:bg-[#e6f2f5]/30 text-[#006680] font-extrabold text-xs py-3 rounded-2xl transition-all text-center cursor-pointer shadow-sm active:scale-[0.98]"
              >
                Register Free
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Campus Support Action helper */}
      <div className="flex justify-end pt-4">
        <button 
          onClick={() => handleActionClick("UniSphere Sparkle AI", "UniSphere Sparkle assistant ready to schedule consultations or summarize syllabus details.")}
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-[#006680] hover:bg-[#00556c] text-white flex items-center justify-center shadow-lg shadow-[#006680]/30 active:scale-[0.95] transition-all hover:scale-105 z-40 cursor-pointer"
          title="AI Assistant Helper"
        >
          <Sparkles className="h-5 w-5 text-white animate-pulse" />
        </button>
      </div>

      {/* Global Student Dashboard Footer */}
      <footer className="border-t border-slate-200 mt-12 pt-8 pb-4 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <div>
          <span className="font-extrabold text-sm text-[#006680] mr-2">UniSphere</span>
          <span>&copy; 2026 UniSphere Systems Inc. All rights reserved.</span>
        </div>
        <div className="flex gap-6 font-semibold">
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-800 transition-colors">Privacy Policy</a>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-800 transition-colors">Terms of Service</a>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-800 transition-colors">Campus Partners</a>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-800 transition-colors">Contact Support</a>
        </div>
      </footer>

      {/* Redesign Dialogue Notification Modal */}
      <Dialog
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
      >
        <div className="space-y-4 text-sm text-slate-600">
          <p className="leading-relaxed leading-loose">{modalMessage}</p>
          <div className="flex justify-end pt-2">
            <Button variant="primary" className="bg-[#006680] hover:bg-[#00556c] text-white font-bold" onClick={() => setModalOpen(false)}>
              Okay, Got It
            </Button>
          </div>
        </div>
      </Dialog>

    </div>
  )
}

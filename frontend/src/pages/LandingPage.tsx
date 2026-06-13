import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Sparkles, 
  ArrowRight, 
  Menu, 
  X, 
  ChevronDown, 
  CheckCircle2, 
  Plane,
  Globe,
  Ticket,
  Clock,
  Compass,
  Calendar
} from 'lucide-react'
import { motion } from 'framer-motion'

// Floating Airline Ticket Card with countdown timer
const AirlineTicketCard: React.FC = () => (
  <div className="absolute bottom-6 left-4 md:left-12 w-[280px] md:w-[320px] bg-white rounded-2xl border border-sky-100 shadow-travel p-5 drift-slow z-20 text-left select-none pointer-events-none">
    <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-3.5">
      <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider flex items-center gap-1.5">
        <Ticket className="h-4 w-4 text-sky-500" />
        <span>Airline Ticket</span>
      </span>
      <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">ON TIME</span>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[9px] font-bold text-slate-400 block uppercase">From</span>
          <span className="text-xl font-black text-slate-800">JFK</span>
          <span className="text-[10px] text-slate-500 block font-semibold">New York</span>
        </div>
        <div className="flex flex-col items-center justify-center px-4">
          <Plane className="h-4 w-4 text-sky-500 rotate-90" />
          <div className="h-[1px] w-12 bg-sky-200 relative my-1.5">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-sky-500 rounded-full" />
          </div>
          <span className="text-[8px] text-slate-400 font-bold">6h 45m</span>
        </div>
        <div className="text-right">
          <span className="text-[9px] font-bold text-slate-400 block uppercase">To</span>
          <span className="text-xl font-black text-slate-800">LHR</span>
          <span className="text-[10px] text-slate-500 block font-semibold">London</span>
        </div>
      </div>

      <div className="bg-sky-50/50 p-3 rounded-xl border border-sky-100/60 mt-2">
        <div className="flex items-center gap-2 mb-1.5">
          <Clock className="h-3.5 w-3.5 text-sky-500" />
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Boarding Starts In</span>
        </div>
        <div className="flex gap-2 text-center">
          <div className="bg-white px-2 py-1 rounded border border-sky-100/80 min-w-10">
            <span className="text-xs font-black text-sky-600 block">02</span>
            <span className="text-[7px] text-slate-400 font-bold uppercase">Days</span>
          </div>
          <div className="bg-white px-2 py-1 rounded border border-sky-100/80 min-w-10">
            <span className="text-xs font-black text-sky-600 block">14</span>
            <span className="text-[7px] text-slate-400 font-bold uppercase">Hours</span>
          </div>
          <div className="bg-white px-2 py-1 rounded border border-sky-100/80 min-w-10">
            <span className="text-xs font-black text-sky-600 block">35</span>
            <span className="text-[7px] text-slate-400 font-bold uppercase">Mins</span>
          </div>
        </div>
      </div>
    </div>
  </div>
)

// Floating Boarding Pass Card
const BoardingPassCard: React.FC = () => (
  <div className="absolute top-8 right-4 md:right-12 w-[240px] md:w-[280px] bg-white rounded-2xl border border-sky-100 shadow-travel p-5 drift-medium z-20 text-left select-none pointer-events-none">
    <div className="flex justify-between items-center pb-3 border-b border-dashed border-slate-100 mb-3.5">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Boarding Pass</span>
      <span className="text-[10px] text-sky-500 font-extrabold">FIRST CLASS</span>
    </div>
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-y-3 text-xs">
        <div>
          <span className="text-[8px] font-bold text-slate-400 uppercase block">Passenger</span>
          <span className="font-extrabold text-slate-800">Alex Rivera</span>
        </div>
        <div>
          <span className="text-[8px] font-bold text-slate-400 uppercase block">Seat No</span>
          <span className="font-extrabold text-slate-800">12A</span>
        </div>
        <div>
          <span className="text-[8px] font-bold text-slate-400 uppercase block">Gate</span>
          <span className="font-extrabold text-slate-800">B-22</span>
        </div>
        <div>
          <span className="text-[8px] font-bold text-slate-400 uppercase block">Boarding</span>
          <span className="font-extrabold text-slate-800">14:20</span>
        </div>
      </div>

      {/* Mock Barcode */}
      <div className="pt-2 border-t border-slate-100 mt-2">
        <div className="h-8 bg-slate-900 rounded flex items-center justify-between px-3 gap-0.5 overflow-hidden">
          {Array.from({ length: 24 }).map((_, i) => (
            <div 
              key={i} 
              className="bg-white h-full shrink-0" 
              style={{ width: `${i % 3 === 0 ? 3 : i % 5 === 0 ? 1 : 2}px` }} 
            />
          ))}
        </div>
        <div className="text-[7px] text-center text-slate-400 font-bold uppercase tracking-widest mt-1">
          *UNISPHERE-BOARD-PASS*
        </div>
      </div>
    </div>
  </div>
)

// Floating Travel Itinerary Card
const ItineraryPanel: React.FC = () => (
  <div className="absolute top-12 left-4 md:left-24 w-52 md:w-56 bg-white rounded-2xl border border-sky-100 shadow-travel overflow-hidden drift-slow z-10 text-left select-none pointer-events-none hidden sm:block">
    <div className="bg-sky-500 p-3.5 text-white flex items-center gap-2">
      <Compass className="h-4.5 w-4.5" />
      <div>
        <h4 className="font-extrabold text-xs">London Getaway</h4>
        <span className="text-[8px] opacity-90 font-semibold uppercase">3 Days Active Itinerary</span>
      </div>
    </div>
    <div className="p-4 space-y-3 bg-white">
      <div className="flex items-start gap-2.5">
        <div className="h-4 w-4 rounded-full bg-sky-100 border border-sky-300 text-sky-600 text-[8px] font-black flex items-center justify-center shrink-0 mt-0.5">1</div>
        <div>
          <span className="text-[9px] font-bold text-slate-800 block leading-tight">Hotel Check-in</span>
          <span className="text-[8px] text-slate-400 block font-semibold">The Ritz London • 14:00</span>
        </div>
      </div>
      <div className="flex items-start gap-2.5">
        <div className="h-4 w-4 rounded-full bg-sky-100 border border-sky-300 text-sky-600 text-[8px] font-black flex items-center justify-center shrink-0 mt-0.5">2</div>
        <div>
          <span className="text-[9px] font-bold text-slate-800 block leading-tight">British Museum Tour</span>
          <span className="text-[8px] text-slate-400 block font-semibold">Guided Audio Tour • 10:30</span>
        </div>
      </div>
      <div className="flex items-start gap-2.5">
        <div className="h-4 w-4 rounded-full bg-sky-100 border border-sky-300 text-sky-600 text-[8px] font-black flex items-center justify-center shrink-0 mt-0.5">3</div>
        <div>
          <span className="text-[9px] font-bold text-slate-800 block leading-tight">Eurostar to Paris</span>
          <span className="text-[8px] text-slate-400 block font-semibold">St Pancras Station • 09:15</span>
        </div>
      </div>
    </div>
  </div>
)

export const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'student' | 'faculty' | 'admin'>('student')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Demo features switcher configuration matching Portal Features
  const demoContent = {
    student: {
      title: "Student Portal: Travel Itineraries & Event Reg",
      desc: "Get travel tickets and event suggestions based on your department, interest affinity, and peer activity. Claim digital boarding passes directly to your device.",
      points: ["98% Match accuracy", "Dynamic XP point tracking", "Apple Wallet format compatibility"]
    },
    faculty: {
      title: "Faculty Suite: Academic Coordinator Scheduling",
      desc: "Upload event drafts and let our recommendation heuristics find optimal non-conflicting time slots across academic departments.",
      points: ["Attendance rate estimation", "Auditorium conflict scanner", "Live QR attendee check-ins"]
    },
    admin: {
      title: "Campus Telemetry: Administration Console",
      desc: "Overview registration volumes, club engagement scales, and approval queues in one centralized administrative panel.",
      points: ["Pending club approval workflows", "Real-time system diagnostics", "CSV spreadsheet summaries"]
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 overflow-hidden font-sans select-none relative pb-12">
      
      {/* Background Radial Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-sky-200/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-orange-100/40 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 border-b border-sky-100/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-2xl tracking-tight text-slate-800 flex items-center gap-2.5">
              <span className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-500 to-sky-600 flex items-center justify-center text-white text-base font-black shadow-md">
                <Globe className="h-5 w-5" />
              </span>
              <span className="bg-gradient-to-r from-sky-600 to-sky-850 bg-clip-text text-transparent font-sans">UniSphere</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-500">
            <a href="#features" className="hover:text-sky-600 transition-colors">Features</a>
            <a href="#examples" className="hover:text-sky-600 transition-colors">Examples</a>
            <a href="#pricing" className="hover:text-sky-600 transition-colors">Pricing</a>
            <a href="#help" className="hover:text-sky-600 transition-colors">Help</a>
            <button 
              onClick={() => navigate('/login')}
              className="bg-sky-500 hover:bg-sky-600 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-md shadow-sky-200 hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer flex items-center gap-1.5"
            >
              <span>Sign In</span>
            </button>
          </div>

          {/* Mobile Menu Btn */}
          <button className="md:hidden text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-sky-100 p-6 flex flex-col gap-4 text-sm font-bold text-slate-550 absolute top-20 left-0 right-0 shadow-2xl z-50">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-sky-600 py-2">Features</a>
            <a href="#examples" onClick={() => setMobileMenuOpen(false)} className="hover:text-sky-600 py-2">Examples</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="hover:text-sky-600 py-2">Pricing</a>
            <a href="#help" onClick={() => setMobileMenuOpen(false)} className="hover:text-sky-600 py-2">Help</a>
            <button 
              onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 rounded-xl mt-2 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign In</span>
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="features" className="pt-36 pb-20 px-6 max-w-7xl mx-auto text-center space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/60 border border-sky-200 text-sky-600 text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="h-3 w-3 animate-pulse text-sky-500" />
            <span>Interactive Travel SaaS Workspace</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-none text-slate-900 font-sans">
            All Your Travel Plans. <br />
            <span className="text-sky-500">One Simple Place.</span>
          </h1>
          <p className="text-slate-550 text-sm sm:text-base max-w-xl mx-auto leading-relaxed text-slate-650">
            Store tickets, itineraries, bookings and documents — automatically organized for every trip. Experience the playful interface, real-time calendars, and automatic schedule layouts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
            <button 
              onClick={() => alert("Downloading UniSphere application package...")}
              className="bg-sky-500 hover:bg-sky-600 text-white font-black px-8 py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-sky-200 active:scale-[0.98] transition-all hover:scale-[1.01] cursor-pointer"
            >
              <span>Download App</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
            <a 
              href="#demo"
              className="bg-white hover:bg-slate-50 text-slate-700 font-extrabold px-8 py-4 rounded-2xl border border-sky-100 flex items-center justify-center transition-all shadow-sm shadow-sky-100/50"
            >
              Explore Sandbox Portal
            </a>
          </div>
        </motion.div>

        {/* 16:9 Floating Travel UI Environment Background Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-5xl mx-auto aspect-[16/9] relative overflow-hidden bg-sky-100/40 border border-sky-200 rounded-[32px] shadow-travel p-4 md:p-6 select-none flex items-center justify-center"
        >
          {/* Layered Floating Elements */}
          <AirlineTicketCard />
          <BoardingPassCard />
          <ItineraryPanel />

          {/* Centralized Workspace Cloud Backdrop */}
          <div className="p-8 text-center bg-white/95 border border-sky-100 rounded-3xl max-w-md shadow-travel z-10">
            <div className="h-10 w-10 bg-sky-50 text-sky-500 border border-sky-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Compass className="h-5 w-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-800 mb-2">Connected Travel Studio</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
              Experience the playful SaaS workspace with floating travel cards, 3D perspective layers, and automated boarding updates in a beautiful sky environment.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Travel Capabilities Showcase Section */}
      <section id="examples" className="py-20 px-6 max-w-7xl mx-auto border-t border-sky-100">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest block">Core Infrastructure</span>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-slate-900 font-sans">Automated Document Organizer</h2>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold">
            UniSphere compiles ticket reservations, boardings codes, schedules, and faculty advisor events into a single, clean workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1: Ticket Synchronization */}
          <div className="bg-white border border-sky-100/80 rounded-3xl p-8 shadow-travel flex flex-col justify-between hover:border-sky-300 transition-all">
            <div>
              <div className="h-10 w-10 bg-sky-50 border border-sky-100 text-sky-500 rounded-xl flex items-center justify-center mb-5">
                <Ticket className="h-5 w-5" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-800 mb-2">Smart Document Sync</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 font-semibold">
                Our parsing heuristic extracts PDF boarding credentials and campus itinerary deadlines, organizing them automatically into active travel profiles.
              </p>
            </div>
          </div>

          {/* Card 2: Interactive Timelines */}
          <div className="bg-white border border-sky-100/80 rounded-3xl p-8 shadow-travel flex flex-col justify-between hover:border-sky-300 transition-all">
            <div>
              <div className="h-10 w-10 bg-orange-50 border border-orange-100 text-orange-500 rounded-xl flex items-center justify-center mb-5">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-800 mb-2">Itinerary Management</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 font-semibold">
                Coordinate campus schedules on a clean calendar. Synchronize events with peer calendars, office hours, and digital pass reservations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sandbox Live Demo Switcher Section */}
      <section id="demo" className="py-24 px-6 max-w-7xl mx-auto border-t border-sky-100 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6 text-left">
            <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest block">UniSphere Portal Sandbox</span>
            <h2 className="text-3xl font-black tracking-tight leading-tight text-slate-900 sm:text-4xl font-sans">Interactive Portal Profiles</h2>
            <p className="text-slate-550 text-xs sm:text-sm leading-relaxed font-semibold">
              Explore the student, faculty, and administrative dashboards re-styled in the UniSphere bright travel planner theme.
            </p>
            
            <div className="flex flex-col gap-2.5">
              {(['student', 'faculty', 'admin'] as const).map(role => (
                <button
                  key={role}
                  onClick={() => setActiveTab(role)}
                  className={`w-full py-4 px-5 rounded-2xl text-left text-xs font-bold capitalize transition-all border ${
                    activeTab === role 
                      ? 'bg-sky-50 border-sky-350 text-sky-600 font-extrabold shadow-sm' 
                      : 'bg-white border-slate-150 text-slate-500 hover:text-slate-800'
                  } cursor-pointer`}
                >
                  {role} Perspective
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-sky-100 rounded-3xl p-8 min-h-[300px] flex flex-col justify-between relative shadow-travel text-left">
            <div className="absolute top-4 right-4 text-[8px] font-bold text-sky-600 tracking-wider uppercase bg-sky-50 border border-sky-100 px-2.5 py-1 rounded">Portal Preview</div>
            <div>
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-1">UniSphere App Sandbox</span>
              <h3 className="font-extrabold text-lg text-slate-800 mb-3">{demoContent[activeTab].title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-6 font-semibold">{demoContent[activeTab].desc}</p>
              
              <ul className="space-y-2.5">
                {demoContent[activeTab].points.map((pt, idx) => (
                  <li key={idx} className="flex gap-2.5 text-xs text-slate-600 font-semibold items-center">
                    <CheckCircle2 className="h-4.5 w-4.5 text-sky-500 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <button 
              onClick={() => navigate('/login')}
              className="mt-8 bg-sky-50 border border-sky-200 hover:bg-sky-100 text-sky-600 py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer w-full"
            >
              <span>Test Live in Sandbox Profile</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Plans Grid Section */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto border-t border-sky-100 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest block">Licensing</span>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-slate-900 font-sans">Simple, Scalable Plans</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto text-left">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between shadow-travel">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Sandbox</span>
              <h4 className="text-xl font-bold mb-3 text-slate-800">Local Creator</h4>
              <div className="text-3xl font-black mb-6 text-slate-900">$0 <span className="text-xs text-slate-400 font-medium">/ forever</span></div>
            </div>
            <button onClick={() => navigate('/login')} className="w-full py-3.5 border border-slate-200 bg-white text-slate-700 rounded-xl text-xs font-bold cursor-pointer">
              Launch Localhost Dev
            </button>
          </div>
          
          <div className="bg-white border-2 border-sky-500 rounded-3xl p-8 flex flex-col justify-between relative shadow-lg">
            <span className="absolute top-4 right-4 bg-sky-50 border border-sky-200 text-sky-600 text-[8px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider">Recommended</span>
            <div>
              <span className="text-[9px] font-bold text-sky-500 uppercase tracking-wider block mb-1">Managed Suite</span>
              <h4 className="text-xl font-bold mb-3 text-slate-800">Studio Pro</h4>
              <div className="text-3xl font-black mb-6 text-slate-900">$129 <span className="text-xs text-slate-400 font-medium">/ month</span></div>
            </div>
            <button onClick={() => navigate('/login')} className="w-full py-3.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold cursor-pointer">
              Initiate Inst. Setup
            </button>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between shadow-travel">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Unlimited Cluster</span>
              <h4 className="text-xl font-bold mb-3 text-slate-800">Enterprise Suite</h4>
              <div className="text-3xl font-black mb-6 text-slate-900">Custom <span className="text-xs text-slate-400 font-medium">/ yearly</span></div>
            </div>
            <button onClick={() => alert("Contacting sales representative...")} className="w-full py-3.5 border border-slate-200 bg-white text-slate-700 rounded-xl text-xs font-bold cursor-pointer">
              Contact Admin Affairs
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="help" className="py-24 px-6 max-w-4xl mx-auto border-t border-sky-100 scroll-mt-20">
        <h2 className="text-3xl font-black tracking-tight text-center mb-12 sm:text-4xl text-slate-900 font-sans">Common Platform Queries</h2>
        
        <div className="space-y-4">
          {[
            { q: "How is the local database seeded?", a: "At system launch, SQLite sync commands seed mock faculty records, students, events, and registrations." },
            { q: "Can we connect our local PostgreSQL instance?", a: "Yes. Using standard production profiles or environment variables." }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm text-left">
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full py-5 px-6 flex justify-between items-center text-xs sm:text-sm font-bold text-slate-750 text-left hover:bg-slate-50 cursor-pointer"
              >
                <span>{item.q}</span>
                <ChevronDown className={`h-4.5 w-4.5 text-slate-400 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="p-6 bg-slate-50 text-xs text-slate-500 border-t border-slate-200 leading-relaxed font-semibold">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Global Landing Footer */}
      <footer className="border-t border-sky-100 bg-white py-12 text-slate-400 text-xs mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-700 text-base">UniSphere</span>
            <span>&copy; {new Date().getFullYear()} UniSphere Systems Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

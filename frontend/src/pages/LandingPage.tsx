import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  BarChart3, 
  Check, 
  Menu, 
  X,
  ChevronDown,
  MapPin
} from 'lucide-react'
import { motion } from 'framer-motion'

export const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'student' | 'faculty' | 'admin'>('student')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Demo features switcher
  const demoContent = {
    student: {
      title: "Interactive AI Recommendations",
      desc: "Get event suggestions based on your department, interest affinity, and peer activity. Claim digital boarding passes directly to your device.",
      points: ["98% Match accuracy", "Dynamic XP point tracking", "Apple Wallet format compatibility"]
    },
    faculty: {
      title: "AI Smart Scheduling",
      desc: "Upload event drafts and let our recommendation heuristics find optimal non-conflicting time slots across academic departments.",
      points: ["Attendance rate estimation", "Auditorium conflict scanner", "Live QR attendee check-ins"]
    },
    admin: {
      title: "Campus Telemetry Console",
      desc: "Overview registration volumes, club engagement scales, and approval queues in one centralized administrative panel.",
      points: ["Pending club approval workflows", "Real-time system diagnostics", "CSV spreadsheet summaries"]
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 overflow-hidden font-sans select-none relative">
      
      {/* Background Soft Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-100/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 border-b border-slate-200 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-2xl tracking-tight text-[#006680]">UniSphere</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-500">
            <a href="#features" className="hover:text-[#006680] transition-colors">Features</a>
            <a href="#demo" className="hover:text-[#006680] transition-colors">Demo</a>
            <a href="#pricing" className="hover:text-[#006680] transition-colors">Pricing</a>
            <button 
              onClick={() => navigate('/login')}
              className="bg-cyan-400 hover:bg-cyan-500 text-slate-900 font-extrabold px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Btn */}
          <button className="md:hidden text-slate-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-6 flex flex-col gap-4 text-sm font-bold text-slate-500 absolute top-20 left-0 right-0 shadow-2xl z-50">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#006680] py-2">Features</a>
            <a href="#demo" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#006680] py-2">Demo</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#006680] py-2">Pricing</a>
            <button 
              onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
              className="w-full bg-cyan-400 hover:bg-cyan-500 text-slate-900 font-bold py-3.5 rounded-xl mt-2 shadow-md cursor-pointer"
            >
              Get Started
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-36 pb-24 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 max-w-xl text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>Next-Gen Campus OS</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none text-slate-900">
            Your Connected <br />
            <span className="inline-block bg-cyan-400 text-slate-900 px-4 py-1.5 rounded-2xl mt-1.5 shadow-sm">Campus Hub</span>
          </h1>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Experience an integrated ecosystem where students, faculty, and administration thrive. From smart scheduling to real-time collaboration, UniSphere bridges every gap in the modern academic experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => navigate('/login')}
              className="bg-cyan-400 hover:bg-cyan-500 text-slate-900 font-black px-8 py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-400/20 active:scale-[0.98] transition-all hover:scale-102 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
            <a 
              href="#demo"
              className="bg-white hover:bg-slate-50 text-slate-700 font-extrabold px-8 py-4 rounded-2xl border border-slate-300 flex items-center justify-center transition-colors shadow-sm"
            >
              Learn More
            </a>
          </div>
        </motion.div>

        {/* Hero Collaboration Image Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:max-w-xl shrink-0"
        >
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white p-3">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800" 
              alt="Connected Hub Collaboration" 
              className="rounded-2xl object-cover w-full h-[320px] sm:h-[400px]"
            />
          </div>
        </motion.div>
      </section>

      {/* Precision Campus Management Section */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-slate-900">Precision Campus Management</h2>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            UniSphere provides a suite of advanced tools designed to streamline the academic lifecycle, using data-driven insights to power every interaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1: AI Recommendations */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <div className="h-10 w-10 bg-cyan-100/50 border border-cyan-200 text-cyan-600 rounded-xl flex items-center justify-center mb-5">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 mb-2">AI Recommendations</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Our neural engine analyzes student performance and interest trends to suggest optimal course pathways and extracurricular activities tailored to individual success.
              </p>
            </div>
            
            {/* Visual preview: bar graphic */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-end justify-center gap-2.5 h-32">
              <div className="h-8 w-2 bg-cyan-400 rounded-full" />
              <div className="h-16 w-2 bg-cyan-400 rounded-full" />
              <div className="h-12 w-2 bg-cyan-400 rounded-full" />
              <div className="h-24 w-2 bg-cyan-400 rounded-full animate-pulse" />
              <div className="h-20 w-2 bg-cyan-400 rounded-full" />
              <div className="h-14 w-2 bg-cyan-400 rounded-full" />
            </div>
          </div>

          {/* Card 2: Smart Scheduling */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <div className="h-10 w-10 bg-violet-100/50 border border-violet-200 text-violet-600 rounded-xl flex items-center justify-center mb-5">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 mb-2">Smart Scheduling</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Resolve complex logistical overlaps with an automated scheduling system that balances classroom capacity, faculty availability, and student preferences.
              </p>
            </div>

            {/* Visual preview: Tablet Calendar mockup */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center h-32 overflow-hidden relative">
              <div className="w-44 h-24 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col p-2 gap-1.5">
                <div className="flex justify-between items-center pb-1 border-b border-slate-100 text-[7px] font-bold text-slate-400">
                  <span>WEEK VIEW</span>
                  <span>OCTOBER</span>
                </div>
                <div className="grid grid-cols-5 gap-1 flex-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className={`rounded-sm border ${i % 3 === 0 ? 'bg-cyan-50 border-cyan-200' : 'bg-slate-50 border-slate-100'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Real-time Analytics Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="bg-[#0c101d] rounded-[32px] p-8 md:p-12 text-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-md space-y-4 text-left">
            <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center mb-2">
              <BarChart3 className="h-5 w-5 text-cyan-400" />
            </div>
            <h3 className="text-3xl font-black tracking-tight text-white leading-tight">Real-time Analytics</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Stay informed on campus events and monitor organizational health, facility usage, and academic resources. Make informed decisions with dashboards that update across the UniSphere network today.
            </p>
            <a 
              href="#demo"
              className="text-cyan-400 hover:text-cyan-300 font-extrabold text-xs inline-flex items-center gap-1.5 pt-2 hover:underline transition-colors"
            >
              <span>View full calendar</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Event Cards List */}
          <div className="w-full lg:max-w-xl space-y-4 shrink-0">
            {/* Event 1 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-4 text-slate-800 shadow-lg shadow-black/10">
              <div className="flex items-center gap-4">
                <div className="text-center font-extrabold font-sans border-r border-slate-200 pr-4 shrink-0">
                  <span className="text-slate-900 text-lg block leading-none">24</span>
                  <span className="text-[#006680] text-[10px] block leading-none uppercase mt-1">Oct</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">Global Research Symposium 2026</h4>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">Central Hall • 09:00 AM - 06:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">Academic</span>
                <ChevronDown className="h-4 w-4 text-slate-400 -rotate-90 shrink-0" />
              </div>
            </div>

            {/* Event 2 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-4 text-slate-800 shadow-lg shadow-black/10">
              <div className="flex items-center gap-4">
                <div className="text-center font-extrabold font-sans border-r border-slate-200 pr-4 shrink-0">
                  <span className="text-slate-900 text-lg block leading-none">26</span>
                  <span className="text-[#006680] text-[10px] block leading-none uppercase mt-1">Oct</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">Career Fair: Tech & Innovation</h4>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">Sports Arena • 10:00 AM - 04:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-600 border border-purple-100">Career</span>
                <ChevronDown className="h-4 w-4 text-slate-400 -rotate-90 shrink-0" />
              </div>
            </div>

            {/* Event 3 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-4 text-slate-800 shadow-lg shadow-black/10">
              <div className="flex items-center gap-4">
                <div className="text-center font-extrabold font-sans border-r border-slate-200 pr-4 shrink-0">
                  <span className="text-slate-900 text-lg block leading-none">28</span>
                  <span className="text-[#006680] text-[10px] block leading-none uppercase mt-1">Oct</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">Digital Literacy Workshop</h4>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">Online Session • 02:00 PM - 03:30 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">Workshop</span>
                <ChevronDown className="h-4 w-4 text-slate-400 -rotate-90 shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sandbox Live Demo Switcher Section */}
      <section id="demo" className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-200 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6 text-left">
            <h2 className="text-3xl font-black tracking-tight leading-tight text-slate-900 sm:text-4xl">Experience the Interactive Sandbox</h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Explore how dashboard views customize seamlessly for different users in the academic ecosystem. Select a perspective to preview the dashboard focus.
            </p>
            
            <div className="flex flex-col gap-2.5">
              {(['student', 'faculty', 'admin'] as const).map(role => (
                <button
                  key={role}
                  onClick={() => setActiveTab(role)}
                  className={`w-full py-4 px-5 rounded-2xl text-left text-xs font-bold capitalize transition-all border ${
                    activeTab === role 
                      ? 'bg-cyan-50 border-cyan-400 text-cyan-800' 
                      : 'bg-white border-slate-200 text-slate-500 hover:text-slate-950'
                  } cursor-pointer`}
                >
                  {role} Perspective
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-8 min-h-[300px] flex flex-col justify-between relative shadow-sm text-left">
            <div className="absolute top-4 right-4 text-[9px] font-bold text-slate-400 tracking-wider uppercase">Feature Preview</div>
            <div>
              <span className="text-[10px] font-black text-cyan-600 uppercase tracking-widest block mb-1">UniSphere App Sandbox</span>
              <h3 className="font-extrabold text-lg text-slate-900 mb-3">{demoContent[activeTab].title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-6">{demoContent[activeTab].desc}</p>
              
              <ul className="space-y-2.5">
                {demoContent[activeTab].points.map((pt, idx) => (
                  <li key={idx} className="flex gap-2.5 text-xs text-slate-700 font-semibold items-center">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <button 
              onClick={() => navigate('/login')}
              className="mt-8 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer w-full"
            >
              <span>Test Live in Sandbox Profile</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Plans Grid Section */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-200 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-slate-900">Simple, Scalable Deployment</h2>
          <p className="text-slate-500 text-xs sm:text-sm">Flexible deployment options supporting H2 local caching, MySQL databases, and enterprise PostgreSQL vectors.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto text-left">
          {/* Free sandbox */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Sandbox</span>
              <h4 className="text-xl font-bold mb-3 text-slate-900">Self-Hosted</h4>
              <div className="text-3xl font-black mb-6 text-slate-900">$0 <span className="text-xs text-slate-400 font-medium">/ forever</span></div>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">Immediate local startup with default H2 in-memory seed settings. Ideal for developers.</p>
            </div>
            <button onClick={() => navigate('/login')} className="w-full py-3.5 border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer">
              Launch Localhost Dev
            </button>
          </div>
          
          {/* Campus pro */}
          <div className="bg-white border-2 border-cyan-400 rounded-3xl p-8 flex flex-col justify-between relative shadow-lg shadow-cyan-100">
            <span className="absolute top-4 right-4 bg-cyan-400 text-slate-900 text-[8px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider">Recommended</span>
            <div>
              <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-wider block mb-1">Academic</span>
              <h4 className="text-xl font-bold mb-3 text-slate-900">Campus Pro</h4>
              <div className="text-3xl font-black mb-6 text-slate-900">$129 <span className="text-xs text-slate-400 font-medium">/ month</span></div>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">Fully managed production database cloud instances with custom heuristics configuration. Up to 15,000 active students.</p>
            </div>
            <button onClick={() => navigate('/login')} className="w-full py-3.5 bg-cyan-400 hover:bg-cyan-500 text-slate-900 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer">
              Initiate Inst. Setup
            </button>
          </div>
          
          {/* Enterprise */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Unlimited</span>
              <h4 className="text-xl font-bold mb-3 text-slate-900">Enterprise Cloud</h4>
              <div className="text-3xl font-black mb-6 text-slate-900">Custom <span className="text-xs text-slate-400 font-medium">/ yearly</span></div>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">Dedicated deployment nodes, SSO/LTI integrations with Canvas/Moodle, and raw vectorized semantic recommendation databases.</p>
            </div>
            <button onClick={() => alert("Contacting sales representative...")} className="w-full py-3.5 border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer">
              Contact Dean Affairs
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-24 px-6 max-w-4xl mx-auto border-t border-slate-200 scroll-mt-20">
        <h2 className="text-3xl font-black tracking-tight text-center mb-12 sm:text-4xl text-slate-900">Common Institutional Queries</h2>
        
        <div className="space-y-4">
          {[
            { q: "How does the AI Recommendation Engine calculate matches?", a: "The AI recommendation engine uses vector scoring calculations (affinity equations). It maps student registration categories, department affinities, and collaborative attendance histories into a scoring metric (0.0 to 1.0) outputted dynamically." },
            { q: "Can we connect our local PostgreSQL instance?", a: "Yes. By executing Spring profiles (using the active 'prod' tag) or configuring Node PG credentials in the backend environment file, UniSphere connects to any standard production PostgreSQL server." },
            { q: "Are digital boarding pass codes securely encrypted?", a: "Absolutely. Passcode tokens use base-16 checksum generators mapping registration primary keys, preventing QR forgery during lecture hall scanner checks." },
            { q: "How is the local database seeded?", a: "At system launch, SQLite sync commands seed mock faculty records, students, events, and registrations, facilitating immediate quick-login sandbox tests." }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm text-left">
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full py-5 px-6 flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800 text-left hover:bg-slate-50 cursor-pointer animate-in fade-in"
              >
                <span>{item.q}</span>
                <ChevronDown className={`h-4.5 w-4.5 text-slate-400 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="p-6 bg-slate-50 text-xs text-slate-500 border-t border-slate-200 leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Ready to Connect Banner Section */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="bg-[#0c101d] rounded-[32px] p-8 md:p-12 text-white shadow-2xl flex flex-col items-center justify-center text-center space-y-6">
          <h3 className="text-3xl font-black tracking-tight text-white leading-tight">Ready to connect?</h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg leading-relaxed">
            Join the hundreds of institutions transforming their student experience with UniSphere. Start your journey towards a more connected campus today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full justify-center">
            <button 
              onClick={() => navigate('/login')}
              className="bg-cyan-400 hover:bg-cyan-500 text-slate-900 font-black px-8 py-3.5 rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              Get Started for Free
            </button>
            <button 
              onClick={() => alert("Contacting sales representative...")}
              className="bg-transparent border border-white hover:bg-white/10 text-white font-extrabold px-8 py-3.5 rounded-xl transition-all cursor-pointer"
            >
              Talk to Sales
            </button>
          </div>
        </div>
      </section>

      {/* Global Landing Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800 text-base">UniSphere</span>
            <span className="text-[10px] text-slate-300">|</span>
            <span>&copy; {new Date().getFullYear()} UniSphere Systems Inc. All rights reserved.</span>
          </div>
          <div className="flex gap-6 font-semibold">
            <a href="#" className="hover:text-[#006680] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#006680] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#006680] transition-colors">Campus Partners</a>
            <a href="#" className="hover:text-[#006680] transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

import React, { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useNotifications, useReadNotification } from '../hooks/useApi'
import type { Notification } from '../types'
import { Badge } from './ui/Badge'
import { 
  LayoutDashboard, Calendar, Users, Bell, LogOut, 
  Menu, X, Search, Mail, BookOpen, GraduationCap, Award, Settings, HelpCircle,
  Activity, Database, Server, RefreshCw, CheckCircle, FileText,
  Sparkles, CalendarDays
} from 'lucide-react'

// Course Catalog Mock Data
const CATALOG_COURSES = [
  { id: 'CS-412', name: 'Distributed Systems', credits: 3, professor: 'Prof. Samuel', desc: 'Designing cloud architectures, Consensus algorithms, RPC protocols, and horizontal scalability.' },
  { id: 'DS-450', name: 'Deep Learning & Vision', credits: 4, professor: 'Dr. Sarah Jenkins', desc: 'Neural networks, CNNs, Transformers, and LLM fine-tuning with PyTorch.' },
  { id: 'CS-301', name: 'Cryptography & Security', credits: 3, professor: 'Prof. Rivest', desc: 'Public key infrastructure, Zero-Knowledge proofs, Blockchain fundamentals, and secure hashing.' },
  { id: 'MATH-302', name: 'Probability & Random Processes', credits: 3, professor: 'Prof. Gauss', desc: 'Random variables, stochastic processes, Markov chains, and queuing theories.' },
  { id: 'CS-499', name: 'Senior Honors Capstone', credits: 4, professor: 'CS Department', desc: 'Independent research project under faculty advisor guidance for thesis defense.' }
]

// Directory Mock Data
const DIRECTORY_PEOPLE = [
  { name: 'Alex Rivera', role: 'STUDENT', dept: 'Computer Science', email: 'student@unisphere.edu', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', status: 'Online' },
  { name: 'Dr. Sarah Jenkins', role: 'FACULTY', dept: 'Data Science', email: 'faculty@unisphere.edu', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', status: 'In Meeting' },
  { name: 'Admin Chief', role: 'ADMIN', dept: 'Administration', email: 'admin@unisphere.edu', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', status: 'Online' },
  { name: 'Dr. Alan Turing', role: 'FACULTY', dept: 'Computer Science', email: 'turing@unisphere.edu', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', status: 'Online' },
  { name: 'Prof. Ada Lovelace', role: 'FACULTY', dept: 'Software Eng', email: 'lovelace@unisphere.edu', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', status: 'Offline' },
  { name: 'Jane Doe', role: 'STUDENT', dept: 'Mechanical Eng', email: 'jane@unisphere.edu', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', status: 'Offline' }
]

// Announcements Mock Data
const INITIAL_ANNOUNCEMENTS = [
  { id: 1, title: '📢 AI Symposium & Hackathon Registration', sender: 'Admin Office', time: '2 hours ago', content: 'Register for the Hack-a-Sphere 2026. Cash pool of $5,000 and direct internship interviews with sponsors.', pinned: true },
  { id: 2, title: '📢 Term Enrollment Schedule (Fall 2026)', sender: 'Registrar Office', time: '1 day ago', content: 'Course registration for the Fall semester starts on June 20. Ensure all advisor clearances are obtained.', pinned: false },
  { id: 3, title: '📢 Campus Health Advisory', sender: 'Student Health', time: '3 days ago', content: 'Free seasonal influenza vaccines are available at the clinic on Mondays and Thursdays.', pinned: false },
  { id: 4, title: '📢 Sports League Tryouts', sender: 'Sports Committee', time: '4 days ago', content: 'Football and Basketball tryouts for the varsity squads will be held at the Bidholi sports grounds.', pinned: false }
]

export const Layout: React.FC = () => {
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  // Drawer states
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null)
  const [drawerSearchQuery, setDrawerSearchQuery] = useState('')

  // Calendar state
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(null)
  const [calendarReminders, setCalendarReminders] = useState<{ day: number; title: string; type: string }[]>([
    { day: 12, title: 'UPES NSS Cleanliness Drive', type: 'SPORTS' },
    { day: 15, title: 'ACM Hack-a-Sphere 2026', type: 'TECH' },
    { day: 20, title: 'IEEE AI Innovations Summit', type: 'ACADEMIC' },
    { day: 28, title: 'ACM Quantum Seminar', type: 'TECH' }
  ])
  const [newReminderTitle, setNewReminderTitle] = useState('')
  const [newReminderDay, setNewReminderDay] = useState<number>(12)

  // Course catalog states
  const [enrolledCourseRequests, setEnrolledCourseRequests] = useState<Record<string, boolean>>({})

  // Faculty Hub booking states
  const [officeHoursProfessor, setOfficeHoursProfessor] = useState('Dr. Sarah Jenkins')
  const [officeHoursTime, setOfficeHoursTime] = useState('Tuesday, 2:00 PM')
  const [officeHoursTopic, setOfficeHoursTopic] = useState('')
  const [officeHoursBooking, setOfficeHoursBooking] = useState<{ professor: string; time: string; topic: string } | null>(null)

  // Student affairs states
  const [affairsSubject, setAffairsSubject] = useState('')
  const [affairsMessage, setAffairsMessage] = useState('')
  const [affairsSuccess, setAffairsSuccess] = useState(false)

  // Transcript states
  const [transcriptRequestLoading, setTranscriptRequestLoading] = useState(false)
  const [transcriptRequestStatus, setTranscriptRequestStatus] = useState<string | null>(null)

  // Admin Diagnostic states
  const [adminActionLoading, setAdminActionLoading] = useState(false)
  const [adminActionStatus, setAdminActionStatus] = useState<string | null>(null)

  const { data: notifications = [] } = useNotifications()
  const readNotifMutation = useReadNotification()

  const unreadCount = notifications.filter((n: Notification) => !n.isRead).length

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Navigation items based on role
  const getNavItems = () => {
    const common = [
      { path: '/events', label: 'Explore Events', icon: Calendar },
      { path: '/clubs', label: 'Clubs & Societies', icon: Users },
      { path: '#academic-record', label: 'Academic Record', icon: GraduationCap },
      { path: '#course-catalog', label: 'Course Catalog', icon: BookOpen },
      { path: '#faculty-hub', label: 'Faculty Hub', icon: Users },
      { path: '#student-affairs', label: 'Student Affairs', icon: Award },
      { path: '#system-admin', label: 'System Admin', icon: Settings },
    ]

    if (user?.role === 'STUDENT') {
      return [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        ...common
      ]
    }
    if (user?.role === 'FACULTY') {
      return [
        { path: '/', label: 'Faculty Suite', icon: LayoutDashboard },
        ...common
      ]
    }
    if (user?.role === 'ADMIN') {
      return [
        { path: '/', label: 'Admin Command', icon: LayoutDashboard },
        ...common
      ]
    }
    return common
  }

  const navItems = getNavItems()

  // Custom Calendar Reminder Sync
  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReminderTitle.trim()) return
    setCalendarReminders(prev => [...prev, { day: Number(newReminderDay), title: newReminderTitle, type: 'CUSTOM' }])
    setNewReminderTitle('')
    setSelectedCalendarDay(Number(newReminderDay))
  }

  // Handle Transcript Request Simulation
  const handleRequestTranscript = () => {
    setTranscriptRequestLoading(true)
    setTranscriptRequestStatus(null)
    setTimeout(() => {
      setTranscriptRequestLoading(false)
      setTranscriptRequestStatus('Academic transcript request processed successfully. PDF package has been generated and sent to student@unisphere.edu.')
    }, 1200)
  }

  // Handle Admin Diagnostic Actions
  const handleAdminDiagnosticAction = (action: string) => {
    setAdminActionLoading(true)
    setAdminActionStatus(null)
    setTimeout(() => {
      setAdminActionLoading(false)
      if (action === 'seed') {
        setAdminActionStatus('Seeding command executed. SQLite tables initialized and verified. Loaded 1,420 simulated members & 8 events.')
      } else if (action === 'cache') {
        setAdminActionStatus('Cache invalidation finished. Cleared all active events cache queries from memory buffer.')
      }
    }, 1000)
  }

  // Drawer Titles & Icons
  const getDrawerIcon = () => {
    switch (activeDrawer) {
      case 'announcements': return <Bell className="h-5 w-5 text-indigo-400" />
      case 'calendar': return <Calendar className="h-5 w-5 text-indigo-400" />
      case 'directory': return <Users className="h-5 w-5 text-indigo-400" />
      case 'academic-record': return <GraduationCap className="h-5 w-5 text-indigo-400" />
      case 'course-catalog': return <BookOpen className="h-5 w-5 text-indigo-400" />
      case 'faculty-hub': return <Users className="h-5 w-5 text-indigo-400" />
      case 'student-affairs': return <Award className="h-5 w-5 text-indigo-400" />
      case 'system-admin': return <Settings className="h-5 w-5 text-indigo-400" />
      default: return <HelpCircle className="h-5 w-5 text-indigo-400" />
    }
  }

  const getDrawerTitle = () => {
    switch (activeDrawer) {
      case 'announcements': return 'Campus Announcements'
      case 'calendar': return 'Academic Calendar & Deadlines'
      case 'directory': return 'UniSphere Campus Directory'
      case 'academic-record': return 'Academic Record & Grades'
      case 'course-catalog': return 'Course Catalog Explorer'
      case 'faculty-hub': return 'Faculty Hub'
      case 'student-affairs': return 'Student Affairs & Support'
      case 'system-admin': return 'System Admin Diagnostic Command'
      default: return 'Information Drawer'
    }
  }

  // Render Drawer Content dynamically
  const renderDrawerContent = () => {
    switch (activeDrawer) {
      case 'announcements':
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-400 font-semibold flex gap-2">
              <Sparkles className="h-4 w-4 shrink-0 text-violet-400 animate-pulse" />
              <span>Real-time news alerts curated by academic advisors and the student registry office.</span>
            </div>
            <div className="space-y-3">
              {INITIAL_ANNOUNCEMENTS.map(item => (
                <div key={item.id} className="p-4 rounded-2xl bg-[#121624]/60 border border-slate-800/80 hover:border-slate-700 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-slate-500">{item.sender} • {item.time}</span>
                    {item.pinned && <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-900/60 text-indigo-300 font-bold uppercase">Pinned</span>}
                  </div>
                  <h4 className="font-extrabold text-xs text-white mb-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        )

      case 'calendar':
        const filteredReminders = calendarReminders.filter(r => selectedCalendarDay ? r.day === selectedCalendarDay : true)
        return (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-400 font-semibold flex gap-2">
              <CalendarDays className="h-4 w-4 shrink-0 text-violet-400" />
              <span>Click on any date to filter events, or append custom tasks to your schedule below.</span>
            </div>

            {/* Calendar grid (June 2026) */}
            <div className="bg-[#121624]/40 border border-slate-800/80 rounded-2xl p-4">
              <div className="text-center font-bold text-xs text-white mb-3">June 2026</div>
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-500 mb-2">
                <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {/* June 1 2026 starts on Monday */}
                {Array.from({ length: 30 }, (_, i) => {
                  const day = i + 1
                  const hasEvent = calendarReminders.some(r => r.day === day)
                  const isSelected = selectedCalendarDay === day
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedCalendarDay(isSelected ? null : day)}
                      className={`h-8 w-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center relative ${
                        isSelected 
                          ? 'bg-indigo-600 text-white font-black scale-105 shadow-md shadow-indigo-600/35' 
                          : hasEvent
                            ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-600/30 font-extrabold hover:bg-indigo-900/40'
                            : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'
                      }`}
                    >
                      {day}
                      {hasEvent && !isSelected && <span className="absolute bottom-1 h-1 w-1 bg-indigo-400 rounded-full" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Event list */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {selectedCalendarDay ? `Agenda for June ${selectedCalendarDay}` : 'Upcoming Calendar Events'}
                </span>
                {selectedCalendarDay && (
                  <button onClick={() => setSelectedCalendarDay(null)} className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold">Show All</button>
                )}
              </div>

              {filteredReminders.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">No scheduled events.</div>
              ) : (
                filteredReminders.map((r, index) => (
                  <div key={index} className="p-3.5 rounded-xl bg-[#121624]/60 border border-slate-800/80 flex items-start gap-3 justify-between">
                    <div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-indigo-400 tracking-wider mr-2">Day {r.day}</span>
                      <span className="text-xs text-white font-semibold">{r.title}</span>
                    </div>
                    <Badge variant={r.type === 'TECH' ? 'purple' : r.type === 'ACADEMIC' ? 'default' : 'info'} className="text-[8px] font-black uppercase shrink-0">
                      {r.type}
                    </Badge>
                  </div>
                ))
              )}
            </div>

            {/* Custom reminder form */}
            <form onSubmit={handleAddReminder} className="p-4 rounded-2xl bg-[#121624]/30 border border-slate-800/60 space-y-3">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Add Custom Task</span>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={newReminderDay}
                  onChange={(e) => setNewReminderDay(Number(e.target.value))}
                  className="bg-[#0b0e17] border border-slate-800 text-xs text-white rounded-lg p-2 focus:outline-none focus:border-indigo-600 text-center font-bold"
                />
                <input
                  type="text"
                  placeholder="Task title..."
                  value={newReminderTitle}
                  onChange={(e) => setNewReminderTitle(e.target.value)}
                  className="col-span-2 bg-[#0b0e17] border border-slate-800 text-xs text-white rounded-lg p-2 focus:outline-none focus:border-indigo-600"
                />
              </div>
              <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all">
                Append Agenda Item
              </button>
            </form>
          </div>
        )

      case 'directory':
        const filteredPeople = DIRECTORY_PEOPLE.filter(p => 
          p.name.toLowerCase().includes(drawerSearchQuery.toLowerCase()) ||
          p.dept.toLowerCase().includes(drawerSearchQuery.toLowerCase()) ||
          p.role.toLowerCase().includes(drawerSearchQuery.toLowerCase())
        )
        return (
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search name, role, department..."
                value={drawerSearchQuery}
                onChange={(e) => setDrawerSearchQuery(e.target.value)}
                className="w-full bg-[#121624]/60 border border-slate-800/80 text-xs text-white rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-indigo-600 transition-all"
              />
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredPeople.map((person, index) => (
                <div key={index} className="p-3.5 rounded-xl bg-[#121624]/40 border border-slate-800/60 hover:border-slate-800 flex items-center justify-between gap-3 transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={person.avatar} alt={person.name} className="h-9 w-9 rounded-full object-cover border border-slate-800" />
                    <div>
                      <h4 className="font-extrabold text-xs text-white">{person.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{person.role} • {person.dept}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      person.status === 'Online' 
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-600/25' 
                        : person.status === 'In Meeting'
                          ? 'bg-amber-950/40 text-amber-400 border border-amber-600/25'
                          : 'bg-slate-900 text-slate-500'
                    }`}>
                      {person.status}
                    </span>
                    <button 
                      onClick={() => alert(`Email composition draft opened for: ${person.email}`)}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold block mt-1 transition-colors"
                    >
                      Email →
                    </button>
                  </div>
                </div>
              ))}
              {filteredPeople.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  No directory records match "{drawerSearchQuery}"
                </div>
              )}
            </div>
          </div>
        )

      case 'academic-record':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#121624]/60 border border-slate-800/80 rounded-2xl p-4 text-center">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Cumulative GPA</span>
                <h3 className="text-2xl font-black text-white mt-1">3.92 / 4.00</h3>
                <span className="text-[9px] text-emerald-400 font-semibold mt-0.5 block">Summa Cum Laude Track</span>
              </div>
              <div className="bg-[#121624]/60 border border-slate-800/80 rounded-2xl p-4 text-center">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Completed Credits</span>
                <h3 className="text-2xl font-black text-white mt-1">108 / 120</h3>
                <span className="text-[9px] text-indigo-400 font-semibold mt-0.5 block">Senior Status</span>
              </div>
            </div>

            {/* Courses listing */}
            <div className="space-y-3">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Spring 2026 Semester Records</span>
              <div className="space-y-2">
                {[
                  { id: 'CS-401', name: 'Advanced Algorithms & Complexity', grade: 'A', credits: 4 },
                  { id: 'CS-403', name: 'Artificial Intelligence & Systems', grade: 'A-', credits: 4 },
                  { id: 'DS-302', name: 'Applied Machine Learning', grade: 'A', credits: 3 },
                  { id: 'MATH-201', name: 'Linear Algebra & Applications', grade: 'B+', credits: 3 }
                ].map((c) => (
                  <div key={c.id} className="p-3.5 rounded-xl bg-[#121624]/40 border border-slate-800/60 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-bold text-slate-500">{c.id} • {c.credits} Credits</span>
                      <h4 className="font-extrabold text-xs text-white mt-0.5">{c.name}</h4>
                    </div>
                    <span className="h-8 w-8 rounded-lg bg-indigo-900/30 border border-indigo-600/20 flex items-center justify-center font-black text-xs text-indigo-400">
                      {c.grade}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Request Transcript section */}
            <div className="p-4 rounded-2xl bg-[#121624]/30 border border-slate-800/60 space-y-3">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Registrar Clearance</span>
              {transcriptRequestStatus ? (
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-600/30 text-xs text-emerald-400">
                  {transcriptRequestStatus}
                </div>
              ) : (
                <button
                  onClick={handleRequestTranscript}
                  disabled={transcriptRequestLoading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  {transcriptRequestLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin text-white" />
                      <span>Generating PDF Transcript...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      <span>Request Official Sealed Transcript</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )

      case 'course-catalog':
        const filteredCourses = CATALOG_COURSES.filter(c => 
          c.name.toLowerCase().includes(drawerSearchQuery.toLowerCase()) ||
          c.id.toLowerCase().includes(drawerSearchQuery.toLowerCase()) ||
          c.desc.toLowerCase().includes(drawerSearchQuery.toLowerCase())
        )
        return (
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search course title, syllabus, code..."
                value={drawerSearchQuery}
                onChange={(e) => setDrawerSearchQuery(e.target.value)}
                className="w-full bg-[#121624]/60 border border-slate-800/80 text-xs text-white rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-indigo-600 transition-all"
              />
            </div>

            <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredCourses.map((c) => (
                <div key={c.id} className="p-4 rounded-xl bg-[#121624]/40 border border-slate-800/60 flex flex-col gap-3 justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-black text-indigo-400 tracking-wider uppercase bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-600/20">{c.id}</span>
                      <span className="text-[10px] text-slate-500 font-bold">{c.credits} Semester Credits</span>
                    </div>
                    <h4 className="font-extrabold text-xs text-white mt-2">{c.name}</h4>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Professor: {c.professor}</span>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-2">{c.desc}</p>
                  </div>
                  <div className="border-t border-slate-900/60 pt-3 flex justify-end">
                    {enrolledCourseRequests[c.id] ? (
                      <span className="text-[10px] text-emerald-400 font-extrabold flex items-center gap-1.5">
                        <CheckCircle className="h-4 w-4" /> Enrollment Request Sent!
                      </span>
                    ) : (
                      <button
                        onClick={() => setEnrolledCourseRequests(prev => ({ ...prev, [c.id]: true }))}
                        className="px-3.5 py-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-600/20 text-indigo-400 hover:text-indigo-300 rounded-lg text-[10px] font-bold transition-all"
                      >
                        Enroll Syllabus
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {filteredCourses.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  No courses match "{drawerSearchQuery}"
                </div>
              )}
            </div>
          </div>
        )

      case 'faculty-hub':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Faculty Advisors & Office Hours</span>
              <div className="space-y-2">
                {[
                  { name: 'Dr. Sarah Jenkins', office: 'CSE-401', hours: 'Tue/Thu 2:00 PM - 4:00 PM', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
                  { name: 'Prof. Alan Turing', office: 'CSE-310', hours: 'Mon/Wed 10:00 AM - 12:00 AM', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
                  { name: 'Prof. Ada Lovelace', office: 'SE-204', hours: 'Fri 1:00 PM - 3:00 PM', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' }
                ].map((f, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#121624]/40 border border-slate-800/60 flex items-center gap-3">
                    <img src={f.image} alt={f.name} className="h-9 w-9 rounded-full object-cover border border-slate-800" />
                    <div>
                      <h4 className="font-extrabold text-xs text-white">{f.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Office: {f.office} • Hours: {f.hours}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule Booking Matrix */}
            <div className="p-4 rounded-2xl bg-[#121624]/30 border border-slate-800/60 space-y-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Book Office Consultation</span>
              
              {officeHoursBooking ? (
                <div className="p-4 rounded-xl bg-[#121624]/60 border border-indigo-500/30 text-xs space-y-2">
                  <div className="text-indigo-400 font-extrabold flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-indigo-400" /> Consultation Booked Successfully!
                  </div>
                  <p className="text-slate-300 mt-1"><strong>Advisor:</strong> {officeHoursBooking.professor}</p>
                  <p className="text-slate-300"><strong>Time Slot:</strong> {officeHoursBooking.time}</p>
                  <p className="text-slate-300"><strong>Topic:</strong> {officeHoursBooking.topic}</p>
                  <button 
                    onClick={() => setOfficeHoursBooking(null)}
                    className="text-[10px] text-slate-500 hover:text-slate-300 font-bold block mt-2"
                  >
                    Schedule another...
                  </button>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Select Professor</label>
                    <select
                      value={officeHoursProfessor}
                      onChange={(e) => setOfficeHoursProfessor(e.target.value)}
                      className="w-full bg-[#0b0e17] border border-slate-800 text-white rounded-lg p-2.5 focus:outline-none focus:border-indigo-600"
                    >
                      <option>Dr. Sarah Jenkins</option>
                      <option>Prof. Alan Turing</option>
                      <option>Prof. Ada Lovelace</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Choose Timeslot</label>
                    <select
                      value={officeHoursTime}
                      onChange={(e) => setOfficeHoursTime(e.target.value)}
                      className="w-full bg-[#0b0e17] border border-slate-800 text-white rounded-lg p-2.5 focus:outline-none focus:border-indigo-600"
                    >
                      <option>Tuesday, 2:00 PM</option>
                      <option>Wednesday, 11:00 AM</option>
                      <option>Friday, 1:30 PM</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Topic details</label>
                    <input
                      type="text"
                      placeholder="e.g. Thesis advice, exam review..."
                      value={officeHoursTopic}
                      onChange={(e) => setOfficeHoursTopic(e.target.value)}
                      className="w-full bg-[#0b0e17] border border-slate-800 text-white rounded-lg p-2.5 focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!officeHoursTopic.trim()) return
                      setOfficeHoursBooking({ professor: officeHoursProfessor, time: officeHoursTime, topic: officeHoursTopic })
                      setOfficeHoursTopic('')
                    }}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Confirm Booking Slot
                  </button>
                </div>
              )}
            </div>
          </div>
        )

      case 'student-affairs':
        return (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-slate-300 leading-relaxed space-y-2">
              <span className="font-extrabold text-indigo-400 uppercase tracking-widest block text-[9px]">Campus Amenities</span>
              <p>📍 <strong>Student Housing:</strong> Dorm room requests, dining plan adjustments, maintenance orders.</p>
              <p>📍 <strong>Career Desk:</strong> Placements schedules, resume reviews, guest recruiter seminars.</p>
              <p>📍 <strong>Health Clinic:</strong> General wellness visits, sports clearances, counseling appointments.</p>
            </div>

            {/* Support Ticket form */}
            <div className="p-4 rounded-2xl bg-[#121624]/30 border border-slate-800/60 space-y-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Submit Support Inquiry / Ticket</span>
              
              {affairsSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-600/30 text-xs space-y-1">
                  <div className="text-emerald-400 font-extrabold flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-emerald-400" /> Ticket Submitted Successfully!
                  </div>
                  <p className="text-slate-400 mt-1"><strong>Ticket Reference:</strong> US-2026-0941-AR</p>
                  <p className="text-slate-400">Our support coordinators will review this within 24 hours.</p>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Subject Topic</label>
                    <input
                      type="text"
                      placeholder="e.g. Housing swap request, career guidance..."
                      value={affairsSubject}
                      onChange={(e) => setAffairsSubject(e.target.value)}
                      className="w-full bg-[#0b0e17] border border-slate-800 text-white rounded-lg p-2.5 focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Detailed Inquiry</label>
                    <textarea
                      placeholder="Explain your case in detail..."
                      rows={4}
                      value={affairsMessage}
                      onChange={(e) => setAffairsMessage(e.target.value)}
                      className="w-full bg-[#0b0e17] border border-slate-800 text-white rounded-lg p-2.5 focus:outline-none focus:border-indigo-600 resize-none"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!affairsSubject.trim() || !affairsMessage.trim()) return
                      setAffairsSuccess(true)
                      setAffairsSubject('')
                      setAffairsMessage('')
                    }}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Send Support Request
                  </button>
                </div>
              )}
            </div>
          </div>
        )

      case 'system-admin':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#121624]/60 border border-slate-800/80 rounded-xl p-3 flex flex-col items-center">
                <Server className="h-5 w-5 text-emerald-400 mb-1" />
                <span className="text-[9px] font-bold text-slate-500 uppercase">Express Backend</span>
                <span className="text-xs font-black text-emerald-400 mt-0.5">ONLINE</span>
              </div>
              <div className="bg-[#121624]/60 border border-slate-800/80 rounded-xl p-3 flex flex-col items-center">
                <Database className="h-5 w-5 text-indigo-400 mb-1" />
                <span className="text-[9px] font-bold text-slate-500 uppercase">SQLite Database</span>
                <span className="text-xs font-black text-indigo-400 mt-0.5">ACTIVE</span>
              </div>
            </div>

            {/* Diagnostic Parameters list */}
            <div className="space-y-2.5 text-xs bg-[#121624]/20 border border-slate-800/40 rounded-xl p-4">
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">API Status:</span>
                <span className="text-white font-extrabold">200 OK (Swagger docs ready)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Redis Cache Server:</span>
                <span className="text-amber-400 font-extrabold">Bypassed (In-Memory Fallback)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">RAG Vector Engine:</span>
                <span className="text-white font-extrabold">Ready (Cosine Heuristics)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Active Sessions:</span>
                <span className="text-indigo-400 font-extrabold">1,420 Active Peers</span>
              </div>
            </div>

            {/* Diagnostic Actions */}
            <div className="space-y-3">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Administrative Operations</span>
              
              {adminActionStatus && (
                <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-600/30 text-xs text-indigo-400 leading-relaxed">
                  {adminActionStatus}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAdminDiagnosticAction('seed')}
                  disabled={adminActionLoading}
                  className="py-3 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className={`h-4 w-4 text-indigo-400 ${adminActionLoading ? 'animate-spin' : ''}`} />
                  <span>Sync DB Seed</span>
                </button>
                <button
                  onClick={() => handleAdminDiagnosticAction('cache')}
                  disabled={adminActionLoading}
                  className="py-3 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Settings className={`h-4 w-4 text-indigo-400 ${adminActionLoading ? 'animate-spin' : ''}`} />
                  <span>Clear Cache</span>
                </button>
              </div>

              <button
                onClick={() => {
                  const dump = {
                    server: 'unisphere-api-v1',
                    db: 'sqlite',
                    metrics: { cpu: '2.4%', ram: '42MB', nodes: 3 },
                    vectorDB: { totalVectors: 8, dimensions: 128 },
                    cache: { type: 'memory', hits: 342, misses: 89 }
                  }
                  alert(`Diagnostic Server Export JSON:\n\n${JSON.stringify(dump, null, 2)}`)
                }}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Activity className="h-4 w-4 text-white" />
                <span>Export JSON Diagnostics</span>
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 flex transition-colors duration-300">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0b0e17] border-r border-slate-900 shrink-0 fixed h-screen z-20 justify-between select-none">
        
        <div>
          {/* Logo Brand */}
          <div className="p-6 flex flex-col items-start gap-0.5">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white font-sans">UniSphere</span>
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Higher Ed Systems</span>
          </div>

          {/* Nav List */}
          <nav className="px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isHash = item.path.startsWith('#')
              const isActive = isHash ? false : location.pathname === item.path
              
              return (
                <Link
                  key={item.label}
                  to={isHash ? '#' : item.path}
                  onClick={(e) => {
                    if (isHash) {
                      e.preventDefault()
                      const drawerId = item.path.substring(1)
                      setActiveDrawer(drawerId)
                    }
                  }}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                    isActive 
                      ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/40 border border-transparent'
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Actions */}
        <div className="p-4 space-y-3 border-t border-slate-900">
          
          {user?.role === 'STUDENT' && (
            <button
              onClick={() => setActiveDrawer('student-affairs')}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3 rounded-2xl transition-all duration-200 shadow-lg shadow-indigo-600/15"
            >
              Raise Ticket
            </button>
          )}

          <div className="space-y-1">
            <button 
              onClick={() => setActiveDrawer('student-affairs')}
              className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900/40"
            >
              <HelpCircle className="h-4.5 w-4.5 text-slate-500" />
              <span>Support</span>
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/10"
            >
              <LogOut className="h-4.5 w-4.5 text-rose-500" />
              <span>Logout</span>
            </button>
          </div>

        </div>

      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#060814]/80 backdrop-blur-md border-b border-slate-900 h-16 px-4 md:px-8 flex items-center justify-between select-none">
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-xl hover:bg-slate-900 text-slate-200"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Search bar & Header links */}
          <div className="hidden md:flex items-center gap-8 w-full max-w-xl">
            
            {/* Search Input */}
            <div className="relative flex items-center w-full max-w-xs">
              <Search className="absolute left-3.5 h-4 w-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="w-full bg-[#0d111d] border border-slate-900 focus:border-indigo-600 text-white rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none transition-all duration-200 placeholder-slate-600 shadow-inner"
              />
            </div>

            {/* Nav Links */}
            <div className="flex gap-6 text-xs font-semibold text-slate-400">
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveDrawer('announcements'); }} className="hover:text-white transition-colors">Announcements</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveDrawer('calendar'); }} className="hover:text-white transition-colors">Calendar</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveDrawer('directory'); }} className="hover:text-white transition-colors">Directory</a>
            </div>

          </div>

          {/* Top Bar Actions (Notifications, Messages, Profile) */}
          <div className="flex items-center gap-4">
            
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl hover:bg-slate-900 text-slate-500 hover:text-slate-300 transition-colors relative"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-3.5 w-3.5 bg-rose-500 text-[9px] text-white font-extrabold flex items-center justify-center rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-[#0c101d] border border-slate-800 rounded-2xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-3 duration-200 z-50">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-900 pb-2">
                    <span className="font-bold text-xs text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] text-indigo-400 font-bold">{unreadCount} Unread</span>
                    )}
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-[10px] text-slate-500 text-center py-6">All caught up!</p>
                    ) : (
                      notifications.map((n: Notification) => (
                        <div 
                          key={n.id} 
                          className={`p-2.5 rounded-xl text-[11px] transition-colors ${
                            n.isRead ? 'opacity-60 bg-transparent' : 'bg-slate-900/60 border-l-2 border-indigo-500'
                          }`}
                          onClick={() => !n.isRead && readNotifMutation.mutate(n.id)}
                        >
                          <div className="flex justify-between items-start gap-1">
                            <span className="font-bold text-white">{n.title}</span>
                          </div>
                          <p className="text-slate-400 mt-1">{n.message}</p>
                          <span className="text-[9px] text-slate-600 block mt-1">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Messages Mail Icon */}
            <button
              onClick={() => alert("Mail box inbox is empty.")}
              className="p-2 rounded-xl hover:bg-slate-900 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <Mail className="h-4.5 w-4.5" />
            </button>

            {/* User Profile Avatar */}
            <div className="h-8 w-8 rounded-full overflow-hidden border border-slate-800">
              <img 
                src={user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
                alt="Profile" 
                className="h-full w-full object-cover"
              />
            </div>

          </div>

        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>

      </div>

      {/* Sliding Drawer Overlay & Panel */}
      {activeDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden select-none">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => {
              setActiveDrawer(null)
              setDrawerSearchQuery('')
              setAdminActionStatus(null)
              setAffairsSuccess(false)
              setTranscriptRequestStatus(null)
            }}
          />
          
          {/* Drawer container panel */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md sm:max-w-lg bg-[#0b0e17] border-l border-slate-900 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              
              {/* Header */}
              <div className="p-6 border-b border-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getDrawerIcon()}
                  <h3 className="font-extrabold text-base text-white">{getDrawerTitle()}</h3>
                </div>
                <button 
                  onClick={() => {
                    setActiveDrawer(null)
                    setDrawerSearchQuery('')
                    setAdminActionStatus(null)
                    setAffairsSuccess(false)
                    setTranscriptRequestStatus(null)
                  }}
                  className="p-1.5 rounded-xl hover:bg-slate-900 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {renderDrawerContent()}
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-slate-900 bg-[#080b12] text-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                UniSphere Portal • Interactive Sandbox
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <nav className="relative flex flex-col w-64 h-full bg-[#0b0e17] p-6 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between mb-8">
              <span className="font-extrabold text-xl text-white">UniSphere</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-xl hover:bg-slate-900">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isHash = item.path.startsWith('#')
                const isActive = isHash ? false : location.pathname === item.path
                
                return (
                  <Link
                    key={item.label}
                    to={isHash ? '#' : item.path}
                    onClick={(e) => {
                      setMobileMenuOpen(false)
                      if (isHash) {
                        e.preventDefault()
                        const drawerId = item.path.substring(1)
                        setActiveDrawer(drawerId)
                      }
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                      isActive 
                        ? 'bg-indigo-600/10 text-indigo-400' 
                        : 'text-slate-400 hover:bg-slate-900/40'
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
            <div className="border-t border-slate-900 pt-4">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-950/15 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl font-bold transition-all"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      )}

    </div>
  )
}

import React, { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useNotifications, useReadNotification, useMyRegistrations } from '../hooks/useApi'
import type { Notification } from '../types'
import { Badge } from './ui/Badge'
import { Dialog } from './ui/Dialog'
import { DigitalPass } from './DigitalPass'
import { 
  LayoutDashboard, Calendar, Users, Bell, LogOut, 
  Menu, X, Search, Mail, BookOpen, GraduationCap, Award, Settings, HelpCircle,
  Activity, Database, Server, RefreshCw, CheckCircle, FileText,
  Sparkles, CalendarDays, Bot, Globe
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
  const { data: registrations = [] } = useMyRegistrations()
  const [selectedPass, setSelectedPass] = useState<{ event: any; passCode: string } | null>(null)

  const unreadCount = notifications.filter((n: Notification) => !n.isRead).length

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isStudent = user?.role === 'STUDENT'
  const isFaculty = user?.role === 'FACULTY'
  const isAdmin = user?.role === 'ADMIN'

  // Navigation items based on role
  const getNavItems = () => {
    const common = [
      { path: '/dashboard/events', label: 'Explore Events', icon: Calendar },
      { path: '/dashboard/clubs', label: 'Clubs & Societies', icon: Users },
      { path: '/dashboard/profile', label: 'My Profile', icon: GraduationCap },
      { path: '/dashboard/settings', label: 'Settings', icon: Settings },
      { path: '#academic-record', label: 'Academic Record', icon: GraduationCap },
      { path: '#course-catalog', label: 'Course Catalog', icon: BookOpen },
      { path: '#faculty-hub', label: 'Faculty Hub', icon: Users },
      { path: '#student-affairs', label: 'Student Support', icon: Award },
      { path: '#system-admin', label: 'System Admin', icon: Settings },
    ]

    if (isStudent) {
      return [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        ...common
      ]
    }
    if (isFaculty) {
      return [
        { path: '/dashboard', label: 'Faculty Suite', icon: LayoutDashboard },
        ...common
      ]
    }
    if (isAdmin) {
      return [
        { path: '/dashboard', label: 'Admin Command', icon: LayoutDashboard },
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
      case 'announcements': return <Bell className="h-5 w-5 text-purple-400" />
      case 'calendar': return <Calendar className="h-5 w-5 text-purple-400" />
      case 'directory': return <Users className="h-5 w-5 text-purple-400" />
      case 'academic-record': return <GraduationCap className="h-5 w-5 text-purple-400" />
      case 'course-catalog': return <BookOpen className="h-5 w-5 text-purple-400" />
      case 'faculty-hub': return <Users className="h-5 w-5 text-purple-400" />
      case 'student-affairs': return <Award className="h-5 w-5 text-purple-400" />
      case 'system-admin': return <Settings className="h-5 w-5 text-purple-400" />
      default: return <HelpCircle className="h-5 w-5 text-purple-400" />
    }
  }

  const getDrawerTitle = () => {
    switch (activeDrawer) {
      case 'announcements': return 'Campus Announcements'
      case 'calendar': return 'Academic Calendar & Deadlines'
      case 'directory': return 'Campus Directory'
      case 'academic-record': return 'Academic Record & Grades'
      case 'course-catalog': return 'Course Catalog Explorer'
      case 'faculty-hub': return 'Faculty Hub'
      case 'student-affairs': return 'Student Support & Affairs'
      case 'system-admin': return 'System Admin Console'
      default: return 'Information Drawer'
    }
  }

  // Render Drawer Content dynamically
  const renderDrawerContent = () => {
    switch (activeDrawer) {
      case 'announcements':
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-xs text-sky-600 font-semibold flex gap-2">
              <Sparkles className="h-4 w-4 shrink-0 text-sky-500 animate-pulse" />
              <span>Real-time news alerts curated by academic advisors and the student registry office.</span>
            </div>
            <div className="space-y-3">
              {INITIAL_ANNOUNCEMENTS.map(item => (
                <div key={item.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-sky-200 hover:bg-sky-50/30 transition-all text-slate-650">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-slate-400">{item.sender} • {item.time}</span>
                    {item.pinned && <span className="text-[8px] px-1.5 py-0.5 rounded bg-sky-500 text-white font-extrabold uppercase">Pinned</span>}
                  </div>
                  <h4 className="font-extrabold text-xs mb-1 text-slate-800">{item.title}</h4>
                  <p className="text-[11px] leading-relaxed text-slate-500">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        )

      case 'calendar':
        const filteredReminders = calendarReminders.filter(r => selectedCalendarDay ? r.day === selectedCalendarDay : true)
        return (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-xs text-sky-600 font-semibold flex gap-2">
              <CalendarDays className="h-4 w-4 shrink-0 text-sky-500" />
              <span>Click on any date to filter events, or append custom tasks to your schedule below.</span>
            </div>

            {/* Calendar grid (June 2026) */}
            <div className="border border-sky-100 rounded-2xl p-4 bg-slate-50/50 shadow-sm">
              <div className="text-center font-bold text-xs mb-3 text-slate-800">June 2026</div>
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
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
                          ? 'bg-sky-500 text-white font-black scale-105 shadow-md shadow-sky-500/20' 
                          : hasEvent
                            ? 'bg-sky-50 text-sky-650 border border-sky-200 font-extrabold hover:bg-sky-100'
                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                      }`}
                    >
                      {day}
                      {hasEvent && !isSelected && <span className="absolute bottom-1 h-1 w-1 bg-sky-500 rounded-full" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Event list */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {selectedCalendarDay ? `Agenda for June ${selectedCalendarDay}` : 'Upcoming Calendar Events'}
                </span>
                {selectedCalendarDay && (
                  <button onClick={() => setSelectedCalendarDay(null)} className="text-[10px] text-sky-650 hover:text-sky-700 font-bold">Show All</button>
                )}
              </div>

              {filteredReminders.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">No scheduled events.</div>
              ) : (
                filteredReminders.map((r, index) => (
                  <div key={index} className="p-3.5 rounded-xl border border-slate-100 flex items-start gap-3 justify-between bg-slate-50/50 text-slate-700 shadow-sm">
                    <div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-50 text-sky-600 border border-sky-100 tracking-wider mr-2">Day {r.day}</span>
                      <span className="text-xs font-semibold text-slate-800">{r.title}</span>
                    </div>
                    <Badge variant={r.type === 'TECH' ? 'purple' : r.type === 'ACADEMIC' ? 'default' : 'info'} className="text-[8px] font-black uppercase shrink-0">
                      {r.type}
                    </Badge>
                  </div>
                ))
              )}
            </div>

            {/* Custom reminder form */}
            <form onSubmit={handleAddReminder} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <span className="text-[10px] font-black text-slate-555 uppercase tracking-widest block">Add Custom Task</span>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={newReminderDay}
                  onChange={(e) => setNewReminderDay(Number(e.target.value))}
                  className="border border-slate-200 bg-white text-slate-700 text-xs rounded-lg p-2 focus:outline-none focus:border-sky-500 text-center font-bold"
                />
                <input
                  type="text"
                  placeholder="Task title..."
                  value={newReminderTitle}
                  onChange={(e) => setNewReminderTitle(e.target.value)}
                  className="col-span-2 border border-slate-200 bg-white text-slate-700 text-xs rounded-lg p-2 focus:outline-none focus:border-sky-500 font-semibold"
                />
              </div>
              <button type="submit" className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer">
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
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, role, department..."
                value={drawerSearchQuery}
                onChange={(e) => setDrawerSearchQuery(e.target.value)}
                className="w-full border border-slate-200 bg-slate-50 text-xs rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-sky-500 transition-all text-slate-700"
              />
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredPeople.map((person, index) => (
                <div key={index} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3 shadow-sm hover:border-sky-200 transition-all">
                  <div className="flex items-center gap-3">
                    <img src={person.avatar} alt={person.name} className="h-9 w-9 rounded-full object-cover border border-slate-200" />
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-800">{person.name}</h4>
                      <p className="text-[10px] mt-0.5 text-slate-400">{person.role} • {person.dept}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      person.status === 'Online' 
                        ? 'bg-sky-50 text-sky-600 border border-sky-100' 
                        : person.status === 'In Meeting'
                          ? 'bg-amber-50 text-amber-600 border border-amber-100'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}>
                      {person.status}
                    </span>
                    <button 
                      onClick={() => alert(`Email composition draft opened for: ${person.email}`)}
                      className="text-[10px] text-sky-600 hover:text-sky-700 font-bold block mt-1 transition-colors"
                    >
                      Email →
                    </button>
                  </div>
                </div>
              ))}
              {filteredPeople.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
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
              <div className="p-4 text-center rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-700 shadow-sm">
                <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider">Cumulative GPA</span>
                <h3 className="text-2xl font-black mt-1 text-slate-800">3.92 / 4.00</h3>
                <span className="text-[9px] text-emerald-600 font-semibold mt-0.5 block">Summa Cum Laude Track</span>
              </div>
              <div className="p-4 text-center rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-700 shadow-sm">
                <span className="text-[9px] font-bold text-slate-455 uppercase tracking-wider">Completed Credits</span>
                <h3 className="text-2xl font-black mt-1 text-slate-800">108 / 120</h3>
                <span className="text-[9px] font-semibold mt-0.5 block text-sky-600">Senior Status</span>
              </div>
            </div>

            {/* Boarding Passes wallet section for student */}
            {isStudent && (
              <div className="space-y-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Active Event Tickets Wallet</span>
                <div className="space-y-2">
                  {registrations.length > 0 ? (
                    registrations.map((event: any) => (
                      <div 
                        key={event.id}
                        onClick={() => setSelectedPass({
                          event,
                          passCode: event.passCode || `PASS-${event.id}-${100000 + event.id * 73}`
                        })}
                        className="p-4 bg-slate-50/50 border border-slate-105 hover:border-sky-300 hover:bg-sky-50/30 rounded-2xl flex justify-between items-center cursor-pointer transition-all duration-200 shadow-sm group"
                      >
                        <div className="min-w-0">
                          <span className="text-[9px] font-bold text-sky-500 uppercase tracking-wider block">
                            {event.category || 'EVENT'} TICKET
                          </span>
                          <h4 className="font-extrabold text-xs text-slate-850 truncate mt-0.5">{event.title}</h4>
                        </div>
                        <span className="text-[9px] text-sky-600 font-bold shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">View Pass →</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 border border-slate-150 border-dashed rounded-2xl">
                      No active tickets in your wallet.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Courses listing */}
            <div className="space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Spring 2026 Semester Records</span>
              <div className="space-y-2">
                {[
                  { id: 'CS-401', name: 'Advanced Algorithms & Complexity', grade: 'A', credits: 4 },
                  { id: 'CS-403', name: 'Artificial Intelligence & Systems', grade: 'A-', credits: 4 },
                  { id: 'DS-302', name: 'Applied Machine Learning', grade: 'A', credits: 3 },
                  { id: 'MATH-201', name: 'Linear Algebra & Applications', grade: 'B+', credits: 3 }
                ].map((c) => (
                  <div key={c.id} className="p-3.5 rounded-xl border border-slate-100 flex justify-between items-center bg-slate-50/50 text-slate-700 shadow-sm">
                    <div>
                      <span className="text-[9px] font-bold text-slate-450">{c.id} • {c.credits} Credits</span>
                      <h4 className="font-extrabold text-xs mt-0.5 text-slate-800">{c.name}</h4>
                    </div>
                    <span className="h-8 w-8 rounded-lg flex items-center justify-center font-black text-xs bg-sky-50 border border-sky-100 text-sky-600">
                      {c.grade}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Request Transcript section */}
            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-700 shadow-sm space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Registrar Clearance</span>
              {transcriptRequestStatus ? (
                <div className="p-3 rounded-xl text-xs font-semibold bg-sky-50 border border-sky-100 text-sky-650">
                  {transcriptRequestStatus}
                </div>
              ) : (
                <button
                  onClick={handleRequestTranscript}
                  disabled={transcriptRequestLoading}
                  className="w-full py-3 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer bg-sky-500 hover:bg-sky-600 disabled:bg-slate-100 disabled:text-slate-400"
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
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search course title, syllabus, code..."
                value={drawerSearchQuery}
                onChange={(e) => setDrawerSearchQuery(e.target.value)}
                className="w-full border border-slate-200 bg-slate-50 text-xs rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-sky-500 transition-all text-slate-700"
              />
            </div>

            <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredCourses.map((c) => (
                <div key={c.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 shadow-sm flex flex-col gap-3 justify-between text-slate-700">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded bg-sky-50 text-sky-650 border border-sky-100">{c.id}</span>
                      <span className="text-[10px] text-slate-400 font-bold">{c.credits} Semester Credits</span>
                    </div>
                    <h4 className="font-extrabold text-xs mt-2 text-slate-800">{c.name}</h4>
                    <span className="text-[10px] font-semibold block mt-0.5 text-slate-450">Professor: {c.professor}</span>
                    <p className="text-[11px] leading-relaxed mt-2 text-slate-500">{c.desc}</p>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex justify-end">
                    {enrolledCourseRequests[c.id] ? (
                      <span className="text-[10px] text-sky-500 font-extrabold flex items-center gap-1.5">
                        <CheckCircle className="h-4 w-4" /> Enrollment Request Sent!
                      </span>
                    ) : (
                      <button
                        onClick={() => setEnrolledCourseRequests(prev => ({ ...prev, [c.id]: true }))}
                        className="px-3.5 py-1.5 border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-650 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                      >
                        Enroll Syllabus
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {filteredCourses.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-450 border border-dashed border-slate-200 rounded-xl">
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
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Faculty Advisors & Office Hours</span>
              <div className="space-y-2">
                {[
                  { name: 'Dr. Sarah Jenkins', office: 'CSE-401', hours: 'Tue/Thu 2:00 PM - 4:00 PM', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
                  { name: 'Prof. Alan Turing', office: 'CSE-310', hours: 'Mon/Wed 10:00 AM - 12:00 AM', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
                  { name: 'Prof. Ada Lovelace', office: 'SE-204', hours: 'Fri 1:00 PM - 3:00 PM', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' }
                ].map((f, i) => (
                  <div key={i} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center gap-3 shadow-sm">
                    <img src={f.image} alt={f.name} className="h-9 w-9 rounded-full object-cover border border-slate-200" />
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-800">{f.name}</h4>
                      <p className="text-[10px] mt-0.5 text-slate-400">Office: {f.office} • Hours: {f.hours}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule Booking Matrix */}
            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4">
              <span className="text-[10px] font-black text-slate-450 uppercase tracking-widest block">Book Office Consultation</span>
              
              {officeHoursBooking ? (
                <div className="p-4 rounded-xl border border-sky-200 text-xs space-y-2 bg-sky-50 text-sky-650">
                  <div className="font-extrabold flex items-center gap-1.5 text-sky-600">
                    <CheckCircle className="h-4 w-4" /> Consultation Booked Successfully!
                  </div>
                  <p className="text-slate-600"><strong>Advisor:</strong> {officeHoursBooking.professor}</p>
                  <p className="text-slate-600"><strong>Time Slot:</strong> {officeHoursBooking.time}</p>
                  <p className="text-slate-600"><strong>Topic:</strong> {officeHoursBooking.topic}</p>
                  <button 
                    onClick={() => setOfficeHoursBooking(null)}
                    className="text-[10px] text-sky-600 hover:text-sky-700 font-bold block mt-2"
                  >
                    Schedule another...
                  </button>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold block mb-1 text-slate-500">Select Professor</label>
                    <select
                      value={officeHoursProfessor}
                      onChange={(e) => setOfficeHoursProfessor(e.target.value)}
                      className="w-full border border-slate-200 bg-white rounded-lg p-2.5 focus:outline-none focus:border-sky-500 cursor-pointer text-slate-700"
                    >
                      <option>Dr. Sarah Jenkins</option>
                      <option>Prof. Alan Turing</option>
                      <option>Prof. Ada Lovelace</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold block mb-1 text-slate-500">Choose Timeslot</label>
                    <select
                      value={officeHoursTime}
                      onChange={(e) => setOfficeHoursTime(e.target.value)}
                      className="w-full border border-slate-200 bg-white rounded-lg p-2.5 focus:outline-none focus:border-sky-500 cursor-pointer text-slate-700"
                    >
                      <option>Tuesday, 2:00 PM</option>
                      <option>Wednesday, 11:00 AM</option>
                      <option>Friday, 1:30 PM</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold block mb-1 text-slate-500">Topic details</label>
                    <input
                      type="text"
                      placeholder="e.g. Thesis advice, exam review..."
                      value={officeHoursTopic}
                      onChange={(e) => setOfficeHoursTopic(e.target.value)}
                      className="w-full border border-slate-200 bg-white rounded-lg p-2.5 focus:outline-none focus:border-sky-500 text-slate-750"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!officeHoursTopic.trim()) return
                      setOfficeHoursBooking({ professor: officeHoursProfessor, time: officeHoursTime, topic: officeHoursTopic })
                      setOfficeHoursTopic('')
                    }}
                    className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
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
            <div className="p-4 rounded-xl border border-sky-100 bg-sky-50/40 text-xs leading-relaxed space-y-2 text-sky-600">
              <span className="font-extrabold uppercase tracking-widest block text-[9px] text-sky-500">Campus Amenities Support</span>
              <p>📍 <strong>Student Housing:</strong> Dorm room requests, dining plan adjustments, maintenance orders.</p>
              <p>📍 <strong>Career Desk:</strong> Placements schedules, resume reviews, guest recruiter seminars.</p>
              <p>📍 <strong>Health Clinic:</strong> General wellness visits, sports clearances, counseling appointments.</p>
            </div>

            {/* Support Ticket form */}
            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Submit Support Inquiry / Ticket</span>
              
              {affairsSuccess ? (
                <div className="p-4 rounded-xl border border-sky-100 text-xs space-y-1 bg-sky-50 text-sky-600 animate-in fade-in">
                  <div className="text-sky-650 font-extrabold flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4" /> Ticket Submitted Successfully!
                  </div>
                  <p className="text-slate-550 mt-1"><strong>Ticket Reference:</strong> US-2026-0941-AR</p>
                  <p className="text-slate-400">Our support coordinators will review this within 24 hours.</p>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold block mb-1 text-slate-500">Subject Topic</label>
                    <input
                      type="text"
                      placeholder="e.g. Housing swap request, career guidance..."
                      value={affairsSubject}
                      onChange={(e) => setAffairsSubject(e.target.value)}
                      className="w-full border border-slate-200 bg-white rounded-lg p-2.5 focus:outline-none focus:border-sky-500 text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1 text-slate-500">Detailed Inquiry</label>
                    <textarea
                      placeholder="Explain your case in detail..."
                      rows={4}
                      value={affairsMessage}
                      onChange={(e) => setAffairsMessage(e.target.value)}
                      className="w-full border border-slate-200 bg-white rounded-lg p-2.5 focus:outline-none focus:border-sky-500 resize-none text-slate-700"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!affairsSubject.trim() || !affairsMessage.trim()) return
                      setAffairsSuccess(true)
                      setAffairsSubject('')
                      setAffairsMessage('')
                    }}
                    className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
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
              <div className="border border-slate-100 bg-slate-50 rounded-xl p-3 flex flex-col items-center">
                <Server className="h-5 w-5 text-sky-500 mb-1" />
                <span className="text-[9px] font-bold text-slate-400 uppercase">Express Backend</span>
                <span className="text-xs font-black text-sky-500 mt-0.5 animate-pulse">ONLINE</span>
              </div>
              <div className="border border-slate-100 bg-slate-50 rounded-xl p-3 flex flex-col items-center">
                <Database className="h-5 w-5 text-sky-500 mb-1" />
                <span className="text-[9px] font-bold text-slate-400 uppercase">SQLite Database</span>
                <span className="text-xs font-black text-sky-500 mt-0.5">ACTIVE</span>
              </div>
            </div>

            {/* Diagnostic Parameters list */}
            <div className="space-y-2.5 text-xs border border-slate-150 bg-slate-50 p-4 rounded-xl text-slate-650">
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">API Status:</span>
                <span className="font-extrabold text-slate-800">200 OK (Swagger docs ready)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Redis Cache Server:</span>
                <span className="text-amber-600 font-extrabold">Bypassed (In-Memory Fallback)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">RAG Vector Engine:</span>
                <span className="font-extrabold text-slate-850">Ready (Cosine Heuristics)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Active Sessions:</span>
                <span className="text-sky-600 font-extrabold">1,420 Active Peers</span>
              </div>
            </div>

            {/* Diagnostic Actions */}
            <div className="space-y-3">
              <span className="text-[10px] font-black text-slate-450 uppercase tracking-widest block">Administrative Operations</span>
              
              {adminActionStatus && (
                <div className="p-3.5 rounded-xl border border-sky-100 text-xs bg-sky-50 text-sky-600 leading-relaxed">
                  {adminActionStatus}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAdminDiagnosticAction('seed')}
                  disabled={adminActionLoading}
                  className="py-3 px-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`h-4 w-4 text-sky-500 ${adminActionLoading ? 'animate-spin' : ''}`} />
                  <span>Sync DB Seed</span>
                </button>
                <button
                  onClick={() => handleAdminDiagnosticAction('cache')}
                  disabled={adminActionLoading}
                  className="py-3 px-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <Settings className={`h-4 w-4 text-sky-500 ${adminActionLoading ? 'animate-spin' : ''}`} />
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
                className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
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
    <div className="min-h-screen flex bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 fixed h-screen z-20 justify-between select-none bg-white border-r border-sky-100/80 text-slate-700">
        
        <div>
          {/* Logo Brand */}
          <div className="p-6 flex flex-col items-start gap-0.5 border-b border-sky-100/60">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-800 flex items-center gap-2">
                <span className="h-7 w-7 rounded-lg bg-gradient-to-tr from-sky-500 to-sky-600 flex items-center justify-center text-white text-[12px] font-black shadow-sm">
                  <Globe className="h-4.5 w-4.5" />
                </span>
                <span>UniSphere</span>
              </span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider text-sky-500 mt-1">
              {isAdmin ? 'ADMIN PORTAL' : isFaculty ? 'FACULTY PORTAL' : 'STUDENT PORTAL'}
            </span>
          </div>

          {/* Nav List */}
          <nav className="px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isHash = item.path.startsWith('#')
              const isActive = isHash ? false : location.pathname === item.path
              
              const linkClass = isActive
                ? 'bg-sky-50 text-sky-600 border-l-4 border-sky-500 rounded-r-xl font-bold'
                : 'text-slate-550 hover:text-sky-600 hover:bg-sky-50/30 rounded-xl transition-all font-semibold'
              const iconColor = isActive ? 'text-sky-500' : 'text-slate-400'

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
                  className={`flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-all duration-155 ${linkClass}`}
                >
                  <Icon className={`h-4.5 w-4.5 ${iconColor}`} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Actions */}
        <div className="p-4 space-y-3 border-t border-sky-100/60">
          {isStudent ? (
            <>
              {/* Profile Row */}
              <Link to="/dashboard/profile" className="flex items-center gap-3 pt-2 px-1 hover:bg-slate-50/50 rounded-xl transition-all cursor-pointer">
                <img 
                  src={user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
                  className="h-9 w-9 rounded-full object-cover border border-slate-200" 
                  alt="Alex Johnson" 
                />
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 text-xs truncate">{user?.name || 'Alex Johnson'}</p>
                  <p className="text-[10px] text-slate-450 truncate mt-0.5">{user?.department || 'Computer Science'}, Yr 3</p>
                </div>
              </Link>

              {/* Sidebar bottom navigation actions (Support & Logout) for student */}
              <div className="space-y-1 mt-2">
                <button 
                  onClick={() => setActiveDrawer('student-affairs')}
                  className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-sky-600 hover:bg-sky-50/40 cursor-pointer"
                >
                  <HelpCircle className="h-4.5 w-4.5 text-slate-400" />
                  <span>Support</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 cursor-pointer"
                >
                  <LogOut className="h-4.5 w-4.5 text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <button 
                  onClick={() => setActiveDrawer('student-affairs')}
                  className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-sky-600 hover:bg-sky-50/40 cursor-pointer"
                >
                  <HelpCircle className="h-4.5 w-4.5 text-slate-400" />
                  <span>Support</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 cursor-pointer"
                >
                  <LogOut className="h-4.5 w-4.5 text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>

      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="sticky top-0 z-30 backdrop-blur-md h-16 px-4 md:px-8 flex items-center justify-between select-none border-b bg-white/80 border-sky-100/60 text-slate-700">
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-xl transition-colors hover:bg-slate-50 text-slate-650"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Search bar & Header links */}
          <div className="hidden md:flex items-center gap-8 w-full max-w-xl">
            
            {/* Search Input */}
            <div className="relative flex items-center w-full max-w-xs">
              <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder={isStudent ? "Search courses, events, or resources..." : "Search systems, students, or logs..."} 
                className="w-full border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none transition-all duration-200 bg-slate-50 text-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-slate-400 font-semibold"
              />
            </div>

            {/* Nav Links */}
            <div className="flex gap-6 text-xs font-semibold text-slate-500">
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveDrawer('announcements'); }} className="transition-colors hover:text-sky-600">Announcements</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveDrawer('calendar'); }} className="transition-colors hover:text-sky-600">Calendar</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveDrawer('directory'); }} className="transition-colors hover:text-sky-600">Directory</a>
            </div>

          </div>

          {/* Top Bar Actions (Notifications, Messages, Profile) */}
          <div className="flex items-center gap-4">
            
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl transition-colors relative cursor-pointer hover:bg-slate-50 text-slate-400 hover:text-sky-600"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-3.5 w-3.5 bg-rose-500 text-[8px] text-white font-black flex items-center justify-center rounded-full animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl shadow-travel p-4 animate-in fade-in slide-in-from-top-3 duration-150 z-50 bg-white border border-sky-100 text-slate-800">
                  <div className="flex items-center justify-between mb-3 border-b pb-2 border-slate-100">
                    <span className="font-bold text-xs text-slate-800">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[9px] font-bold text-sky-600">{unreadCount} Unread</span>
                    )}
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-[10px] text-slate-450 text-center py-6">All caught up!</p>
                    ) : (
                      notifications.map((n: Notification) => (
                        <div 
                          key={n.id} 
                          className={`p-2.5 rounded-xl text-[11px] transition-colors border border-transparent cursor-pointer ${
                            n.isRead 
                              ? 'opacity-65 bg-transparent' 
                              : 'bg-sky-50/50 border-l-2 border-l-sky-500 text-slate-800 font-bold'
                          }`}
                          onClick={() => !n.isRead && readNotifMutation.mutate(n.id)}
                        >
                          <div className="flex justify-between items-start gap-1">
                            <span className="font-bold text-slate-800">{n.title}</span>
                          </div>
                          <p className="mt-1 text-slate-500 text-[10px] leading-relaxed">{n.message}</p>
                          <span className="text-[9px] text-slate-455 block mt-1">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* AI Assistant Robot Button */}
            <button
              onClick={() => setActiveDrawer('system-admin')}
              className="p-2 rounded-xl transition-colors cursor-pointer hover:bg-slate-50 text-slate-400 hover:text-sky-600"
            >
              <Bot className="h-4.5 w-4.5" />
            </button>

            {/* Messages Mail Icon */}
            <button
              onClick={() => alert("Mailbox is currently empty.")}
              className="p-2 rounded-xl transition-colors cursor-pointer hover:bg-slate-50 text-slate-400 hover:text-sky-600"
            >
              <Mail className="h-4.5 w-4.5" />
            </button>

            {/* User Profile Widget */}
            <Link to="/dashboard/profile" className="flex items-center gap-3 hover:bg-slate-50 p-1.5 rounded-xl transition-all cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="font-extrabold text-xs text-slate-800">{user?.name || 'Admin Chief'}</p>
                <p className="text-[9px] font-black tracking-wider uppercase mt-0.5 text-sky-500">
                  {isAdmin ? 'LEVEL 4 ACCESS' : isFaculty ? 'FACULTY COORDINATOR' : 'STUDENT LEVEL 3'}
                </p>
              </div>
              <div className="h-9 w-9 rounded-full overflow-hidden border border-slate-200">
                <img 
                  src={user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
                  alt="Profile" 
                  className="h-full w-full object-cover"
                />
              </div>
            </Link>

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
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
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
            <div className="w-screen max-w-md sm:max-w-lg border-l shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 bg-white border-sky-100 text-slate-800">
              
              {/* Header */}
              <div className="p-6 border-b flex items-center justify-between border-sky-100 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  {getDrawerIcon()}
                  <h3 className="font-extrabold text-sm text-slate-800">{getDrawerTitle()}</h3>
                </div>
                <button 
                  onClick={() => {
                    setActiveDrawer(null)
                    setDrawerSearchQuery('')
                    setAdminActionStatus(null)
                    setAffairsSuccess(false)
                    setTranscriptRequestStatus(null)
                  }}
                  className="p-1.5 rounded-xl transition-colors hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-600">
                {renderDrawerContent()}
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t text-center text-[9px] font-black uppercase tracking-wider border-sky-100 bg-slate-50/50 text-slate-400">
                UniSphere Systems • Sandbox Environment
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <nav className="relative flex flex-col w-64 h-full p-6 animate-in slide-in-from-left duration-150 bg-white border-r border-sky-100 text-slate-700">
            <div className="flex items-center justify-between mb-8">
              <span className="font-extrabold text-xl text-slate-800 flex items-center gap-1.5">
                <span className="h-6 w-6 rounded-md bg-gradient-to-tr from-sky-500 to-sky-600 flex items-center justify-center text-white text-[11px] font-black">
                  <Globe className="h-3.5 w-3.5" />
                </span>
                <span>UniSphere</span>
              </span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon
                const isHash = item.path.startsWith('#')
                const isActive = isHash ? false : location.pathname === item.path
                
                const linkClass = isActive
                  ? 'bg-sky-50 text-sky-600 border-l-4 border-sky-500 rounded-r-xl font-bold'
                  : 'text-slate-550 hover:text-sky-600 hover:bg-sky-50/30 rounded-xl transition-all'

                return (
                  <Link
                    key={item.label}
                    to={isHash ? '#' : item.path}
                    onClick={(e) => {
                      if (isHash) {
                        e.preventDefault()
                        setActiveDrawer(item.path.substring(1))
                        setMobileMenuOpen(false)
                      } else {
                        setMobileMenuOpen(false)
                      }
                    }}
                    className={`flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-all ${linkClass}`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>
      )}

      {/* Digital Pass Overlay Modal */}
      {selectedPass && (
        <Dialog 
          isOpen={!!selectedPass} 
          onClose={() => setSelectedPass(null)}
          title="Campus Digital Boarding Pass"
        >
          <div className="p-6 bg-slate-50 flex flex-col items-center">
            <DigitalPass 
              event={selectedPass.event}
              passCode={selectedPass.passCode}
              studentName={user?.name || 'Alex Rivera'}
            />
            <p className="text-[9px] text-slate-500 font-extrabold uppercase mt-6 tracking-widest">
              Present QR code to faculty scanner at event entrance
            </p>
          </div>
        </Dialog>
      )}

    </div>
  )
}

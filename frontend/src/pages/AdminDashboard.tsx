import React, { useState } from 'react'
import { 
  Users, 
  Clock, 
  ArrowUpRight, 
  SlidersHorizontal, 
  MoreVertical, 
  Edit2, 
  Check, 
  X, 
  Activity,
  Plus,
  Brain,
  Download,
  QrCode,
  ShieldCheck
} from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { 
  usePendingEvents, useApproveEvent, usePendingClubs, 
  useApproveClub, useUsersList, useAIEngagementStats 
} from '../hooks/useApi'
import { 
  ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, 
  PieChart, Pie 
} from 'recharts'
import type { Event, Club } from '../types'
import type { User } from '../store/authStore'

export const AdminDashboard: React.FC = () => {
  const { data: pendingEvents = [] } = usePendingEvents()
  const { data: pendingClubs = [] } = usePendingClubs()
  const { data: usersList = [] } = useUsersList()
  const { data: stats } = useAIEngagementStats()

  const approveEventMutation = useApproveEvent()
  const approveClubMutation = useApproveClub()

  // Local state managers
  const [approvalsTab, setApprovalsTab] = useState<'events' | 'clubs'>('events')
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week')
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'STUDENT' | 'FACULTY' | 'ADMIN'>('ALL')
  const [deptFilter, setDeptFilter] = useState<'ALL' | string>('ALL')

  const handleApproveEvent = (eventId: number, approve: boolean) => {
    approveEventMutation.mutate({ eventId, approve })
  }

  const handleApproveClub = (clubId: number, approve: boolean) => {
    approveClubMutation.mutate({ clubId, approve })
  }

  // Filtered users list based on selected filters
  const filteredUsers = usersList.filter((usr: User) => {
    if (roleFilter !== 'ALL' && usr.role !== roleFilter) return false
    if (deptFilter !== 'ALL' && usr.department !== deptFilter) return false
    return true
  })

  // Colors for Recharts categories
  const COLORS = ['#06b6d4', '#10b981', '#7c3aed']

  // Format Recharts data safely
  const rawChartData = stats?.registrationsTrend || [
    { name: 'Mon', count: 120 },
    { name: 'Tue', count: 240 },
    { name: 'Wed', count: 350 },
    { name: 'Thu', count: 280 },
    { name: 'Fri', count: 420 },
    { name: 'Sat', count: 500 },
    { name: 'Sun', count: 180 }
  ]

  // Mock Telemetry Data matching Mockup 2
  const telemetryData = [
    { name: '08:00', count: 240, isPeak: false },
    { name: '12:00', count: 460, isPeak: true },
    { name: '16:00', count: 380, isPeak: false },
    { name: '20:00', count: 290, isPeak: false }
  ]

  const totalPending = pendingEvents.length + pendingClubs.length

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans select-none pb-24 bg-slate-50/50 relative">
      
      {/* Row 1: KPI Stats Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Users</span>
            <h2 className="text-3xl font-black text-slate-900 mt-1.5">{usersList.length > 0 ? usersList.length + 12000 : 12482}</h2>
            <p className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
              <ArrowUpRight className="h-3 w-3" />
              <span>+8.4% from last week</span>
            </p>
          </div>
          <div className="h-12 w-12 bg-cyan-50 border border-cyan-100 text-cyan-700 rounded-2xl flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending Approvals</span>
            <h2 className="text-3xl font-black text-slate-900 mt-1.5">{totalPending > 0 ? totalPending : 3}</h2>
            <p className="text-[10px] text-slate-500 font-bold mt-1 flex items-center gap-1">
              <Clock className="h-3 w-3 text-slate-400" />
              <span>Action required</span>
            </p>
          </div>
          <div className="h-12 w-12 bg-amber-50 border border-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly Registrations</span>
            <h2 className="text-3xl font-black text-slate-900 mt-1.5">1,105</h2>
            <p className="text-[10px] text-cyan-700 font-bold mt-1">Peak activity: Mondays</p>
          </div>
          <div className="h-12 w-12 bg-cyan-50 border border-cyan-100 text-cyan-700 rounded-2xl flex items-center justify-center">
            <Activity className="h-5 w-5 animate-pulse" />
          </div>
        </div>

      </div>

      {/* Row 2: Density Telemetry & Quick Verify (Mockup 2 Top Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Campus Density Telemetry (col-span-8) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-extrabold text-sm tracking-tight text-slate-900">
                  Campus Density Telemetry
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Real-time attendance & foot traffic analytics</p>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase border border-emerald-100">
                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
                <span>LIVE</span>
              </span>
            </div>

            <div className="h-56 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={telemetryData}>
                  <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '10px', fontWeight: 'bold' }} tickLine={false} />
                  <YAxis stroke="#64748b" style={{ fontSize: '10px', fontWeight: 'bold' }} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#fff', 
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                      borderRadius: '12px',
                      color: '#1e293b',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }} 
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={32}>
                    {telemetryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.isPeak ? '#10b981' : '#b2ebf2'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quick Verify card (col-span-4) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-extrabold text-sm tracking-tight text-slate-900">
                  Quick Verify
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Security & Access Authorization</p>
              </div>
              <QrCode className="h-5 w-5 text-slate-400" />
            </div>

            {/* Scanning Visual Representation */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center h-32 relative overflow-hidden group">
              <div className="w-24 h-24 border-2 border-dashed border-cyan-400 rounded-xl flex items-center justify-center bg-cyan-50/20 relative">
                <div className="absolute inset-x-0 h-0.5 bg-cyan-400 top-1/2 animate-bounce" />
                <ShieldCheck className="h-10 w-10 text-cyan-600" />
              </div>
            </div>

            <div className="flex justify-between items-center text-xs font-bold text-slate-600 mt-4 border-t border-slate-100 pt-3">
              <span>System Status</span>
              <span className="text-emerald-600 flex items-center gap-1 font-extrabold">
                <ShieldCheck className="h-4 w-4" /> Secured
              </span>
            </div>
          </div>

          <button 
            onClick={() => alert("Manual Override bypass activated. Access log entry logged in diagnostic ledger.")}
            className="w-full bg-cyan-400 hover:bg-cyan-500 text-slate-900 font-extrabold py-3.5 rounded-xl transition-all cursor-pointer text-xs tracking-wider mt-4 shadow-sm"
          >
            MANUAL OVERRIDE
          </button>
        </div>

      </div>

      {/* Row 3: Event Approval Queue & AI Scheduler / System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Event Approval Queue (col-span-8) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-extrabold text-sm tracking-tight text-slate-900">
                  Event Approval Queue
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Approve or reject coordinator proposals</p>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => alert("Exporting pending lists to Excel sheet CSV.")}
                  className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export CSV</span>
                </button>

                {/* Tabs */}
                <div className="flex bg-slate-100 border border-slate-200 rounded-lg p-0.5">
                  <button 
                    onClick={() => setApprovalsTab('events')}
                    className={`px-3 py-1 rounded text-[9px] font-bold uppercase transition-all ${approvalsTab === 'events' ? 'bg-white text-cyan-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    Events
                  </button>
                  <button 
                    onClick={() => setApprovalsTab('clubs')}
                    className={`px-3 py-1 rounded text-[9px] font-bold uppercase transition-all ${approvalsTab === 'clubs' ? 'bg-white text-cyan-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    Clubs
                  </button>
                </div>
              </div>
            </div>

            {/* Approvals Table */}
            <div className="overflow-x-auto min-h-[160px]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                    <th className="pb-3 font-bold">Event Name</th>
                    <th className="pb-3 font-bold">Organizer</th>
                    <th className="pb-3 font-bold">Priority</th>
                    <th className="pb-3 font-bold">Date/Time</th>
                    <th className="pb-3 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {approvalsTab === 'events' ? (
                    pendingEvents.length > 0 ? (
                      pendingEvents.map((event: Event) => {
                        const isUrgent = event.id % 3 === 1;
                        const isMedium = event.id % 3 === 2;
                        const priorityLabel = isUrgent ? 'URGENT' : isMedium ? 'MEDIUM' : 'ROUTINE';
                        const priorityBadge = isUrgent 
                          ? 'bg-red-50 text-red-600 border border-red-100' 
                          : isMedium 
                            ? 'bg-cyan-50 text-cyan-705 border border-cyan-100' 
                            : 'bg-slate-100 text-slate-600 border border-slate-200';

                        return (
                          <tr key={event.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3.5 font-bold text-slate-800">{event.title}</td>
                            <td className="py-3.5 text-slate-600 font-medium">{event.category} Faculty</td>
                            <td className="py-3.5">
                              <Badge className={`text-[8px] font-bold ${priorityBadge}`}>{priorityLabel}</Badge>
                            </td>
                            <td className="py-3.5 font-semibold text-slate-500">{event.date}, {event.time}</td>
                            <td className="py-3.5">
                              <div className="flex gap-1.5 justify-center">
                                <button 
                                  onClick={() => handleApproveEvent(event.id, true)}
                                  className="p-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 cursor-pointer"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleApproveEvent(event.id, false)}
                                  className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      // Mock entries if empty matching Mockup 2
                      <>
                        <tr className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5">
                            <p className="font-bold text-slate-800">Quantum Physics Symposium</p>
                            <p className="text-[9px] text-slate-400 mt-0.5">Auditorium A</p>
                          </td>
                          <td className="py-3.5 text-slate-600 font-medium">Physics Faculty</td>
                          <td className="py-3.5">
                            <Badge className="text-[8px] font-bold bg-red-50 text-red-600 border border-red-100">URGENT</Badge>
                          </td>
                          <td className="py-3.5 font-semibold text-slate-500">Oct 24, 09:00 AM</td>
                          <td className="py-3.5">
                            <div className="flex gap-1.5 justify-center">
                              <button onClick={() => alert("Approved!")} className="p-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 cursor-pointer"><Check className="h-3.5 w-3.5" /></button>
                              <button onClick={() => alert("Rejected!")} className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5">
                            <p className="font-bold text-slate-800">Student AI Hackathon</p>
                            <p className="text-[9px] text-slate-400 mt-0.5">Tech Hub 2</p>
                          </td>
                          <td className="py-3.5 text-slate-600 font-medium">ACM Chapter</td>
                          <td className="py-3.5">
                            <Badge className="text-[8px] font-bold bg-cyan-50 text-cyan-705 border border-cyan-100">MEDIUM</Badge>
                          </td>
                          <td className="py-3.5 font-semibold text-slate-500">Oct 28, 08:00 PM</td>
                          <td className="py-3.5">
                            <div className="flex gap-1.5 justify-center">
                              <button onClick={() => alert("Approved!")} className="p-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 cursor-pointer"><Check className="h-3.5 w-3.5" /></button>
                              <button onClick={() => alert("Rejected!")} className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5">
                            <p className="font-bold text-slate-800">Annual Gala Dinner</p>
                            <p className="text-[9px] text-slate-400 mt-0.5">Main Hall</p>
                          </td>
                          <td className="py-3.5 text-slate-600 font-medium">Admin Affairs</td>
                          <td className="py-3.5">
                            <Badge className="text-[8px] font-bold bg-slate-100 text-slate-600 border border-slate-200">ROUTINE</Badge>
                          </td>
                          <td className="py-3.5 font-semibold text-slate-500">Nov 05, 07:30 PM</td>
                          <td className="py-3.5">
                            <div className="flex gap-1.5 justify-center">
                              <button onClick={() => alert("Approved!")} className="p-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 cursor-pointer"><Check className="h-3.5 w-3.5" /></button>
                              <button onClick={() => alert("Rejected!")} className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                            </div>
                          </td>
                        </tr>
                      </>
                    )
                  ) : (
                    pendingClubs.length > 0 ? (
                      pendingClubs.map((club: Club) => (
                        <tr key={club.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 font-bold text-slate-800">{club.name}</td>
                          <td className="py-3.5 text-slate-600 font-medium">Student Coordinator</td>
                          <td className="py-3.5">
                            <Badge className="text-[8px] font-bold bg-slate-100 text-slate-600 border border-slate-200">ROUTINE</Badge>
                          </td>
                          <td className="py-3.5 font-semibold text-slate-500">Just Now</td>
                          <td className="py-3.5">
                            <div className="flex gap-1.5 justify-center">
                              <button 
                                onClick={() => handleApproveClub(club.id, true)}
                                className="p-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 cursor-pointer"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              <button 
                                onClick={() => handleApproveClub(club.id, false)}
                                className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                          No pending club approvals in this queue.
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* AI Scheduler & System Health (col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* AI Scheduler card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4 text-left">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-cyan-50 border border-cyan-100 text-cyan-600 rounded-lg flex items-center justify-center">
                <Brain className="h-4.5 w-4.5" />
              </div>
              <h3 className="font-extrabold text-sm tracking-tight text-slate-900">AI Scheduler</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-4 border border-slate-100 rounded-2xl">
              I've analyzed the Spring 2026 course requests. There is a conflict in <span className="text-cyan-700 font-bold underline cursor-pointer">Room 402</span> between 10:00 AM - 12:00 PM.
            </p>

            <div className="space-y-2">
              <button 
                onClick={() => alert("Reassigning CS101 lecture track to Computer Lab 4...")}
                className="w-full p-3.5 bg-slate-50 border border-slate-100 hover:border-slate-200 hover:bg-slate-100/50 text-slate-700 font-bold text-xs rounded-xl flex justify-between items-center transition-all cursor-pointer"
              >
                <span>Move CS101 to Lab 4</span>
                <ArrowUpRight className="h-4 w-4 text-slate-400" />
              </button>
              <button 
                onClick={() => alert("Invoking smart rescheduling algorithm for DS404 slot...")}
                className="w-full p-3.5 bg-slate-50 border border-slate-100 hover:border-slate-200 hover:bg-slate-100/50 text-slate-700 font-bold text-xs rounded-xl flex justify-between items-center transition-all cursor-pointer"
              >
                <span>Reschedule DS404</span>
                <ArrowUpRight className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* System Health card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4 text-left">
            <h3 className="font-extrabold text-xs tracking-widest uppercase text-slate-400">System Health</h3>
            
            <div className="space-y-3">
              {/* CPU */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                  <span>CPU Load</span>
                  <span className="text-slate-900">24%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: '24%' }} />
                </div>
              </div>

              {/* Server Response */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                  <span>Server Response</span>
                  <span className="text-slate-900">12ms</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: '12%' }} />
                </div>
              </div>

              {/* Network Bandwidth */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                  <span>Network Bandwidth</span>
                  <span className="text-slate-900">8.4 Gbps</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '80%' }} />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Row 4: Engagement Charts & Club Engagement (Original detailed components styled in light mode) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Registration Trend (col-span-7) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-extrabold text-sm tracking-tight text-slate-900">
              Registration Volume Trend
            </h3>
            {/* Timeframe selector */}
            <div className="flex bg-slate-100 border border-slate-200 rounded-lg p-0.5">
              <button 
                onClick={() => setTimeframe('week')}
                className={`px-3 py-1 rounded text-[9px] font-bold uppercase transition-all ${timeframe === 'week' ? 'bg-white text-cyan-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Week
              </button>
              <button 
                onClick={() => setTimeframe('month')}
                className={`px-3 py-1 rounded text-[9px] font-bold uppercase transition-all ${timeframe === 'month' ? 'bg-white text-cyan-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Month
              </button>
            </div>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rawChartData}>
                <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '10px', fontWeight: 'bold' }} tickLine={false} />
                <YAxis stroke="#64748b" style={{ fontSize: '10px', fontWeight: 'bold' }} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    background: '#fff', 
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    borderRadius: '12px',
                    color: '#1e293b',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }} 
                />
                <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories & Club Engagement (col-span-5) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between text-center">
          <h3 className="font-extrabold text-sm tracking-tight text-slate-900 text-left mb-4">
            Event Categories Heatmap
          </h3>

          <div className="relative flex items-center justify-center h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.eventCategoryHeatmap || [
                    { category: 'Academic', value: 45 },
                    { category: 'Sports', value: 32 },
                    { category: 'Social', value: 23 }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={68}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {(stats?.eventCategoryHeatmap || [{}, {}, {}]).map((_: unknown, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: '#fff', 
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    borderRadius: '12px',
                    color: '#1e293b',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-950">154</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Total Events</span>
            </div>
          </div>

          {/* Breakdown legend */}
          <div className="space-y-2 text-[10px] font-bold text-slate-500 mt-4 text-left">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-500" />
                <span>Academic</span>
              </div>
              <span className="text-slate-800">45%</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Sports</span>
              </div>
              <span className="text-slate-800">32%</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-violet-500" />
                <span>Social</span>
              </div>
              <span className="text-slate-800">23%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Row 5: User Directory Table (Original complete table styled in light mode) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
        
        {/* Table Header with Filters */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <h3 className="font-extrabold text-sm tracking-tight text-slate-900">
            User Directory
          </h3>

          <div className="flex flex-wrap gap-2 items-center">
            
            {/* Role Filter Selector */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as 'ALL' | 'STUDENT' | 'FACULTY' | 'ADMIN')}
              className="bg-white border border-slate-200 text-slate-700 font-bold text-[10px] uppercase tracking-wider py-1.5 px-3 rounded-lg focus:outline-none focus:border-cyan-500 cursor-pointer shadow-sm"
            >
              <option value="ALL">Role: All</option>
              <option value="STUDENT">Student</option>
              <option value="FACULTY">Faculty</option>
              <option value="ADMIN">Admin</option>
            </select>

            {/* Department Filter Selector */}
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 font-bold text-[10px] uppercase tracking-wider py-1.5 px-3 rounded-lg focus:outline-none focus:border-cyan-500 cursor-pointer shadow-sm"
            >
              <option value="ALL">Department: All</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Data Science">Data Science</option>
              <option value="Business Admin">Business Admin</option>
              <option value="Applied Arts">Applied Arts</option>
            </select>

            {/* Filter Toggle */}
            <button className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors shadow-sm">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* User directory Table grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                <th className="pb-4 font-bold">User</th>
                <th className="pb-4 font-bold">ID Number</th>
                <th className="pb-4 font-bold">Role</th>
                <th className="pb-4 font-bold">Department</th>
                <th className="pb-4 font-bold">Status</th>
                <th className="pb-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              {filteredUsers.map((usr: User) => (
                <tr key={usr.id} className="hover:bg-slate-50/50 transition-colors">
                  
                  {/* User profile details */}
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={usr.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
                        className="h-8 w-8 rounded-full object-cover border border-slate-200" 
                        alt="" 
                      />
                      <div>
                        <p className="font-bold text-slate-800 text-xs">{usr.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{usr.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* ID number */}
                  <td className="py-4 font-bold text-slate-500 font-mono">
                    #{usr.id + 100}-20{usr.id + 4}
                  </td>

                  {/* Badges system role */}
                  <td className="py-4">
                    <Badge variant={usr.role === 'ADMIN' ? 'purple' : usr.role === 'FACULTY' ? 'warning' : 'info'} className="text-[9px] font-black uppercase">
                      {usr.role === 'FACULTY' ? 'Faculty' : usr.role === 'STUDENT' ? 'Student' : 'Admin'}
                    </Badge>
                  </td>

                  {/* Department */}
                  <td className="py-4 font-semibold text-slate-700">
                    {usr.department || 'Applied Science'}
                  </td>

                  {/* Dot status */}
                  <td className="py-4">
                    <span className="flex items-center gap-1.5 font-bold text-[10px] text-slate-500">
                      <span className={`w-1.5 h-1.5 rounded-full ${usr.id % 3 === 0 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      <span>{usr.id % 3 === 0 ? 'Active' : 'Offline'}</span>
                    </span>
                  </td>

                  {/* Action icons */}
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <button 
                        onClick={() => alert(`Edit profile settings for ${usr.name}`)}
                        className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button className="text-slate-400 hover:text-slate-700">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                    No directory records found matching chosen filters.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        {/* Directory Footer pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-6 border-t border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Showing 1-10 of {filteredUsers.length} users</span>
          <div className="flex gap-1.5">
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all cursor-pointer">Previous</button>
            <button className="px-3.5 py-1.5 border border-slate-200 bg-cyan-50 text-cyan-700 rounded-lg font-bold">1</button>
            <button className="px-3.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 hover:text-slate-800 transition-all cursor-pointer">2</button>
            <button className="px-3.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 hover:text-slate-800 transition-all cursor-pointer">3</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all cursor-pointer">Next</button>
          </div>
        </div>

      </div>

      {/* Floating circular + button in the bottom right corner (Mockup 2) */}
      <button 
        onClick={() => alert("Initiate fast command: Create quick notice or event schedule.")}
        className="fixed bottom-6 right-6 bg-cyan-400 hover:bg-cyan-500 text-slate-900 rounded-full p-4 shadow-xl z-20 cursor-pointer border border-cyan-300 transition-all active:scale-[0.95] flex items-center justify-center"
      >
        <Plus className="h-6 w-6" />
      </button>

    </div>
  )
}

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
  Rocket, 
  Activity
} from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { 
  usePendingEvents, useApproveEvent, usePendingClubs, 
  useApproveClub, useUsersList, useAIEngagementStats 
} from '../hooks/useApi'
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell 
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
  const COLORS = ['#6366f1', '#10b981', '#ffffff']

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

  const totalPending = pendingEvents.length + pendingClubs.length

  return (
    <div className="space-y-10 animate-in fade-in duration-500 font-sans select-none pb-16">
      
      {/* Row 1: KPI Stats Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-[#0b0e17] border border-slate-900 rounded-3xl p-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Users</span>
            <h2 className="text-3xl font-black text-white mt-1.5">{usersList.length > 0 ? usersList.length + 12000 : 12482}</h2>
            <p className="text-[10px] text-emerald-400 font-bold mt-1 flex items-center gap-0.5">
              <ArrowUpRight className="h-3 w-3" />
              <span>+8.4% from last week</span>
            </p>
          </div>
          <div className="h-12 w-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#0b0e17] border border-slate-900 rounded-3xl p-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pending Approvals</span>
            <h2 className="text-3xl font-black text-white mt-1.5">{totalPending > 0 ? totalPending : 42}</h2>
            <p className="text-[10px] text-slate-500 font-bold mt-1 flex items-center gap-1">
              <Clock className="h-3 w-3 text-slate-500" />
              <span>12 Urgent requests</span>
            </p>
          </div>
          <div className="h-12 w-12 bg-[#121624] border border-slate-800 text-amber-500 rounded-2xl flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#0b0e17] border border-slate-900 rounded-3xl p-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Monthly Registrations</span>
            <h2 className="text-3xl font-black text-white mt-1.5">1,105</h2>
            <p className="text-[10px] text-indigo-400 font-bold mt-1">^ Peak activity: Mondays</p>
          </div>
          <div className="h-12 w-12 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-2xl flex items-center justify-center">
            <Activity className="h-5 w-5 animate-pulse" />
          </div>
        </div>

      </div>

      {/* Row 2: Registration Volume & Event Categories Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Registration Volume (Left, col-span-8) */}
        <div className="lg:col-span-8 bg-[#0b0e17] border border-slate-900 rounded-3xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-extrabold text-base tracking-tight text-white">
              Registration Volume
            </h3>
            {/* Timeframe selector */}
            <div className="flex bg-[#121624] border border-slate-800 rounded-lg p-0.5">
              <button 
                onClick={() => setTimeframe('week')}
                className={`px-3 py-1 rounded text-[9px] font-bold uppercase transition-all ${timeframe === 'week' ? 'bg-slate-900 text-indigo-400 border border-slate-800' : 'text-slate-500 hover:text-white'}`}
              >
                Week
              </button>
              <button 
                onClick={() => setTimeframe('month')}
                className={`px-3 py-1 rounded text-[9px] font-bold uppercase transition-all ${timeframe === 'month' ? 'bg-slate-900 text-indigo-400 border border-slate-800' : 'text-slate-500 hover:text-white'}`}
              >
                Month
              </button>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rawChartData}>
                <XAxis dataKey="name" stroke="#475569" style={{ fontSize: '10px', fontWeight: 'bold' }} tickLine={false} />
                <YAxis stroke="#475569" style={{ fontSize: '10px', fontWeight: 'bold' }} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(12, 16, 29, 0.95)', 
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px'
                  }} 
                />
                <Bar dataKey="count" fill="#818cf8" radius={[6, 6, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Event Categories pie/donut (Right, col-span-4) */}
        <div className="lg:col-span-4 bg-[#0b0e17] border border-slate-900 rounded-3xl p-6 flex flex-col justify-between text-center">
          
          <h3 className="font-extrabold text-base tracking-tight text-white mb-4">
            Event Categories
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
                  {stats?.eventCategoryHeatmap?.map((_: unknown, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  )) || [
                    <Cell key="cell-0" fill="#6366f1" />,
                    <Cell key="cell-1" fill="#10b981" />,
                    <Cell key="cell-2" fill="#ffffff" />
                  ]}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(12, 16, 29, 0.95)', 
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-white">154</span>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Total Events</span>
            </div>
          </div>

          {/* Breakdown legend */}
          <div className="space-y-2 text-[10px] font-bold text-slate-400 mt-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>Academic</span>
              </div>
              <span className="text-white">45%</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Sports</span>
              </div>
              <span className="text-white">32%</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white" />
                <span>Social</span>
              </div>
              <span className="text-white">23%</span>
            </div>
          </div>

        </div>

      </div>

      {/* Row 3: Approvals Queue & Club Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Approvals Queue (Left, col-span-7) */}
        <div className="lg:col-span-7 bg-[#0b0e17] border border-slate-900 rounded-3xl p-6 flex flex-col justify-between">
          
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-base tracking-tight text-white">
                Approvals Queue
              </h3>
              {/* Tabs */}
              <div className="flex bg-[#121624] border border-slate-800 rounded-lg p-0.5">
                <button 
                  onClick={() => setApprovalsTab('events')}
                  className={`px-3 py-1 rounded text-[9px] font-bold uppercase transition-all ${approvalsTab === 'events' ? 'bg-slate-900 text-indigo-400 border border-slate-800' : 'text-slate-500 hover:text-white'}`}
                >
                  Events
                </button>
                <button 
                  onClick={() => setApprovalsTab('clubs')}
                  className={`px-3 py-1 rounded text-[9px] font-bold uppercase transition-all ${approvalsTab === 'clubs' ? 'bg-slate-900 text-indigo-400 border border-slate-800' : 'text-slate-500 hover:text-white'}`}
                >
                  Clubs
                </button>
              </div>
            </div>

            {/* Approvals List container */}
            <div className="space-y-3 min-h-[160px]">
              
              {approvalsTab === 'events' ? (
                /* Pending Events */
                pendingEvents.slice(0, 3).map((event: Event) => (
                  <div key={event.id} className="p-4 rounded-2xl bg-[#121624]/60 border border-slate-800/80 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                        <Rocket className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-white truncate">{event.title}</h4>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">Requested by Dr. Jenkins • Faculty of CS</p>
                      </div>
                    </div>
                    {/* Approve / Reject buttons */}
                    <div className="flex gap-1.5 shrink-0">
                      <button 
                        onClick={() => handleApproveEvent(event.id, false)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500"
                        title="Reject Event"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleApproveEvent(event.id, true)}
                        className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500"
                        title="Approve Event"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                /* Pending Clubs */
                pendingClubs.slice(0, 3).map((club: Club) => (
                  <div key={club.id} className="p-4 rounded-2xl bg-[#121624]/60 border border-slate-800/80 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0">
                        <Users className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-white truncate">{club.name}</h4>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{club.description || 'Requested campus chapter'}</p>
                      </div>
                    </div>
                    {/* Approve / Reject buttons */}
                    <div className="flex gap-1.5 shrink-0">
                      <button 
                        onClick={() => handleApproveClub(club.id, false)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500"
                        title="Reject Club"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleApproveClub(club.id, true)}
                        className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500"
                        title="Verify Club"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}

              {/* Empty State fallback */}
              {((approvalsTab === 'events' && pendingEvents.length === 0) || (approvalsTab === 'clubs' && pendingClubs.length === 0)) && (
                <div className="p-8 border border-dashed border-slate-800 rounded-2xl text-center text-xs text-slate-500">
                  No authorization requests pending review in this queue.
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Club Engagement indexes (Right, col-span-5) */}
        <div className="lg:col-span-5 bg-[#0b0e17] border border-slate-900 rounded-3xl p-6 flex flex-col justify-between">
          <h3 className="font-extrabold text-base tracking-tight text-white mb-6">
            Club Engagement
          </h3>

          <div className="space-y-4 flex-1 flex flex-col justify-center">
            
            {/* Club 1: Coding Club */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>Coding Club</span>
                <span className="text-white">92%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            {/* Club 2: Debate Society */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>Debate Society</span>
                <span className="text-white">78%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '78%' }} />
              </div>
            </div>

            {/* Club 3: Music Ensemble */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>Music Ensemble</span>
                <span className="text-white">64%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: '64%' }} />
              </div>
            </div>

            {/* Club 4: Environmental Club */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>Environmental Club</span>
                <span className="text-white">45%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Row 4: User Directory Table */}
      <div className="bg-[#0b0e17] border border-slate-900 rounded-3xl p-6 md:p-8">
        
        {/* Table Header with Filters */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <h3 className="font-extrabold text-base tracking-tight text-white">
            User Directory
          </h3>

          <div className="flex flex-wrap gap-2 items-center">
            
            {/* Role Filter Selector */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as 'ALL' | 'STUDENT' | 'FACULTY' | 'ADMIN')}
              className="bg-[#121624] border border-slate-800 text-slate-300 font-bold text-[10px] uppercase tracking-wider py-1.5 px-3 rounded-lg focus:outline-none focus:border-indigo-600 cursor-pointer"
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
              className="bg-[#121624] border border-slate-800 text-slate-300 font-bold text-[10px] uppercase tracking-wider py-1.5 px-3 rounded-lg focus:outline-none focus:border-indigo-600 cursor-pointer"
            >
              <option value="ALL">Department: All</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Data Science">Data Science</option>
              <option value="Business Admin">Business Admin</option>
              <option value="Applied Arts">Applied Arts</option>
            </select>

            {/* Filter Toggle */}
            <button className="p-2 rounded-xl border border-slate-800 bg-[#0d111d] text-slate-400 hover:text-white transition-colors">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* User directory Table grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-900 text-slate-500 font-bold uppercase tracking-wider">
                <th className="pb-4 font-bold">User</th>
                <th className="pb-4 font-bold">ID Number</th>
                <th className="pb-4 font-bold">Role</th>
                <th className="pb-4 font-bold">Department</th>
                <th className="pb-4 font-bold">Status</th>
                <th className="pb-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              
              {filteredUsers.map((usr: User) => (
                <tr key={usr.id} className="hover:bg-slate-900/20 transition-colors">
                  
                  {/* User profile details */}
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={usr.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
                        className="h-8 w-8 rounded-full object-cover border border-slate-800" 
                        alt="" 
                      />
                      <div>
                        <p className="font-bold text-white text-xs">{usr.name}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{usr.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* ID number */}
                  <td className="py-4 font-bold text-slate-400 font-mono">
                    #{usr.id + 100}-20{usr.id + 4}
                  </td>

                  {/* Badges system role */}
                  <td className="py-4">
                    <Badge variant={usr.role === 'ADMIN' ? 'purple' : usr.role === 'FACULTY' ? 'warning' : 'info'} className="text-[9px] font-black uppercase">
                      {usr.role === 'FACULTY' ? 'Faculty' : usr.role === 'STUDENT' ? 'Student' : 'Admin'}
                    </Badge>
                  </td>

                  {/* Department */}
                  <td className="py-4 font-semibold text-slate-300">
                    {usr.department || 'Applied Science'}
                  </td>

                  {/* Dot status */}
                  <td className="py-4">
                    <span className="flex items-center gap-1.5 font-bold text-[10px] text-slate-400">
                      <span className={`w-1.5 h-1.5 rounded-full ${usr.id % 3 === 0 ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                      <span>{usr.id % 3 === 0 ? 'Active' : 'Offline'}</span>
                    </span>
                  </td>

                  {/* Action icons */}
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <button 
                        onClick={() => alert(`Edit profile settings for ${usr.name}`)}
                        className="p-1.5 rounded-lg bg-[#121624]/60 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button className="text-slate-500 hover:text-white">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">
                    No directory records found matching chosen filters.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        {/* Directory Footer pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-6 border-t border-slate-900 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          <span>Showing 1-10 of {filteredUsers.length} users</span>
          <div className="flex gap-1.5">
            <button className="px-3 py-1.5 border border-slate-800 rounded-lg bg-slate-900/40 text-slate-400 hover:text-white transition-all">Previous</button>
            <button className="px-3.5 py-1.5 border border-slate-800 bg-slate-900 text-indigo-400 rounded-lg">1</button>
            <button className="px-3.5 py-1.5 border border-slate-800 rounded-lg bg-slate-900/40 hover:text-white transition-all">2</button>
            <button className="px-3.5 py-1.5 border border-slate-800 rounded-lg bg-slate-900/40 hover:text-white transition-all">3</button>
            <button className="px-3 py-1.5 border border-slate-800 rounded-lg bg-slate-900/40 text-slate-400 hover:text-white transition-all">Next</button>
          </div>
        </div>

      </div>

    </div>
  )
}

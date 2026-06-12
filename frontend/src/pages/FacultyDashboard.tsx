import React, { useState } from 'react'
import { 
  Signal, 
  Users, 
  Star, 
  Calendar, 
  Sparkles, 
  XCircle, 
  MoreVertical, 
  BarChart3, 
  Download, 
  SlidersHorizontal, 
  CheckCircle2, 
  HelpCircle, 
  ScanLine,
  FlaskConical
} from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Dialog } from '../components/ui/Dialog'
import { 
  useCoordinatorEvents, useCreateEvent, useDeleteEvent, 
  useEventAttendees, useCheckInAttendance, useAIPredictAttendance, 
  useAISmartSchedule, useClubs 
} from '../hooks/useApi'
import type { Event, Club, Attendee } from '../types'

export const FacultyDashboard: React.FC = () => {
  const { data: events = [] } = useCoordinatorEvents()
  const { data: clubs = [] } = useClubs()
  const createEventMutation = useCreateEvent()
  const deleteEventMutation = useDeleteEvent()
  const checkInMutation = useCheckInAttendance()
  
  // Local state managers
  const [createOpen, setCreateOpen] = useState(false)
  const [attendanceOpen, setAttendanceOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
  const [scanPassCode, setScanPassCode] = useState('')
  const [scanMessage, setScanMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // AI attendance predictor parameters
  const predCategory = 'TECH'
  const predCapacity = 100;
  const predDay = 'Saturday';

  // Form states (prefilled with defaults, mapped to suggested slots)
  const [formTitle, setFormTitle] = useState('')
  const [formDesc, setFormDesc] = useState('AI Enhanced Campus Event')
  const [formDate, setFormDate] = useState('2026-06-25')
  const [formTime, setFormTime] = useState('14:00')
  const [formLocation, setFormLocation] = useState('CS Block Block A Auditorium')
  const [formCapacity, setFormCapacity] = useState(100)
  const [formCategory, setFormCategory] = useState('TECH')
  const [formClubId, setFormClubId] = useState('1')

  // AI API Hooks
  const { data: aiPrediction, isLoading: predLoading } = useAIPredictAttendance(predCategory, predCapacity, predDay)
  const { data: smartSlots = [] } = useAISmartSchedule()
  const { data: attendees = [], refetch: refetchAttendees } = useEventAttendees(selectedEventId || 0)

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createEventMutation.mutate({
      title: formTitle,
      description: formDesc,
      date: formDate,
      time: formTime,
      location: formLocation,
      maxCapacity: formCapacity,
      category: formCategory,
      clubId: formClubId
    }, {
      onSuccess: () => {
        setCreateOpen(false)
        setFormTitle('')
        setFormDesc('AI Enhanced Campus Event')
      }
    })
  }

  const handleDeleteEvent = (id: number) => {
    if (confirm('Are you sure you want to cancel and delete this event?')) {
      deleteEventMutation.mutate(id)
    }
  }

  const handleScanCheckIn = (e: React.FormEvent) => {
    e.preventDefault()
    setScanMessage(null)
    if (!selectedEventId || !scanPassCode) return

    checkInMutation.mutate({
      eventId: selectedEventId,
      passCode: scanPassCode
    }, {
      onSuccess: () => {
        setScanMessage({ type: 'success', text: 'Checked in successfully!' })
        setScanPassCode('')
        refetchAttendees()
      },
      onError: (err: Error) => {
        setScanMessage({ type: 'error', text: err.message || 'Check-in failed.' })
      }
    })
  }

  const handleSelectSlot = (date: string, time: string) => {
    setFormDate(date)
    setFormTime(time)
    alert(`Suggested slot selected: ${date} at ${time}`)
  }

  // Calculate live events count based on loaded events
  const activeEventsCount = events.filter((e: Event) => e.status === 'APPROVED').length

  return (
    <div className="space-y-10 animate-in fade-in duration-500 font-sans select-none pb-16">
      
      {/* Row 1: Telemetry Stats Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-[#0b0e17] border border-slate-900 rounded-3xl p-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Events</span>
            <h2 className="text-3xl font-black text-white mt-1.5">{activeEventsCount || 14} Active</h2>
            <p className="text-[10px] text-emerald-400 font-bold mt-1">+12% from last week</p>
          </div>
          <div className="h-12 w-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center">
            <Signal className="h-5 w-5 animate-pulse" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#0b0e17] border border-slate-900 rounded-3xl p-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Attendees</span>
            <h2 className="text-3xl font-black text-white mt-1.5">3,248</h2>
            <p className="text-[10px] text-slate-500 font-bold mt-1">Across all active tracks</p>
          </div>
          <div className="h-12 w-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#0b0e17] border border-slate-900 rounded-3xl p-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Average Hub Score</span>
            <h2 className="text-3xl font-black text-white mt-1.5">92.4</h2>
            {/* Visual Mini Progress Bar */}
            <div className="h-1.5 w-32 bg-slate-900 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-violet-500 rounded-full" style={{ width: '92%' }} />
            </div>
          </div>
          <div className="h-12 w-12 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-2xl flex items-center justify-center">
            <Star className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* Row 2: Grid Form & Estimators */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Create Event Panel (Left, col-span-7) */}
        <div className="lg:col-span-7 bg-[#0b0e17] border border-slate-900 rounded-3xl p-8 flex flex-col justify-between">
          
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-lg tracking-tight text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-400" />
                <span>Create New Event</span>
              </h3>
              <Badge variant="success" className="px-2 py-0.5 font-black text-[9px] uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex gap-1 items-center">
                <Sparkles className="h-3 w-3" />
                <span>AI Enhanced</span>
              </Badge>
            </div>

            {/* Inline Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Event Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Graduate Colloquium"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-[#131929] border border-slate-800 focus:border-indigo-600 text-white rounded-xl py-3 px-4 text-xs focus:outline-none transition-all placeholder-slate-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department</label>
                <select
                  value={formClubId}
                  onChange={(e) => setFormClubId(e.target.value)}
                  className="w-full bg-[#131929] border border-slate-800 focus:border-indigo-600 text-white rounded-xl py-3 px-3 text-xs focus:outline-none transition-all"
                >
                  {clubs.map((c: Club) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                  {clubs.length === 0 && <option value="1">Computer Science</option>}
                </select>
              </div>
            </div>

            {/* Proposed Scheduling Suggestions */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Proposed Scheduling</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* AI Suggestion Slot 1 */}
                <div 
                  onClick={() => handleSelectSlot(smartSlots[0]?.date || '2026-10-24', smartSlots[0]?.time || '10:00')}
                  className="bg-[#121624]/60 border border-dashed border-indigo-500/30 hover:border-indigo-500 rounded-2xl p-4 cursor-pointer transition-all flex flex-col justify-between min-h-[90px]"
                >
                  <div>
                    <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-indigo-400" />
                      <span>AI Suggested</span>
                    </span>
                    <h4 className="font-bold text-xs text-white mt-1.5">
                      {smartSlots[0]?.date || 'Oct 24'}, {smartSlots[0]?.time || '10:00 AM'}
                    </h4>
                  </div>
                  <span className="text-[8px] text-slate-500 font-bold mt-2 block">High Engagement Prob.</span>
                </div>

                {/* Slot 2 */}
                <div 
                  onClick={() => handleSelectSlot(smartSlots[1]?.date || '2026-10-25', smartSlots[1]?.time || '14:00')}
                  className="bg-[#121624]/30 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 cursor-pointer transition-all flex flex-col justify-between min-h-[90px]"
                >
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Alternative</span>
                    <h4 className="font-bold text-xs text-white mt-1.5">
                      {smartSlots[1]?.date || 'Oct 25'}, {smartSlots[1]?.time || '2:00 PM'}
                    </h4>
                  </div>
                </div>

                {/* Slot 3: Custom Date Picker Trigger */}
                <div 
                  onClick={() => setCreateOpen(true)}
                  className="bg-[#121624]/30 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 cursor-pointer transition-all flex items-center justify-center min-h-[90px]"
                >
                  <Calendar className="h-5 w-5 text-slate-500" />
                </div>

              </div>

            </div>
          </div>

          {/* Create Event Submit Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={() => alert("Draft Event saved to templates.")}
              className="flex-1 py-3.5 border border-slate-800 hover:border-slate-700 bg-slate-900/40 text-slate-300 font-bold text-xs rounded-xl transition-all"
            >
              Draft
            </button>
            <button
              onClick={(e) => {
                if (!formTitle) {
                  alert("Please fill in the Event Name first.");
                  return;
                }
                handleCreateEventSubmit(e);
              }}
              className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/20"
            >
              Initialize Event
            </button>
          </div>

        </div>

        {/* Attendance Predictor (Right, col-span-5) */}
        <div className="lg:col-span-5 bg-[#0b0e17] border border-slate-900 rounded-3xl p-8 flex flex-col justify-between text-center">
          
          <div>
            <h3 className="font-extrabold text-base tracking-tight text-white flex items-center justify-center gap-2 mb-6">
              <BarChart3 className="h-5 w-5 text-indigo-400" />
              <span>Attendance Predictor</span>
            </h3>

            {/* Radial progress SVG */}
            <div className="relative flex items-center justify-center h-40 mb-6">
              <svg className="w-36 h-36 transform -rotate-90">
                <circle 
                  cx="72" 
                  cy="72" 
                  r="62" 
                  className="text-slate-900" 
                  strokeWidth="8" 
                  stroke="currentColor" 
                  fill="transparent" 
                />
                <circle 
                  cx="72" 
                  cy="72" 
                  r="62" 
                  className="text-emerald-500" 
                  strokeWidth="8" 
                  strokeDasharray={389.5} 
                  strokeDashoffset={389.5 * (1 - (aiPrediction?.predictedAttendanceRate || 80) / 100)} 
                  strokeLinecap="round" 
                  stroke="currentColor" 
                  fill="transparent" 
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">
                  {predLoading ? '...' : `${aiPrediction?.predictedAttendanceRate || 80}%`}
                </span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Confidence</span>
              </div>
            </div>

            {/* expected & risk details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#121624]/60 border border-slate-800/80 rounded-2xl p-4">
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Expected High</span>
                <h4 className="text-lg font-black text-white mt-1">{aiPrediction?.expectedAttendance || 450}</h4>
              </div>
              <div className="bg-[#121624]/60 border border-slate-800/80 rounded-2xl p-4">
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Risk Factor</span>
                <h4 className="text-lg font-black text-emerald-400 mt-1">Low</h4>
              </div>
            </div>

          </div>

          {/* tip caption */}
          <p className="text-[10px] text-slate-500 italic mt-6">
            "Historical data suggests mid-morning sessions yield 15% higher retention."
          </p>

        </div>

      </div>

      {/* Row 3: Active Events Table */}
      <div className="bg-[#0b0e17] border border-slate-900 rounded-3xl p-6 md:p-8">
        
        {/* Table Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-extrabold text-base tracking-tight text-white">
            Active Events Table
          </h3>
          <div className="flex gap-2">
            <button onClick={() => alert("Filtering events list...")} className="p-2 rounded-xl border border-slate-800 bg-[#0d111d] text-slate-400 hover:text-white transition-colors">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
            <button onClick={() => alert("Downloading attendance spreadsheet report...")} className="p-2 rounded-xl border border-slate-800 bg-[#0d111d] text-slate-400 hover:text-white transition-colors">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Table Wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-900 text-slate-500 font-bold uppercase tracking-wider">
                <th className="pb-4 font-bold">Event Details</th>
                <th className="pb-4 font-bold">Coordinator</th>
                <th className="pb-4 font-bold">Status</th>
                <th className="pb-4 font-bold">Capacity</th>
                <th className="pb-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              
              {events.map((event: Event) => {
                const regCount = event.registrationCount || 0;
                const capacityRatio = regCount / event.maxCapacity;
                const statusLabel = event.status === 'APPROVED' ? 'Live' : event.status === 'PENDING' ? 'Upcoming' : 'Completed';
                const statusColor = event.status === 'APPROVED' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : event.status === 'PENDING' 
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                    : 'bg-slate-900 text-slate-400 border border-slate-800';

                return (
                  <tr key={event.id} className="hover:bg-slate-900/20 transition-colors">
                    
                    {/* Event details */}
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                          <FlaskConical className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs">{event.title}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{event.location} • {event.time}</p>
                        </div>
                      </div>
                    </td>

                    {/* Coordinator */}
                    <td className="py-4 font-semibold text-slate-300">
                      Dr. Sarah Jenkins
                    </td>

                    {/* Status badge */}
                    <td className="py-4">
                      <Badge className={`px-2 py-0.5 font-bold text-[9px] uppercase tracking-wider rounded-lg ${statusColor}`}>
                        {statusLabel}
                      </Badge>
                    </td>

                    {/* Capacity Indicator Progress */}
                    <td className="py-4 w-36">
                      <div>
                        <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 mb-1">
                          <span>{regCount} / {event.maxCapacity}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${event.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                            style={{ width: `${Math.min(100, capacityRatio * 100)}%` }} 
                          />
                        </div>
                      </div>
                    </td>

                    {/* Actions icons */}
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        
                        {/* Attendance scan */}
                        <button 
                          onClick={() => {
                            setSelectedEventId(event.id)
                            setAttendanceOpen(true)
                          }}
                          className="p-1.5 rounded-lg bg-[#121624]/60 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                          title="Verify Registrations Attendance"
                        >
                          <BarChart3 className="h-3.5 w-3.5" />
                        </button>

                        {/* Cancel/Delete */}
                        <button 
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-1.5 rounded-lg bg-[#121624]/60 border border-slate-800 text-rose-400 hover:text-rose-300 transition-colors"
                          title="Cancel Event"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                        </button>

                        <button className="text-slate-500 hover:text-white">
                          <MoreVertical className="h-4 w-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                )
              })}

              {events.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">
                    You have not scheduled any events yet. Fill in the event creator above to start.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

      </div>

      {/* CREATE EVENT DIALOG MODAL (Fallback/Detailed) */}
      <Dialog
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Schedule Campus Event"
      >
        <form onSubmit={handleCreateEventSubmit} className="space-y-4">
          <Input
            label="Event Title"
            id="event-title"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            required
          />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase pl-1">Description</label>
            <textarea
              className="w-full px-4 py-2.5 bg-background/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[80px]"
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              id="event-date"
              type="date"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              required
            />
            <Input
              label="Time"
              id="event-time"
              type="time"
              value={formTime}
              onChange={(e) => setFormTime(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Auditorium/Location"
              id="event-loc"
              value={formLocation}
              onChange={(e) => setFormLocation(e.target.value)}
              required
            />
            <Input
              label="Max Capacity"
              id="event-cap"
              type="number"
              value={formCapacity}
              onChange={(e) => setFormCapacity(Number(e.target.value))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Event Category"
              id="event-cat"
              options={[
                { value: 'TECH', label: 'Technology' },
                { value: 'SPORTS', label: 'Sports & Athletics' },
                { value: 'ACADEMIC', label: 'Academic & Seminar' },
                { value: 'CULTURAL', label: 'Cultural & Arts' }
              ]}
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
            />
            <Select
              label="Hosting Club"
              id="event-club"
              options={clubs.map((c: Club) => ({ value: c.id, label: c.name }))}
              value={formClubId}
              onChange={(e) => setFormClubId(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full mt-4">
            Publish Event Schedule
          </Button>
        </form>
      </Dialog>

      {/* ATTENDANCE SCANNERS & LOGS DIALOG */}
      <Dialog
        isOpen={attendanceOpen}
        onClose={() => {
          setAttendanceOpen(false)
          setSelectedEventId(null)
          setScanMessage(null)
          setScanPassCode('')
        }}
        title="Event Attendance Tracker"
      >
        <div className="space-y-6 text-slate-300">
          
          {/* Mock QR Scan Code Entry Form */}
          <form onSubmit={handleScanCheckIn} className="space-y-3">
            <Input
              label="Simulate Digital Pass QR Scan"
              id="scan-code"
              placeholder="e.g. PASS-1-100432 (Enter pass code)"
              value={scanPassCode}
              onChange={(e) => setScanPassCode(e.target.value)}
              required
            />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 flex gap-1.5 items-center justify-center">
                <ScanLine className="h-4 w-4" />
                Scan Pass
              </Button>
            </div>
            {scanMessage && (
              <div className={`p-3 rounded-xl text-xs font-semibold ${
                scanMessage.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border border-rose-500/20 text-rose-500'
              }`}>
                {scanMessage.text}
              </div>
            )}
          </form>

          {/* Attendee status list */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 pl-1">
              Attendee Checklist
            </h4>
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {attendees.map((a: Attendee) => (
                <div key={a.studentId} className="p-3 rounded-2xl bg-[#121624] border border-slate-900 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-white">{a.name}</p>
                    <p className="text-[10px] text-slate-500">{a.department} • {a.email}</p>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold">
                    <span className="text-[10px] text-slate-500 font-mono">{a.passCode}</span>
                    {a.checkedIn ? (
                      <span className="text-emerald-500 flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        Checked-In
                      </span>
                    ) : (
                      <span className="text-slate-500 flex items-center gap-1">
                        <HelpCircle className="h-4 w-4" />
                        Awaiting
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {attendees.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-6">No registrations found for this event yet.</p>
              )}
            </div>
          </div>
        </div>
      </Dialog>

    </div>
  )
}

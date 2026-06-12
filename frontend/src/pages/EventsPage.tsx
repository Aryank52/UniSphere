import React, { useState } from 'react'
import { Search, SlidersHorizontal, Zap } from 'lucide-react'
import { EventCard } from '../components/EventCard'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { useEvents, useMyRegistrations, useRegisterForEvent } from '../hooks/useApi'
import { useAuthStore } from '../store/authStore'
import { Dialog } from '../components/ui/Dialog'
import { DigitalPass } from '../components/DigitalPass'
import type { Event } from '../types'

export const EventsPage: React.FC = () => {
  const { user } = useAuthStore()
  const isStudent = user?.role === 'STUDENT'

  const { data: events = [], isLoading } = useEvents()
  const { data: registrations = [] } = useMyRegistrations()
  const registerMutation = useRegisterForEvent()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [sortBy, setSortBy] = useState<'DATE' | 'TITLE' | 'SCORE'>('DATE')
  const [selectedPass, setSelectedPass] = useState<{ event: Event; passCode: string } | null>(null)

  const handleRegister = (eventId: number) => {
    registerMutation.mutate(eventId)
  }

  const getPassCodeForEvent = (eventId: number) => {
    return `PASS-${eventId}-${100000 + eventId * 73}`
  }

  // Filter events
  const filteredEvents = events.filter((event: Event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'ALL' || event.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Sort events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === 'DATE') {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    }
    if (sortBy === 'TITLE') {
      return a.title.localeCompare(b.title)
    }
    if (sortBy === 'SCORE') {
      return (b.engagementScore || 0) - (a.engagementScore || 0)
    }
    return 0
  })

  // Category pill mappings (maps UI labels to backend event categories)
  const displayCategories = [
    { key: 'ALL', label: 'All Events' },
    { key: 'TECH', label: 'Tech' },
    { key: 'CULTURAL', label: 'Arts' }, // CULTURAL maps to Arts
    { key: 'SPORTS', label: 'Sports' },
    { key: 'ACADEMIC', label: 'Social' } // ACADEMIC maps to Social
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Title Header Banner */}
      {/* Title Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            {isStudent ? 'Discover Campus Life' : 'Explore Events'}
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            {isStudent 
              ? 'Find events that match your interests, from late-night hackathons to morning yoga on the quad.' 
              : 'Find upcoming technology bootcamps, athletic tournaments, and academic forums'
            }
          </p>
        </div>
        
        {isStudent && (
          <div className="shrink-0">
            <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 shadow-sm hover:bg-slate-50 transition-colors">
              <Zap className="h-4.5 w-4.5 text-[#006680] fill-[#006680]/20" />
              <span>12 New Events Today</span>
            </div>
          </div>
        )}
      </div>

      {/* Filter, Search, and Sort Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between w-full">
        <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-auto items-center">
          
          {/* Search bar */}
          <div className="relative w-full lg:w-80 shrink-0">
            <Input
              id="search-event"
              placeholder="Search events, keywords, or clubs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-slate-200 text-slate-800 focus:border-[#006680] focus:ring-1 focus:ring-[#006680]"
            />
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          </div>

          {/* Category Pill Filters */}
          <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 scrollbar-none items-center">
            {displayCategories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shrink-0 cursor-pointer shadow-sm ${
                  selectedCategory === cat.key
                    ? 'bg-[#006680] text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
            
            {/* Filters button */}
            <button 
              onClick={() => alert("Advance filter modal opened.")}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors flex items-center gap-1.5 shadow-sm shrink-0 cursor-pointer"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Filters</span>
            </button>
          </div>

        </div>

        {/* Sorting options select dropdown */}
        <div className="flex items-center gap-2 w-full lg:w-auto shrink-0 justify-end">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'DATE' | 'TITLE' | 'SCORE')}
            className="px-3 py-1.5 border rounded-xl text-xs font-semibold focus:outline-none transition-all cursor-pointer bg-white border-slate-200 text-slate-800 focus:border-[#006680]"
          >
            <option value="DATE">🗓️ Date (Upcoming first)</option>
            <option value="TITLE">🔤 Title (A-Z)</option>
            <option value="SCORE">⚡ Match / Engagement Score</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-400">Loading active catalog...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEvents.map((event: Event) => {
            const regEvent = registrations.find((r: Event) => r.id === event.id)
            const isReg = !!regEvent
            return (
              <EventCard
                key={event.id}
                event={event}
                isRegistered={isReg}
                actionLabel={isReg ? 'Show Boarding Pass' : 'Register Seat'}
                onAction={() => {
                  if (isReg) {
                    setSelectedPass({
                      event,
                      passCode: regEvent.passCode || getPassCodeForEvent(event.id)
                    })
                  } else {
                    handleRegister(event.id)
                  }
                }}
              />
            )
          })}
          {sortedEvents.length === 0 && (
            <Card className="col-span-3 p-12 text-center text-slate-400 border-dashed bg-card/40">
              No matching events found in the catalogue. Try adjusting your filters.
            </Card>
          )}
        </div>
      )}

      {/* Load More section */}
      {isStudent && sortedEvents.length > 0 && (
        <div className="flex flex-col items-center gap-3 pt-8">
          <button 
            onClick={() => alert("Loading next page of campus events catalogues...")}
            className="px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-2xl transition-all shadow-sm cursor-pointer"
          >
            Load More Events
          </button>
          <span className="text-[10px] font-bold text-slate-400">
            Showing {Math.min(sortedEvents.length, 6)} of {sortedEvents.length + 136} upcoming events
          </span>
        </div>
      )}

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

      {/* Custom light-theme Footer for events portal */}
      <footer className="border-t border-slate-200 mt-16 pt-8 pb-4 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
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

    </div>
  )
}

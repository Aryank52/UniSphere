import React, { useState } from 'react'
import { Search } from 'lucide-react'
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

  const categories = ['ALL', 'TECH', 'SPORTS', 'ACADEMIC', 'CULTURAL']

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">Explore Events</h2>
          <p className="text-xs text-muted-foreground">Find upcoming technology bootcamps, athletic tournaments, and academic forums</p>
        </div>
      </div>

      {/* Filter, Search, and Sort Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-center">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Input
              id="search-event"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          </div>

          {/* Category Pill Filters */}
          <div className="flex gap-2 w-full overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-bold rounded-full transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'bg-secondary/40 text-muted-foreground hover:bg-secondary/80'
                }`}
              >
                {cat === 'ALL' ? 'All Categories' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sorting options select dropdown */}
        <div className="flex items-center gap-2 w-full lg:w-auto shrink-0 justify-end">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'DATE' | 'TITLE' | 'SCORE')}
            className="px-3 py-1.5 bg-background/50 border border-border/80 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground cursor-pointer"
          >
            <option value="DATE">🗓️ Date (Upcoming first)</option>
            <option value="TITLE">🔤 Title (A-Z)</option>
            <option value="SCORE">⚡ Match / Engagement Score</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading active catalog...</div>
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
            <Card className="col-span-3 p-12 text-center text-muted-foreground border-dashed bg-card/40">
              No matching events found in the catalogue. Try adjusting your filters.
            </Card>
          )}
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
    </div>
  )
}

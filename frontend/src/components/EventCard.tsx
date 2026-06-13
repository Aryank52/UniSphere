import React, { useState } from 'react'
import { Calendar, MapPin, Users, Award, ShieldCheck, Trash2, Bookmark, Zap } from 'lucide-react'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { useAuthStore } from '../store/authStore'
import type { Event } from '../types'

interface EventCardProps {
  event: Event
  onAction?: () => void
  actionLabel?: string
  isRegistered?: boolean
  showAdminActions?: boolean
  onApprove?: (approve: boolean) => void
  onDelete?: () => void
}

const formatEventDateTime = (dateStr: string, timeStr: string) => {
  try {
    const [year, month, day] = dateStr.split('-').map(Number)
    const [hour, minute] = timeStr.split(':').map(Number)
    const date = new Date(year, month - 1, day, hour, minute)
    
    // Format to e.g. Oct 24, 2024
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    
    // Format to e.g. 4:00 PM
    const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    
    return `${formattedDate} • ${formattedTime}`
  } catch (e) {
    return `${dateStr} at ${timeStr}`
  }
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onAction,
  actionLabel,
  isRegistered = false,
  showAdminActions = false,
  onApprove,
  onDelete
}) => {
  const { user } = useAuthStore()
  const isStudent = user?.role === 'STUDENT'
  
  const [bookmarked, setBookmarked] = useState(false)

  const getMatchRateString = () => {
    if (!event.engagementScore) return '98%'
    if (event.engagementScore <= 1.0) {
      return `${(event.engagementScore * 100).toFixed(0)}%`
    }
    return `${event.engagementScore.toFixed(0)}%`
  }

  // Dynamic category badge styling
  const getCategoryVariant = (cat: string) => {
    switch (cat?.toUpperCase()) {
      case 'TECH': return 'purple'
      case 'SPORTS': return 'info'
      case 'ACADEMIC': return 'success'
      case 'CULTURAL': return 'warning'
      default: return 'default'
    }
  }

  // Calculate simulated occupancy
  const registrationCount = event.registrationCount || Math.floor(event.maxCapacity * 0.4)
  const occupancyPercentage = Math.min(100, Math.floor((registrationCount / event.maxCapacity) * 100))

  // Custom capacity descriptions
  const getCapacityDescription = () => {
    if (event.category?.toUpperCase() === 'CULTURAL' || event.category?.toUpperCase() === 'ARTS') return "Tickets Required"
    if (event.category?.toUpperCase() === 'SPORTS' && event.id % 2 === 0) return "Spectators Welcome"
    if (event.maxCapacity >= 500) return "Open Capacity"
    const remaining = event.maxCapacity - registrationCount
    if (remaining > 0 && remaining <= 15) return `${remaining} Slots Left`
    return `${registrationCount} / ${event.maxCapacity} Registered`
  }

  // Action labels
  const getBtnLabel = () => {
    if (isRegistered) return "View Pass"
    if (actionLabel) {
      if (actionLabel.includes("Seat")) return "Register"
      return actionLabel
    }
    const cat = event.category?.toUpperCase()
    if (cat === 'TECH') return event.id % 2 === 0 ? "Apply" : "Register"
    if (cat === 'ARTS' || cat === 'CULTURAL') return "Get Tickets"
    if (cat === 'SPORTS') return event.id % 2 === 0 ? "RSVP" : "Join Match"
    return "Register"
  }

  return (
    <Card 
      variant='default' 
      className="overflow-hidden flex flex-col h-full select-none border border-sky-100 bg-white shadow-travel hover:shadow-travel-hover transition-all text-left rounded-3xl"
    >
      <div className="relative h-44 overflow-hidden group rounded-t-3xl">
        <img 
          src={event.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
        
        {/* Match rating badge top-left */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
          {isStudent ? (
            <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm border border-orange-100">
              <Zap className="h-3 w-3 fill-orange-200 text-orange-500" />
              <span>{getMatchRateString()} Match</span>
            </span>
          ) : (
            <Badge variant={getCategoryVariant(event.category)} className="font-extrabold uppercase px-2.5 py-0.5 shadow-md">
              {event.category}
            </Badge>
          )}
        </div>

        {/* Category badge top-right */}
        <div className="absolute top-4 right-4">
          {isStudent ? (
            <span className="bg-white/90 backdrop-blur text-slate-700 border border-slate-200 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg shadow-sm">
              {event.category || 'Tech'}
            </span>
          ) : (
            event.engagementScore !== undefined && event.engagementScore > 0 && (
              <div className="bg-sky-50 px-2.5 py-1 rounded-full text-xs font-bold text-sky-600 flex items-center gap-1 border border-sky-100">
                <Award className="h-3 w-3 text-sky-500" />
                AI Score: {event.engagementScore.toFixed(1)}
              </div>
            )
          )}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Header block with Bookmark */}
          <div className="flex justify-between items-start gap-3 mb-2.5">
            <h4 className="font-black text-base tracking-tight truncate-2-lines line-clamp-2 min-h-[48px] text-slate-800">
              {event.title}
            </h4>
            {isStudent && (
              <button 
                onClick={() => setBookmarked(!bookmarked)}
                className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
                  bookmarked 
                    ? 'bg-orange-50 border-orange-200 text-orange-600' 
                    : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-orange-500' : ''}`} />
              </button>
            )}
          </div>
          
          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">
            {event.description}
          </p>

          {/* Details list */}
          <div className="space-y-2 mb-5 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0 text-sky-500" />
              <span>{isStudent ? formatEventDateTime(event.date, event.time) : `${event.date} at ${event.time}`}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-sky-500" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 shrink-0 text-sky-500" />
              <span className="truncate">
                {isStudent ? getCapacityDescription() : `${registrationCount} / ${event.maxCapacity} Seats Filled`}
              </span>
            </div>
          </div>
        </div>

        {/* Occupancy Indicator */}
        {!isStudent && (
          <div className="w-full bg-slate-100 rounded-full h-1.5 mb-5 overflow-hidden">
            <div 
              className="bg-sky-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${occupancyPercentage}%` }}
            />
          </div>
        )}

        {/* Boarding Ticket Tear-off Dash & Notches */}
        <div className="border-t border-dashed border-sky-100 my-4 relative">
          <div className="absolute -left-8 -top-1.5 w-3 h-3 bg-[#f0f9ff] rounded-full border-r border-sky-100"></div>
          <div className="absolute -right-8 -top-1.5 w-3 h-3 bg-[#f0f9ff] rounded-full border-l border-sky-100"></div>
        </div>

        {/* Footer Actions section */}
        <div className="mt-auto pt-1">
          {showAdminActions && onApprove ? (
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="glass" 
                size="sm" 
                className="text-sky-600 border border-sky-100 bg-sky-50 hover:bg-sky-100 py-1.5"
                onClick={() => onApprove(true)}
              >
                Approve
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-orange-600 border border-orange-100 bg-orange-50 hover:bg-orange-100 py-1.5"
                onClick={() => onApprove(false)}
              >
                Reject
              </Button>
            </div>
          ) : onDelete ? (
            <div className="flex gap-2">
              {onAction && (
                <Button variant="primary" className="flex-1 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-extrabold cursor-pointer" onClick={onAction}>
                  {getBtnLabel()}
                </Button>
              )}
              <Button 
                variant="outline" 
                className="text-orange-600 hover:bg-orange-50 shrink-0 border-slate-200"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ) : isStudent ? (
            <div className="flex justify-between items-center gap-3">
              {/* Avatars */}
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="flex items-center -space-x-1.5">
                  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80" className="h-5.5 w-5.5 rounded-full object-cover border border-white shadow-sm" alt="" />
                  {event.id % 2 === 0 && (
                    <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80" className="h-5.5 w-5.5 rounded-full object-cover border border-white shadow-sm" alt="" />
                  )}
                </div>
                <span className="text-[10px] font-bold text-slate-400">
                  +{event.id * 14 + 12}
                </span>
              </div>
              
              {isRegistered ? (
                <button 
                  onClick={onAction}
                  className="bg-sky-50 border border-sky-100 hover:bg-sky-100 text-sky-600 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-inner shrink-0 cursor-pointer"
                >
                  View Pass
                </button>
              ) : (
                onAction && (
                  <button 
                    onClick={onAction}
                    className={`text-xs font-black px-5 py-2 rounded-xl transition-all active:scale-[0.98] shrink-0 cursor-pointer shadow-sm ${
                      getBtnLabel().toUpperCase() === 'RSVP' 
                        ? 'border border-sky-200 text-sky-600 bg-white hover:bg-sky-50' 
                        : 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white'
                    }`}
                  >
                    {getBtnLabel()}
                  </button>
                )
              )}
            </div>
          ) : isRegistered ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-sky-50 border border-sky-100 text-sky-650">
              <span className="text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-sky-500" />
                Registered
              </span>
              {onAction && (
                <button 
                  onClick={onAction}
                  className="text-xs text-sky-600 font-extrabold hover:underline"
                >
                  View Pass
                </button>
              )}
            </div>
          ) : (
            onAction && (
              <Button 
                variant={actionLabel?.includes('Pass') ? 'glass' : 'primary'} 
                className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-extrabold py-2.5 cursor-pointer" 
                onClick={onAction}
              >
                {getBtnLabel()}
              </Button>
            )
          )}
        </div>
      </div>
    </Card>
  )
}

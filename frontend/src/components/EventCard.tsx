import React from 'react'
import { Calendar, MapPin, Users, Award, ShieldCheck, Trash2 } from 'lucide-react'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
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

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onAction,
  actionLabel,
  isRegistered = false,
  showAdminActions = false,
  onApprove,
  onDelete
}) => {

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

  return (
    <Card variant="glass" className="overflow-hidden flex flex-col h-full select-none">
      <div className="relative h-44 overflow-hidden group">
        <img 
          src={event.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Category & Campus Badges overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
          <Badge variant={getCategoryVariant(event.category)} className="font-extrabold uppercase px-2.5 py-0.5 shadow-md">
            {event.category}
          </Badge>
          {event.campus && (
            <Badge variant="default" className="text-[9px] font-black uppercase px-2 py-0.5 bg-slate-900/80 backdrop-blur border border-white/10 text-indigo-300 shadow-md">
              📍 {event.campus} Campus
            </Badge>
          )}
        </div>

        {/* Engagement Rating overlay */}
        {event.engagementScore !== undefined && event.engagementScore > 0 && (
          <div className="absolute top-4 right-4 glass px-2.5 py-1 rounded-full text-xs font-bold text-violet-400 flex items-center gap-1 border border-white/20">
            <Award className="h-3 w-3" />
            AI Score: {event.engagementScore.toFixed(1)}
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h4 className="font-extrabold text-lg tracking-tight mb-2 text-slate-100 dark:text-white truncate-2-lines line-clamp-2 min-h-[56px]">
          {event.title}
        </h4>
        
        <p className="text-xs text-slate-300/90 line-clamp-3 mb-4 flex-1">
          {event.description}
        </p>

        <div className="space-y-2.5 mb-5 text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-indigo-400 shrink-0" />
            <span>{event.date} at {event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-indigo-400 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-indigo-400 shrink-0" />
            <span className="w-full">
              {registrationCount} / {event.maxCapacity} Seats Filled
            </span>
          </div>
        </div>

        {/* Occupancy Indicator */}
        <div className="w-full bg-secondary/50 rounded-full h-2 mb-5">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-violet-500 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${occupancyPercentage}%` }}
          />
        </div>

        {/* Actions section */}
        <div className="mt-auto">
          {showAdminActions && onApprove ? (
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="glass" 
                size="sm" 
                className="text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/10"
                onClick={() => onApprove(true)}
              >
                Approve
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-rose-500 hover:bg-rose-500/10"
                onClick={() => onApprove(false)}
              >
                Reject
              </Button>
            </div>
          ) : onDelete ? (
            <div className="flex gap-2">
              {onAction && actionLabel && (
                <Button variant="primary" className="flex-1" onClick={onAction}>
                  {actionLabel}
                </Button>
              )}
              <Button 
                variant="outline" 
                className="text-rose-500 hover:bg-rose-500/10 shrink-0"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ) : isRegistered ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" />
                Registered
              </span>
              {onAction && (
                <button 
                  onClick={onAction}
                  className="text-xs text-primary font-bold hover:underline"
                >
                  View Pass
                </button>
              )}
            </div>
          ) : (
            onAction && actionLabel && (
              <Button 
                variant={actionLabel.includes('Pass') ? 'glass' : 'primary'} 
                className="w-full" 
                onClick={onAction}
              >
                {actionLabel}
              </Button>
            )
          )}
        </div>
      </div>
    </Card>
  )
}

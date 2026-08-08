import React, { useState } from 'react'
import { X, MapPin, Compass, Users, Building, Layers, CheckCircle2 } from 'lucide-react'

interface VenuePin {
  id: string
  name: string
  campus: string
  building: string
  capacity: number
  activeEventsCount: number
  top: string
  left: string
  description: string
}

const VENUES: VenuePin[] = [
  {
    id: 'bidholi-auditorium',
    name: 'Main Auditorium (Bidholi)',
    campus: 'Bidholi Campus',
    building: 'Energy Acres Block',
    capacity: 500,
    activeEventsCount: 2,
    top: '38%',
    left: '48%',
    description: 'Premier grand venue for university keynotes, hackathons, and cultural fests.'
  },
  {
    id: 'cs-auditorium',
    name: 'CS Block A Auditorium',
    campus: 'Bidholi Campus',
    building: 'Computer Science Wing',
    capacity: 150,
    activeEventsCount: 1,
    top: '52%',
    left: '64%',
    description: 'Equipped with ultra-wide projection screens and gigabit Wi-Fi for tech symposiums.'
  },
  {
    id: 'bidholi-quad',
    name: 'Bidholi Quadrangle',
    campus: 'Bidholi Campus',
    building: 'Central Open Lawns',
    capacity: 800,
    activeEventsCount: 1,
    top: '68%',
    left: '35%',
    description: 'Open-air venue for athletic meets, sports tournaments, and food carnivals.'
  },
  {
    id: 'ai-lab',
    name: 'Advanced AI Research Lab',
    campus: 'Bidholi Campus',
    building: 'High-Tech Lab Wing',
    capacity: 40,
    activeEventsCount: 0,
    top: '28%',
    left: '72%',
    description: 'State-of-the-art GPU workstation lab for hands-on machine learning workshops.'
  }
]

interface CampusMapModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectVenue?: (venueName: string) => void
}

export const CampusMapModal: React.FC<CampusMapModalProps> = ({ isOpen, onClose, onSelectVenue }) => {
  const [selectedVenue, setSelectedVenue] = useState<VenuePin>(VENUES[0])
  const [activeCampus, setActiveCampus] = useState<'Bidholi' | 'Kandoli'>('Bidholi')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-6">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Interactive Campus Venue Navigator</h3>
              <p className="text-xs text-slate-400">Explore UPES campus locations, live event venues & capacities</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setActiveCampus('Bidholi')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeCampus === 'Bidholi' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Bidholi Campus
              </button>
              <button
                onClick={() => setActiveCampus('Kandoli')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeCampus === 'Kandoli' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Kandoli Campus
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {/* Visual Interactive Map Area (2 Cols) */}
          <div className="lg:col-span-2 p-6 bg-slate-950 relative min-h-[420px] flex items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-800 overflow-hidden">
            {/* Map Background Canvas Graphic */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            {/* Simulated Campus Grid Layout */}
            <div className="w-full h-full min-h-[380px] bg-slate-900/60 rounded-2xl border border-slate-800 relative overflow-hidden flex items-center justify-center p-4">
              {/* SVG Campus Road/Building Vector Pathways */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <path d="M 50 150 Q 200 100 350 200 T 600 300" stroke="#4f46e5" strokeWidth="4" fill="none" strokeDasharray="6 6" />
                <path d="M 200 50 L 200 350" stroke="#6366f1" strokeWidth="3" fill="none" opacity="0.6" />
                <path d="M 100 250 L 500 250" stroke="#6366f1" strokeWidth="3" fill="none" opacity="0.6" />
              </svg>

              {/* Venue Pins */}
              {VENUES.map((v) => {
                const isSelected = selectedVenue.id === v.id
                return (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVenue(v)
                      if (onSelectVenue) onSelectVenue(v.name)
                    }}
                    style={{ top: v.top, left: v.left }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 z-10`}
                  >
                    <div className="relative flex items-center justify-center">
                      {isSelected && (
                        <span className="absolute w-12 h-12 bg-indigo-500/30 rounded-full animate-ping"></span>
                      )}
                      <div
                        className={`p-3 rounded-2xl shadow-xl flex items-center space-x-2 transition border ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-400 scale-110'
                            : 'bg-slate-900 text-indigo-400 border-slate-700 hover:border-indigo-500 hover:scale-105'
                        }`}
                      >
                        <MapPin className="w-5 h-5" />
                        <span className="text-xs font-bold whitespace-nowrap pr-1">{v.name.split(' ')[0]}</span>
                      </div>
                    </div>
                  </button>
                )
              })}

              <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-800 p-3 rounded-xl text-[11px] text-slate-400 flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                  <span>Active Venue</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>Available Seats</span>
                </div>
              </div>
            </div>
          </div>

          {/* Venue Info Sidebar (1 Col) */}
          <div className="p-6 bg-slate-900 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                <Building className="w-4 h-4" />
                <span>Selected Location Details</span>
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-white">{selectedVenue.name}</h4>
                <p className="text-xs text-slate-400 mt-1">{selectedVenue.building} • {selectedVenue.campus}</p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                {selectedVenue.description}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <span>Max Capacity</span>
                  </div>
                  <div className="text-lg font-bold text-white">{selectedVenue.capacity} Seats</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span>Scheduled Events</span>
                  </div>
                  <div className="text-lg font-bold text-white">{selectedVenue.activeEventsCount} Events</div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              {onSelectVenue && (
                <button
                  onClick={() => {
                    onSelectVenue(selectedVenue.name)
                    onClose()
                  }}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30 transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Select Venue for Event</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition"
              >
                Close Map Navigator
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

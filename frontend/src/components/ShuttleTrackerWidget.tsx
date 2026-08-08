import React, { useState, useEffect } from 'react'
import { Bus, Clock, MapPin, Users, ArrowRight } from 'lucide-react'

interface ShuttleRoute {
  id: string
  route: string
  origin: string
  destination: string
  etaMinutes: number
  capacityPercent: number
  busNumber: string
  status: 'On Time' | 'Approaching' | 'Departed'
}

export const ShuttleTrackerWidget: React.FC = () => {
  const [routes, setRoutes] = useState<ShuttleRoute[]>([
    {
      id: 'shuttle-1',
      route: 'Bidholi Express',
      origin: 'Bidholi Campus (Energy Acres)',
      destination: 'Kandoli Campus',
      etaMinutes: 4,
      capacityPercent: 65,
      busNumber: 'UK-07-UPES-01',
      status: 'Approaching'
    },
    {
      id: 'shuttle-2',
      route: 'Kandoli Shuttle',
      origin: 'Kandoli Campus',
      destination: 'Bidholi Main Gate',
      etaMinutes: 12,
      capacityPercent: 85,
      busNumber: 'UK-07-UPES-04',
      status: 'On Time'
    },
    {
      id: 'shuttle-3',
      route: 'Dehradun City Connector',
      origin: 'Clock Tower (Dehradun)',
      destination: 'Bidholi Campus',
      etaMinutes: 22,
      capacityPercent: 40,
      busNumber: 'UK-07-UPES-09',
      status: 'On Time'
    }
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setRoutes(prev => prev.map(r => ({
        ...r,
        etaMinutes: r.etaMinutes > 1 ? r.etaMinutes - 1 : 15
      })))
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-travel text-left space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-sky-500/10 rounded-xl text-sky-600 border border-sky-500/20">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">UPES Transit Watch (Shuttle Service)</h3>
            <p className="text-[10px] text-slate-400 font-semibold">Live campus bus ETAs between Bidholi & Kandoli</p>
          </div>
        </div>
        <span className="flex items-center space-x-1 px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg text-[10px] font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Live Tracking</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {routes.map(r => (
          <div key={r.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">{r.busNumber}</span>
                <h4 className="text-xs font-extrabold text-slate-800 mt-0.5">{r.route}</h4>
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                r.etaMinutes <= 5 ? 'bg-amber-100 text-amber-800 font-black' : 'bg-sky-100 text-sky-800'
              }`}>
                {r.status}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-[11px] font-semibold text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span className="truncate">{r.origin}</span>
              <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{r.destination}</span>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1.5 text-slate-800 font-extrabold">
                <Clock className="w-3.5 h-3.5 text-sky-600" />
                <span>ETA: {r.etaMinutes} mins</span>
              </div>
              <div className="flex items-center space-x-1 text-[10px] text-slate-500 font-bold">
                <Users className="w-3 h-3 text-slate-400" />
                <span>Seats: {r.capacityPercent}% Full</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

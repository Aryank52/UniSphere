import React, { useState } from 'react'
import { Cpu, Calendar, CheckCircle2, Shield } from 'lucide-react'
import { Dialog } from '../components/ui/Dialog'

interface LabResource {
  id: string
  name: string
  category: 'COMPUTE' | 'PROTOTYPING' | 'ROBOTICS' | 'NETWORKING'
  location: string
  supervisor: string
  availableSlots: string[]
  specs: string
  image: string
  status: 'AVAILABLE' | 'HIGH_DEMAND' | 'MAINTENANCE'
}

export const LabReservationPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [selectedResource, setSelectedResource] = useState<LabResource | null>(null)
  const [selectedSlot, setSelectedSlot] = useState('')
  const [projectTitle, setProjectTitle] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(false)

  const resources: LabResource[] = [
    {
      id: 'res-1',
      name: 'NVIDIA H100 AI Supercomputer Cluster (Node Alpha)',
      category: 'COMPUTE',
      location: 'Bidholi CS High Performance Computing Lab (Room 402)',
      supervisor: 'Dr. Subhrasankar Chatterjee',
      availableSlots: ['09:00 AM - 12:00 PM', '02:00 PM - 05:00 PM', '06:00 PM - 09:00 PM'],
      specs: '8x NVIDIA H100 80GB GPUs, 512GB RAM, PyTorch 2.2 / CUDA 12.1',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600',
      status: 'HIGH_DEMAND'
    },
    {
      id: 'res-2',
      name: 'Industrial 3D Printing & Rapid Prototyping Bay',
      category: 'PROTOTYPING',
      location: 'Bidholi Mechanical & Design Innovation Center',
      supervisor: 'Dr. Vinod Patidar',
      availableSlots: ['10:00 AM - 01:00 PM', '01:30 PM - 04:30 PM'],
      specs: 'Dual-Extruder Resin & Carbon Fiber 3D Printers, Laser Cutters',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600',
      status: 'AVAILABLE'
    },
    {
      id: 'res-3',
      name: 'Autonomous Robotics Arm & Vision Testing Cell',
      category: 'ROBOTICS',
      location: 'Kandoli Mechatronics Lab (Block B)',
      supervisor: 'Dr. Hitesh Kumar Sharma',
      availableSlots: ['11:00 AM - 02:00 PM', '03:00 PM - 06:00 PM'],
      specs: '6-DOF Robotic Kinematic Arm, Intel RealSense Depth Cameras',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600',
      status: 'AVAILABLE'
    },
    {
      id: 'res-4',
      name: 'Edge & Quantum Computing Network Testbed',
      category: 'NETWORKING',
      location: 'Bidholi Advanced Networks Lab (Room 305)',
      supervisor: 'Prof. (Dr.) Sanjay Biswash',
      availableSlots: ['09:30 AM - 12:30 PM', '02:30 PM - 05:30 PM'],
      specs: 'Quantum Simulator Nodes, 5G NR Private Testbed, SDR Transceivers',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600',
      status: 'AVAILABLE'
    }
  ]

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          res.specs.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          res.supervisor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCat = selectedCategory === 'ALL' || res.category === selectedCategory
    return matchesSearch && matchesCat
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans select-none pb-20 text-slate-800">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 border border-sky-800 rounded-3xl p-6 md:p-10 shadow-2xl text-white relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-sky-500/20 border border-sky-500/30 rounded-xl text-sky-300 text-xs font-bold">
            <Cpu className="w-4 h-4 text-sky-400" />
            <span>UPES Innovation Infrastructure</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Research Lab & HPC Slot Reservation
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Reserve compute time on NVIDIA GPU Supercomputing Clusters, 3D prototyping centers, and robotics testbeds under UPES Faculty Supervision.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input
            id="lab-search"
            placeholder="Search GPU cluster, 3D printer, Robotics, Quantum..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 bg-white border border-slate-200 rounded-2xl py-3 px-4 text-xs text-slate-800 font-semibold focus:outline-none focus:border-sky-500 shadow-sm"
          />
          <Cpu className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 text-xs font-bold">
          {['ALL', 'COMPUTE', 'PROTOTYPING', 'ROBOTICS', 'NETWORKING'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl transition cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat === 'ALL' ? 'All Infrastructure' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Lab Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="bg-white border border-slate-200 hover:border-sky-300 rounded-3xl p-6 shadow-travel transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between text-left relative overflow-hidden"
          >
            <div>
              <div className="relative h-44 rounded-2xl overflow-hidden mb-4 bg-slate-100">
                <img src={res.image} alt={res.name} className="w-full h-full object-cover" />
                <span className={`absolute top-3 right-3 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg backdrop-blur-md border ${
                  res.status === 'HIGH_DEMAND' ? 'bg-amber-950/80 text-amber-300 border-amber-500/50' : 'bg-slate-950/80 text-sky-300 border-sky-500/50'
                }`}>
                  {res.status.replace('_', ' ')}
                </span>
              </div>

              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">{res.category} • {res.location}</span>
              <h3 className="text-base font-extrabold text-slate-900 mt-1">{res.name}</h3>
              <p className="text-xs text-sky-600 font-bold mt-1">Supervisor: {res.supervisor}</p>
              
              <div className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Hardware Specs</span>
                <p className="text-xs text-slate-700 font-semibold mt-0.5">{res.specs}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold">{res.availableSlots.length} Available Slots Today</span>
              <button
                onClick={() => {
                  setSelectedResource(res)
                  setSelectedSlot(res.availableSlots[0])
                  setBookingSuccess(false)
                }}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer flex items-center space-x-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Reserve Time Slot</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      <Dialog
        isOpen={!!selectedResource}
        onClose={() => setSelectedResource(null)}
        title="Reserve Research Lab Slot"
      >
        {selectedResource && (
          <div className="space-y-4 text-left bg-white p-2 rounded-2xl text-xs">
            <div className="flex items-center space-x-3 p-3 bg-sky-50 border border-sky-100 rounded-xl">
              <img src={selectedResource.image} alt={selectedResource.name} className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <h4 className="font-bold text-slate-900">{selectedResource.name}</h4>
                <p className="text-[11px] text-sky-600 font-semibold">{selectedResource.location}</p>
              </div>
            </div>

            {!bookingSuccess ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setBookingSuccess(true)
                }}
                className="space-y-3"
              >
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Select Time Slot</label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 font-semibold"
                  >
                    {selectedResource.availableSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Research Project Title / Justification</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fine-Tuning Llama 3 on Medical Datasets"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 font-semibold"
                  />
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 font-semibold flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Reservation request will be routed to {selectedResource.supervisor} for automated supervisor clearance.</span>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-extrabold rounded-xl shadow-md transition cursor-pointer"
                >
                  Submit Slot Reservation
                </button>
              </form>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Slot reserved for {selectedSlot}! Confirmation sent to {selectedResource.supervisor}.</span>
              </div>
            )}
          </div>
        )}
      </Dialog>
    </div>
  )
}

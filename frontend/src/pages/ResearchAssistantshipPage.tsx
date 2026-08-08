import React, { useState } from 'react'
import { GraduationCap, Search, Briefcase, CheckCircle2, Send } from 'lucide-react'
import { Dialog } from '../components/ui/Dialog'

interface JobOpening {
  id: string
  title: string
  facultyName: string
  department: string
  stipend: string
  duration: string
  prerequisites: string[]
  description: string
  status: 'OPEN' | 'INTERVIEWING' | 'CLOSED'
}

export const ResearchAssistantshipPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null)
  const [statement, setStatement] = useState('')
  const [applicationSubmitted, setApplicationSubmitted] = useState(false)

  const openings: JobOpening[] = [
    {
      id: 'ra-1',
      title: 'Student Research Assistant - Deep Learning & Transformer Architectures',
      facultyName: 'Dr. Subhrasankar Chatterjee',
      department: 'School of Computer Science & AI',
      stipend: '₹ 8,000 / month',
      duration: '6 Months (Fall 2026)',
      prerequisites: ['PyTorch', 'Transformers', 'Linear Algebra', 'GPA > 3.5'],
      description: 'Assist in training large-scale multimodal transformer models for computational neuroscience. Selected student will co-author a Scopus-indexed conference paper.',
      status: 'OPEN'
    },
    {
      id: 'ra-2',
      title: 'Blockchain & Smart Contract Security Analyst',
      facultyName: 'Dr. Hitesh Kumar Sharma',
      department: 'Cybersecurity & Distributed Ledgers',
      stipend: '₹ 10,000 / month',
      duration: '4 Months',
      prerequisites: ['Solidity', 'Web3.js', 'Cryptography', 'Go / Rust'],
      description: 'Research vulnerability detection heuristics in Ethereum smart contracts. Hands-on testing on UPES private blockchain network.',
      status: 'OPEN'
    },
    {
      id: 'ra-3',
      title: 'Spatial Computing & Geospatial Data Fellow',
      facultyName: 'Dr. Siva Sankar',
      department: 'Geospatial Intelligence',
      stipend: '₹ 7,500 / month',
      duration: '6 Months',
      prerequisites: ['QGIS / ArcGIS', 'Python GeoPandas', 'Remote Sensing'],
      description: 'Analyze satellite SAR imagery for environmental change detection around Uttarakhand Himalayas.',
      status: 'OPEN'
    },
    {
      id: 'ra-4',
      title: 'Cloud & Fog Edge Computing Lab Associate',
      facultyName: 'Prof. (Dr.) Sanjay Biswash',
      department: 'Distributed Systems Lab',
      stipend: '₹ 9,000 / month',
      duration: '5 Months',
      prerequisites: ['Kubernetes', 'Docker', 'C++', 'gRPC'],
      description: 'Deploy latency-optimized fog node orchestrators for IoT telemetry at Bidholi campus.',
      status: 'OPEN'
    }
  ]

  const filteredOpenings = openings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.facultyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans select-none pb-20 text-slate-800">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-800 rounded-3xl p-6 md:p-10 shadow-2xl text-white relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-indigo-300 text-xs font-bold">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>UPES Faculty Research Fellowship</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Campus Research Assistantship & RA Desk
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Apply for paid research positions, co-author publications, and work directly under UPES School of Computer Science distinguished faculty members.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input
            id="ra-search"
            placeholder="Search PyTorch, Blockchain, Dr. Hitesh, Deep Learning..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 bg-white border border-slate-200 rounded-2xl py-3 px-4 text-xs text-slate-800 font-semibold focus:outline-none focus:border-indigo-500 shadow-sm"
          />
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
        </div>

        <div className="px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold flex items-center space-x-1.5">
          <Briefcase className="w-4 h-4 text-indigo-600" />
          <span>{openings.length} Active Positions Open</span>
        </div>
      </div>

      {/* Openings List */}
      <div className="space-y-6">
        {filteredOpenings.map(job => (
          <div
            key={job.id}
            className="bg-white border border-slate-200 hover:border-indigo-300 rounded-3xl p-6 md:p-8 shadow-travel transition-all duration-300 hover:-translate-y-1 flex flex-col md:flex-row md:items-center justify-between gap-6 text-left"
          >
            <div className="space-y-3 flex-1">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-black uppercase">
                  {job.status}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{job.department}</span>
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 leading-tight">{job.title}</h3>
              <p className="text-xs font-extrabold text-indigo-600">Faculty Supervisor: {job.facultyName}</p>
              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">{job.description}</p>

              <div className="flex flex-wrap gap-2 pt-2">
                {job.prerequisites.map((req, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold">
                    {req}
                  </span>
                ))}
              </div>
            </div>

            <div className="shrink-0 flex flex-col md:items-end justify-between space-y-4 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div className="text-left md:text-right space-y-1">
                <div className="text-base font-black text-emerald-600">{job.stipend}</div>
                <div className="text-[10px] text-slate-400 font-bold">{job.duration}</div>
              </div>

              <button
                onClick={() => {
                  setSelectedJob(job)
                  setApplicationSubmitted(false)
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Apply for Position</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Application Modal */}
      <Dialog
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title="Apply for Research Assistantship"
      >
        {selectedJob && (
          <div className="space-y-4 text-left bg-white p-2 rounded-2xl text-xs">
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
              <h4 className="font-bold text-slate-900">{selectedJob.title}</h4>
              <p className="text-xs text-indigo-600 font-extrabold mt-0.5">Faculty: {selectedJob.facultyName}</p>
            </div>

            {!applicationSubmitted ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setApplicationSubmitted(true)
                }}
                className="space-y-3"
              >
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Statement of Research Interest</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Briefly describe your relevant coursework, coding experience, and motivation..."
                    value={statement}
                    onChange={(e) => setStatement(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 font-semibold"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl shadow-md transition cursor-pointer"
                >
                  Submit RA Portfolio Application
                </button>
              </form>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Application submitted to {selectedJob.facultyName}! You will be contacted for an interview schedule.</span>
              </div>
            )}
          </div>
        )}
      </Dialog>
    </div>
  )
}

import React, { useState } from 'react'
import { Search, GraduationCap, CheckCircle2 } from 'lucide-react'
import { useFacultyDirectory } from '../hooks/useApi'
import { Dialog } from '../components/ui/Dialog'

export const FacultyDirectoryPage: React.FC = () => {
  const { data: facultyMembers = [], isLoading } = useFacultyDirectory()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDept, setSelectedDept] = useState('ALL')
  const [selectedFaculty, setSelectedFaculty] = useState<any | null>(null)
  const [consultationSubmitted, setConsultationSubmitted] = useState(false)

  // Filter faculty members based on search and department
  const filteredFaculty = facultyMembers.filter((f: any) => {
    const matchesQuery = 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.skills && f.skills.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (f.interests && f.interests.some((i: string) => i.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (f.department && f.department.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesDept = selectedDept === 'ALL' || (f.department && f.department.includes(selectedDept))
    return matchesQuery && matchesDept
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans select-none pb-20 text-slate-800">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-3 text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-indigo-300 text-xs font-bold">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>UPES Dehradun Faculty Roster</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            School of Computer Science Faculty Directory
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Connect with distinguished professors, researchers, and academic leaders shaping the future of AI, Deep Learning, Cybersecurity, Cloud, and Spatial Computing at UPES Dehradun.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Input
            id="faculty-search"
            placeholder="Search by name, AI, Deep Learning, Cryptography..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border border-slate-200 rounded-2xl py-3 text-xs text-slate-800 font-semibold focus:border-indigo-500"
          />
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 text-xs font-bold">
          {['ALL', 'Computer Science', 'AI', 'Cyber Security', 'Data Analytics'].map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-4 py-2 rounded-xl transition cursor-pointer shrink-0 ${
                selectedDept === dept
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {dept === 'ALL' ? 'All Departments' : dept}
            </button>
          ))}
        </div>
      </div>

      {/* Faculty Cards Grid */}
      {isLoading ? (
        <div className="text-center py-16 text-slate-400 font-bold">Loading UPES Faculty Roster...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFaculty.map((f: any) => {
            const designation = (f.skills && f.skills[0]) || 'Faculty Member'
            const isDean = f.name.includes('Dean') || designation.includes('Dean')

            return (
              <div
                key={f.id}
                className="bg-white border border-slate-200 hover:border-indigo-300 rounded-3xl p-6 shadow-travel transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between text-left relative overflow-hidden"
              >
                {isDean && (
                  <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-sm">
                    Dean & Leadership
                  </div>
                )}

                <div>
                  <div className="flex items-start space-x-4 mb-4">
                    <img
                      src={f.profileImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
                      alt={f.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-100 shadow-md shrink-0"
                    />
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 leading-tight">{f.name}</h3>
                      <p className="text-xs font-bold text-indigo-600 mt-1">{designation}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{f.department || 'School of Computer Science'}</p>
                    </div>
                  </div>

                  {/* Research Interests / Domain Pills */}
                  <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                      Research & Specialization
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {f.interests && f.interests.length > 0 ? (
                        f.interests.map((interest: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold"
                          >
                            {interest}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">Computer Science Systems</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono truncate max-w-[150px]">{f.email}</span>
                  <button
                    onClick={() => {
                      setSelectedFaculty(f)
                      setConsultationSubmitted(false)
                    }}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    Schedule Office Hour
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Consultation Dialog */}
      <Dialog
        isOpen={!!selectedFaculty}
        onClose={() => setSelectedFaculty(null)}
        title="Schedule Faculty Consultation"
      >
        {selectedFaculty && (
          <div className="space-y-4 text-left bg-white p-2 rounded-2xl">
            <div className="flex items-center space-x-3 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
              <img
                src={selectedFaculty.profileImage}
                alt={selectedFaculty.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div>
                <h4 className="font-bold text-slate-900">{selectedFaculty.name}</h4>
                <p className="text-xs text-indigo-600 font-semibold">{selectedFaculty.skills?.[0] || 'Faculty'}</p>
              </div>
            </div>

            {!consultationSubmitted ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setConsultationSubmitted(true)
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Consultation Topic</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Research Guidance on Deep Learning or Project Mentor Request"
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Preferred Slot</label>
                  <select className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 font-semibold">
                    <option>Tuesday • 2:00 PM - 3:00 PM (Office Hour)</option>
                    <option>Thursday • 4:00 PM - 5:00 PM (Research Park)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl shadow-md transition cursor-pointer"
                >
                  Confirm Appointment Request
                </button>
              </form>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Appointment request submitted to {selectedFaculty.name}! An email confirmation has been sent to your inbox.</span>
              </div>
            )}
          </div>
        )}
      </Dialog>
    </div>
  )
}

function Input({ id, placeholder, value, onChange, className }: any) {
  return (
    <input
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
    />
  )
}

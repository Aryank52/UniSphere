import React, { useState } from 'react'
import { Search, Users, Trophy, CheckCircle2 } from 'lucide-react'
import { useStudentDirectory } from '../hooks/useApi'

export const StudentDirectoryPage: React.FC = () => {
  const { data: students = [], isLoading } = useStudentDirectory()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState<'ALL' | number>('ALL')

  // Filter students based on search and year
  const filteredStudents = students.filter((s: any) => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.department && s.department.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesYear = selectedYear === 'ALL' || s.academicYear === Number(selectedYear)
    return matchesSearch && matchesYear
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans select-none pb-20 text-slate-800">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sky-950 via-indigo-900 to-slate-900 border border-sky-800 rounded-3xl p-6 md:p-10 shadow-2xl text-white relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-sky-500/20 border border-sky-500/30 rounded-xl text-sky-300 text-xs font-bold">
            <Users className="w-4 h-4 text-sky-400" />
            <span>UPES Dehradun Student Roster</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Campus Student Directory & Leaderboard
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Discover student participants across School of Computer Science & Engineering, track event participation XP points, and explore project collaborators at UPES Bidholi & Kandoli campuses.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input
            id="student-search"
            placeholder="Search by student name (e.g., Kartik, Aryan, Shaurya...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 bg-white border border-slate-200 rounded-2xl py-3 px-4 text-xs text-slate-800 font-semibold focus:outline-none focus:border-sky-500 shadow-sm"
          />
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 text-xs font-bold">
          <button
            onClick={() => setSelectedYear('ALL')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer shrink-0 ${
              selectedYear === 'ALL'
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Years (1st - 4th Year)
          </button>
          {[1, 2, 3, 4].map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-2 rounded-xl transition cursor-pointer shrink-0 ${
                selectedYear === year
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Year {year}
            </button>
          ))}
        </div>
      </div>

      {/* Student Roster Table */}
      {isLoading ? (
        <div className="text-center py-16 text-slate-400 font-bold">Loading UPES Student Records...</div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-travel text-left overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Student Leaderboards ({filteredStudents.length} Records)</h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Ranked by Event Participation XP Points</p>
            </div>
            <div className="flex items-center space-x-1 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-xs font-bold">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Campus XP Active</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[9px] pb-3">
                  <th className="pb-3 font-bold">Rank</th>
                  <th className="pb-3 font-bold">Student Name</th>
                  <th className="pb-3 font-bold">Department</th>
                  <th className="pb-3 font-bold">Year</th>
                  <th className="pb-3 font-bold">XP & Level</th>
                  <th className="pb-3 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold">
                {filteredStudents.map((s: any, idx: number) => {
                  const rank = idx + 1
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5">
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                          rank === 1 ? 'bg-amber-500 text-white shadow-md' :
                          rank === 2 ? 'bg-slate-400 text-white' :
                          rank === 3 ? 'bg-amber-700 text-white' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {rank}
                        </div>
                      </td>

                      <td className="py-3.5">
                        <div className="flex items-center space-x-3">
                          <img
                            src={s.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                            alt={s.name}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <p className="font-extrabold text-slate-900 text-sm">{s.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{s.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 text-slate-700 font-bold">
                        {s.department || 'Computer Science'}
                      </td>

                      <td className="py-3.5">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold">
                          Year {s.academicYear || 2}
                        </span>
                      </td>

                      <td className="py-3.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-sky-600">{s.xpPoints || 150} XP</span>
                          <span className="text-[10px] px-2 py-0.5 bg-sky-50 border border-sky-150 text-sky-700 rounded-md font-bold">
                            Lvl {s.level || 1}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 text-right">
                        <span className="inline-flex items-center space-x-1 text-emerald-600 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Active Member</span>
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

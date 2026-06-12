import React, { useState } from 'react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Dialog } from '../components/ui/Dialog'
import { useClubs, useCreateClub } from '../hooks/useApi'
import { useAuthStore } from '../store/authStore'
import { 
  Users, 
  PlusCircle, 
  UserCheck, 
  Search, 
  Code, 
  Palette, 
  Dumbbell, 
  GraduationCap, 
  Leaf, 
  Rocket, 
  ChevronRight 
} from 'lucide-react'
import type { Club } from '../types'

const AnimatedCounter: React.FC<{ value: number }> = ({ value }) => {
  const [count, setCount] = useState(Math.max(0, value - 15))

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        if (prev < value) {
          return prev + 1
        }
        if (prev > value) {
          return prev - 1
        }
        clearInterval(interval)
        return prev
      })
    }, 40)
    return () => clearInterval(interval)
  }, [value])

  return <>{count}</>
}

const getClubCategory = (club: Club) => {
  const text = `${club.name} ${club.description}`.toLowerCase()
  if (text.includes('code') || text.includes('science') || text.includes('data') || text.includes('biogenics') || text.includes('robotics')) {
    return 'TECH'
  }
  if (text.includes('business') || text.includes('investment') || text.includes('case') || text.includes('finance')) {
    return 'ACADEMIC'
  }
  if (text.includes('athletics') || text.includes('sports') || text.includes('basketball') || text.includes('varsity') || text.includes('fitness')) {
    return 'SPORTS'
  }
  if (text.includes('arts') || text.includes('theater') || text.includes('photography') || text.includes('cultural') || text.includes('music')) {
    return 'CULTURAL'
  }
  if (text.includes('eco') || text.includes('green') || text.includes('sustainability') || text.includes('clean') || text.includes('environmental')) {
    return 'GREEN'
  }
  return 'OTHER'
}

const getIconBg = (club: Club) => {
  const cat = getClubCategory(club)
  switch (cat) {
    case 'TECH': return 'bg-blue-50 text-blue-600'
    case 'CULTURAL': return 'bg-purple-50 text-purple-600'
    case 'SPORTS': return 'bg-amber-50 text-amber-600'
    case 'ACADEMIC': return 'bg-emerald-50 text-emerald-600'
    case 'GREEN': return 'bg-green-50 text-green-600'
    default: return 'bg-slate-50 text-slate-600'
  }
}

const getCategoryIcon = (club: Club) => {
  const cat = getClubCategory(club)
  switch (cat) {
    case 'TECH': return <Code className="h-4.5 w-4.5" />
    case 'CULTURAL': return <Palette className="h-4.5 w-4.5" />
    case 'SPORTS': return <Dumbbell className="h-4.5 w-4.5" />
    case 'ACADEMIC': return <GraduationCap className="h-4.5 w-4.5" />
    case 'GREEN': return <Leaf className="h-4.5 w-4.5" />
    default: return <Users className="h-4.5 w-4.5" />
  }
}

const originalCategories = [
  { key: 'ALL', label: 'All Chapters' },
  { key: 'TECH', label: 'Tech & Coding' },
  { key: 'ACADEMIC', label: 'Business & Academia' },
  { key: 'SPORTS', label: 'Sports & Fitness' },
  { key: 'CULTURAL', label: 'Cultural & Arts' },
  { key: 'GREEN', label: 'Green & Sustainability' }
]

const studentCategories = [
  { key: 'ALL', label: 'All Communities' },
  { key: 'TECH', label: 'Technology' },
  { key: 'CULTURAL', label: 'Arts & Culture' },
  { key: 'SPORTS', label: 'Sports & Athletics' },
  { key: 'GREEN', label: 'Social Service' },
  { key: 'ACADEMIC', label: 'Entrepreneurship' }
]

export const ClubsPage: React.FC = () => {
  const { user } = useAuthStore()
  const isStudent = user?.role === 'STUDENT'

  const { data: clubs = [], isLoading } = useClubs()
  const createClubMutation = useCreateClub()

  const [createOpen, setCreateOpen] = useState(false)
  const [clubName, setClubName] = useState('')
  const [clubDesc, setClubDesc] = useState('')
  const [joinedClubs, setJoinedClubs] = useState<number[]>([1, 2, 3]) // Preset join states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')

  const handleCreateClub = (e: React.FormEvent) => {
    e.preventDefault()
    if (!clubName || !clubDesc) return

    createClubMutation.mutate({
      name: clubName,
      description: clubDesc
    }, {
      onSuccess: () => {
        setCreateOpen(false)
        setClubName('')
        setClubDesc('')
        alert('Club registration request sent to Admin approval queue.')
      }
    })
  }

  const handleJoinClub = (clubId: number) => {
    if (joinedClubs.includes(clubId)) {
      setJoinedClubs(joinedClubs.filter(id => id !== clubId))
    } else {
      setJoinedClubs([...joinedClubs, clubId])
    }
  }

  const filteredClubs = clubs.filter((club: Club) => {
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          club.description.toLowerCase().includes(searchQuery.toLowerCase())
    if (selectedCategory === 'ALL') return matchesSearch
    return matchesSearch && getClubCategory(club) === selectedCategory
  })

  // Active Chapters mapping for students (IEEE and ACM)
  const ieeeClub = clubs.find((c: Club) => c.name.toLowerCase().includes('ieee'))
  const acmClub = clubs.find((c: Club) => c.name.toLowerCase().includes('acm'))
  const activeChapter1 = ieeeClub || clubs[0]
  const activeChapter2 = acmClub || clubs[1]

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {isStudent ? (
        // STUDENT LIGHT THEME VIEW
        <>
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">
                Clubs & Chapters
              </h2>
              <p className="text-xs text-muted-foreground mt-1.5 font-medium">
                Explore and join diverse campus communities.
              </p>
            </div>
            
            {/* Search Box */}
            <div className="relative w-full md:w-80 shrink-0">
              <Input
                id="search-club"
                placeholder="Search for clubs, chapters or interests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-slate-200 text-slate-800 focus:border-[#006680] focus:ring-1 focus:ring-[#006680]"
              />
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Category Pill Filters */}
          <div className="flex gap-2 w-full overflow-x-auto pb-1 scrollbar-none items-center">
            {studentCategories.map(cat => (
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
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-slate-400">Loading active directories...</div>
          ) : (
            <>
              {/* Active Chapters Layout */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Active Chapters</h3>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert("Interactive campus map loading..."); }} className="text-xs font-bold text-[#006680] hover:underline flex items-center gap-0.5">
                    <span>View map</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Card 1 */}
                  {activeChapter1 && (
                    <div className="bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden flex flex-col h-full hover:border-slate-300 transition-colors">
                      <div className="h-40 overflow-hidden relative">
                        <img 
                          src={activeChapter1.bannerImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'} 
                          alt={activeChapter1.name} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-2.5">
                            <span className="bg-[#e6f2f5] text-[#006680] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg">
                              North Campus
                            </span>
                            <div className="flex items-center -space-x-1.5">
                              <span className="w-4.5 h-4.5 rounded-full bg-sky-200 border border-white" />
                              <span className="w-4.5 h-4.5 rounded-full bg-violet-200 border border-white" />
                              <span className="w-4.5 h-4.5 rounded-full bg-slate-400 border border-white" />
                            </div>
                          </div>
                          <h4 className="font-black text-base text-slate-800 tracking-tight mb-2">
                            {activeChapter1.name}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                            {activeChapter1.description}
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-center pt-3 border-t border-slate-100 mt-auto">
                          <span className="text-xs font-bold text-slate-500">
                            {activeChapter1.membersCount.toLocaleString()} Members
                          </span>
                          <a href="#" onClick={(e) => { e.preventDefault(); alert(`Chapter detail panel for ${activeChapter1.name} opened.`); }} className="text-xs font-bold text-[#006680] hover:underline flex items-center gap-0.5">
                            <span>Details</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Card 2 */}
                  {activeChapter2 && (
                    <div className="bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden flex flex-col h-full hover:border-slate-300 transition-colors">
                      <div className="h-40 overflow-hidden relative">
                        <img 
                          src={activeChapter2.bannerImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'} 
                          alt={activeChapter2.name} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-2.5">
                            <span className="bg-[#e6f2f5] text-[#006680] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg">
                              Central Campus
                            </span>
                            <div className="flex items-center -space-x-1.5">
                              <span className="w-4.5 h-4.5 rounded-full bg-slate-300 border border-white" />
                              <span className="w-4.5 h-4.5 rounded-full bg-[#006680]/30 border border-white" />
                            </div>
                          </div>
                          <h4 className="font-black text-base text-slate-800 tracking-tight mb-2">
                            {activeChapter2.name}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                            {activeChapter2.description}
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-center pt-3 border-t border-slate-100 mt-auto">
                          <span className="text-xs font-bold text-slate-500">
                            {activeChapter2.membersCount.toLocaleString()} Members
                          </span>
                          <a href="#" onClick={(e) => { e.preventDefault(); alert(`Chapter detail panel for ${activeChapter2.name} opened.`); }} className="text-xs font-bold text-[#006680] hover:underline flex items-center gap-0.5">
                            <span>Details</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Start / Stats Panel */}
                  <div className="flex flex-col gap-6">
                    {/* Start a Chapter */}
                    <div className="bg-[#006680] text-white p-6 rounded-3xl flex flex-col justify-between h-[190px] shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                      <div className="space-y-2.5">
                        <div className="h-9 w-9 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                          <Rocket className="h-4.5 w-4.5 text-white" />
                        </div>
                        <h4 className="font-black text-base tracking-tight">Start a Chapter</h4>
                        <p className="text-[10px] text-white/80 font-medium leading-normal max-w-[200px]">
                          Don't see your favorite organization? Bring a new international chapter to UniSphere.
                        </p>
                      </div>
                      <button 
                        onClick={() => setCreateOpen(true)}
                        className="w-full bg-white hover:bg-slate-50 text-[#006680] text-xs font-extrabold py-2 rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer mt-2"
                      >
                        Apply Now
                      </button>
                    </div>

                    {/* Stats Card */}
                    <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col justify-between h-[166px]">
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                          CHAPTER ACTIVITY
                        </span>
                        <div className="flex justify-between items-end">
                          <span className="text-xs font-extrabold text-slate-500">Total Chapters</span>
                          <span className="text-3xl font-black text-slate-800 tracking-tight leading-none">42</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 mt-3 mb-2 overflow-hidden">
                          <div 
                            className="bg-[#006680] h-full rounded-full transition-all duration-500"
                            style={{ width: '85%' }}
                          />
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 block pt-1 border-t border-slate-50">
                        85% active engagement this semester
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Clubs Table */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Featured Clubs</h3>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <span>Sort by:</span>
                    <select className="border border-slate-200 bg-white rounded-xl px-2.5 py-1 text-slate-700 font-extrabold focus:outline-none focus:ring-1 focus:ring-[#006680] cursor-pointer">
                      <option value="popularity">Popularity</option>
                      <option value="name">Name (A-Z)</option>
                      <option value="members">Members Count</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/50 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="py-4.5 px-6">Club Name</th>
                        <th className="py-4.5 px-6">Coordinator</th>
                        <th className="py-4.5 px-6">Members</th>
                        <th className="py-4.5 px-6">Status</th>
                        <th className="py-4.5 px-6 text-right">Join Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                      {filteredClubs.map((club: Club) => {
                        const hasJoined = joinedClubs.includes(club.id)
                        const creator = club.creator || (club.creatorId === 3 ? {
                          name: 'Admin Chief',
                          role: 'ADMIN'
                        } : {
                          name: 'Sarah Jenkins',
                          role: 'FACULTY'
                        })
                        
                        // Mapped coordinator name from mockup if applicable
                        const getMockCoordinator = () => {
                          if (club.name.toLowerCase().includes('data science')) return 'Alex Rivera'
                          if (club.name.toLowerCase().includes('fine arts') || club.name.toLowerCase().includes('uurja')) return 'Sarah Chen'
                          if (club.name.toLowerCase().includes('sports') || club.name.toLowerCase().includes('nss')) return 'Marcus Thorne'
                          return creator.name
                        }
                        
                        // Status mapping from mockup
                        const getMockStatus = () => {
                          if (club.status === 'PENDING') return 'PENDING'
                          if (club.name.toLowerCase().includes('sports') || club.id % 3 === 0) return 'WAITLIST'
                          return 'RECRUITING'
                        }
                        
                        const status = getMockStatus()

                        return (
                          <tr key={club.id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="py-4.5 px-6">
                              <div className="flex items-center gap-3">
                                <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${getIconBg(club)}`}>
                                  {getCategoryIcon(club)}
                                </div>
                                <div>
                                  <span className="font-extrabold text-slate-800 text-sm block tracking-tight">
                                    {club.name}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-medium">
                                    {club.description.slice(0, 48)}...
                                  </span>
                                </div>
                              </div>
                            </td>
                            
                            <td className="py-4.5 px-6 text-slate-600 font-bold">
                              {getMockCoordinator()}
                            </td>
                            
                            <td className="py-4.5 px-6 text-slate-500 font-bold">
                              <AnimatedCounter value={club.membersCount + (hasJoined && !joinedClubs.includes(club.id) ? -1 : hasJoined && joinedClubs.includes(club.id) ? 0 : 0)} />
                            </td>
                            
                            <td className="py-4.5 px-6">
                              {status === 'RECRUITING' ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/40">
                                  RECRUITING
                                </span>
                              ) : status === 'WAITLIST' ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200/40">
                                  WAITLIST
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200/40">
                                  PENDING
                                </span>
                              )}
                            </td>
                            
                            <td className="py-4.5 px-6 text-right">
                              <div className="inline-flex items-center gap-2">
                                <button
                                  onClick={() => handleJoinClub(club.id)}
                                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                    hasJoined ? 'bg-[#006680]' : 'bg-slate-200'
                                  }`}
                                  disabled={club.status === 'PENDING'}
                                >
                                  <span
                                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                      hasJoined ? 'translate-x-4' : 'translate-x-0'
                                    }`}
                                  />
                                </button>
                                <span className={`text-[10px] font-extrabold w-10 text-left ${hasJoined ? 'text-[#006680]' : 'text-slate-400'}`}>
                                  {hasJoined ? 'Joined' : 'Join'}
                                </span>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Have a vision for a new community callout box */}
              <div className="border border-dashed border-slate-300 rounded-3xl p-8 text-center flex flex-col items-center bg-slate-50/50">
                <h4 className="text-lg font-black text-slate-800 tracking-tight mb-2">
                  Have a vision for a new community?
                </h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-lg mb-6">
                  UniSphere supports over 150+ student-led initiatives. Propose a new club and get access to funding, meeting spaces, and digital management tools.
                </p>
                <button 
                  onClick={() => setCreateOpen(true)}
                  className="bg-[#006680] hover:bg-[#00556c] text-white text-xs font-extrabold px-6 py-3 rounded-2xl flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Propose New Club</span>
                </button>
              </div>
            </>
          )}

          {/* Student view footer */}
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
        </>
      ) : (
        // COORDINATOR / ADMIN LIGHT THEME VIEW
        <>
          <div className="flex justify-between items-center bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 font-sans">Campus Clubs & Societies</h2>
              <p className="text-xs text-slate-500 mt-1.5 font-medium">Join academic chapters, technical coding teams, or environmental organizations</p>
            </div>
            <Button onClick={() => setCreateOpen(true)} className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Propose Club
            </Button>
          </div>

          {/* Filter and Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative w-full md:w-80 shrink-0">
              <Input
                id="search-club"
                placeholder="Search clubs by name or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-slate-200 text-slate-800 focus:border-[#006680] focus:ring-1 focus:ring-[#006680]"
              />
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>

            {/* Category Pill Filters */}
            <div className="flex gap-2 w-full overflow-x-auto pb-1 md:pb-0 scrollbar-none items-center">
              {originalCategories.map(cat => (
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
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-slate-400">Loading active directories...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClubs.map((club: Club) => {
                const hasJoined = joinedClubs.includes(club.id)
                const creator = club.creator || (club.creatorId === 3 ? {
                  id: 3,
                  name: 'Admin Chief',
                  email: 'admin@unisphere.edu',
                  department: 'Administration',
                  profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
                  role: 'ADMIN' as const
                } : {
                  id: 2,
                  name: 'Dr. Sarah Jenkins',
                  email: 'faculty@unisphere.edu',
                  department: 'Data Science',
                  profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
                  role: 'FACULTY' as const
                })

                return (
                  <div key={club.id} className="bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden flex flex-col h-full hover:border-slate-300 transition-colors relative">
                    <div className="relative h-36 overflow-hidden">
                      <img 
                        src={club.bannerImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800'} 
                        alt={club.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-3 left-4 text-white">
                        <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">CAMPUS CHAPTER</span>
                        <h4 className="font-extrabold text-base tracking-tight">{club.name}</h4>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">
                        {club.description}
                      </p>

                      <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-auto gap-2">
                        <span className="text-xs text-slate-500 font-bold flex items-center gap-1 shrink-0">
                          <Users className="h-4 w-4 text-[#006680]" />
                          <AnimatedCounter value={club.membersCount + (hasJoined && !joinedClubs.includes(club.id) ? -1 : hasJoined && joinedClubs.includes(club.id) ? 0 : 0)} /> Members
                        </span>

                        <div className="relative group shrink-0">
                          <div className="flex items-center gap-1 cursor-pointer bg-slate-100 hover:bg-slate-250 py-1 px-2 rounded-lg transition-colors border border-slate-200">
                            <img 
                              src={creator.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'} 
                              alt={creator.name} 
                              className="w-3.5 h-3.5 rounded-full object-cover"
                            />
                            <span className="text-[10px] font-bold text-slate-500">Coord</span>
                          </div>
                          
                          <div className="absolute bottom-full right-0 mb-2 w-56 p-3 rounded-xl bg-white border border-slate-200 shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-300 z-50">
                            <div className="flex items-center gap-2">
                              <img 
                                src={creator.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'} 
                                alt={creator.name} 
                                className="w-8 h-8 rounded-full object-cover border border-[#006680]"
                              />
                              <div className="min-w-0">
                                <h5 className="font-extrabold text-[11px] text-slate-800 truncate">{creator.name}</h5>
                                <span className="text-[9px] text-[#006680] font-bold tracking-wider uppercase">{creator.role}</span>
                              </div>
                            </div>
                            <div className="mt-2 space-y-0.5 text-[10px] text-slate-500 border-t border-slate-100 pt-1.5">
                              <p className="truncate"><strong className="text-slate-700">Dept:</strong> {creator.department || 'N/A'}</p>
                              <p className="truncate"><strong className="text-slate-700">Email:</strong> {creator.email}</p>
                            </div>
                          </div>
                        </div>

                        <Button 
                          variant={hasJoined ? 'outline' : 'primary'}
                          size="sm"
                          onClick={() => handleJoinClub(club.id)}
                          className="flex gap-1 items-center py-1 px-3 text-[11px]"
                          disabled={club.status === 'PENDING'}
                        >
                          {club.status === 'PENDING' ? (
                            'Approval Pending'
                          ) : hasJoined ? (
                            <>
                              <UserCheck className="h-3 w-3 text-emerald-400" />
                              Joined
                            </>
                          ) : (
                            'Join'
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
              {filteredClubs.length === 0 && (
                <Card className="col-span-3 p-12 text-center text-slate-400 border-dashed bg-card/40">
                  No matching clubs found in the directory. Try adjusting your search.
                </Card>
              )}
            </div>
          )}
        </>
      )}

      {/* CREATE CLUB DIALOG REQUEST */}
      <Dialog
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Propose New Campus Club"
      >
        <form onSubmit={handleCreateClub} className="space-y-4">
          <Input
            label="Club Name"
            id="club-name"
            placeholder="e.g. Robotics & Automation Group"
            value={clubName}
            onChange={(e) => setClubName(e.target.value)}
            required
            className={isStudent ? 'bg-white border-slate-200 text-slate-800 focus:border-[#006680] focus:ring-[#006680]' : ''}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase pl-1">Description / Core Charter</label>
            <textarea
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all min-h-[100px] ${
                isStudent 
                  ? 'bg-white border-slate-200 text-slate-800 focus:border-[#006680] focus:ring-[#006680]/30' 
                  : 'bg-background/50 border-border focus:ring-primary/50'
              }`}
              placeholder="Outline your club goal, prospective coordinator faculty, and student plans..."
              value={clubDesc}
              onChange={(e) => setClubDesc(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className={`w-full mt-4 ${isStudent ? 'bg-[#006680] hover:bg-[#00556c] text-white font-extrabold' : ''}`}>
            Submit Proposal
          </Button>
        </form>
      </Dialog>
    </div>
  )
}

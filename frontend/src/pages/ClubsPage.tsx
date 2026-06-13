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
    case 'TECH': return 'bg-sky-50 text-sky-600 border border-sky-100'
    case 'CULTURAL': return 'bg-orange-50 text-orange-655 border border-orange-100'
    case 'SPORTS': return 'bg-sky-50 text-sky-650 border border-sky-100'
    case 'ACADEMIC': return 'bg-sky-50 text-sky-600 border border-sky-100'
    case 'GREEN': return 'bg-sky-50 text-sky-650 border border-sky-100'
    default: return 'bg-slate-50 text-slate-500 border border-slate-100'
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
    <div className="space-y-8 animate-in fade-in duration-500 text-slate-800">
      {isStudent ? (
        // STUDENT LIGHT THEME VIEW
        <>
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white border border-sky-100 rounded-3xl p-6 md:p-8 shadow-travel text-left">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-800">
                Clubs & Chapters
              </h2>
              <p className="text-xs text-slate-500 mt-1.5 font-bold">
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
                className="pl-10 bg-slate-50 border border-slate-205 text-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white font-semibold"
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
                    ? 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-650 hover:to-sky-700 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800'
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
              <div className="text-left">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">Active Chapters</h3>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert("Interactive campus map loading..."); }} className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-0.5">
                    <span>View map</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Card 1 */}
                  {activeChapter1 && (
                    <div className="bg-white border border-sky-100 shadow-travel rounded-3xl overflow-hidden flex flex-col h-full">
                      <div className="h-40 overflow-hidden relative">
                        <img 
                          src={activeChapter1.bannerImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'} 
                          alt={activeChapter1.name} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-2.5">
                            <span className="bg-sky-50 text-sky-650 border border-sky-100 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg">
                              North Campus
                            </span>
                            <div className="flex items-center -space-x-1.5">
                              <span className="w-4.5 h-4.5 rounded-full bg-sky-100 border border-white" />
                              <span className="w-4.5 h-4.5 rounded-full bg-violet-100 border border-white" />
                              <span className="w-4.5 h-4.5 rounded-full bg-slate-100 border border-white" />
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
                          <span className="text-xs font-bold text-slate-400">
                            {activeChapter1.membersCount.toLocaleString()} Members
                          </span>
                          <a href="#" onClick={(e) => { e.preventDefault(); alert(`Chapter detail panel for ${activeChapter1.name} opened.`); }} className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-0.5">
                            <span>Details</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Card 2 */}
                  {activeChapter2 && (
                    <div className="bg-white border border-sky-100 shadow-travel rounded-3xl overflow-hidden flex flex-col h-full">
                      <div className="h-40 overflow-hidden relative">
                        <img 
                          src={activeChapter2.bannerImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'} 
                          alt={activeChapter2.name} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-2.5">
                            <span className="bg-orange-50 text-orange-655 border border-orange-100 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg">
                              Central Campus
                            </span>
                            <div className="flex items-center -space-x-1.5">
                              <span className="w-4.5 h-4.5 rounded-full bg-slate-100 border border-white" />
                              <span className="w-4.5 h-4.5 rounded-full bg-sky-100 border border-white" />
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
                          <span className="text-xs font-bold text-slate-400">
                            {activeChapter2.membersCount.toLocaleString()} Members
                          </span>
                          <a href="#" onClick={(e) => { e.preventDefault(); alert(`Chapter detail panel for ${activeChapter2.name} opened.`); }} className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-0.5">
                            <span>Details</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Propose a new organization card */}
                  <div className="bg-white border border-dashed border-sky-200 shadow-travel rounded-3xl p-6 flex flex-col justify-between items-center text-center min-h-[300px]">
                    <div className="my-auto space-y-3">
                      <h4 className="font-extrabold text-sm text-slate-805">Missing something?</h4>
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-[200px] mx-auto">
                        Don't see your favorite organization? Bring a new international chapter to UniSphere.
                      </p>
                    </div>
                    <button 
                      onClick={() => setCreateOpen(true)}
                      className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-extrabold py-3.5 rounded-2xl text-xs transition-colors cursor-pointer"
                    >
                      Propose Chapter
                    </button>
                  </div>
                </div>
              </div>

              {/* Browse communities */}
              <div className="text-left pt-6">
                <h3 className="text-lg font-black text-slate-800 tracking-tight mb-4">Browse Communities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredClubs.map((club: Club) => {
                    const hasJoined = joinedClubs.includes(club.id)
                    return (
                      <div key={club.id} className="bg-white border border-sky-100 rounded-3xl p-6 shadow-travel flex flex-col justify-between min-h-[180px] hover:border-sky-350 transition-colors">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${getIconBg(club)}`}>
                              {getCategoryIcon(club)}
                            </div>
                            <button 
                              onClick={() => handleJoinClub(club.id)}
                              className={`text-[10px] font-black uppercase tracking-wider py-1.5 px-3 rounded-lg border transition-all cursor-pointer ${
                                hasJoined 
                                  ? 'bg-sky-50 border border-sky-100 text-sky-655' 
                                  : 'border-slate-205 bg-white text-slate-500 hover:text-slate-800 hover:border-slate-350'
                              }`}
                            >
                              {hasJoined ? 'Joined' : 'Join'}
                            </button>
                          </div>
                          
                          <h4 className="font-extrabold text-sm text-slate-800 tracking-tight">{club.name}</h4>
                          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{club.description}</p>
                        </div>
                        
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 border-t border-slate-100 pt-3 mt-4">
                          <span>
                            <AnimatedCounter value={club.membersCount + (hasJoined && !joinedClubs.includes(club.id) ? -1 : hasJoined && joinedClubs.includes(club.id) ? 0 : 0)} /> Active Peers
                          </span>
                          <span className="uppercase text-[9px] tracking-wider text-orange-600 font-extrabold">{getClubCategory(club)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Have a vision for a new community callout box */}
              <div className="border border-dashed border-sky-200 rounded-3xl p-8 text-center flex flex-col items-center bg-white shadow-travel mt-8">
                <h4 className="text-lg font-black text-slate-800 tracking-tight mb-2">
                  Have a vision for a new community?
                </h4>
                <p className="text-xs text-slate-500 font-bold leading-relaxed max-w-lg mb-6">
                  UniSphere supports over 150+ student-led initiatives. Propose a new club and get access to funding, meeting spaces, and digital management tools.
                </p>
                <button 
                  onClick={() => setCreateOpen(true)}
                  className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white text-xs font-extrabold px-6 py-3 rounded-2xl flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Propose New Club</span>
                </button>
              </div>
            </>
          )}

          {/* Student view footer */}
          <footer className="border-t border-slate-100 mt-16 pt-8 pb-4 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
            <div>
              <span className="font-extrabold text-sm text-slate-800 mr-2">UniSphere</span>
              <span>&copy; 2026 UniSphere Systems Inc. All rights reserved.</span>
            </div>
            <div className="flex gap-6 font-semibold">
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-800 transition-colors">Privacy Policy</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-800 transition-colors">Terms of Service</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-800 transition-colors">Studio Partners</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-800 transition-colors">Contact Support</a>
            </div>
          </footer>
        </>
      ) : (
        // COORDINATOR / ADMIN LIGHT THEME VIEW
        <>
          <div className="flex justify-between items-center bg-white border border-sky-100 rounded-3xl p-6 md:p-8 shadow-travel text-left">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-800 font-sans">Campus Clubs & Societies</h2>
              <p className="text-xs text-slate-500 mt-1.5 font-bold">Join academic chapters, technical coding teams, or environmental organizations</p>
            </div>
            <Button onClick={() => setCreateOpen(true)} className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-extrabold shadow-sm py-2 px-4 cursor-pointer">
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
                className="pl-10 bg-slate-50 border border-slate-200 text-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white font-semibold"
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
                      ? 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800'
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
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
                  <div key={club.id} className="bg-white border border-sky-100 shadow-travel rounded-3xl overflow-hidden flex flex-col h-full hover:border-sky-350 transition-colors relative">
                    <div className="relative h-36 overflow-hidden">
                      <img 
                        src={club.bannerImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800'} 
                        alt={club.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                      <div className="absolute bottom-3 left-4 text-white">
                        <span className="text-[10px] text-sky-200 font-bold uppercase tracking-wider">CAMPUS CHAPTER</span>
                        <h4 className="font-extrabold text-base tracking-tight">{club.name}</h4>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">
                        {club.description}
                      </p>

                      <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-auto gap-2">
                        <span className="text-xs text-slate-400 font-bold flex items-center gap-1 shrink-0">
                          <Users className="h-4 w-4 text-sky-500" />
                          <AnimatedCounter value={club.membersCount + (hasJoined && !joinedClubs.includes(club.id) ? -1 : hasJoined && joinedClubs.includes(club.id) ? 0 : 0)} /> Members
                        </span>

                        <div className="relative group shrink-0">
                          <div className="flex items-center gap-1 cursor-pointer bg-slate-50 hover:bg-slate-100 py-1 px-2 rounded-lg transition-colors border border-slate-205 shadow-sm">
                            <img 
                              src={creator.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'} 
                              alt={creator.name} 
                              className="w-3.5 h-3.5 rounded-full object-cover border border-slate-200"
                            />
                            <span className="text-[10px] font-bold text-slate-500">Coord</span>
                          </div>
                          
                          <div className="absolute bottom-full right-0 mb-2 w-56 p-3 rounded-xl bg-white border border-slate-200 shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-300 z-50">
                            <div className="flex items-center gap-2">
                              <img 
                                src={creator.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'} 
                                alt={creator.name} 
                                className="w-8 h-8 rounded-full object-cover border border-sky-200"
                              />
                              <div className="min-w-0">
                                <h5 className="font-extrabold text-[11px] text-slate-805 truncate">{creator.name}</h5>
                                <span className="text-[8px] text-sky-600 font-black tracking-wider uppercase">{creator.role}</span>
                              </div>
                            </div>
                            <div className="mt-2 space-y-0.5 text-[10px] text-slate-500 border-t border-slate-100 pt-1.5">
                              <p className="truncate"><strong className="text-slate-400">Dept:</strong> {creator.department || 'N/A'}</p>
                              <p className="truncate"><strong className="text-slate-400">Email:</strong> {creator.email}</p>
                            </div>
                          </div>
                        </div>

                        <Button 
                          variant={hasJoined ? 'outline' : 'primary'}
                          size="sm"
                          onClick={() => handleJoinClub(club.id)}
                          className={`flex gap-1 items-center py-1 px-3 text-[11px] cursor-pointer ${!hasJoined ? 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-extrabold shadow-sm' : 'border-slate-200 text-slate-500 bg-slate-50'}`}
                          disabled={club.status === 'PENDING'}
                        >
                          {club.status === 'PENDING' ? (
                            'Approval Pending'
                          ) : hasJoined ? (
                            <>
                              <UserCheck className="h-3 w-3 text-sky-600" />
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
                <Card className="col-span-3 p-12 text-center text-slate-400 border-dashed border-slate-200 bg-white shadow-travel">
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
        <form onSubmit={handleCreateClub} className="space-y-4 text-left bg-white p-2 rounded-2xl">
          <Input
            label="Club Name"
            id="club-name"
            placeholder="e.g. Robotics & Automation Group"
            value={clubName}
            onChange={(e) => setClubName(e.target.value)}
            required
            className="bg-slate-50 border-slate-200 text-slate-800 focus:border-sky-500 focus:ring-sky-500"
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase pl-1">Description / Core Charter</label>
            <textarea
              className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50 text-slate-800 focus:border-sky-500 focus:ring-sky-500 rounded-xl text-sm focus:outline-none focus:ring-1 transition-all min-h-[100px] font-semibold"
              placeholder="Outline your club goal, prospective coordinator faculty, and student plans..."
              value={clubDesc}
              onChange={(e) => setClubDesc(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full mt-4 py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-extrabold shadow-sm cursor-pointer">
            Submit Proposal
          </Button>
        </form>
      </Dialog>
    </div>
  )
}

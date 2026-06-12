import React, { useState } from 'react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Dialog } from '../components/ui/Dialog'
import { useClubs, useCreateClub } from '../hooks/useApi'
import { Users, PlusCircle, UserCheck, Search } from 'lucide-react'
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

const categories = [
  { key: 'ALL', label: 'All Chapters' },
  { key: 'TECH', label: 'Tech & Coding' },
  { key: 'ACADEMIC', label: 'Business & Academia' },
  { key: 'SPORTS', label: 'Sports & Fitness' },
  { key: 'CULTURAL', label: 'Cultural & Arts' },
  { key: 'GREEN', label: 'Green & Sustainability' }
]

export const ClubsPage: React.FC = () => {
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

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground font-sans">Campus Clubs & Societies</h2>
          <p className="text-xs text-muted-foreground">Join academic chapters, technical coding teams, or environmental organizations</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Propose Club
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Input
            id="search-club"
            placeholder="Search clubs by name or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
        </div>

        {/* Category Pill Filters */}
        <div className="flex gap-2 w-full overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all shrink-0 ${
                selectedCategory === cat.key
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-secondary/40 text-muted-foreground hover:bg-secondary/80 hover:text-foreground border border-border/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading active directories...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club: Club) => {
            const hasJoined = joinedClubs.includes(club.id)
            
            // Fallback for creator object if not present (e.g. running mock fallback)
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
              <Card key={club.id} variant="glass" className="flex flex-col h-full relative">
                <div className="relative h-36 overflow-hidden rounded-t-2xl">
                  <img 
                    src={club.bannerImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800'} 
                    alt={club.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-4 text-white">
                    <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">CAMPUS CHAPTER</span>
                    <h4 className="font-extrabold text-base tracking-tight">{club.name}</h4>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-300/90 line-clamp-3 mb-4">
                    {club.description}
                  </p>

                  <div className="flex justify-between items-center border-t border-border/40 pt-4 mt-auto gap-2">
                    <span className="text-xs text-slate-300 font-semibold flex items-center gap-1 shrink-0">
                      <Users className="h-4 w-4 text-indigo-400" />
                      <AnimatedCounter value={club.membersCount + (hasJoined && !joinedClubs.includes(club.id) ? -1 : hasJoined && joinedClubs.includes(club.id) ? 0 : 0)} /> Members
                    </span>

                    {/* Coordinator Hover Card */}
                    <div className="relative group shrink-0">
                      <div className="flex items-center gap-1 cursor-pointer bg-secondary/60 hover:bg-secondary py-1 px-2 rounded-lg transition-colors border border-border/30">
                        <img 
                          src={creator.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'} 
                          alt={creator.name} 
                          className="w-3.5 h-3.5 rounded-full object-cover"
                        />
                        <span className="text-[10px] font-bold text-muted-foreground">Coord</span>
                      </div>
                      
                      {/* Hover Card Body */}
                      <div className="absolute bottom-full right-0 mb-2 w-56 p-3 rounded-xl bg-card border border-border shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-300 z-50">
                        <div className="flex items-center gap-2">
                          <img 
                            src={creator.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'} 
                            alt={creator.name} 
                            className="w-8 h-8 rounded-full object-cover border border-primary"
                          />
                          <div className="min-w-0">
                            <h5 className="font-extrabold text-[11px] text-foreground truncate">{creator.name}</h5>
                            <span className="text-[9px] text-primary font-bold tracking-wider uppercase">{creator.role}</span>
                          </div>
                        </div>
                        <div className="mt-2 space-y-0.5 text-[10px] text-muted-foreground border-t border-border/40 pt-1.5">
                          <p className="truncate"><strong className="text-foreground">Dept:</strong> {creator.department || 'N/A'}</p>
                          <p className="truncate"><strong className="text-foreground">Email:</strong> {creator.email}</p>
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
              </Card>
            )
          })}
          {filteredClubs.length === 0 && (
            <Card className="col-span-3 p-12 text-center text-muted-foreground border-dashed bg-card/40">
              No matching clubs found in the directory. Try adjusting your search.
            </Card>
          )}
        </div>
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
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase pl-1">Description / Core Charter</label>
            <textarea
              className="w-full px-4 py-2.5 bg-background/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[100px]"
              placeholder="Outline your club goal, prospective coordinator faculty, and student plans..."
              value={clubDesc}
              onChange={(e) => setClubDesc(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full mt-4">
            Submit Proposal
          </Button>
        </form>
      </Dialog>
    </div>
  )
}

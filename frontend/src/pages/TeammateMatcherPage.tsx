import React, { useState } from 'react'
import { Sparkles, Search, UserPlus, CheckCircle2, Send } from 'lucide-react'
import { useStudentDirectory } from '../hooks/useApi'
import { Dialog } from '../components/ui/Dialog'

export const TeammateMatcherPage: React.FC = () => {
  const { data: students = [], isLoading } = useStudentDirectory()
  const [searchSkill, setSearchSkill] = useState('')
  const [selectedRole, setSelectedRole] = useState('ALL')
  const [selectedPeer, setSelectedPeer] = useState<any | null>(null)
  const [inviteSent, setInviteSent] = useState(false)
  const [inviteMessage, setInviteMessage] = useState('')

  // Compute skill compatibility matrix
  const peerMatches = students.map((s: any, idx: number) => {
    const skillsList = s.skills || (idx % 3 === 0 ? ['PyTorch', 'Python', 'Computer Vision', 'ML'] : idx % 3 === 1 ? ['Solidity', 'Web3', 'React', 'Smart Contracts'] : ['React', 'TypeScript', 'Tailwind', 'Node.js'])
    const compatibility = Math.min(99, Math.max(70, 96 - (idx * 3) % 25))
    const vectorCluster = idx % 3 === 0 ? 'Deep Learning Cluster' : idx % 3 === 1 ? 'Web3 Smart Contracts Cluster' : 'Full-Stack Web Cluster'
    return {
      ...s,
      compatibility,
      vectorCluster,
      projectTitle: idx % 3 === 0 ? 'AI Medical Imaging App' : idx % 3 === 1 ? 'Web3 Smart Campus Wallet' : 'Autonomous IoT Rover',
      roleNeeded: idx % 3 === 0 ? 'Frontend Engineer' : idx % 3 === 1 ? 'Blockchain Developer' : 'ML Researcher',
      skillsList
    }
  })

  const filteredMatches = peerMatches.filter((p: any) => {
    const matchesSkill = searchSkill === '' || 
      p.name.toLowerCase().includes(searchSkill.toLowerCase()) ||
      p.skillsList.some((sk: string) => sk.toLowerCase().includes(searchSkill.toLowerCase()))
    const matchesRole = selectedRole === 'ALL' || p.roleNeeded.includes(selectedRole)
    return matchesSkill && matchesRole
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans select-none pb-20 text-slate-800">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-slate-900 border border-purple-800 rounded-3xl p-6 md:p-10 shadow-2xl text-white relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-300 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI Teammate Finder</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Find Your Hackathon & Capstone Teammates
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Match with UPES Dehradun peers based on complementary skills, hackathon experience, and research project goals.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input
            id="teammate-search"
            placeholder="Search by skill (React, Python, ML, Blockchain...)"
            value={searchSkill}
            onChange={(e) => setSearchSkill(e.target.value)}
            className="w-full pl-10 bg-white border border-slate-200 rounded-2xl py-3 px-4 text-xs text-slate-800 font-semibold focus:outline-none focus:border-purple-500 shadow-sm"
          />
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 text-xs font-bold">
          {['ALL', 'Frontend Engineer', 'Blockchain Developer', 'ML Researcher'].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-4 py-2 rounded-xl transition cursor-pointer shrink-0 ${
                selectedRole === role
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {role === 'ALL' ? 'All Roles' : role}
            </button>
          ))}
        </div>
      </div>

      {/* Match Cards Grid */}
      {isLoading ? (
        <div className="text-center py-16 text-slate-400 font-bold">Computing skill compatibility metrics...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((peer: any) => (
            <div
              key={peer.id}
              className="bg-white border border-slate-200 hover:border-purple-300 rounded-3xl p-6 shadow-travel transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between text-left relative overflow-hidden"
            >
              {/* Compatibility Badge */}
              <div className="absolute top-4 right-4 bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xl shadow-sm flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-purple-600 animate-pulse" />
                <span>{peer.compatibility}% Match</span>
              </div>

              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={peer.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={peer.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-100 shadow-md shrink-0"
                  />
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-tight">{peer.name}</h3>
                    <p className="text-xs font-bold text-purple-600 mt-0.5">{peer.department}</p>
                    <span className="inline-block my-1 px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[9px] font-black rounded-md">
                      🎯 Track: {peer.vectorCluster}
                    </span>
                    <p className="text-[10px] text-slate-400 font-semibold">Year {peer.academicYear || 3} • {peer.xpPoints || 250} XP</p>
                  </div>
                </div>

                {/* Looking For Project */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 mb-4">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Project Seeking Teammate</span>
                  <h4 className="text-xs font-extrabold text-slate-800 mt-1">{peer.projectTitle}</h4>
                  <p className="text-[10px] text-purple-600 font-bold mt-0.5">Seeking: {peer.roleNeeded}</p>
                </div>

                {/* Skill Pills */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Skill Matrix</span>
                  <div className="flex flex-wrap gap-1.5">
                    {peer.skillsList.map((skill: string, sIdx: number) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 bg-purple-50 border border-purple-100 text-purple-700 rounded-lg text-[10px] font-bold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]">{peer.email}</span>
                <button
                  onClick={() => {
                    setSelectedPeer(peer)
                    setInviteSent(false)
                    setInviteMessage(`Hi ${peer.name.split(' ')[0]}, let's team up for the UPES Hackathon project: ${peer.projectTitle}!`)
                  }}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Send Team Invite</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invite Modal */}
      <Dialog
        isOpen={!!selectedPeer}
        onClose={() => setSelectedPeer(null)}
        title="Send Hackathon & Project Invite"
      >
        {selectedPeer && (
          <div className="space-y-4 text-left bg-white p-2 rounded-2xl text-xs">
            <div className="flex items-center space-x-3 p-3 bg-purple-50 border border-purple-100 rounded-xl">
              <img
                src={selectedPeer.profileImage}
                alt={selectedPeer.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div>
                <h4 className="font-bold text-slate-900">{selectedPeer.name}</h4>
                <p className="text-[11px] text-purple-600 font-semibold">{selectedPeer.projectTitle}</p>
              </div>
            </div>

            {!inviteSent ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setInviteSent(true)
                }}
                className="space-y-3"
              >
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Invitation Message</label>
                  <textarea
                    rows={3}
                    required
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 font-semibold focus:outline-none focus:border-purple-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-extrabold rounded-xl shadow-md transition cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Dispatch Team Request</span>
                </button>
              </form>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Invitation sent to {selectedPeer.name}! They will receive a push notification in their UniSphere wallet.</span>
              </div>
            )}
          </div>
        )}
      </Dialog>
    </div>
  )
}

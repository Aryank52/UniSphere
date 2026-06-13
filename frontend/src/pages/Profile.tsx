import React from 'react'
import { useAuthStore } from '../store/authStore'
import { Badge } from '../components/ui/Badge'
import { Star, BookOpen, Trophy, Zap, ShieldCheck } from 'lucide-react'

export const Profile: React.FC = () => {
  const { user } = useAuthStore()

  // Calculate XP threshold logic
  const currentXP = user?.xpPoints || 0
  const currentLevel = user?.level || 1
  const xpNeededForNextLevel = currentLevel * 200
  const xpProgressPercent = Math.min(100, Math.floor((currentXP / xpNeededForNextLevel) * 100))

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-slate-800 text-left pb-16">
      
      {/* Top Profile Header Banner */}
      <div className="flex flex-col md:flex-row gap-6 bg-white border border-sky-100 rounded-3xl p-6 md:p-8 shadow-travel items-center justify-between">
        <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
          <img 
            src={user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
            className="h-20 w-20 rounded-full object-cover border-2 border-sky-100 shadow-sm"
            alt="Profile Avatar"
          />
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{user?.name}</h2>
              {user?.isEmailVerified && (
                <span title="Email Verified">
                  <ShieldCheck className="h-5 w-5 text-sky-500" />
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-slate-400 mt-1">{user?.email}</p>
            <div className="flex flex-wrap gap-1.5 mt-3 justify-center md:justify-start">
              <Badge variant="purple" className="text-[9px] font-black uppercase tracking-wider">{user?.role}</Badge>
              <Badge variant="info" className="text-[9px] font-black uppercase tracking-wider">{user?.department || 'Applied Science'}</Badge>
            </div>
          </div>
        </div>

        {/* Level Indicator Badge */}
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 flex items-center gap-4.5 min-w-[200px] shadow-sm">
          <div className="h-12 w-12 rounded-xl bg-sky-500 text-white flex items-center justify-center font-black text-xl shadow-md">
            {currentLevel}
          </div>
          <div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Milestone Level</span>
            <h4 className="font-extrabold text-sm text-slate-800 mt-0.5">Rank: Alpha</h4>
            <span className="text-[9px] text-sky-655 font-bold mt-1 block">{currentXP} XP Earned</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Gamification Progress (col-span-8) */}
        <div className="lg:col-span-8 bg-white border border-sky-100 rounded-3xl p-6 md:p-8 shadow-travel flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2 mb-6">
              <Trophy className="h-4.5 w-4.5 text-sky-500" />
              <span>Milestone & Leveling Progress</span>
            </h3>

            {/* XP progress bar */}
            <div className="space-y-3 bg-slate-50 border border-slate-100 p-6 rounded-2xl shadow-inner">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-500">Level {currentLevel}</span>
                <span className="text-slate-800 font-extrabold">{currentXP} / {xpNeededForNextLevel} XP</span>
              </div>
              <div className="h-3 w-full bg-slate-150 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full transition-all duration-500" 
                  style={{ width: `${xpProgressPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-bold italic pt-1">
                {xpNeededForNextLevel - currentXP} XP required to advance to Level {currentLevel + 1}!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Active Streak</span>
              <h4 className="text-xl font-black text-slate-800 mt-1 flex items-center gap-1">
                <Zap className="h-4 w-4 text-orange-500 fill-orange-200" />
                <span>42 Days</span>
              </h4>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Event Registrations</span>
              <h4 className="text-xl font-black text-slate-800 mt-1">14 Registered</h4>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Club Subscriptions</span>
              <h4 className="text-xl font-black text-slate-800 mt-1">2 Active</h4>
            </div>
          </div>
        </div>

        {/* Interests & Skills Cards (col-span-4) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
          
          {/* Interests Card */}
          <div className="bg-white border border-sky-100 rounded-3xl p-6 shadow-travel flex-1">
            <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Star className="h-4 w-4 text-sky-500 fill-sky-200" />
              <span>Interests Profile</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {user?.interests && user.interests.length > 0 ? (
                user.interests.map(i => (
                  <Badge key={i} variant="default" className="text-[9px] border-slate-200 bg-slate-50 text-slate-500 uppercase rounded-lg font-bold">{i}</Badge>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic font-semibold">No interests registered yet.</span>
              )}
            </div>
          </div>

          {/* Skills Card */}
          <div className="bg-white border border-sky-100 rounded-3xl p-6 shadow-travel flex-1">
            <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-sky-500" />
              <span>Skills & Competencies</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {user?.skills && user.skills.length > 0 ? (
                user.skills.map(s => (
                  <Badge key={s} variant="default" className="text-[9px] border-slate-200 bg-slate-50 text-slate-500 rounded-lg font-bold">{s}</Badge>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic font-semibold">No skills registered yet.</span>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}

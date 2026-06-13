import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClubs, useUpdateOnboarding } from '../hooks/useApi'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { 
  Building, 
  Calendar, 
  Brain, 
  Wrench, 
  Sparkles, 
  CheckCircle2, 
  Award,
  ArrowRight,
  ArrowLeft,
  Users
} from 'lucide-react'

export const OnboardingWizard: React.FC = () => {
  const navigate = useNavigate()
  const onboardingMutation = useUpdateOnboarding()
  const { data: clubs = [] } = useClubs()

  const [step, setStep] = useState(1)

  // Form selections
  const [department, setDepartment] = useState('Computer Science')
  const [academicYear, setAcademicYear] = useState(1)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedClubs, setSelectedClubs] = useState<number[]>([])
  const [careerGoal, setCareerGoal] = useState('Software Engineer')

  // Chip options list
  const INTEREST_OPTIONS = [
    'coding', 'artificial intelligence', 'hackathons', 'ux design', 'algorithms', 
    'cloud computing', 'data analytics', 'cybersecurity', 'robotics', 'entrepreneurship',
    'athletics', 'football', 'basketball', 'music', 'theatre', 'painting', 'literature'
  ]

  const SKILL_OPTIONS = [
    'React', 'TypeScript', 'Node.js', 'Python', 'Java', 'SQL', 'C++', 
    'Figma', 'AWS', 'Docker', 'Git', 'Public Speaking', 'Photoshop'
  ]

  const CATEGORIES = ['TECH', 'SPORTS', 'ACADEMIC', 'CULTURAL']

  const CAREER_GOALS = [
    'Software Engineer', 'Data Scientist', 'UX/UI Designer', 
    'Product Manager', 'Entrepreneur', 'Academic Researcher', 'Cybersecurity Specialist'
  ]

  const handleToggleInterest = (val: string) => {
    setSelectedInterests(prev => 
      prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val]
    )
  }

  const handleToggleSkill = (val: string) => {
    setSelectedSkills(prev => 
      prev.includes(val) ? prev.filter(s => s !== val) : [...prev, val]
    )
  }

  const handleToggleCategory = (val: string) => {
    setSelectedCategories(prev => 
      prev.includes(val) ? prev.filter(c => c !== val) : [...prev, val]
    )
  }

  const handleToggleClub = (clubId: number) => {
    setSelectedClubs(prev => 
      prev.includes(clubId) ? prev.filter(id => id !== clubId) : [...prev, clubId]
    )
  }

  const handleNext = () => {
    if (step < 7) {
      setStep(prev => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1)
    }
  }

  const handleSubmit = () => {
    onboardingMutation.mutate({
      department,
      academicYear,
      interests: selectedInterests,
      skills: selectedSkills,
      preferredCategories: selectedCategories
    }, {
      onSuccess: () => {
        // Redirect to dashboard upon profile completion
        navigate('/dashboard')
      }
    })
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Building className="h-5 w-5 text-sky-500" />
              <h3 className="font-extrabold text-lg text-slate-800">Select your Department</h3>
            </div>
            <p className="text-xs text-slate-400 font-semibold mb-4">This helps UniSphere suggest events popular in your specific academic department.</p>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white text-slate-800 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none transition-all"
            >
              <option value="Computer Science">Computer Science & Engineering</option>
              <option value="Data Science">Data Science & Analytics</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Business Administration">Business Administration</option>
              <option value="Applied Arts">Applied Arts & Design</option>
            </select>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-sky-500" />
              <h3 className="font-extrabold text-lg text-slate-800">Select Academic Year</h3>
            </div>
            <p className="text-xs text-slate-400 font-semibold mb-4">What year of study are you currently in?</p>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map(y => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setAcademicYear(y)}
                  className={`py-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    academicYear === y 
                      ? 'bg-sky-500 text-white border-sky-600 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-550 hover:bg-slate-50'
                  }`}
                >
                  {y}{y === 1 ? 'st' : y === 2 ? 'nd' : y === 3 ? 'rd' : 'th'} Year
                </button>
              ))}
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-5 w-5 text-sky-500" />
              <h3 className="font-extrabold text-lg text-slate-800">Select Interests</h3>
            </div>
            <p className="text-xs text-slate-400 font-semibold mb-4">These tags are processed by the AI Recommendation Engine to rank upcoming events.</p>
            <div className="flex flex-wrap gap-2.5 max-h-48 overflow-y-auto pr-1">
              {INTEREST_OPTIONS.map(opt => {
                const selected = selectedInterests.includes(opt)
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleToggleInterest(opt)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all capitalize cursor-pointer ${
                      selected 
                        ? 'bg-sky-50 border-sky-300 text-sky-600 font-extrabold'
                        : 'bg-white border-slate-200 text-slate-450 hover:bg-slate-50'
                    }`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-6 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Wrench className="h-5 w-5 text-sky-500" />
              <h3 className="font-extrabold text-lg text-slate-800">Select Skills</h3>
            </div>
            <p className="text-xs text-slate-400 font-semibold mb-4">Choose your active skills to match technical seminars and workshops.</p>
            <div className="flex flex-wrap gap-2.5 max-h-48 overflow-y-auto pr-1">
              {SKILL_OPTIONS.map(opt => {
                const selected = selectedSkills.includes(opt)
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleToggleSkill(opt)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      selected 
                        ? 'bg-sky-50 border-sky-300 text-sky-600 font-extrabold'
                        : 'bg-white border-slate-200 text-slate-450 hover:bg-slate-50'
                    }`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        )
      case 5:
        return (
          <div className="space-y-6 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-sky-500" />
              <h3 className="font-extrabold text-lg text-slate-800">Preferred Event Categories</h3>
            </div>
            <p className="text-xs text-slate-400 font-semibold mb-4">What types of events do you prefer attending?</p>
            <div className="grid grid-cols-2 gap-4">
              {CATEGORIES.map(cat => {
                const selected = selectedCategories.includes(cat)
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleToggleCategory(cat)}
                    className={`py-4 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                      selected 
                        ? 'bg-sky-50 border-sky-300 text-sky-600 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>
        )
      case 6:
        return (
          <div className="space-y-6 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-sky-500" />
              <h3 className="font-extrabold text-lg text-slate-800">Subscribe to Student Clubs</h3>
            </div>
            <p className="text-xs text-slate-400 font-semibold mb-4">Join active campus clubs immediately to receive their event announcements.</p>
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {clubs.map((c: any) => {
                const selected = selectedClubs.includes(c.id)
                return (
                  <div 
                    key={c.id} 
                    onClick={() => handleToggleClub(c.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex justify-between items-center shadow-sm ${
                      selected 
                        ? 'bg-sky-50 border-sky-300 text-sky-655 font-extrabold'
                        : 'bg-white border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <h5 className="font-bold text-xs text-slate-700">{c.name}</h5>
                      <p className="text-[10px] text-slate-400 truncate max-w-[280px] font-semibold mt-0.5">{c.description}</p>
                    </div>
                    {selected && <CheckCircle2 className="h-4 w-4 text-sky-500 shrink-0" />}
                  </div>
                )
              })}
            </div>
          </div>
        )
      case 7:
        return (
          <div className="space-y-6 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-sky-500" />
              <h3 className="font-extrabold text-lg text-slate-800">Select Career Goal</h3>
            </div>
            <p className="text-xs text-slate-400 font-semibold mb-4">Let us know what your career objectives are to align professional workshops.</p>
            <div className="space-y-3">
              {CAREER_GOALS.map(goal => (
                <div
                  key={goal}
                  onClick={() => setCareerGoal(goal)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer text-xs font-bold text-slate-700 ${
                    careerGoal === goal
                      ? 'bg-sky-50 border-sky-300 text-sky-600 font-extrabold shadow-sm'
                      : 'bg-white border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  {goal}
                </div>
              ))}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen w-full bg-sky-clouds text-slate-800 flex flex-col justify-center items-center py-12 px-6 relative overflow-hidden font-sans select-none">
      
      {/* Background Radial Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-sky-200/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-orange-100/40 rounded-full blur-[140px] pointer-events-none" />

      <Card className="w-full max-w-lg bg-white border border-sky-100 rounded-3xl overflow-hidden shadow-travel p-8 relative flex flex-col justify-between min-h-[420px] z-10">
        
        {/* Top Stepper Indicator */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-sky-500">ONBOARDING PROFILE WIZARD</span>
            <h2 className="font-black text-xl text-slate-800 mt-1">Configure Workspace</h2>
          </div>
          <div className="bg-sky-50 border border-sky-100 text-sky-600 font-black text-xs px-3 py-1.5 rounded-xl">
            Step {step} of 7
          </div>
        </div>

        {/* Content Box */}
        <div className="flex-1 mb-8">
          {renderStepContent()}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex justify-between items-center border-t border-slate-100 pt-6 mt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="flex gap-1.5 items-center justify-center cursor-pointer border border-slate-200 bg-white text-slate-500 disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>

          <Button
            variant="primary"
            onClick={handleNext}
            disabled={onboardingMutation.isPending}
            className="flex gap-1.5 items-center justify-center bg-sky-500 hover:bg-sky-600 text-white font-extrabold px-6"
          >
            <span>{step === 7 ? 'Complete Profile' : 'Next Step'}</span>
            {step < 7 && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>

      </Card>
      
      {/* Onboarding completion gift XP tip */}
      <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-6 z-10">
        <Sparkles className="h-4 w-4 text-sky-500 animate-pulse" />
        <span>Earn 100 XP upon profile activation</span>
      </div>
    </div>
  )
}

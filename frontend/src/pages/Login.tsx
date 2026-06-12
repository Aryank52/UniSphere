import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Sparkles, 
  Shield, 
  GraduationCap, 
  Network, 
  Lock, 
  ArrowRight, 
  Fingerprint, 
  Users, 
  Zap, 
  Globe,
  User
} from 'lucide-react'
import { useLogin, useRegister } from '../hooks/useApi'
import { useAuthStore } from '../store/authStore'

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const token = useAuthStore(state => state.token)
  
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<'STUDENT' | 'FACULTY' | 'ADMIN'>('STUDENT')
  const [department, setDepartment] = useState('Computer Science')
  const [formError, setFormError] = useState('')

  const loginMutation = useLogin()
  const registerMutation = useRegister()

  // Redirect if already logged in
  useEffect(() => {
    if (token) navigate('/')
  }, [token, navigate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (!email || !password || (isRegister && !name)) {
      setFormError('Please fill in all required fields.')
      return
    }

    if (isRegister) {
      registerMutation.mutate({ name, email, password, role, department }, {
        onSuccess: () => navigate('/'),
        onError: (err: Error) => setFormError(err.message || 'Registration failed.')
      })
    } else {
      loginMutation.mutate({ email, password }, {
        onSuccess: () => navigate('/'),
        onError: (err: Error) => setFormError(err.message || 'Authentication failed.')
      })
    }
  }

  // Pre-fill helpers for verification
  const handleShortcutLogin = (roleType: 'STUDENT' | 'FACULTY' | 'ADMIN') => {
    setFormError('')
    setIsRegister(false)
    
    let prefilledEmail = ''
    if (roleType === 'STUDENT') prefilledEmail = 'student@unisphere.edu'
    if (roleType === 'FACULTY') prefilledEmail = 'faculty@unisphere.edu'
    if (roleType === 'ADMIN') prefilledEmail = 'admin@unisphere.edu'

    setEmail(prefilledEmail)
    setPassword('password')

    // Submit after tiny timeout to show prefill effect
    setTimeout(() => {
      loginMutation.mutate({ email: prefilledEmail, password: 'password' }, {
        onSuccess: () => navigate('/'),
        onError: (err: Error) => setFormError(err.message || 'Authentication failed.')
      })
    }, 150)
  }

  return (
    <div className="min-h-screen w-full bg-[#060814] flex flex-col justify-between p-6 relative overflow-hidden font-sans select-none">
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Main Grid Wrapper */}
      <div className="max-w-7xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center z-10 px-4 md:px-8 py-12">
        
        {/* Left Side: Branding & Statistics */}
        <div className="lg:col-span-6 flex flex-col justify-between h-full py-4 text-left">
          
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 lg:mb-16">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Network className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white font-sans">UniSphere</span>
          </div>

          {/* Headline Description */}
          <div className="space-y-5 mb-10 lg:mb-12">
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              The Future of <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(52,211,153,0.15)]">
                Campus Life
              </span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              A unified ecosystem for students, faculty, and administrators. Experience precision-engineered academic management with real-time data orchestration.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 max-w-lg mb-12">
            
            {/* Stat 1 */}
            <div className="bg-[#0b0e17]/60 backdrop-blur border border-slate-900 rounded-2xl p-5 hover:border-slate-800 transition-colors duration-300">
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <Users className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Community</span>
              </div>
              <h3 className="text-2xl font-black text-white">45k+</h3>
              <p className="text-xs text-slate-500 font-medium">Active Students</p>
            </div>

            {/* Stat 2 */}
            <div className="bg-[#0b0e17]/60 backdrop-blur border border-slate-900 rounded-2xl p-5 hover:border-slate-800 transition-colors duration-300">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <Zap className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Performance</span>
              </div>
              <h3 className="text-2xl font-black text-white">99.9%</h3>
              <p className="text-xs text-slate-500 font-medium">System Uptime</p>
            </div>

            {/* Stat 3 */}
            <div className="bg-[#0b0e17]/60 backdrop-blur border border-slate-900 rounded-2xl p-5 hover:border-slate-800 transition-colors duration-300">
              <div className="flex items-center gap-2 text-violet-400 mb-2">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Intelligence</span>
              </div>
              <h3 className="text-2xl font-black text-white">2.4m</h3>
              <p className="text-xs text-slate-500 font-medium">Daily Data Points</p>
            </div>

            {/* Stat 4 */}
            <div className="relative overflow-hidden bg-[#0b0e17]/60 backdrop-blur border border-slate-900 rounded-2xl p-5 hover:border-slate-800 transition-colors duration-300 flex flex-col justify-between">
              {/* Subtle background glow representing world network */}
              <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center gap-2 text-slate-300 mb-2">
                <Globe className="h-4 w-4 text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-wider">Global</span>
              </div>
              <div>
                <h3 className="text-sm font-black text-white leading-snug">Campus Network</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Connected Infrastructure</p>
              </div>
            </div>

          </div>

          {/* Trusted Brand Footer */}
          <div className="flex items-center gap-4 text-slate-600 text-[10px] font-bold uppercase tracking-widest mt-auto">
            <span>Trusted by world-class institutions</span>
            <div className="h-[1px] bg-slate-900 flex-1" />
          </div>

        </div>

        {/* Right Side: Login Card Container */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end items-center">
          
          <div className="bg-[#0c101d]/80 backdrop-blur border border-slate-800/80 rounded-3xl p-8 lg:p-10 w-full max-w-md shadow-2xl relative">
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-white mb-1.5">
                {isRegister ? 'Welcome to UniSphere' : 'Welcome Back'}
              </h2>
              <p className="text-xs text-slate-400">
                {isRegister ? 'Access your digital campus experience' : 'Access your digital campus experience'}
              </p>
            </div>

            {formError && (
              <div className="p-3 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 font-semibold text-center">
                {formError}
              </div>
            )}

            {!isRegister ? (
              /* LOGIN FORM */
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Institutional Email */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Institutional Email</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-slate-500 text-base font-bold">@</span>
                    <input 
                      type="email"
                      id="login-email"
                      placeholder="name@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#131929] border border-slate-800/80 focus:border-indigo-500 text-white rounded-xl py-3.5 pl-10 pr-4 text-sm focus:outline-none transition-all duration-200 placeholder-slate-600 shadow-inner"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Password</label>
                    <button type="button" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">Forgot?</button>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-4 h-4 w-4 text-slate-500" />
                    <input 
                      type="password"
                      id="login-pass"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#131929] border border-slate-800/80 focus:border-indigo-500 text-white rounded-xl py-3.5 pl-10 pr-4 text-sm focus:outline-none transition-all duration-200 placeholder-slate-600 shadow-inner"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50 mt-2"
                >
                  {loginMutation.isPending ? (
                    <span>Verifying Security Check...</span>
                  ) : (
                    <>
                      <span>Sign In to UniSphere</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

              </form>
            ) : (
              /* REGISTRATION FORM */
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Full Name</label>
                  <input 
                    type="text"
                    id="reg-name"
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#131929] border border-slate-800/80 focus:border-indigo-500 text-white rounded-xl py-3 px-4 text-sm focus:outline-none transition-all duration-200 placeholder-slate-600"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Institutional Email</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-slate-500 text-base font-bold">@</span>
                    <input 
                      type="email"
                      id="login-email"
                      placeholder="student@unisphere.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#131929] border border-slate-800/80 focus:border-indigo-500 text-white rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none transition-all duration-200 placeholder-slate-600"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Secret Password</label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-4 h-4 w-4 text-slate-500" />
                    <input 
                      type="password"
                      id="login-pass"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#131929] border border-slate-800/80 focus:border-indigo-500 text-white rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none transition-all duration-200 placeholder-slate-600"
                      required
                    />
                  </div>
                </div>

                {/* Select Options */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Account Role</label>
                    <select
                      id="reg-role"
                      value={role}
                      onChange={(e) => setRole(e.target.value as 'STUDENT' | 'FACULTY' | 'ADMIN')}
                      className="w-full bg-[#131929] border border-slate-800/80 focus:border-indigo-500 text-white rounded-xl py-3 px-3 text-xs focus:outline-none transition-all duration-200"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="FACULTY">Faculty Coordinator</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Department</label>
                    <select
                      id="reg-dept"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-[#131929] border border-slate-800/80 focus:border-indigo-500 text-white rounded-xl py-3 px-3 text-xs focus:outline-none transition-all duration-200"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Mechanical Engineering">Mechanical Eng</option>
                      <option value="Business Administration">Business Admin</option>
                    </select>
                  </div>
                </div>

                {/* Register Submit */}
                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50 mt-2"
                >
                  {registerMutation.isPending ? 'Completing Sign Up...' : 'Complete Sign Up'}
                </button>

              </form>
            )}

            {/* Secure Connect Divider */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800/60"></div>
              </div>
              <span className="relative px-3 bg-[#0c101d] text-[9px] font-black tracking-widest text-slate-500 uppercase">Secure Connect</span>
            </div>

            {/* Google & Biometrics Mock connect */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => alert("Google Single Sign-On integration is currently in sandbox mode.")}
                className="bg-[#131929] hover:bg-[#182035] border border-slate-800/80 text-slate-300 rounded-xl py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-2 transition-colors duration-200"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => alert("Biometrics fingerprint scanning is currently in sandbox mode.")}
                className="bg-[#131929] hover:bg-[#182035] border border-slate-800/80 text-slate-300 rounded-xl py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-2 transition-colors duration-200"
              >
                <Fingerprint className="h-4 w-4 text-slate-500" />
                <span>Biometrics</span>
              </button>
            </div>

            {/* Quick Access Horizontal Section */}
            <div className="mt-8 pt-4 border-t border-slate-800/60 space-y-3">
              <div className="text-center">
                <span className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Quick Access (Sandboxed)</span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                
                {/* Student Shortcut */}
                <button
                  type="button"
                  onClick={() => handleShortcutLogin('STUDENT')}
                  className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border border-slate-800 bg-[#131929]/30 hover:bg-[#131929] hover:border-emerald-500/40 text-slate-400 hover:text-emerald-400 transition-all duration-200"
                >
                  <User className="h-4 w-4" />
                  <span className="text-[10px] font-bold">Student</span>
                </button>

                {/* Faculty Shortcut */}
                <button
                  type="button"
                  onClick={() => handleShortcutLogin('FACULTY')}
                  className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border border-slate-800 bg-[#131929]/30 hover:bg-[#131929] hover:border-indigo-500/40 text-slate-400 hover:text-indigo-400 transition-all duration-200"
                >
                  <GraduationCap className="h-4 w-4" />
                  <span className="text-[10px] font-bold">Faculty</span>
                </button>

                {/* Admin Shortcut */}
                <button
                  type="button"
                  onClick={() => handleShortcutLogin('ADMIN')}
                  className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border border-slate-800 bg-[#131929]/30 hover:bg-[#131929] hover:border-violet-500/40 text-slate-400 hover:text-violet-400 transition-all duration-200"
                >
                  <Shield className="h-4 w-4" />
                  <span className="text-[10px] font-bold">Admin</span>
                </button>

              </div>
            </div>

            {/* Need Access / Onboarding footer */}
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => {
                  setFormError('')
                  setIsRegister(!isRegister)
                }}
                className="text-xs text-slate-400 hover:text-white transition-colors duration-200"
              >
                {isRegister ? (
                  <span>Already have an account? <span className="font-bold text-indigo-400 hover:underline">Log In</span></span>
                ) : (
                  <span>Need access? <span className="font-bold text-indigo-400 hover:underline">Request Institution Onboarding</span></span>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Global Page Footer */}
      <footer className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-600 text-xs px-4 md:px-8 border-t border-slate-900 pt-6">
        <div>
          <span>&copy; {new Date().getFullYear()} UniSphere Systems</span>
        </div>
        <div className="flex gap-6 font-semibold">
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-400 transition-colors">Security</a>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-400 transition-colors">Privacy</a>
        </div>
      </footer>

    </div>
  )
}

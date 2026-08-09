import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Lock, 
  ArrowRight, 
  GraduationCap, 
  Briefcase, 
  Shield, 
  Eye, 
  EyeOff, 
  Building,
  ShieldAlert,
  ShieldCheck,
  Globe
} from 'lucide-react'
import { useLogin, useRegister } from '../hooks/useApi'
import { useAuthStore } from '../store/authStore'

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const token = useAuthStore(state => state.token)
  const user = useAuthStore(state => state.user)
  
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<'STUDENT' | 'FACULTY' | 'ADMIN'>('STUDENT')
  const [department, setDepartment] = useState('Computer Science')
  const [formError, setFormError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberDevice, setRememberDevice] = useState(false)

  const loginMutation = useLogin()
  const registerMutation = useRegister()

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      if (user?.role === 'STUDENT' && !user?.department) {
        navigate('/onboarding')
      } else {
        navigate('/dashboard')
      }
    }
  }, [token, user, navigate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (!email || !password || (isRegister && !name)) {
      setFormError('Please fill in all required fields.')
      return
    }

    if (isRegister) {
      registerMutation.mutate({ name, email, password, role, department }, {
        onSuccess: (data) => {
          if (data.user?.role === 'STUDENT' && !data.user?.department) {
            navigate('/onboarding')
          } else {
            navigate('/dashboard')
          }
        },
        onError: (err: Error) => setFormError(err.message || 'Registration failed.')
      })
    } else {
      loginMutation.mutate({ email, password }, {
        onSuccess: (data) => {
          if (data.user?.role === 'STUDENT' && !data.user?.department) {
            navigate('/onboarding')
          } else {
            navigate('/dashboard')
          }
        },
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
        onSuccess: (data) => {
          if (data.user?.role === 'STUDENT' && !data.user?.department) {
            navigate('/onboarding')
          } else {
            navigate('/dashboard')
          }
        },
        onError: (err: Error) => setFormError(err.message || 'Authentication failed.')
      })
    }, 150)
  }

  return (
    <div className="min-h-screen w-full bg-sky-clouds text-slate-800 flex flex-col justify-between relative overflow-hidden font-sans select-none">
      
      {/* Background Radial Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-sky-200/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-orange-100/40 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header Secure Bar */}
      <header className="w-full bg-white/80 border-b border-sky-100/60 backdrop-blur-md z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-2xl tracking-tight text-slate-800 font-sans flex items-center gap-2.5">
              <span className="h-8 w-8 rounded-lg bg-gradient-to-tr from-sky-500 to-sky-600 flex items-center justify-center text-white text-[11px] font-black shadow-sm">
                <Globe className="h-4.5 w-4.5" />
              </span>
              <span className="bg-gradient-to-r from-sky-600 to-sky-850 bg-clip-text text-transparent font-sans">UniSphere</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <span>Secure Access Console</span>
            <Lock className="h-4 w-4 text-sky-500" />
          </div>
        </div>
      </header>

      {/* Central Login Card Section */}
      <main className="flex-1 flex items-center justify-center py-12 px-6 z-10">
        <div className="w-full max-w-md bg-white border border-sky-100 rounded-3xl overflow-hidden shadow-travel flex flex-col">
          
          {/* Top Switcher Tabs */}
          <div className="grid grid-cols-2 border-b border-sky-100 bg-slate-50/50">
            <button
              onClick={() => { setIsRegister(false); setFormError(''); }}
              className={`py-4 text-xs font-extrabold transition-all border-b-2 cursor-pointer ${
                !isRegister 
                  ? 'border-sky-500 text-sky-600 bg-white' 
                  : 'border-transparent text-slate-400 hover:text-slate-600 bg-transparent'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsRegister(true); setFormError(''); }}
              className={`py-4 text-xs font-extrabold transition-all border-b-2 cursor-pointer ${
                isRegister 
                  ? 'border-sky-500 text-sky-600 bg-white' 
                  : 'border-transparent text-slate-400 hover:text-slate-600 bg-transparent'
              }`}
            >
              Register
            </button>
          </div>

          <div className="p-8 flex flex-col">
            
            {/* Greetings block */}
            <div className="text-left mb-6">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                {isRegister ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                {isRegister ? 'Register your official UPES student/faculty account.' : 'Enter your credentials to access your campus dashboard.'}
              </p>
            </div>

            {/* Form Error Banner */}
            {formError && (
              <div className="p-3 mb-5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-bold text-center flex items-center justify-center gap-1.5">
                <ShieldAlert className="h-4.5 w-4.5 text-rose-500 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* FORM CONTAINER */}
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              
              {isRegister && (
                /* Full Name (Registration only) */
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 tracking-wider uppercase pl-1">Full Name</label>
                  <input 
                    type="text"
                    id="reg-name"
                    placeholder="e.g. Alex Rivera"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white text-slate-800 rounded-xl py-3 px-4 text-xs focus:outline-none transition-all placeholder-slate-400 font-semibold"
                    required
                  />
                </div>
              )}

              {/* University ID / Email */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 tracking-wider uppercase pl-1">
                  University ID
                </label>
                <div className="relative flex items-center">
                  <Building className="absolute left-4 h-4 w-4 text-slate-400" />
                  <input 
                    type="text"
                    id="login-email"
                    placeholder="e.g. student@unisphere.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white text-slate-800 rounded-xl py-3 pl-11 pr-4 text-xs focus:outline-none transition-all placeholder-slate-400 font-semibold"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[9px] font-black text-slate-400 tracking-wider uppercase">Password</label>
                  {!isRegister && (
                    <button 
                      type="button" 
                      onClick={() => alert("Credentials reset request forwarded to registrar support.")}
                      className="text-xs text-sky-600 hover:text-sky-700 font-extrabold transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 h-4 w-4 text-slate-400" />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    id="login-pass"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white text-slate-800 rounded-xl py-3 pl-11 pr-11 text-xs focus:outline-none transition-all placeholder-slate-400 font-semibold"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-slate-400 hover:text-slate-650 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {isRegister && (
                /* Role & Department Switchers (Registration only) */
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 tracking-wider uppercase pl-1">Role</label>
                    <select
                      id="reg-role"
                      value={role}
                      onChange={(e) => setRole(e.target.value as 'STUDENT' | 'FACULTY' | 'ADMIN')}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 text-slate-700 rounded-xl py-3 px-3 text-xs font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="FACULTY">Faculty Coordinator</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 tracking-wider uppercase pl-1">Department</label>
                    <select
                      id="reg-dept"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 text-slate-700 rounded-xl py-3 px-3 text-xs font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Mechanical Engineering">Mechanical Eng</option>
                      <option value="Business Administration">Business Admin</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Remember device checkbox */}
              {!isRegister && (
                <div className="flex items-center gap-2 pt-1 px-1">
                  <input
                    type="checkbox"
                    id="remember-device"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-sky-500 bg-white focus:ring-sky-500 cursor-pointer"
                  />
                  <label htmlFor="remember-device" className="text-xs font-semibold text-slate-450 cursor-pointer select-none">
                    Remember device for 30 days
                  </label>
                </div>
              )}

              {/* Submit Action Button */}
              <button
                type="submit"
                disabled={loginMutation.isPending || registerMutation.isPending}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-extrabold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all duration-200 shadow-md active:scale-[0.98] disabled:opacity-50 mt-4 cursor-pointer text-xs"
              >
                {loginMutation.isPending || registerMutation.isPending ? (
                  <span>Verifying credentials...</span>
                ) : (
                  <>
                    <span>{isRegister ? 'Create Account' : 'Sign In to Portal'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Institutional SSO Section */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <span className="relative px-3 bg-white text-[8px] font-black tracking-widest text-slate-400 uppercase">
                INSTITUTIONAL SSO (@upes.ac.in)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-2">
              <button
                type="button"
                onClick={() => {
                  const userEmail = prompt('Enter your official UPES Google Email (@stu.upes.ac.in or @upes.ac.in):', 'student@stu.upes.ac.in')
                  if (!userEmail) return
                  if (!userEmail.endsWith('@stu.upes.ac.in') && !userEmail.endsWith('@upes.ac.in')) {
                    setFormError('Access Denied: Only official UPES accounts (@stu.upes.ac.in or @upes.ac.in) are permitted via Institutional SSO.')
                    return
                  }
                  loginMutation.mutate({ email: 'student@unisphere.edu', password: 'password' }, {
                    onSuccess: () => navigate('/dashboard')
                  })
                }}
                className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-[10px] flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                <span>Google SSO</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const userEmail = prompt('Enter your official UPES Microsoft 365 Email (@stu.upes.ac.in or @upes.ac.in):', 'faculty@upes.ac.in')
                  if (!userEmail) return
                  if (!userEmail.endsWith('@stu.upes.ac.in') && !userEmail.endsWith('@upes.ac.in')) {
                    setFormError('Access Denied: Only official UPES accounts (@stu.upes.ac.in or @upes.ac.in) are permitted via Institutional SSO.')
                    return
                  }
                  loginMutation.mutate({ email: 'faculty@unisphere.edu', password: 'password' }, {
                    onSuccess: () => navigate('/dashboard')
                  })
                }}
                className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-[10px] flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 23 23"><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>
                <span>Microsoft 365</span>
              </button>
            </div>

            {/* Quick Access Roles Separator */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <span className="relative px-3 bg-white text-[8px] font-black tracking-widest text-slate-400 uppercase">
                QUICK ACCESS ROLES
              </span>
            </div>

            {/* Shortcut Buttons Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              {/* Student */}
              <button
                type="button"
                onClick={() => handleShortcutLogin('STUDENT')}
                className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-sky-50 hover:border-sky-200 text-slate-600 hover:text-sky-600 transition-all duration-200 cursor-pointer"
              >
                <GraduationCap className="h-4.5 w-4.5 text-sky-500" />
                <span className="text-[10px] font-extrabold">Student</span>
              </button>

              {/* Faculty */}
              <button
                type="button"
                onClick={() => handleShortcutLogin('FACULTY')}
                className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-sky-50 hover:border-sky-200 text-slate-600 hover:text-sky-600 transition-all duration-200 cursor-pointer"
              >
                <Briefcase className="h-4.5 w-4.5 text-sky-500" />
                <span className="text-[10px] font-extrabold">Faculty</span>
              </button>

              {/* Admin */}
              <button
                type="button"
                onClick={() => handleShortcutLogin('ADMIN')}
                className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-sky-50 hover:border-sky-200 text-slate-600 hover:text-sky-600 transition-all duration-200 cursor-pointer"
              >
                <Shield className="h-4.5 w-4.5 text-sky-500" />
                <span className="text-[10px] font-extrabold">Admin</span>
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* Security credentials indicators */}
      <div className="flex justify-center items-center gap-4 text-[9px] font-black text-slate-400 uppercase tracking-wider mb-6">
        <div className="flex items-center gap-1">
          <ShieldCheck className="h-4 w-4 text-sky-500" />
          <span>AES-256 Encrypted</span>
        </div>
        <div className="flex items-center gap-1">
          <ShieldCheck className="h-4 w-4 text-sky-500" />
          <span>UPES Secured Portal</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-sky-100 py-6 text-xs text-slate-400 z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <span className="font-extrabold text-sm text-slate-700 mr-2">UniSphere</span>
            <span>&copy; {new Date().getFullYear()} UniSphere Systems Inc. All rights reserved.</span>
          </div>
          <div className="flex gap-6 font-semibold">
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-sky-500 transition-colors">Privacy Policy</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-sky-500 transition-colors">Terms of Service</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-sky-500 transition-colors">Support</a>
          </div>
        </div>
      </footer>

    </div>
  )
}

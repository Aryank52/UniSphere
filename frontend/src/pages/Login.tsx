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
  ShieldCheck
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
  const [showPassword, setShowPassword] = useState(false)
  const [rememberDevice, setRememberDevice] = useState(false)

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
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-between relative overflow-hidden font-sans select-none text-slate-700">
      
      {/* Background Soft Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-100/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header Secure Bar */}
      <header className="w-full bg-white/80 border-b border-slate-200 backdrop-blur-md z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-2xl tracking-tight text-[#006680] font-sans">UniSphere</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <span>Secure Access Portal</span>
            <Lock className="h-4 w-4 text-[#006680]" />
          </div>
        </div>
      </header>

      {/* Central Login Card Section */}
      <main className="flex-1 flex items-center justify-center py-12 px-6 z-10">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col">
          
          {/* Top Switcher Tabs */}
          <div className="grid grid-cols-2 border-b border-slate-100">
            <button
              onClick={() => { setIsRegister(false); setFormError(''); }}
              className={`py-4 text-xs font-extrabold transition-all border-b-2 cursor-pointer ${
                !isRegister 
                  ? 'border-cyan-500 text-cyan-700 bg-white' 
                  : 'border-transparent text-slate-400 hover:text-slate-600 bg-slate-50/50'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsRegister(true); setFormError(''); }}
              className={`py-4 text-xs font-extrabold transition-all border-b-2 cursor-pointer ${
                isRegister 
                  ? 'border-cyan-500 text-cyan-700 bg-white' 
                  : 'border-transparent text-slate-400 hover:text-slate-600 bg-slate-50/50'
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
              <p className="text-xs text-slate-400 font-semibold mt-1">
                {isRegister ? 'Enter your details to register a profile.' : 'Enter your university credentials to continue.'}
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
                  <label className="text-[10px] font-black text-slate-400 tracking-wider uppercase pl-1">Full Name</label>
                  <input 
                    type="text"
                    id="reg-name"
                    placeholder="e.g. Alex Rivera"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-800 rounded-xl py-3 px-4 text-sm focus:outline-none transition-all placeholder-slate-300 shadow-sm font-semibold"
                    required
                  />
                </div>
              )}

              {/* University ID / Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 tracking-wider uppercase pl-1">
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
                    className="w-full bg-white border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none transition-all placeholder-slate-300 shadow-sm font-semibold"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-400 tracking-wider uppercase">Password</label>
                  {!isRegister && (
                    <button 
                      type="button" 
                      onClick={() => alert("Credentials reset request forwarded to registrar support.")}
                      className="text-xs text-cyan-700 hover:underline font-extrabold transition-colors"
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
                    className="w-full bg-white border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-800 rounded-xl py-3 pl-11 pr-11 text-sm focus:outline-none transition-all placeholder-slate-300 shadow-sm font-semibold"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {isRegister && (
                /* Role & Department Switchers (Registration only) */
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 tracking-wider uppercase pl-1">Role</label>
                    <select
                      id="reg-role"
                      value={role}
                      onChange={(e) => setRole(e.target.value as 'STUDENT' | 'FACULTY' | 'ADMIN')}
                      className="w-full bg-white border border-slate-200 focus:border-cyan-500 text-slate-800 rounded-xl py-3 px-3 text-xs font-semibold focus:outline-none shadow-sm cursor-pointer"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="FACULTY">Faculty Coordinator</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 tracking-wider uppercase pl-1">Department</label>
                    <select
                      id="reg-dept"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-cyan-500 text-slate-800 rounded-xl py-3 px-3 text-xs font-semibold focus:outline-none shadow-sm cursor-pointer"
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
                    className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                  />
                  <label htmlFor="remember-device" className="text-xs font-semibold text-slate-500 cursor-pointer">
                    Remember device for 30 days
                  </label>
                </div>
              )}

              {/* Submit Action Button */}
              <button
                type="submit"
                disabled={loginMutation.isPending || registerMutation.isPending}
                className="w-full bg-cyan-400 hover:bg-cyan-500 text-slate-900 font-extrabold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all duration-200 shadow-md active:scale-[0.98] disabled:opacity-50 mt-4 cursor-pointer text-sm"
              >
                {loginMutation.isPending || registerMutation.isPending ? (
                  <span>Verifying security credentials...</span>
                ) : (
                  <>
                    <span>{isRegister ? 'Register and Log In' : 'Sign Into Dashboard'}</span>
                    <ArrowRight className="h-4.5 w-4.5" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Access Roles Separator */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <span className="relative px-3 bg-white text-[9px] font-black tracking-widest text-slate-400 uppercase">
                QUICK ACCESS ROLES
              </span>
            </div>

            {/* Shortcut Buttons Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              {/* Student */}
              <button
                type="button"
                onClick={() => handleShortcutLogin('STUDENT')}
                className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-cyan-50/20 hover:border-cyan-300 text-slate-500 hover:text-cyan-700 transition-all duration-200 cursor-pointer"
              >
                <GraduationCap className="h-4.5 w-4.5" />
                <span className="text-[10px] font-extrabold">Student</span>
              </button>

              {/* Faculty */}
              <button
                type="button"
                onClick={() => handleShortcutLogin('FACULTY')}
                className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-cyan-50/20 hover:border-cyan-300 text-slate-500 hover:text-cyan-700 transition-all duration-200 cursor-pointer"
              >
                <Briefcase className="h-4.5 w-4.5" />
                <span className="text-[10px] font-extrabold">Faculty</span>
              </button>

              {/* Admin */}
              <button
                type="button"
                onClick={() => handleShortcutLogin('ADMIN')}
                className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-cyan-50/20 hover:border-cyan-300 text-slate-500 hover:text-cyan-700 transition-all duration-200 cursor-pointer"
              >
                <Shield className="h-4.5 w-4.5" />
                <span className="text-[10px] font-extrabold">Admin</span>
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* Security credentials indicators */}
      <div className="flex justify-center items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-6">
        <div className="flex items-center gap-1">
          <ShieldCheck className="h-4 w-4 text-slate-400" />
          <span>AES-256 Encrypted</span>
        </div>
        <div className="flex items-center gap-1">
          <ShieldCheck className="h-4 w-4 text-slate-400" />
          <span>2FA Ready</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <span className="font-extrabold text-sm text-[#006680] mr-2">UniSphere</span>
            <span>&copy; {new Date().getFullYear()} UniSphere Systems Inc. All rights reserved.</span>
          </div>
          <div className="flex gap-6 font-semibold">
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-800 transition-colors">Privacy Policy</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-800 transition-colors">Terms of Service</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#006680] transition-colors">Support</a>
          </div>
        </div>
      </footer>

    </div>
  )
}

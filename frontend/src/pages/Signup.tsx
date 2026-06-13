import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, Building, ShieldCheck, Globe } from 'lucide-react'
import { useRegister } from '../hooks/useApi'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'

export const Signup: React.FC = () => {
  const navigate = useNavigate()
  const registerMutation = useRegister()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<'STUDENT' | 'FACULTY' | 'COORDINATOR' | 'ADMIN'>('STUDENT')
  const [department, setDepartment] = useState('Computer Science')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!name || !email || !password) {
      setErrorMsg('Please fill in all required fields.')
      return
    }

    registerMutation.mutate({ name, email, password, role, department }, {
      onSuccess: () => {
        // Successful signup logs in and directs to onboarding
        navigate('/onboarding')
      },
      onError: (err: Error) => {
        setErrorMsg(err.message || 'Registration failed.')
      }
    })
  }

  return (
    <div className="min-h-screen w-full bg-sky-clouds text-slate-800 flex flex-col justify-between relative overflow-hidden font-sans select-none">
      
      {/* Background Radial Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-sky-200/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-orange-100/40 rounded-full blur-[140px] pointer-events-none" />

      {/* Secure Header */}
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

      {/* Main Form Box */}
      <main className="flex-1 flex items-center justify-center py-12 px-6 z-10">
        <Card className="w-full max-w-md bg-white border border-sky-100 rounded-3xl overflow-hidden shadow-travel p-8">
          
          <div className="text-left mb-6">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Create Account</h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">Configure your student or faculty profile.</p>
          </div>

          {errorMsg && (
            <div className="p-3 mb-5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-bold text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <Input
              label="Full Name"
              id="signup-name"
              placeholder="e.g. Alex Rivera"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 tracking-wider uppercase pl-1">University Email</label>
              <div className="relative flex items-center">
                <Building className="absolute left-4 h-4 w-4 text-slate-400" />
                <input 
                  type="email"
                  placeholder="e.g. student@unisphere.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-205 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white text-slate-800 rounded-xl py-3.5 pl-11 pr-4 text-xs font-semibold focus:outline-none transition-all placeholder-slate-400"
                  required
                />
              </div>
            </div>

            <Input
              label="Password"
              id="signup-pass"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Role"
                id="signup-role"
                options={[
                  { value: 'STUDENT', label: 'Student' },
                  { value: 'FACULTY', label: 'Faculty Coordinator' }
                ]}
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
              />
              <Select
                label="Department"
                id="signup-dept"
                options={[
                  { value: 'Computer Science', label: 'Computer Science' },
                  { value: 'Data Science', label: 'Data Science' },
                  { value: 'Mechanical Engineering', label: 'Mechanical Eng' },
                  { value: 'Business Administration', label: 'Business Admin' }
                ]}
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-extrabold py-3.5 mt-4"
            >
              {registerMutation.isPending ? 'Creating account...' : 'Register Sandbox Profile'}
            </Button>
          </form>

          <p className="text-xs text-slate-400 mt-6 font-semibold text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-sky-600 hover:underline font-bold">
              Sign In
            </Link>
          </p>

        </Card>
      </main>

      {/* Security Flags */}
      <div className="flex justify-center items-center gap-4 text-[9px] font-black text-slate-400 uppercase tracking-wider mb-6 z-10">
        <div className="flex items-center gap-1">
          <ShieldCheck className="h-4 w-4 text-sky-500" />
          <span>AES-256 Encrypted</span>
        </div>
        <div className="flex items-center gap-1">
          <ShieldCheck className="h-4 w-4 text-sky-500" />
          <span>Sandbox Mode</span>
        </div>
      </div>
    </div>
  )
}

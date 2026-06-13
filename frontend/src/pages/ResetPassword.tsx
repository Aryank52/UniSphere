import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Globe, CheckCircle2 } from 'lucide-react'

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!token) {
      setErrorMsg('Reset token is missing from the URL.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || 'Failed to reset password.')
      }

      setSuccess(true)
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-sky-clouds text-slate-800 flex flex-col justify-between relative overflow-hidden font-sans select-none">
      
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-sky-200/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-orange-100/40 rounded-full blur-[140px] pointer-events-none" />

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
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12 px-6 z-10">
        <Card className="w-full max-w-md bg-white border border-sky-100 rounded-3xl p-8 shadow-travel text-left">
          
          {!success ? (
            <>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Reset Password</h2>
              <p className="text-xs text-slate-500 font-semibold mt-1 mb-6">Enter a new secure password for your UniSphere account.</p>

              {errorMsg && (
                <div className="p-3 mb-5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-bold text-center">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="New Password"
                  id="reset-pass"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <Input
                  label="Confirm New Password"
                  id="reset-pass-confirm"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white font-extrabold py-3.5 mt-4"
                >
                  {loading ? 'Updating password...' : 'Update Password'}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="h-12 w-12 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Password Updated</h2>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Your password has been successfully updated. You can now use your new credentials to log into the campus dashboard.
              </p>
              <div className="pt-4">
                <Link to="/login" className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-md">
                  Sign In
                </Link>
              </div>
            </div>
          )}

        </Card>
      </main>

      <footer className="py-6 text-center text-[10px] text-slate-400 font-bold uppercase z-10">
        UniSphere Security Protocol • &copy; 2026
      </footer>

    </div>
  )
}

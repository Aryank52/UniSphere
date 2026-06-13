import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Globe, CheckCircle2, XCircle, Loader2 } from 'lucide-react'

export const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [verifying, setVerifying] = useState(true)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const triggerVerify = async () => {
      if (!token) {
        setErrorMsg('Verification token is missing from the link.')
        setVerifying(false)
        return
      }

      try {
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        })

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData.message || 'Verification failed.')
        }

        setSuccess(true)
      } catch (err: any) {
        setErrorMsg(err.message || 'Token is invalid or has expired.')
      } finally {
        setVerifying(false)
      }
    }

    triggerVerify()
  }, [token])

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
        <Card className="w-full max-w-md bg-white border border-sky-100 rounded-3xl p-8 shadow-travel text-center">
          
          {verifying ? (
            <div className="py-12 space-y-4 flex flex-col items-center">
              <Loader2 className="h-10 w-10 text-sky-500 animate-spin" />
              <h3 className="font-black text-lg text-slate-800">Verifying Email Address</h3>
              <p className="text-xs text-slate-400 font-semibold">Contacting UniSphere core security ledger...</p>
            </div>
          ) : success ? (
            <div className="py-6 space-y-4">
              <div className="h-12 w-12 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Email Verified</h2>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Your email address has been successfully verified in the UniSphere registry. You can now access full platform utilities.
              </p>
              <div className="pt-4">
                <Link to="/login" className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-md">
                  Go to Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <div className="py-6 space-y-4">
              <div className="h-12 w-12 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-2">
                <XCircle className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Verification Failed</h2>
              <p className="text-xs text-slate-550 font-semibold leading-relaxed text-rose-600">
                {errorMsg}
              </p>
              <div className="pt-4">
                <Link to="/login" className="inline-block bg-slate-150 hover:bg-slate-200 text-slate-700 font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-sm">
                  Back to Sign In
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

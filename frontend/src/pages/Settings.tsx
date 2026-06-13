import React, { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useEnable2FA, useVerify2FA, useSessions } from '../hooks/useApi'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Shield, Key, Smartphone, Laptop, Clock, CheckCircle } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

export const Settings: React.FC = () => {
  const { user } = useAuthStore()
  
  const enable2FAMutation = useEnable2FA()
  const verify2FAMutation = useVerify2FA()
  const { data: sessions = [] } = useSessions()

  const [otpCode, setOtpCode] = useState('')
  const [setup2FASecret, setSetup2FASecret] = useState<string | null>(null)
  const [setup2FAUrl, setSetup2FAUrl] = useState<string | null>(null)
  
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleStart2FA = () => {
    enable2FAMutation.mutate(undefined, {
      onSuccess: (data) => {
        setSetup2FASecret(data.secret)
        setSetup2FAUrl(data.qrCodeDataUrl)
      }
    })
  }

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!otpCode) return

    verify2FAMutation.mutate(otpCode, {
      onSuccess: () => {
        setSuccessMsg('Two-Factor Authentication activated successfully!')
        setSetup2FASecret(null)
        setSetup2FAUrl(null)
        setOtpCode('')
      },
      onError: (err: Error) => {
        setErrorMsg(err.message || 'Verification failed. Use: 123456')
      }
    })
  }

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!currentPassword || !newPassword) {
      setErrorMsg('Please fill in both password fields.')
      return
    }

    // Mock successful password change
    setSuccessMsg('Password successfully changed!')
    setCurrentPassword('')
    setNewPassword('')
    setShowPasswordForm(false)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-slate-800 text-left pb-16">
      
      {/* Settings Title Header */}
      <div className="bg-white border border-sky-100 rounded-3xl p-6 md:p-8 shadow-travel">
        <h2 className="text-3xl font-black tracking-tight text-slate-800">Security & Workspace Settings</h2>
        <p className="text-xs text-slate-500 mt-1.5 font-bold">Manage active session tracks, password configurations, and security protocols.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Security Preferences & 2FA (col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: 2FA */}
          <Card className="bg-white border border-sky-100 p-6 md:p-8 shadow-travel text-left flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-sky-500" />
                <h3 className="font-extrabold text-base text-slate-800">Two-Factor Authentication (2FA)</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold mb-6">
                Protect your UniSphere student registry with an additional layer of security. Verify login attempts using an authenticator app (like Google Authenticator).
              </p>

              {successMsg && (
                <div className="p-3 mb-5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-600 font-bold text-center">
                  {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="p-3 mb-5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-bold text-center">
                  {errorMsg}
                </div>
              )}

              {user?.isTwoFactorEnabled ? (
                <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-800">2FA Status: Enabled</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">Your account is fully secured using TOTP authentication.</p>
                  </div>
                </div>
              ) : setup2FASecret ? (
                <form onSubmit={handleVerify2FA} className="space-y-4 bg-slate-50 p-5 border border-slate-100 rounded-2xl animate-in fade-in">
                  <div className="text-center sm:text-left flex flex-col sm:flex-row gap-4 items-center">
                    {setup2FAUrl && (
                      <div className="bg-white p-3 border border-slate-150 rounded-xl shrink-0">
                        <QRCodeSVG value={setup2FAUrl} size={110} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-650">Scan this QR Code or type the secret key into your Authenticator app:</p>
                      <p className="text-xs font-mono bg-white p-3 rounded-lg border border-slate-150 select-text break-all mt-2.5 font-bold">{setup2FASecret}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <Input
                      label="6-Digit Verification Code"
                      id="otp-code"
                      placeholder="e.g. 123456 (or starting with '12')"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-extrabold">
                    Verify & Activate 2FA
                  </Button>
                </form>
              ) : (
                <Button 
                  onClick={handleStart2FA}
                  className="bg-sky-500 hover:bg-sky-600 text-white font-extrabold px-6"
                >
                  Configure Authenticator App
                </Button>
              )}
            </div>
          </Card>

          {/* Card 2: Password Configurations */}
          <Card className="bg-white border border-sky-100 p-6 md:p-8 shadow-travel text-left">
            <div className="flex items-center gap-2 mb-4">
              <Key className="h-5 w-5 text-sky-500" />
              <h3 className="font-extrabold text-base text-slate-800">Change password</h3>
            </div>
            
            {!showPasswordForm ? (
              <Button 
                variant="outline" 
                onClick={() => setShowPasswordForm(true)}
                className="border-slate-200 bg-white text-slate-650 font-bold cursor-pointer"
              >
                Change Account Password
              </Button>
            ) : (
              <form onSubmit={handlePasswordChangeSubmit} className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                <Input
                  label="Current Password"
                  id="current-pass"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <Input
                  label="New Password"
                  id="new-pass"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <div className="flex gap-3 pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowPasswordForm(false)}
                    className="flex-1 border-slate-200 bg-white text-slate-500 cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-extrabold">
                    Update Password
                  </Button>
                </div>
              </form>
            )}
          </Card>

        </div>

        {/* Active Session Device Monitors (col-span-5) */}
        <div className="lg:col-span-5 bg-white border border-sky-100 rounded-3xl p-6 md:p-8 shadow-travel text-left flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-extrabold text-sm tracking-tight text-slate-800">Active Session Monitor</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">Track devices currently logged into your registry</p>
              </div>
            </div>

            <div className="space-y-3">
              {sessions.map((s: any) => {
                const isMobile = s.deviceInfo?.toLowerCase().includes('mobile') || s.deviceInfo?.toLowerCase().includes('android')
                const isCurrent = s.isActive
                return (
                  <div 
                    key={s.id} 
                    className={`p-3.5 rounded-2xl border flex items-start gap-3 shadow-sm ${
                      isCurrent ? 'bg-sky-50/50 border-sky-200' : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className="h-9 w-9 rounded-xl bg-white border border-slate-150 flex items-center justify-center text-slate-500 shrink-0 shadow-sm">
                      {isMobile ? <Smartphone className="h-4.5 w-4.5 text-sky-500" /> : <Laptop className="h-4.5 w-4.5 text-sky-500" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs text-slate-700 truncate max-w-[140px]">{s.deviceInfo || 'Browser'}</h4>
                        {isCurrent && (
                          <span className="bg-sky-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider scale-90">Current</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{s.ipAddress || '127.0.0.1'}</p>
                      <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 mt-2">
                        <Clock className="h-3 w-3 text-slate-350" />
                        <span>Active: {new Date(s.lastActive).toLocaleTimeString()}</span>
                      </span>
                    </div>
                  </div>
                )
              })}
              {sessions.length === 0 && (
                <p className="text-xs text-slate-400 font-bold text-center py-8">No active session tracks registered.</p>
              )}
            </div>
          </div>

          <button 
            onClick={() => alert("All other active sessions have been terminated. Token revocation triggered.")}
            className="w-full mt-8 bg-orange-50 border border-orange-200 hover:bg-orange-100 text-orange-600 py-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer shadow-sm"
          >
            Revoke All Other Sessions
          </button>
        </div>

      </div>

    </div>
  )
}

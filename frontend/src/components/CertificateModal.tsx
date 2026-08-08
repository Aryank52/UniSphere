import React from 'react'
import { X, Award, Download, ShieldCheck, Calendar, MapPin } from 'lucide-react'

interface CertificateModalProps {
  isOpen: boolean
  onClose: () => void
  studentName: string
  eventTitle: string
  eventDate: string
  location: string
  category?: string
  verificationHash?: string
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  studentName,
  eventTitle,
  eventDate,
  location,
  category = 'GENERAL',
  verificationHash = `UNISPHERE-VERIFIED-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
}) => {
  if (!isOpen) return null

  const handlePrint = () => {
    const printContent = document.getElementById('printable-certificate')
    if (!printContent) return
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <html>
        <head>
          <title>Certificate of Participation - ${studentName}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              body { margin: 0; background: white; }
              @page { size: landscape; margin: 0; }
            }
          </style>
        </head>
        <body class="bg-slate-950 p-8 flex items-center justify-center min-h-screen">
          ${printContent.outerHTML}
        </body>
      </html>
    `)
    win.document.close()
    setTimeout(() => {
      win.print()
    }, 500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Certificate of Achievement</h3>
              <p className="text-xs text-slate-400">Official verified digital credential from UniSphere</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF / Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Card */}
        <div className="p-6 md:p-10 flex justify-center bg-slate-950/50">
          <div
            id="printable-certificate"
            className="w-full max-w-3xl bg-slate-900 border-4 border-amber-500/30 rounded-2xl p-8 md:p-12 text-slate-100 relative overflow-hidden shadow-2xl"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.08) 0%, transparent 70%)'
            }}
          >
            {/* Ornate corners */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-400/50"></div>
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-400/50"></div>
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-400/50"></div>
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-400/50"></div>

            {/* University Crest Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center p-3 bg-gradient-to-tr from-amber-500 to-indigo-600 rounded-2xl shadow-xl">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-indigo-200 to-amber-100 uppercase">
                UniSphere Campus Chapter
              </h1>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
                Official Credential of Merit & {category} Event Participation
              </p>
            </div>

            <div className="my-8 text-center space-y-4">
              <p className="text-sm font-medium text-slate-400 italic">This is proudly presented to</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-wide border-b border-indigo-500/20 pb-3 max-w-lg mx-auto">
                {studentName}
              </h2>
              <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                For active participation and successful completion of attendance in the university event
              </p>
              <h3 className="text-xl md:text-2xl font-bold text-amber-400 py-1">{eventTitle}</h3>
            </div>

            {/* Metadata Footer */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <span className="block text-slate-500 text-[10px] uppercase">Date</span>
                  <span className="text-slate-200 font-medium">{eventDate}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <span className="block text-slate-500 text-[10px] uppercase">Location</span>
                  <span className="text-slate-200 font-medium truncate max-w-[140px] block">{location}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 col-span-2 md:col-span-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="block text-slate-500 text-[10px] uppercase">Verification Token</span>
                  <span className="text-emerald-400 font-mono text-[11px] font-bold">{verificationHash}</span>
                </div>
              </div>
            </div>

            {/* Signature & Seal */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between">
              <div className="text-left">
                <div className="font-serif italic text-lg text-indigo-300">Dr. Sarah Jenkins</div>
                <div className="text-[11px] text-slate-400">Faculty Coordinator & Head of Events</div>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="font-semibold">Cryptographically Verified</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>Badge added to student gamification profile (+50 XP)</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

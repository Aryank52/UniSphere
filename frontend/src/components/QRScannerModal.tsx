import React, { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { X, Camera, CheckCircle2, AlertCircle } from 'lucide-react'

interface QRScannerModalProps {
  isOpen: boolean
  onClose: () => void
  eventId: number | string
  onScanSuccess: (passCode: string) => Promise<void> | void
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  eventId,
  onScanSuccess,
}) => {
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)

  useEffect(() => {
    if (!isOpen) return

    setScanResult(null)
    setErrorMsg(null)

    // Short timeout to ensure container DOM is ready
    const timer = setTimeout(() => {
      try {
        const scanner = new Html5QrcodeScanner(
          'qr-reader-container',
          { fps: 10, qrbox: { width: 220, height: 220 } },
          /* verbose= */ false
        )

        scanner.render(
          async (decodedText) => {
            if (isProcessing) return
            setIsProcessing(true)
            try {
              await onScanSuccess(decodedText)
              setScanResult(`Check-in successful! Code: ${decodedText}`)
              setErrorMsg(null)

              // Play subtle success chime
              try {
                const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
                const osc = audioCtx.createOscillator()
                const gain = audioCtx.createGain()
                osc.type = 'sine'
                osc.frequency.setValueAtTime(587.33, audioCtx.currentTime)
                gain.gain.setValueAtTime(0.1, audioCtx.currentTime)
                osc.connect(gain)
                gain.connect(audioCtx.destination)
                osc.start()
                osc.stop(audioCtx.currentTime + 0.2)
              } catch (e) {
                // ignore audio policy blocks
              }
            } catch (err: any) {
              setErrorMsg(err.message || 'Check-in failed for scanned QR code.')
            } finally {
              setIsProcessing(false)
            }
          },
          () => {
            // Frame scan failure - suppress console spam
          }
        )

        scannerRef.current = scanner
      } catch (err) {
        console.error('Failed to launch QR scanner:', err)
      }
    }, 100)

    return () => {
      clearTimeout(timer)
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {})
      }
    }
  }, [isOpen, eventId])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Live Camera Pass Scanner</h3>
              <p className="text-xs text-slate-400">Scan student pass code directly via camera feed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div
            id="qr-reader-container"
            className="overflow-hidden rounded-xl bg-slate-950 border border-slate-800 text-white min-h-[300px]"
          ></div>

          {scanResult && (
            <div className="flex items-center space-x-3 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{scanResult}</span>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center space-x-3 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-950/50 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition"
          >
            Close Scanner
          </button>
        </div>
      </div>
    </div>
  )
}

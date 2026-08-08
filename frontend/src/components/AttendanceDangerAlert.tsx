import React from 'react'
import { AlertTriangle } from 'lucide-react'

interface CourseAttendance {
  code: string
  name: string
  attended: number
  total: number
  percentage: number
  isDanger: boolean
}

export const AttendanceDangerAlert: React.FC = () => {
  const courses: CourseAttendance[] = [
    { code: 'CS-401', name: 'Advanced Algorithms', attended: 22, total: 24, percentage: 91.6, isDanger: false },
    { code: 'CS-403', name: 'AI Systems', attended: 17, total: 23, percentage: 73.9, isDanger: true },
    { code: 'DS-302', name: 'Applied Machine Learning', attended: 20, total: 25, percentage: 80.0, isDanger: false },
    { code: 'MATH-201', name: 'Linear Algebra', attended: 19, total: 24, percentage: 79.1, isDanger: false }
  ]

  const dangerCourse = courses.find(c => c.isDanger)

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-travel text-left space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-600 border border-amber-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">75% Attendance Danger Threshold Matrix</h3>
            <p className="text-[10px] text-slate-400 font-semibold">UPES University policy exam eligibility tracker</p>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-bold">
          Policy Watch Active
        </span>
      </div>

      {dangerCourse && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-extrabold">Warning: {dangerCourse.code} - {dangerCourse.name}</p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Current attendance is <strong>{dangerCourse.percentage}%</strong> ({dangerCourse.attended}/{dangerCourse.total} classes). Missing 1 more class will disqualify exam eligibility.
              </p>
            </div>
          </div>
          <button
            onClick={() => alert("Medical exemption portal opened. Upload your medical certificate for advisor review.")}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[10px] font-bold shrink-0 shadow-sm transition cursor-pointer"
          >
            Submit Medical Exemption
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {courses.map(c => (
          <div
            key={c.code}
            className={`p-3.5 rounded-2xl border transition ${
              c.isDanger
                ? 'bg-amber-50/50 border-amber-300'
                : 'bg-slate-50 border-slate-100 hover:border-slate-200'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400">{c.code}</span>
              <span className={`text-xs font-black ${c.isDanger ? 'text-amber-600' : 'text-emerald-600'}`}>
                {c.percentage}%
              </span>
            </div>
            <h4 className="text-xs font-extrabold text-slate-800 truncate mt-1">{c.name}</h4>
            <div className="h-1.5 w-full bg-slate-200 rounded-full mt-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${c.isDanger ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${c.percentage}%` }}
              ></div>
            </div>
            <p className="text-[9px] text-slate-400 font-bold mt-2">
              {c.attended} of {c.total} sessions logged
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

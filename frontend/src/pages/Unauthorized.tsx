import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

export const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center p-4">
      <Card variant="default" className="max-w-md p-8 text-center space-y-6 border border-sky-100 bg-white shadow-travel rounded-3xl">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
          <ShieldAlert className="h-8 w-8 text-orange-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-slate-800">Access Forbidden</h3>
          <p className="text-xs text-slate-500">
            You do not hold the required credentials or role privilege indexes to view this panel.
          </p>
        </div>
        <Link to="/" replace className="block w-full">
          <Button variant="primary" className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-extrabold cursor-pointer">
            Return to Dashboard
          </Button>
        </Link>
      </Card>
    </div>
  )
}

import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

export const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center p-4">
      <Card variant="glass" className="max-w-md p-8 text-center space-y-6 border border-rose-500/20 shadow-2xl">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-foreground">Access Forbidden</h3>
          <p className="text-xs text-muted-foreground">
            You do not hold the required credentials or role privilege indexes to view this panel.
          </p>
        </div>
        <Link to="/" replace>
          <Button variant="primary" className="w-full">
            Return to Dashboard
          </Button>
        </Link>
      </Card>
    </div>
  )
}

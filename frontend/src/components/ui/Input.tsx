import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-4 py-2.5 bg-background/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 ${error ? 'border-destructive focus:ring-destructive/50' : 'hover:border-primary/50'} ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-destructive pl-1">
          {error}
        </span>
      )}
    </div>
  )
}

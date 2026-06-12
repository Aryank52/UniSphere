import React from 'react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string | number; label: string }[]
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
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
      <div className="relative">
        <select
          id={id}
          className={`w-full px-4 py-2.5 bg-background/50 border border-border rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 ${error ? 'border-destructive focus:ring-destructive/50' : 'hover:border-primary/50'} ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-card text-foreground">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      {error && (
        <span className="text-xs text-destructive pl-1">
          {error}
        </span>
      )}
    </div>
  )
}

import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'glow'
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-300'
  
  const variants = {
    default: 'bg-card text-card-foreground border border-border shadow-sm hover:shadow-md',
    glass: 'glass shadow-xl hover:translate-y-[-2px] hover:shadow-2xl hover:border-white/30 dark:hover:border-slate-800/60',
    glow: 'bg-card text-card-foreground border border-border shadow-lg shadow-primary/5 hover:shadow-primary/10'
  }

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

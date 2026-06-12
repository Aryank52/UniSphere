import React from 'react'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple'
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border'
  
  const variants = {
    default: 'bg-secondary text-secondary-foreground border-border',
    success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/20',
    warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20 dark:bg-amber-400/10 dark:text-amber-400 dark:border-amber-400/20',
    error: 'bg-rose-500/10 text-rose-500 border-rose-500/20 dark:bg-rose-400/10 dark:text-rose-400 dark:border-rose-400/20',
    info: 'bg-sky-500/10 text-sky-500 border-sky-500/20 dark:bg-sky-400/10 dark:text-sky-400 dark:border-sky-400/20',
    purple: 'bg-violet-500/10 text-violet-500 border-violet-500/20 dark:bg-violet-400/10 dark:text-violet-400 dark:border-violet-400/20'
  }

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}

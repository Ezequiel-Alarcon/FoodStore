import { type FC, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  /** Card content */
  children: ReactNode
  /** Additional classes */
  className?: string
  /** Click handler */
  onClick?: () => void
}

/**
 * Card component - reusable container
 */
export const Card: FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        onClick && 'cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

export const CardHeader: FC<CardHeaderProps> = ({ children, className }) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)}>{children}</div>
)

interface CardTitleProps {
  children: ReactNode
  className?: string
}

export const CardTitle: FC<CardTitleProps> = ({ children, className }) => (
  <h3 className={cn('text-lg font-semibold leading-none tracking-tight', className)}>
    {children}
  </h3>
)

interface CardContentProps {
  children: ReactNode
  className?: string
}

export const CardContent: FC<CardContentProps> = ({ children, className }) => (
  <div className={cn('p-6 pt-0', className)}>{children}</div>
)
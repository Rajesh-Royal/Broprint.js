import * as React from 'react'
import { cn } from '../../lib/utils'

const CardRoot = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('rounded-2xl border border-cyan-400/30 bg-gray-900/50 backdrop-blur-sm shadow-xl', className)} {...props} />
))
CardRoot.displayName = 'Card'

const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-6 pb-0 flex flex-col gap-1', className)} {...props} />
)
const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-6 pt-4', className)} {...props} />
)
const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-6 pt-0 flex items-center', className)} {...props} />
)

export const Card = Object.assign(CardRoot, { Header: CardHeader, Content: CardContent, Footer: CardFooter })

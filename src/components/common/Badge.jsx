import clsx from 'clsx'

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={clsx(
      'inline-block text-[10px] font-bold px-1.5 py-0.5 rounded leading-tight',
      variant === 'discount' && 'bg-[#14958F] text-white',
      variant === 'new' && 'bg-primary text-white',
      variant === 'low-stock' && 'bg-orange-500 text-white',
      variant === 'out-of-stock' && 'bg-gray-400 text-white',
      variant === 'default' && 'bg-surface text-muted border border-border',
      className
    )}>
      {children}
    </span>
  )
}
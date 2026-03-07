import clsx from 'clsx'

export default function SizeSelector({ sizes = [], selected, onChange, outOfStockSizes = [] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold uppercase tracking-wide">
          Size: <span className="font-normal">{selected || 'Select'}</span>
        </p>
        <button className="text-xs text-primary font-bold underline underline-offset-2">Size Guide</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const oos = outOfStockSizes.includes(size)
          return (
            <button
              key={size}
              disabled={oos}
              onClick={() => onChange(size)}
              className={clsx(
                'w-12 h-12 rounded-full border text-sm font-semibold transition-all',
                selected === size && !oos ? 'border-dark bg-dark text-white' : '',
                !selected || (selected !== size && !oos) ? 'border-border text-dark hover:border-dark' : '',
                oos ? 'border-border text-border cursor-not-allowed line-through opacity-50' : ''
              )}
            >
              {size}
            </button>
          )
        })}
      </div>
    </div>
  )
}
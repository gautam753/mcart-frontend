import clsx from 'clsx'

const COLOR_MAP = {
  Red: '#EF4444', Blue: '#3B82F6', Green: '#22C55E', Black: '#111827',
  White: '#F9FAFB', Yellow: '#EAB308', Pink: '#EC4899', Purple: '#A855F7',
  Orange: '#F97316', Brown: '#92400E', Grey: '#6B7280', Gray: '#6B7280',
  Navy: '#1E3A8A', Maroon: '#881337', Teal: '#0D9488', Beige: '#D4B896',
}

export default function ColorSelector({ colors = [], selected, onChange }) {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-wide mb-3">
        Color: <span className="font-normal capitalize">{selected || ''}</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            title={color}
            className={clsx(
              'w-8 h-8 rounded-full border-2 transition-all',
              selected === color ? 'border-dark scale-110 shadow-md' : 'border-white hover:border-border shadow-sm'
            )}
            style={{ backgroundColor: COLOR_MAP[color] || '#CBD5E1', outline: selected === color ? '2px solid #1C1C1C' : 'none', outlineOffset: '2px' }}
          />
        ))}
      </div>
    </div>
  )
}
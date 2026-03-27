import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import clsx from 'clsx'

function Section({ title, children, open: defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-border py-4">
      <button className="flex items-center justify-between w-full text-sm font-bold uppercase tracking-wide mb-0" onClick={() => setOpen(!open)}>
        {title}
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}

export default function FilterSidebar({ options, filters, onChange }) {
  const toggle = (key, value) => {
    const cur = filters[key] || []
    const updated = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]
    onChange({ ...filters, [key]: updated })
  }
  const set = (key, value) => onChange({ ...filters, [key]: value })

  return (
    <aside className="w-56 flex-shrink-0">
      <div className="flex items-center justify-between mb-1">
        <p className="font-bold text-sm uppercase tracking-wide">Filters</p>
        <button className="text-xs text-primary font-bold" onClick={() => {
          const base = filters.categoryId ? { categoryId: filters.categoryId } : {}
          onChange(base)
        }}>
          CLEAR ALL
        </button>
      </div>

      {options?.priceRange && (
        <Section title="Price Range">
          <div className="flex items-center gap-2">
            <input type="number" placeholder="Min" value={filters.minPrice || ''}
              onChange={e => set('minPrice', e.target.value || undefined)}
              className="border border-border rounded px-2 py-1.5 w-full text-xs outline-none focus:border-dark" />
            <span className="text-muted text-xs">—</span>
            <input type="number" placeholder="Max" value={filters.maxPrice || ''}
              onChange={e => set('maxPrice', e.target.value || undefined)}
              className="border border-border rounded px-2 py-1.5 w-full text-xs outline-none focus:border-dark" />
          </div>
        </Section>
      )}

      {options?.brands?.length > 0 && (
        <Section title="Brand">
          <div className="space-y-2 max-h-44 overflow-y-auto">
            {options.brands.map(b => (
              <label key={b.key || b.value} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="accent-dark rounded"
                  // Fix: compare against b.value not b.label
                  checked={filters.brandName === b.value}
                  onChange={() => set(
                    'brandName',
                    filters.brandName === b.value ? undefined : b.value
                  )}
                />
                {/* Fix: show label only — removed duplicate count span */}
                <span className="text-sm text-dark group-hover:text-primary flex-1">
                  {b.label} ({b.count})
                </span>
              </label>
            ))}
          </div>
        </Section>
      )}

      {options?.sizes?.length > 0 && (
        <Section title="Size">
          <div className="flex flex-wrap gap-1.5">
            {options.sizes.map(s => (
              <button key={s.value} onClick={() => toggle('sizes', s.value)}
                className={clsx('px-3 py-1 border text-xs font-medium rounded-sm transition-all',
                  (filters.sizes || []).includes(s.value)
                    ? 'border-dark bg-dark text-white'
                    : 'border-border text-dark hover:border-dark')}>
                {s.label}
              </button>
            ))}
          </div>
        </Section>
      )}

      {options?.colors?.length > 0 && (
        <Section title="Color">
          <div className="space-y-2 max-h-44 overflow-y-auto">
            {options.colors.map(c => (
              <label key={c.value} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-dark"
                  checked={(filters.colors || []).includes(c.value)}
                  onChange={() => toggle('colors', c.value)} />
                <span className="text-sm text-dark">{c.label}</span>
                <span className="text-xs text-muted ml-auto">({c.count})</span>
              </label>
            ))}
          </div>
        </Section>
      )}

      {options?.genders?.length > 0 && (
        <Section title="Gender">
          <div className="space-y-2">
            {options.genders.map(g => (
              <label key={g.value} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="gender" className="accent-dark"
                  checked={filters.gender === g.value}
                  onChange={() => set('gender', g.value)} />
                <span className="text-sm text-dark capitalize">{g.label.toLowerCase()}</span>
              </label>
            ))}
          </div>
        </Section>
      )}

      {options?.fitTypes?.length > 0 && (
        <Section title="Fit Type">
          <div className="space-y-2">
            {options.fitTypes.map(f => (
              <label key={f.value} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-dark"
                  checked={filters.fitType === f.value}
                  onChange={() => set('fitType', filters.fitType === f.value ? undefined : f.value)} />
                <span className="text-sm text-dark">{f.label}</span>
              </label>
            ))}
          </div>
        </Section>
      )}

      {options?.materials?.length > 0 && (
        <Section title="Material">
          <div className="space-y-2 max-h-36 overflow-y-auto">
            {options.materials.map(m => (
              <label key={m.value} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-dark"
                  checked={filters.material === m.value}
                  onChange={() => set('material', filters.material === m.value ? undefined : m.value)} />
                <span className="text-sm text-dark">{m.label}</span>
              </label>
            ))}
          </div>
        </Section>
      )}

      <div className="py-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="accent-primary"
            checked={!!filters.onSale}
            onChange={e => set('onSale', e.target.checked || undefined)} />
          <span className="text-sm font-bold text-primary">On Sale Only</span>
        </label>
      </div>
    </aside>
  )
}
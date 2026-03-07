import { X } from 'lucide-react'

export default function ActiveFilterChips({ filters, onChange }) {
  const chips = []
  if (filters.brandName) chips.push({ label: `Brand: ${filters.brandName}`, key: 'brandName' })
  if (filters.gender) chips.push({ label: `Gender: ${filters.gender}`, key: 'gender' })
  if (filters.material) chips.push({ label: `Material: ${filters.material}`, key: 'material' })
  if (filters.fitType) chips.push({ label: `Fit: ${filters.fitType}`, key: 'fitType' })
  if (filters.onSale) chips.push({ label: 'On Sale', key: 'onSale' })
  if (filters.minPrice) chips.push({ label: `Min: ₹${filters.minPrice}`, key: 'minPrice' })
  if (filters.maxPrice) chips.push({ label: `Max: ₹${filters.maxPrice}`, key: 'maxPrice' });
  (filters.sizes || []).forEach(s => chips.push({ label: `Size: ${s}`, key: 'sizes', value: s }));
  (filters.colors || []).forEach(c => chips.push({ label: `Color: ${c}`, key: 'colors', value: c }))

  if (!chips.length) return null

  const remove = (chip) => {
    const updated = { ...filters }
    if (chip.value) {
      updated[chip.key] = (filters[chip.key] || []).filter(v => v !== chip.value)
    } else {
      delete updated[chip.key]
    }
    onChange(updated)
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {chips.map((chip, i) => (
        <span key={i} className="flex items-center gap-1.5 text-xs bg-white border border-border rounded-full px-3 py-1 font-medium">
          {chip.label}
          <button onClick={() => remove(chip)} className="text-muted hover:text-dark transition-colors">
            <X size={11} />
          </button>
        </span>
      ))}
    </div>
  )
}
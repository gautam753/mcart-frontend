import { Trash2, Edit2, Star } from 'lucide-react'
import { deleteAddress, setDefaultAddress } from '../../api/userApi'
import toast from 'react-hot-toast'

export default function AddressCard({ address, onRefresh, onEdit }) {
  // addressJson is now a plain object — no JSON.parse needed
  const a = address.addressJson || {}

  const handleDelete = async () => {
    if (!confirm('Remove this address?')) return
    try {
      await deleteAddress(address.addressId)
      toast.success('Address removed')
      onRefresh()
    } catch (e) { toast.error(e.message) }
  }

  const handleDefault = async () => {
    try {
      await setDefaultAddress(address.addressId)
      toast.success('Default address updated')
      onRefresh()
    } catch (e) { toast.error(e.message) }
  }

  return (
    <div className={`border rounded-sm p-4 relative transition-all ${address.isDefault ? 'border-primary' : 'border-border hover:border-dark'}`}>
      {address.isDefault && (
        <span className="absolute top-3 right-3 text-[10px] font-bold text-primary border border-primary px-2 py-0.5 rounded uppercase">
          Default
        </span>
      )}
      <span className="inline-block text-[10px] font-bold text-muted uppercase bg-surface px-2 py-1 rounded mb-2 tracking-wide">
        {address.type}
      </span>
      {a.name && <p className="text-sm font-bold text-dark">{a.name}</p>}
      <p className="text-sm text-muted mt-1 leading-relaxed">
        {[a.street, a.area, a.city, a.state, a.pincode].filter(Boolean).join(', ')}
      </p>
      {a.phone && <p className="text-sm text-muted mt-1">📞 {a.phone}</p>}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-surface">
        <button
          onClick={onEdit}
          className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
        >
          <Edit2 size={11} /> EDIT
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center gap-1 text-xs font-bold text-red-500 hover:underline"
        >
          <Trash2 size={11} /> REMOVE
        </button>
        {!address.isDefault && (
          <button
            onClick={handleDefault}
            className="flex items-center gap-1 text-xs font-bold text-muted hover:text-dark ml-auto"
          >
            <Star size={11} /> SET DEFAULT
          </button>
        )}
      </div>
    </div>
  )
}
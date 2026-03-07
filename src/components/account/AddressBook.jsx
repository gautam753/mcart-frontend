import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { getAddresses, addAddress, updateAddress } from '../../api/userApi'
import AddressCard from './AddressCard'
import Modal from '../common/Modal'
import toast from 'react-hot-toast'

const BLANK = {
  type: 'HOME', name: '', phone: '', street: '', area: '', city: '', state: '', pincode: ''
}

const FIELDS = [
  ['name', 'Full Name'], ['phone', 'Phone Number'],
  ['street', 'Street Address'], ['area', 'Area / Locality'],
  ['city', 'City'], ['state', 'State'], ['pincode', 'Pincode / ZIP'],
]

export default function AddressBook() {
  const [addresses, setAddresses] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(BLANK)

  const load = () =>
    getAddresses().then(r => setAddresses(r.data || [])).catch(() => {})

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditing(null)
    setForm(BLANK)
    setShowModal(true)
  }

  const openEdit = (addr) => {
    setEditing(addr)
    setForm({
      type: addr.type || 'HOME',
      // addressJson is now a plain object — spread directly
      ...addr.addressJson,
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    const { type, ...addressFields } = form
    const payload = {
      type,
      // Send addressJson as plain object — no JSON.stringify
      addressJson: addressFields,
      isDefault: false,
    }
    try {
      if (editing) await updateAddress(editing.addressId, payload)
      else await addAddress(payload)
      toast.success(editing ? 'Address updated' : 'Address added')
      setShowModal(false)
      load()
    } catch (e) { toast.error(e.message) }
  }

  const inp = 'w-full border border-border rounded-sm px-3 py-2.5 text-sm outline-none focus:border-dark transition-colors'

  return (
    <div className="bg-white border border-border rounded-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-base uppercase tracking-wide">Saved Addresses</h2>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 text-primary font-bold text-xs border border-primary px-4 py-2 hover:bg-primary hover:text-white transition-colors"
        >
          <Plus size={13} /> ADD NEW ADDRESS
        </button>
      </div>

      {!addresses.length ? (
        <div className="text-center py-12 text-muted">
          <p className="text-sm">No saved addresses yet.</p>
          <button onClick={openAdd} className="mt-3 text-primary font-bold text-sm underline">
            Add your first address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map(a => (
            <AddressCard
              key={a.addressId}
              address={a}
              onRefresh={load}
              onEdit={() => openEdit(a)}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Edit Address' : 'Add New Address'}
      >
        <div className="space-y-3">
          <select
            value={form.type}
            onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
            className={inp}
          >
            {['HOME', 'WORK', 'SHIPPING', 'BILLING'].map(t => <option key={t}>{t}</option>)}
          </select>
          {FIELDS.map(([key, placeholder]) => (
            <input
              key={key}
              placeholder={placeholder}
              value={form[key] || ''}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              className={inp}
            />
          ))}
          <button
            onClick={handleSave}
            className="w-full bg-primary text-white py-3 font-bold text-sm hover:bg-primary-dark transition-colors mt-2"
          >
            {editing ? 'UPDATE ADDRESS' : 'SAVE ADDRESS'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
import { useState, useEffect } from 'react'
import {
  getProfile, saveProfile, deleteProfile,
  getMyAccount, updateMyAccount
} from '../../api/userApi'
import Modal from '../common/Modal'
import toast from 'react-hot-toast'

export default function ProfileForm() {
  const [profile, setProfile] = useState({
    firstName: '', lastName: '', dob: '', gender: '',
    // preferences is now a plain object
    preferences: { newsletter: false, sizePreference: '', favoriteCategories: [] }
  })
  const [account, setAccount] = useState({ name: '', phone: '', preferences: {} })
  const [loading, setLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    getProfile()
      .then(r => {
        if (r.data) {
          setProfile({
            ...r.data,
            // preferences already an object — use directly
            preferences: r.data.preferences || {},
          })
        }
      })
      .catch(() => {})

    getMyAccount()
      .then(r => {
        if (r.data) {
          setAccount({
            ...r.data,
            // preferences already an object — use directly
            preferences: r.data.preferences || {},
          })
        }
      })
      .catch(() => {})
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      // Send preferences as plain object — no JSON.stringify
      await Promise.all([
        saveProfile(profile),
        updateMyAccount(account),
      ])
      toast.success('Profile updated!')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteProfile()
      setProfile({
        firstName: '', lastName: '', dob: '', gender: '', preferences: {}
      })
      toast.success('Profile deleted')
      setShowDeleteModal(false)
    } catch (e) { toast.error(e.message) }
  }

  const inputCls = 'w-full border-b border-border pb-2 text-sm outline-none focus:border-primary bg-transparent transition-colors'

  const F = ({ label, children }) => (
    <div>
      <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1">
        {label}
      </label>
      {children}
    </div>
  )

  return (
    <div className="bg-white border border-border rounded-sm p-6">
      <h2 className="font-bold text-base uppercase tracking-wide mb-6">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <F label="First Name">
          <input
            className={inputCls}
            value={profile.firstName || ''}
            onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))}
          />
        </F>
        <F label="Last Name">
          <input
            className={inputCls}
            value={profile.lastName || ''}
            onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))}
          />
        </F>
        <F label="Display Name">
          <input
            className={inputCls}
            value={account.name || ''}
            onChange={e => setAccount(a => ({ ...a, name: e.target.value }))}
          />
        </F>
        <F label="Phone Number">
          <input
            className={inputCls}
            value={account.phone || ''}
            onChange={e => setAccount(a => ({ ...a, phone: e.target.value }))}
          />
        </F>
        <F label="Date of Birth">
          <input
            type="date"
            className={inputCls}
            value={profile.dob || ''}
            onChange={e => setProfile(p => ({ ...p, dob: e.target.value }))}
          />
        </F>
        <F label="Gender">
          <div className="flex gap-5 pt-1">
            {['MALE', 'FEMALE', 'OTHER'].map(g => (
              <label key={g} className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  className="accent-dark"
                  checked={profile.gender === g}
                  onChange={() => setProfile(p => ({ ...p, gender: g }))}
                />
                <span className="capitalize">{g.toLowerCase()}</span>
              </label>
            ))}
          </div>
        </F>
      </div>

      <div className="flex items-center gap-6 mt-8">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-primary text-white px-8 py-3 font-bold text-sm hover:bg-primary-dark transition-colors disabled:opacity-60"
        >
          {loading ? 'SAVING...' : 'SAVE CHANGES'}
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="text-sm text-red-500 font-semibold underline"
        >
          Delete Profile
        </button>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Profile"
      >
        <p className="text-sm text-muted mb-6">
          Are you sure you want to delete your profile? Your personal details will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-500 text-white py-3 font-bold text-sm hover:bg-red-600"
          >
            YES, DELETE
          </button>
          <button
            onClick={() => setShowDeleteModal(false)}
            className="flex-1 border border-border py-3 font-bold text-sm hover:bg-surface"
          >
            CANCEL
          </button>
        </div>
      </Modal>
    </div>
  )
}
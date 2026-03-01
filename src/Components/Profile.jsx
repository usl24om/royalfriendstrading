import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { FiUser, FiMail, FiCalendar, FiEdit2, FiLogOut, FiCheck, FiX, FiArrowLeft } from 'react-icons/fi'

const Profile = () => {
  const { user, signOut, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (!error) {
      navigate('/')
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage({ type: '', text: '' })

    const { error } = await updateProfile({ full_name: fullName })
    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      setEditing(false)
    }
    setSaving(false)
  }

  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A'

  const displayName = user?.user_metadata?.full_name || 'User'
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="min-h-screen bg-gray-50 pt-36 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-heroBg mb-6 transition-colors"
        >
          <FiArrowLeft />
          <span className="text-sm font-medium">Back to Home</span>
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header Banner */}
          <div className="h-32 bg-heroBg relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center">
                <span className="text-2xl font-bold text-heroBg font-Secoundary">
                  {initials}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-16 px-8 pb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold font-Secoundary text-gray-900">
                  {displayName}
                </h1>
                <p className="text-gray-500 text-sm">Member of Royal Friends Trading</p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                <FiLogOut className="text-sm" />
                Sign Out
              </button>
            </div>

            {message.text && (
              <div
                className={`mb-6 px-4 py-3 rounded-lg text-sm ${
                  message.type === 'error'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Info Grid */}
            <div className="space-y-4">
              {/* Full Name */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-heroBg/10 flex items-center justify-center">
                    <FiUser className="text-heroBg" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Full Name
                    </p>
                    {editing ? (
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="text-sm text-gray-900 border border-gray-300 rounded px-2 py-1 mt-1 focus:outline-none focus:ring-2 focus:ring-heroBg focus:border-transparent"
                        autoFocus
                      />
                    ) : (
                      <p className="text-sm text-gray-900 font-medium">{displayName}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {editing ? (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                        aria-label="Save changes"
                      >
                        <FiCheck />
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false)
                          setFullName(user?.user_metadata?.full_name || '')
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Cancel editing"
                      >
                        <FiX />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditing(true)}
                      className="p-2 text-gray-400 hover:text-heroBg hover:bg-heroBg/10 rounded-lg transition-colors"
                      aria-label="Edit name"
                    >
                      <FiEdit2 />
                    </button>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-heroBg/10 flex items-center justify-center">
                    <FiMail className="text-heroBg" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Email Address
                    </p>
                    <p className="text-sm text-gray-900 font-medium">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Member Since */}
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-heroBg/10 flex items-center justify-center">
                    <FiCalendar className="text-heroBg" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Member Since
                    </p>
                    <p className="text-sm text-gray-900 font-medium">{createdAt}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { updatePassword } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const onSubmit = async (formData) => {
    setIsLoading(true)
    try {
      const { error } = await updatePassword(formData.password)
      if (error) {
        toast.error(error.message)
        return
      }
      toast.success('Password updated successfully!')
      navigate('/')
    } catch (err) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 pt-28">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold font-Secoundary mb-2 text-center text-gray-900">
          Set New Password
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-heroBg focus:border-transparent transition-all pr-10"
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === watch('password') || 'Passwords do not match',
              })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-heroBg focus:border-transparent transition-all"
              placeholder="Re-enter your password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-white bg-heroBg py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword

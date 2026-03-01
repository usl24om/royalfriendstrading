import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const Auth = ({ onClose, initialMode = 'login' }) => {
  const [isSignup, setIsSignup] = useState(initialMode === 'signup')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const { signUp, signIn, resetPassword } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = async (formData) => {
    setIsLoading(true)

    try {
      if (isSignup) {
        const { data, error } = await signUp(
          formData.email,
          formData.password,
          formData.fullname
        )

        if (error) {
          toast.error(error.message)
          return
        }

        toast.success('Account created! Please check your email to confirm your account.')
        setIsSignup(false)
        reset()
      } else {
        const { data, error } = await signIn(formData.email, formData.password)

        if (error) {
          toast.error(error.message)
          return
        }

        toast.success('Welcome back!')
        if (onClose) onClose()
        navigate('/')
      }
    } catch (err) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (formData) => {
    setIsLoading(true)
    try {
      const { error } = await resetPassword(formData.email)
      if (error) {
        toast.error(error.message)
        return
      }
      toast.success('Password reset email sent! Check your inbox.')
      setShowForgotPassword(false)
      reset()
    } catch (err) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (showForgotPassword) {
    return (
      <div className="flex flex-col items-center px-2">
        <h2 className="text-2xl font-bold font-Secoundary mb-2 text-center text-gray-900">
          Reset Password
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          {"Enter your email and we'll send you a reset link."}
        </p>

        <form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-4 w-full">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-heroBg focus:border-transparent transition-all"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-white bg-heroBg py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <button
          onClick={() => {
            setShowForgotPassword(false)
            reset()
          }}
          className="mt-4 text-sm text-heroBg hover:underline"
        >
          Back to Login
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center px-2">
      <h2 className="text-2xl font-bold font-Secoundary mb-1 text-center text-gray-900">
        {isSignup ? 'Create Account' : 'Welcome Back'}
      </h2>
      <p className="text-sm text-gray-500 mb-6 text-center">
        {isSignup
          ? 'Sign up to get started with Royal Friends Trading'
          : 'Sign in to your account'}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
        {isSignup && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              {...register('fullname', { required: 'Full name is required' })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-heroBg focus:border-transparent transition-all"
              placeholder="John Doe"
            />
            {errors.fullname && (
              <p className="text-red-500 text-xs mt-1">{errors.fullname.message}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-heroBg focus:border-transparent transition-all"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
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

        {!isSignup && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(true)
                reset()
              }}
              className="text-xs text-heroBg hover:underline"
            >
              Forgot password?
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full text-white bg-heroBg py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? isSignup
              ? 'Creating account...'
              : 'Signing in...'
            : isSignup
            ? 'Create Account'
            : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm mt-5 text-gray-500">
        {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          onClick={() => {
            setIsSignup(!isSignup)
            reset()
          }}
          className="text-heroBg font-semibold hover:underline"
        >
          {isSignup ? 'Sign in' : 'Create one'}
        </button>
      </p>
    </div>
  )
}

export default Auth

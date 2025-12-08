'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) setEmail(emailParam)
    else router.push('/')
  }, [searchParams, router])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      setError('Please enter a 6-digit code')
      return
    }
    setLoading(true)
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, otp }),
      })
      const data = await response.json()
      if (data.success) {
        setSuccess('Verified! Redirecting...')
        setTimeout(() => router.push('/agent'), 2000)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      if (data.success) setSuccess('New code sent!')
      else setError(data.message)
    } catch (err) {
      setError('Network error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Verify Email</h1>
          <p className="text-gray-400">Enter code from server console</p>
          <p className="text-pharmed-blue font-medium mt-2">{email}</p>
        </div>
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-center text-2xl tracking-widest"
              />
              <p className="mt-1 text-xs text-gray-400 text-center">Expires in 10 minutes</p>
            </div>
            {error && <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">{error}</div>}
            {success && <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded-lg text-sm">{success}</div>}
            <button type="submit" disabled={loading || otp.length !== 6} className="w-full bg-pharmed-blue hover:bg-blue-600 text-white font-semibold py-3 rounded-lg">
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <button onClick={handleResend} className="text-pharmed-blue hover:underline text-sm">Resend Code</button>
          </div>
          <div className="mt-4 text-center">
            <button onClick={() => router.push('/')} className="text-sm text-gray-400 hover:text-white">← Back to Login</button>
          </div>
        </div>
        <div className="mt-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-yellow-400">Contact support for OTP</p>
        </div>
      </div>
    </div>
  )
}

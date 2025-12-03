'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AgentPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          credentials: 'include',
        })

        const data = await response.json()

        if (data.success) {
          setIsAuthenticated(true)
          setUserEmail(data.user.email)
        } else {
          router.push('/')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
      router.push('/')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pharmed-blue mb-4"></div>
          <p className="text-white text-xl">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12">
              <Image 
                src="/Pharmed_logo copy.png"
                alt="Pharmed Logo"
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Improsyn AI</h1>
              <p className="text-xs text-gray-400">Pharmed Voice Agent</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400 hidden sm:block">{userEmail}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Bot iFrame */}
      <div className="flex-1 relative">
        <iframe
          src={process.env.NEXT_PUBLIC_LIVEKIT_BOT_URL || 'https://pharmedbot-2vryvh.sandbox.livekit.io'}
          className="absolute inset-0 w-full h-full border-0"
          allow="microphone; camera; autoplay"
          title="Improsyn AI Voice Agent"
        />
      </div>

      {/* Footer Info */}
      <footer className="bg-gray-800 border-t border-gray-700 px-6 py-3 flex-shrink-0">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs text-gray-500">
            🔒 Secure session • Connected to Improsyn AI • 
            <span className="ml-1 text-green-400">● Active</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
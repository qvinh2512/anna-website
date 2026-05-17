'use client'
import { useState } from 'react'
import { createClient } from '../lib/supabase/client'

export default function DangNhapPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Email hoặc mật khẩu không đúng')
    else window.location.href = '/'
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl text-center mb-8" style={{fontFamily:"'Playfair Display',serif"}}>
          Đăng <span className="text-rose-500">nhập</span>
        </h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-6 space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Email</label>
            <input type="email" placeholder="anna@example.com" required
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-rose-300"
              onChange={e=>setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Mật khẩu</label>
            <input type="password" placeholder="••••••••" required
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-rose-300"
              onChange={e=>setPassword(e.target.value)} />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-rose-500 text-white rounded-full text-sm hover:bg-rose-600 transition-colors disabled:opacity-60">
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Chưa có tài khoản? <a href="/dang-ky" className="text-rose-500 hover:underline">Đăng ký</a>
        </p>
      </div>
    </div>
  )
}
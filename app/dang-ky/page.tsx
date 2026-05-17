'use client'
import { useState } from 'react'
import { createClient } from '../lib/supabase/client'

export default function DangKyPage() {
  const supabase = createClient()
  const [form, setForm] = useState({email:'',password:'',username:'',full_name:''})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { username: form.username, full_name: form.full_name } }
    })
    if (error) setError(error.message)
    else setDone(true)
    setLoading(false)
  }

  if (done) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-4">📬</div>
        <h2 className="text-2xl font-semibold mb-3">Kiểm tra email nhé!</h2>
        <p className="text-gray-500 text-sm mb-6">Chúng tôi đã gửi link xác nhận đến <strong>{form.email}</strong></p>
        <a href="/dang-nhap" className="px-6 py-2.5 bg-rose-500 text-white rounded-full text-sm hover:bg-rose-600 transition-colors">
          Về trang đăng nhập
        </a>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl text-center mb-8" style={{fontFamily:"'Playfair Display',serif"}}>
          Đăng <span className="text-rose-500">ký</span>
        </h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Tên hiển thị</label>
              <input type="text" placeholder="Anna" required
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-rose-300"
                onChange={e=>setForm(f=>({...f,full_name:e.target.value}))} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Username</label>
              <input type="text" placeholder="anna123" required
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-rose-300"
                onChange={e=>setForm(f=>({...f,username:e.target.value.toLowerCase()}))} />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Email</label>
            <input type="email" placeholder="anna@example.com" required
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-rose-300"
              onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Mật khẩu</label>
            <input type="password" placeholder="Ít nhất 6 ký tự" required
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-rose-300"
              onChange={e=>setForm(f=>({...f,password:e.target.value}))} />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-rose-500 text-white rounded-full text-sm hover:bg-rose-600 transition-colors disabled:opacity-60">
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Đã có tài khoản? <a href="/dang-nhap" className="text-rose-500 hover:underline">Đăng nhập</a>
        </p>
      </div>
    </div>
  )
}
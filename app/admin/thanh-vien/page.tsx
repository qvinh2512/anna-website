'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase/client'

type Member = {
  id: string
  full_name: string
  username: string
  email: string
  role: string
  is_approved: boolean
  created_at: string
}

export default function ThanhVienPage() {
  const supabase = createClient()
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('profiles')
      .select('id,full_name,username,role,is_approved,created_at')
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setMembers(data as any); setLoading(false) })
  }, [])

  const toggleApprove = async (id: string, current: boolean) => {
    await supabase.from('profiles').update({ is_approved: !current }).eq('id', id)
    setMembers(m => m.map(x => x.id === id ? { ...x, is_approved: !current } : x))
  }

  const setRole = async (id: string, role: string) => {
    await supabase.from('profiles').update({ role }).eq('id', id)
    setMembers(m => m.map(x => x.id === id ? { ...x, role } : x))
  }

  if (loading) return <div className="p-8 text-gray-400">Đang tải...</div>

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6" style={{fontFamily:"'Playfair Display',serif"}}>
        Thành viên <span className="text-rose-400 text-lg">({members.length})</span>
      </h1>
      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Tên</th>
              <th className="px-4 py-3 text-left">Username</th>
              <th className="px-4 py-3 text-left">Ngày đăng ký</th>
              <th className="px-4 py-3 text-left">Vai trò</th>
              <th className="px-4 py-3 text-left">Trạng thái</th>
              <th className="px-4 py-3 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.map(m => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{m.full_name || '—'}</td>
                <td className="px-4 py-3 text-gray-500">@{m.username || '—'}</td>
                <td className="px-4 py-3 text-gray-400">
                  {new Date(m.created_at).toLocaleDateString('vi-VN', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})}
                </td>
                <td className="px-4 py-3">
                  <select value={m.role} onChange={e => setRole(m.id, e.target.value)}
                    className="text-xs border rounded px-2 py-1 bg-white">
                    <option value="member">Thành viên</option>
                    <option value="admin">Admin</option>
                    <option value="anna">Anna</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${m.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {m.is_approved ? '✓ Đã duyệt' : '⏳ Chờ duyệt'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleApprove(m.id, m.is_approved)}
                    className={`text-xs px-3 py-1 rounded-full ${m.is_approved ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                    {m.is_approved ? 'Thu hồi' : 'Duyệt'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {members.length === 0 && <p className="text-center text-gray-400 py-12">Chưa có thành viên nào.</p>}
      </div>
    </div>
  )
}
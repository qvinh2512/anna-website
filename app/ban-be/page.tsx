'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '../lib/supabase/client'

const TAGS = ['Tất cả', 'Âm nhạc', 'Hội họa', 'Học tập', 'Cuộc sống', 'Chung']

type Profile = { id: string; username: string; full_name: string; avatar_url?: string }
type Topic = {
  id: string; title: string; content: string; tag: string
  likes_count: number; replies_count: number; created_at: string
  author: Profile; liked?: boolean
}
type Reply = {
  id: string; content: string; likes_count: number; created_at: string
  author: Profile; liked?: boolean
}

function Avatar({ name, size = 8 }: { name: string; size?: number }) {
  const initials = name?.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase() || '?'
  const colors = ['bg-rose-400','bg-amber-400','bg-emerald-400','bg-blue-400','bg-purple-400','bg-pink-400']
  const color = colors[name?.charCodeAt(0) % colors.length] || 'bg-gray-400'
  return (
    <div className={`w-${size} h-${size} ${color} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}
      style={{fontSize: size <= 8 ? 12 : 16, width: size*4, height: size*4}}>
      {initials}
    </div>
  )
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'vừa xong'
  if (m < 60) return `${m} phút trước`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} giờ trước`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d} ngày trước`
  return new Date(date).toLocaleDateString('vi-VN')
}

export default function BanBePage() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [topics, setTopics] = useState<Topic[]>([])
  const [activeTag, setActiveTag] = useState('Tất cả')
  const [search, setSearch] = useState('')
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [replies, setReplies] = useState<Reply[]>([])
  const [showNewTopic, setShowNewTopic] = useState(false)
  const [newTopic, setNewTopic] = useState({ title: '', content: '', tag: 'Chung' })
  const [newReply, setNewReply] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        supabase.from('profiles').select('*').eq('id', data.user.id).single()
          .then(({ data: p }) => setProfile(p))
      }
    })
    loadTopics()
  }, [])

  const loadTopics = useCallback(async () => {
    setLoading(true)
    const { data: t } = await supabase
      .from('forum_topics')
      .select('*, author:profiles(*)')
      .order('created_at', { ascending: false })

    const { data: { user: u } } = await supabase.auth.getUser()
    if (u && t) {
      const { data: likes } = await supabase.from('forum_likes').select('topic_id').eq('user_id', u.id).not('topic_id','is',null)
      const likedIds = new Set(likes?.map(l => l.topic_id))
      setTopics(t.map((topic: any) => ({ ...topic, liked: likedIds.has(topic.id) })))
    } else {
      setTopics((t || []).map((topic: any) => ({ ...topic, liked: false })))
    }
    setLoading(false)
  }, [])

  const loadReplies = async (topicId: string) => {
    const { data: r } = await supabase
      .from('forum_replies')
      .select('*, author:profiles(*)')
      .eq('topic_id', topicId)
      .order('created_at', { ascending: true })

    const { data: { user: u } } = await supabase.auth.getUser()
    if (u && r) {
      const { data: likes } = await supabase.from('forum_likes').select('reply_id').eq('user_id', u.id).not('reply_id','is',null)
      const likedIds = new Set(likes?.map(l => l.reply_id))
      setReplies(r.map((rep: any) => ({ ...rep, liked: likedIds.has(rep.id) })))
    } else {
      setReplies((r || []).map((rep: any) => ({ ...rep, liked: false })))
    }
  }

  const openTopic = (t: Topic) => {
    setSelectedTopic(t)
    loadReplies(t.id)
  }

  const submitTopic = async () => {
    if (!user || !newTopic.title.trim() || !newTopic.content.trim()) return
    await supabase.from('forum_topics').insert({
      title: newTopic.title, content: newTopic.content,
      tag: newTopic.tag, author_id: user.id
    })
    setNewTopic({ title: '', content: '', tag: 'Chung' })
    setShowNewTopic(false)
    loadTopics()
  }

  const submitReply = async () => {
    if (!user || !newReply.trim() || !selectedTopic) return
    await supabase.from('forum_replies').insert({
      topic_id: selectedTopic.id, content: newReply, author_id: user.id
    })
    setNewReply('')
    loadReplies(selectedTopic.id)
    setSelectedTopic(prev => prev ? { ...prev, replies_count: prev.replies_count + 1 } : prev)
  }

  const toggleLikeTopic = async (topic: Topic) => {
    if (!user) return
    if (topic.liked) {
      await supabase.from('forum_likes').delete().eq('user_id', user.id).eq('topic_id', topic.id)
    } else {
      await supabase.from('forum_likes').insert({ user_id: user.id, topic_id: topic.id })
    }
    setTopics(prev => prev.map(t => t.id === topic.id
      ? { ...t, liked: !t.liked, likes_count: t.liked ? t.likes_count - 1 : t.likes_count + 1 }
      : t))
    if (selectedTopic?.id === topic.id) {
      setSelectedTopic(prev => prev ? { ...prev, liked: !prev.liked, likes_count: prev.liked ? prev.likes_count - 1 : prev.likes_count + 1 } : prev)
    }
  }

  const toggleLikeReply = async (reply: Reply) => {
    if (!user) return
    if (reply.liked) {
      await supabase.from('forum_likes').delete().eq('user_id', user.id).eq('reply_id', reply.id)
    } else {
      await supabase.from('forum_likes').insert({ user_id: user.id, reply_id: reply.id })
    }
    setReplies(prev => prev.map(r => r.id === reply.id
      ? { ...r, liked: !r.liked, likes_count: r.liked ? r.likes_count - 1 : r.likes_count + 1 }
      : r))
  }

  const filtered = topics.filter(t => {
    const matchTag = activeTag === 'Tất cả' || t.tag === activeTag
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.content.toLowerCase().includes(search.toLowerCase())
    return matchTag && matchSearch
  })

  // ===== DETAIL VIEW =====
  if (selectedTopic) return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <button onClick={() => { setSelectedTopic(null); loadTopics() }}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors">
        ← Quay lại diễn đàn
      </button>

      <div className="bg-white rounded-2xl border p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Avatar name={selectedTopic.author?.full_name || selectedTopic.author?.username || '?'} size={10} />
          <div>
            <p className="font-medium text-sm">{selectedTopic.author?.full_name || selectedTopic.author?.username}</p>
            <p className="text-xs text-gray-400">{timeAgo(selectedTopic.created_at)}</p>
          </div>
          <span className="ml-auto text-xs px-3 py-1 bg-rose-50 text-rose-500 rounded-full border border-rose-100">
            {selectedTopic.tag}
          </span>
        </div>
        <h1 className="text-2xl font-semibold mb-3" style={{fontFamily:"'Playfair Display',serif"}}>
          {selectedTopic.title}
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed mb-5 whitespace-pre-wrap">{selectedTopic.content}</p>
        <div className="flex items-center gap-4 pt-4 border-t">
          <button onClick={() => toggleLikeTopic(selectedTopic)}
            className={`flex items-center gap-1.5 text-sm transition-colors ${selectedTopic.liked ? 'text-rose-500' : 'text-gray-400 hover:text-rose-400'} ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!user}>
            {selectedTopic.liked ? '❤️' : '🤍'} {selectedTopic.likes_count}
          </button>
          <span className="text-sm text-gray-400">💬 {selectedTopic.replies_count} bình luận</span>
        </div>
      </div>

      {/* REPLIES */}
      <div className="space-y-4 mb-6">
        {replies.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
        )}
        {replies.map(r => (
          <div key={r.id} className="bg-white rounded-xl border p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar name={r.author?.full_name || r.author?.username || '?'} size={8} />
              <div>
                <p className="font-medium text-sm">{r.author?.full_name || r.author?.username}</p>
                <p className="text-xs text-gray-400">{timeAgo(r.created_at)}</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-3">{r.content}</p>
            <button onClick={() => toggleLikeReply(r)}
              className={`flex items-center gap-1 text-xs transition-colors ${r.liked ? 'text-rose-500' : 'text-gray-400 hover:text-rose-400'} ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!user}>
              {r.liked ? '❤️' : '🤍'} {r.likes_count}
            </button>
          </div>
        ))}
      </div>

      {/* REPLY BOX */}
      {user ? (
        <div className="bg-white rounded-2xl border p-5">
          <div className="flex items-center gap-3 mb-3">
            <Avatar name={profile?.full_name || profile?.username || '?'} size={8} />
            <p className="text-sm font-medium">{profile?.full_name || profile?.username}</p>
          </div>
          <textarea value={newReply} onChange={e => setNewReply(e.target.value)}
            placeholder="Viết bình luận của bạn..." rows={3}
            className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-rose-300 resize-none mb-3" />
          <div className="flex justify-end">
            <button onClick={submitReply} disabled={!newReply.trim()}
              className="px-5 py-2 bg-rose-500 text-white rounded-full text-sm hover:bg-rose-600 transition-colors disabled:opacity-50">
              Gửi bình luận
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 bg-white rounded-2xl border">
          <p className="text-gray-500 text-sm mb-3">Đăng nhập để bình luận</p>
          <a href="/dang-nhap" className="px-5 py-2 bg-rose-500 text-white rounded-full text-sm hover:bg-rose-600 transition-colors">
            Đăng nhập
          </a>
        </div>
      )}
    </div>
  )

  // ===== LIST VIEW =====
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-rose-500 text-xs tracking-widest uppercase mb-2">Diễn đàn · Giao lưu · Kết nối</p>
          <h1 className="text-4xl" style={{fontFamily:"'Playfair Display',serif"}}>👫 Bạn <em>bè</em></h1>
          <p className="text-gray-500 text-sm mt-1">Nơi Anna và các bạn trao đổi, chia sẻ về âm nhạc và cuộc sống.</p>
        </div>
        {user ? (
          <button onClick={() => setShowNewTopic(true)}
            className="px-5 py-2.5 bg-rose-500 text-white rounded-full text-sm hover:bg-rose-600 transition-colors whitespace-nowrap">
            + Tạo chủ đề
          </button>
        ) : (
          <a href="/dang-nhap" className="px-5 py-2.5 border border-rose-300 text-rose-500 rounded-full text-sm hover:bg-rose-50 transition-colors">
            Đăng nhập để tham gia
          </a>
        )}
      </div>

      {/* SEARCH */}
      <div className="relative mb-5">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input type="text" placeholder="Tìm kiếm chủ đề..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-rose-300" />
      </div>

      {/* TAGS */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TAGS.map(tag => (
          <button key={tag} onClick={() => setActiveTag(tag)}
            className={`px-4 py-1.5 rounded-full text-xs transition-colors ${activeTag === tag
              ? 'bg-rose-500 text-white'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            {tag}
          </button>
        ))}
      </div>

      {/* TOPICS */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Đang tải...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">💬</div>
          <p>{search ? 'Không tìm thấy chủ đề nào.' : 'Chưa có chủ đề nào. Hãy tạo chủ đề đầu tiên!'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(t => (
            <div key={t.id} onClick={() => openTopic(t)}
              className="bg-white rounded-2xl border p-5 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-start gap-4">
                <Avatar name={t.author?.full_name || t.author?.username || '?'} size={10} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2.5 py-0.5 bg-rose-50 text-rose-500 rounded-full border border-rose-100">
                      {t.tag}
                    </span>
                    <span className="text-xs text-gray-400">{timeAgo(t.created_at)}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-rose-500 transition-colors mb-1 truncate">
                    {t.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{t.content}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <span>{t.author?.full_name || t.author?.username}</span>
                    <span>🤍 {t.likes_count}</span>
                    <span>💬 {t.replies_count}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL TẠO TOPIC */}
      {showNewTopic && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h2 className="text-xl font-semibold mb-4" style={{fontFamily:"'Playfair Display',serif"}}>
              Tạo chủ đề mới
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Tiêu đề</label>
                <input type="text" value={newTopic.title} placeholder="Chủ đề của bạn..."
                  onChange={e => setNewTopic(v => ({...v, title: e.target.value}))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-rose-300" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Nội dung</label>
                <textarea value={newTopic.content} placeholder="Chia sẻ suy nghĩ của bạn..." rows={5}
                  onChange={e => setNewTopic(v => ({...v, content: e.target.value}))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-rose-300 resize-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Chủ đề</label>
                <select value={newTopic.tag}
                  onChange={e => setNewTopic(v => ({...v, tag: e.target.value}))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-rose-300">
                  {TAGS.filter(t => t !== 'Tất cả').map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowNewTopic(false)}
                className="flex-1 py-2 border border-gray-200 rounded-full text-sm hover:bg-gray-50 transition-colors">
                Huỷ
              </button>
              <button onClick={submitTopic}
                disabled={!newTopic.title.trim() || !newTopic.content.trim()}
                className="flex-1 py-2 bg-rose-500 text-white rounded-full text-sm hover:bg-rose-600 transition-colors disabled:opacity-50">
                Đăng chủ đề
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

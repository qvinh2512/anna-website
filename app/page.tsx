import HomeClient from './HomeClient'
import { createClient } from './lib/supabase/client'

// Dữ liệu trang chủ làm mới tối đa mỗi 60 giây
export const revalidate = 60

const THU_TU = ['nhất', 'hai', 'ba', 'tư', 'năm', 'sáu', 'bảy', 'tám', 'chín']

export default async function HomePage() {
  const supabase = createClient()

  const { data: settingsRows } = await supabase
    .from('site_settings')
    .select('key, value')

  const settings: Record<string, string> = {}
  for (const row of settingsRows || []) {
    settings[row.key] = row.value
  }

  const { data: masterclasses } = await supabase
    .from('masterclasses')
    .select('*')
    .order('event_date', { ascending: false })
    .limit(6)

  // Đếm tổng số Masterclass thật trong database
  const { count: masterclassCount } = await supabase
    .from('masterclasses')
    .select('*', { count: 'exact', head: true })

  // Bài viết mới nhất (Nhật ký, Nghệ thuật, Học thuật, Xã hội)
  const { data: latestPosts } = await supabase
    .from('posts')
    .select('*')
    .in('category_id', [1, 3, 4, 6])
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(3)

  // Video nổi bật (video đầu tiên trong Quản lý Video)
  const { data: videoRows } = await supabase
    .from('videos')
    .select('title,youtube_url')
    .order('sort_order')
    .order('created_at', { ascending: false })
    .limit(1)

  // ===== TỰ TÍNH THEO NGÀY HIỆN TẠI (giờ Việt Nam) =====
  const now = new Date(Date.now() + 7 * 60 * 60 * 1000)
  const year = now.getUTCFullYear()
  const month = now.getUTCMonth() + 1 // 1–12
  const day = now.getUTCDate()

  // Năm học bắt đầu từ tháng 9
  const schoolYear = month >= 9 ? year : year - 1

  // Tuổi (sinh 04.03.2014)
  const age = year - 2014 - (month < 3 || (month === 3 && day < 4) ? 1 : 0)

  // Năm thứ mấy ở Nhạc viện
  const nvStart = parseInt(settings['nhacvien_start_year'] || '2025', 10)
  const nvYear = schoolYear - nvStart + 1
  const nhacVienText =
    nvYear > 9 ? 'Đã hoàn thành Trung cấp Violin 9 năm'
    : nvYear < 1 ? 'Trung cấp Violin 9 năm'
    : `Năm ${THU_TU[nvYear - 1]} Trung cấp Violin 9 năm`

  // Lớp ở Sedbergh
  const lopBase = parseInt(settings['lop_2025'] || '6', 10)
  const lop = lopBase + (schoolYear - 2025)

  // Số năm học violin
  const violinStart = parseInt(settings['violin_start_year'] || '2021', 10)
  const violinYears = Math.max(1, year - violinStart)

  const auto = {
    age: String(age),
    lop: String(lop),
    namHoc: `${schoolYear}–${schoolYear + 1}`,
    nhacVienText,
    violinYears: `${violinYears}+`,
    masterclassCount: String(masterclassCount ?? (masterclasses?.length || 0)),
  }

  return (
    <HomeClient
      settings={settings}
      masterclasses={masterclasses || []}
      auto={auto}
      latestPosts={latestPosts || []}
      video={videoRows?.[0] || null}
    />
  )
}

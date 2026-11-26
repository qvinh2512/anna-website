import HomeClient from './HomeClient'
import { loadHomeData } from '@/lib/home-data'

// Dữ liệu trang chủ làm mới tối đa mỗi 60 giây
export const revalidate = 60

export default async function HomePage() {
  const data = await loadHomeData()
  return <HomeClient {...data} lang="vi" />
}

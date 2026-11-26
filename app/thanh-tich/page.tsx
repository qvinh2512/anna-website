import Milestones from '@/components/Milestones'

export const revalidate = 60

export const metadata = {
  title: 'Thành tích · Anna Duyên An',
  description: 'Giải thưởng, học tập, Masterclass và hoạt động cộng đồng của Anna Duyên An',
}

export default function ThanhTichPage() {
  return <Milestones lang="vi" />
}

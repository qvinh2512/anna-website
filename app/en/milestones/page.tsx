import Milestones from '@/components/Milestones'

export const revalidate = 60

export const metadata = {
  title: 'Milestones · Anna Duyen An',
  description: 'Awards, education, masterclasses and community activities of Anna Duyen An',
}

export default function MilestonesPage() {
  return <Milestones lang="en" />
}

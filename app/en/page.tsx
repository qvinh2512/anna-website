import HomeClient from '../HomeClient'
import { loadHomeData } from '@/lib/home-data'

export const revalidate = 60

export const metadata = {
  title: 'Anna Duyen An · Young Violinist & Artist',
  description: 'Anna Duyen An — young violinist at the Ho Chi Minh City Conservatory of Music, student at Sedbergh Vietnam, and oil painter.',
}

export default async function EnglishHomePage() {
  const data = await loadHomeData()
  return <HomeClient {...data} lang="en" />
}

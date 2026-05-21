import { createClient } from './lib/supabase/server'
import HomeClient from './HomeClient'

export default async function HomePage() {
  const supabase = createClient()

  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('key,value')

  const settings: Record<string, string> = {}
  if (settingsData) {
    settingsData.forEach(d => { settings[d.key] = d.value || '' })
  }

  const { data: masterclasses } = await supabase
    .from('masterclasses')
    .select('id,date,professor,event,piece,color,event_date')
    .order('event_date', { ascending: false })
    .limit(3)

  return <HomeClient settings={settings} masterclasses={masterclasses || []} />
}

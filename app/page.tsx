import { createClient } from './lib/supabase/client'
import HomeClient from './HomeClient'

export default async function HomePage() {
  const supabase = createClient()

  const { data: settingsRows } = await supabase
    .from('settings')
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

  return <HomeClient settings={settings} masterclasses={masterclasses || []} />
}

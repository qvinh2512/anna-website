// lib/settings.ts
import { createClient } from './supabase/server';

export async function getSiteSettings() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value');

  if (error) {
    console.error('Error fetching site settings:', error);
    return {};
  }

  // Chuyển thành object dễ dùng: { hero_subtitle: "value", ... }
  return data.reduce((acc: any, item: any) => {
    acc[item.key] = item.value;
    return acc;
  }, {});
}

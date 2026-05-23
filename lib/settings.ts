// lib/settings.ts
import { createClient } from '@/app/lib/supabase/server';   // Dùng alias @ (khuyến nghị)

export async function getSiteSettings() {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value');

    if (error) {
      console.error('Error fetching site settings:', error);
      return {};
    }

    return data.reduce((acc: any, item: any) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
  } catch (err) {
    console.error('Failed to fetch settings:', err);
    return {};
  }
}

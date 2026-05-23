// lib/settings.ts
import { createClient } from '../supabase/server';   // ← Dùng đường dẫn tương đối

export async function getSiteSettings() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value');

  if (error) {
    console.error('Error fetching site settings:', error);
    // Trả về object rỗng để tránh crash
    return {};
  }

  return data.reduce((acc: any, item: any) => {
    acc[item.key] = item.value;
    return acc;
  }, {});
}

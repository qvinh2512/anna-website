// components/Footer.tsx — lấy dữ liệu Cài đặt, phần hiển thị nằm ở FooterClient
import { getSiteSettings } from '@/lib/settings';
import FooterClient from './FooterClient';

export default async function Footer() {
  const settings = await getSiteSettings();
  return <FooterClient settings={settings} />;
}

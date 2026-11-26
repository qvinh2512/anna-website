// Danh sách thành tích của Anna — dùng chung cho trang Thành tích (VI) và trang English.
// Muốn thêm thành tích mới: chép một khối { ... } và sửa nội dung. Mục mới nhất để trên cùng.

export type Achievement = {
  date: string        // hiển thị tiếng Việt, ví dụ '13.12.2025'
  dateEn: string      // hiển thị tiếng Anh, ví dụ 'Dec 2025'
  year: number
  type: 'award' | 'study' | 'community'
  title: string
  titleEn: string
  detail: string
  detailEn: string
  image?: string      // ảnh trong thư mục public, ví dụ '/thanh-tich-dalat.jpg'
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    date: '13.12.2025', dateEn: 'Dec 2025', year: 2025, type: 'award',
    title: 'Huy chương Bạc — Violin',
    titleEn: 'Silver Award — Violin',
    detail: 'Vietnam International Music & Art Festival (VIMAF)',
    detailEn: 'Vietnam International Music & Art Festival (VIMAF)',
  },
  {
    date: '2025', dateEn: '2025', year: 2025, type: 'study',
    title: 'Đỗ Nhạc viện TP. Hồ Chí Minh',
    titleEn: 'Admitted to the Ho Chi Minh City Conservatory of Music',
    detail: 'Khoa Violin, hệ Trung cấp 9 năm, điểm thi tuyển 8/10',
    detailEn: 'Violin Department, 9-year program — entrance exam score 8/10',
    image: '/thanh-tich-nhacvien.jpg',
  },
  {
    date: '22.03.2025', dateEn: 'Mar 2025', year: 2025, type: 'award',
    title: 'Giải Bạc — Piano',
    titleEn: 'Silver Award — Piano',
    detail: 'Chicago International Music Competition and Festival',
    detailEn: 'Chicago International Music Competition and Festival',
  },
  {
    date: '03.2025', dateEn: 'Mar 2025', year: 2025, type: 'award',
    title: 'Bằng khen danh dự — Violin',
    titleEn: 'Honorable Mention — Violin',
    detail: 'Chiang Mai Ginastera International Music Festival',
    detailEn: 'Chiang Mai Ginastera International Music Festival',
  },
  {
    date: '10–17.03.2024', dateEn: 'Mar 2024', year: 2024, type: 'community',
    title: 'Biểu diễn violin — 10 năm UNESCO vinh danh Đà Lạt',
    titleEn: 'Violin performance — 10th anniversary of Da Lat as a UNESCO Creative City',
    detail: 'Chương trình kỷ niệm 10 năm UNESCO công nhận Đà Lạt là Thành phố Sáng tạo',
    detailEn: "Celebration of UNESCO's recognition of Da Lat as a Creative City",
    image: '/thanh-tich-dalat.jpg',
  },
  {
    date: '28.01.2024', dateEn: 'Jan 2024', year: 2024, type: 'community',
    title: 'Triển lãm tranh từ thiện "Tết yêu thương, Xuân chia sẻ"',
    titleEn: 'Charity art exhibition "Tet Yeu Thuong, Xuan Chia Se"',
    detail: 'Triển lãm tranh sơn dầu cá nhân cùng Give.Asia, gây quỹ hỗ trợ nạn nhân chất độc da cam',
    detailEn: 'Solo oil-painting exhibition with Give.Asia, raising funds for Agent Orange victims',
  },
]

export const TYPE_LABEL = {
  award:     { vi: 'Giải thưởng', en: 'Award',     icon: '🏆', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  study:     { vi: 'Học tập',     en: 'Education', icon: '🎓', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  community: { vi: 'Cộng đồng',   en: 'Community', icon: '🤝', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
}

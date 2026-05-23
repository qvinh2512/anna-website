{/* Desktop Navigation */}
<div className="hidden md:flex items-center gap-8 text-sm font-medium">
  <Link href="/nhat-ky" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
    {settings?.menu_nhatky || "Nhật Ký"}
  </Link>
  <Link href="/am-nhac" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
    {settings?.menu_amnhac || "Âm Nhạc"}
  </Link>
  <Link href="/nghe-thuat" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
    {settings?.menu_nghethuat || "Nghệ Thuật"}
  </Link>
  <Link href="/hoc-tap" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
    {settings?.menu_hocthuat || "Học Tập"}
  </Link>
  <Link href="/ban-be" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
    Bạn Bè
  </Link>
  <Link href="/masterclass" className="text-pink-600 dark:text-pink-400 font-semibold">
    Masterclass
  </Link>
</div>

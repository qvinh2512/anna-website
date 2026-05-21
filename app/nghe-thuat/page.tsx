import PostList from '../../components/PostList'

export default function NgheThuat() {
  return (
    <PostList
      categoryId={3}
      basePath="nghe-thuat"
      title="Nghệ Thuật"
      emoji="🎨"
      subtitle="Hội họa, triển lãm và thế giới màu sắc của Anna."
      color="emerald"
    />
  )
}

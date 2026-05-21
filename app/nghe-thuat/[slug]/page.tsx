import PostDetail from '../../../components/PostDetail'
export default function NgheThuat({ params }: { params: { slug: string } }) {
  return <PostDetail slug={params.slug} backHref="/nghe-thuat" backLabel="Nghệ Thuật" />
}

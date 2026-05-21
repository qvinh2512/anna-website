import PostDetail from '../../../components/PostDetail'
export default function HocThuat({ params }: { params: { slug: string } }) {
  return <PostDetail slug={params.slug} backHref="/hoc-thuat" backLabel="Học Thuật" />
}

import PostDetail from '../../../components/PostDetail'
export default function XaHoi({ params }: { params: { slug: string } }) {
  return <PostDetail slug={params.slug} backHref="/xa-hoi" backLabel="Xã Hội" />
}

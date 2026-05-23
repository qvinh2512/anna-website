import PostDetail from '../../../components/PostDetail'
export default function NhatKyDetail({ params }: any) {
  return <PostDetail slug={params.slug} backHref="/nhat-ky" backLabel="Nhật ký" />
}
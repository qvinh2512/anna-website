import PostDetail from '../../../components/PostDetail'

export default function MasterclassDetail({ params }: any) {
  return <PostDetail slug={params.id} backHref="/masterclass" backLabel="Masterclass" />
}
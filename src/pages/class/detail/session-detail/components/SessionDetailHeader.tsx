import PageHeader from '~/components/header/PageHeader'
import { protectedRoute } from '~/routes/routes'

interface SessionDetailHeaderProps {
  id: string
}

const SessionDetailHeader = ({ id }: SessionDetailHeaderProps) => {
  const breadcrumbsItems = [
    protectedRoute.classList,
    {
      ...protectedRoute.classDetail,
      path: protectedRoute.classDetail.path.replace(':id', id)
    },
    protectedRoute.classSessionDetail
  ]

  return <PageHeader title='Session Details' breadcrumbsItems={breadcrumbsItems} />
}

export default SessionDetailHeader

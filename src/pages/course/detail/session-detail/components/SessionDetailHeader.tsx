import PageHeader from '~/components/header/PageHeader'
import { protectedRoute } from '~/routes/routes'

interface SessionDetailHeaderProps {
  id: string
}

const SessionDetailHeader = ({ id }: SessionDetailHeaderProps) => {
  const breadcrumbsItems = [
    protectedRoute.courseList,
    {
      ...protectedRoute.courseDetail,
      path: protectedRoute.courseDetail.path.replace(':id', id)
    },
    protectedRoute.courseSessionDetail
  ]

  return <PageHeader title='Session Details' breadcrumbsItems={breadcrumbsItems} />
}

export default SessionDetailHeader

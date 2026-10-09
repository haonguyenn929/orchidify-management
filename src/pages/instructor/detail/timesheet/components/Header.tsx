import PageHeader from '~/components/header/PageHeader'
import { protectedRoute } from '~/routes/routes'

interface HeaderProps {
  instructorId: string
}

const Header = ({ instructorId }: HeaderProps) => {
  const breadcrumbsItems = [
    protectedRoute.instructorList,
    {
      ...protectedRoute.instructorDetail,
      path: protectedRoute.instructorDetail.path.replace(':id', instructorId)
    },
    protectedRoute.instructorTimesheet
  ]

  return <PageHeader title='Teaching Schedule' breadcrumbsItems={breadcrumbsItems} />
}

export default Header

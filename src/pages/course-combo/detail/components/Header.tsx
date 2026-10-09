import PageHeader from '~/components/header/PageHeader'
import { protectedRoute } from '~/routes/routes'

const Header = () => {
  const breadcrumbsItems = [protectedRoute.courseComboList, protectedRoute.courseComboDetail]

  return <PageHeader title='Course Combo Details' breadcrumbsItems={breadcrumbsItems} />
}

export default Header

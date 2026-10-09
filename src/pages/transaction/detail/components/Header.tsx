import PageHeader from '~/components/header/PageHeader'
import { protectedRoute } from '~/routes/routes'

const Header = () => {
  const breadcrumbsItems = [protectedRoute.transactionList, protectedRoute.transactionDetail]

  return <PageHeader title='Transaction Details' breadcrumbsItems={breadcrumbsItems} />
}

export default Header

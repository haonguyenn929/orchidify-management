import PageHeader from '~/components/header/PageHeader'
import { protectedRoute } from '~/routes/routes'

interface HeaderProps {
  gardenId: string
}

const Header = ({ gardenId }: HeaderProps) => {
  const breadcrumbsItems = [
    protectedRoute.gardenList,
    {
      ...protectedRoute.gardenDetail,
      path: protectedRoute.gardenDetail.path.replace(':id', gardenId)
    },
    { ...protectedRoute.viewGardenTimesheet, path: protectedRoute.viewGardenTimesheet.path.replace(':id', gardenId) },
    protectedRoute.updateGardenTimesheet
  ]

  return <PageHeader title='Update Schedule' breadcrumbsItems={breadcrumbsItems} />
}

export default Header

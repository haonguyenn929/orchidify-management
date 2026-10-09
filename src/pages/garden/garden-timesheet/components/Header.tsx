import { Box, Button } from '@mui/material'
import useAuth from '~/auth/useAuth'
import PageHeader from '~/components/header/PageHeader'
import { UserRole } from '~/global/constants'
import { protectedRoute } from '~/routes/routes'

interface HeaderProps {
  gardenId: string
  onUpdateButtonClick: () => void
}

const Header = ({ gardenId, onUpdateButtonClick }: HeaderProps) => {
  const { userTokenPayload } = useAuth()
  const breadcrumbsItems = [
    protectedRoute.gardenList,
    {
      ...protectedRoute.gardenDetail,
      path: protectedRoute.gardenDetail.path.replace(':id', gardenId)
    },
    protectedRoute.viewGardenTimesheet
  ]

  return (
    <Box display='flex' justifyContent='space-between' alignItems='center'>
      <PageHeader title='Schedule' breadcrumbsItems={breadcrumbsItems} />
      {userTokenPayload?.role === UserRole.STAFF ? (
        <Button color='warning' onClick={onUpdateButtonClick}>
          Update
        </Button>
      ) : null}
    </Box>
  )
}

export default Header

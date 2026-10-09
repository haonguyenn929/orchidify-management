import { Box, Button } from '@mui/material'
import PageHeader from '~/components/header/PageHeader'
import { RequestStatus } from '~/global/app-status'
import { protectedRoute } from '~/routes/routes'

interface HeaderProps {
  classRequestStatus: RequestStatus
  onApproveButtonClick: () => void
  onRejectButtonClick: () => void
}

const Header = ({ classRequestStatus, onApproveButtonClick, onRejectButtonClick }: HeaderProps) => {
  const breadcrumbsItems = [protectedRoute.classRequestList, protectedRoute.classRequestDetail]

  return (
    <Box display='flex' justifyContent='space-between' alignItems='center'>
      <PageHeader title='Request Details' breadcrumbsItems={breadcrumbsItems} />
      <Box display='flex' justifyContent='space-between' gap='1.5rem'>
        {classRequestStatus === RequestStatus.PENDING ? (
          <>
            <Button color='secondary' onClick={onApproveButtonClick}>
              Accepted
            </Button>
            <Button color='error' onClick={onRejectButtonClick}>
              Rejected
            </Button>
          </>
        ) : null}
      </Box>
    </Box>
  )
}

export default Header

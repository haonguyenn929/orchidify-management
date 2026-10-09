import { Box, Button } from '@mui/material'
import PageHeader from '~/components/header/PageHeader'
import { RequestStatus } from '~/global/app-status'
import { protectedRoute } from '~/routes/routes'

interface HeaderProps {
  payoutRequestStatus: RequestStatus
  onApproveButtonClick: () => void
  onRejectButtonClick: () => void
  onPayoutButtonClick: () => void
  hasMadePayout: boolean
}

const Header: React.FC<HeaderProps> = ({
  payoutRequestStatus,
  onApproveButtonClick,
  onRejectButtonClick,
  onPayoutButtonClick,
  hasMadePayout
}) => {
  const breadcrumbsItems = [protectedRoute.payoutRequestList, protectedRoute.payoutRequestDetail]

  const renderPendingButtons = () => (
    <>
      <Button color='secondary' onClick={onApproveButtonClick}>
        Approve
      </Button>
      <Button color='error' onClick={onRejectButtonClick}>
        Reject
      </Button>
    </>
  )

  const renderApprovedButtons = () =>
    hasMadePayout ? null : (
      <Button color='secondary' onClick={onPayoutButtonClick}>
        Payout
      </Button>
    )

  const renderButtons = () => {
    switch (payoutRequestStatus) {
      case RequestStatus.PENDING:
        return renderPendingButtons()
      case RequestStatus.APPROVED:
        return renderApprovedButtons()
      default:
        return null
    }
  }

  return (
    <Box display='flex' justifyContent='space-between' alignItems='center'>
      <PageHeader title='Request Details' breadcrumbsItems={breadcrumbsItems} />
      <Box display='flex' justifyContent='space-between' gap='1.5rem'>
        {renderButtons()}
      </Box>
    </Box>
  )
}

export default Header

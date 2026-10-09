import { useState } from 'react'
import AlertDialog from '~/components/dialog/AlertDialog'
import { APP_MESSAGE } from '~/global/app-message'
import { usePayoutRequestApi } from '~/hooks/api/usePayoutRequestApi'
import { notifyError, notifySuccess } from '~/utils/toastify'

interface DialogProps {
  payoutRequestId: string
  open: boolean
  handleClose: () => void
  onSuccess: () => void
}
const ApproveRequestDialog = ({ payoutRequestId, open, handleClose, onSuccess }: DialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const { approvePayoutRequest } = usePayoutRequestApi()

  const handleApprove = async (payoutRequestId: string) => {
    setIsProcessing(true)
    const { error } = await approvePayoutRequest(payoutRequestId)
    if (error) {
      notifyError(error.message)
    } else {
      notifySuccess(APP_MESSAGE.ACTION_SUCCESS('Approve Request'))
      onSuccess()
    }
    handleClose()
    setIsProcessing(false)
  }
  const handleCancel = () => {
    setIsProcessing(true)
    handleClose()
    setIsProcessing(false)
  }
  return (
    <AlertDialog
      open={open}
      handleConfirm={() => handleApprove(payoutRequestId)}
      handleCancel={handleCancel}
      isProcessing={isProcessing}
      title='Confirm Approve Request'
      description={APP_MESSAGE.CONFIRM_ACTION('approve this request')}
      confirmButtonText='Accepted'
      confirmButtonColor='secondary'
      cancelButtonText='Cancel'
      sx={{ '& .MuiDialog-paper': { width: '500px' } }}
    />
  )
}

export default ApproveRequestDialog

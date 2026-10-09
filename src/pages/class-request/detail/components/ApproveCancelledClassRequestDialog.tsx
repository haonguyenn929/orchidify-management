import { useState } from 'react'
import AlertDialog from '~/components/dialog/AlertDialog'
import { APP_MESSAGE } from '~/global/app-message'
import { useClassRequestApi } from '~/hooks/api/useClassRequestApi'
import { notifyError, notifySuccess } from '~/utils/toastify'

interface ApproveCancelledRequestDialogProps {
  requestId: string
  open: boolean
  handleClose: () => void
  onSuccess: () => void
}

const ApproveCancelledClassRequestDialog = ({
  requestId,
  open,
  handleClose,
  onSuccess
}: ApproveCancelledRequestDialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const { approveClassRequest } = useClassRequestApi()

  const handleApprove = async () => {
    setIsProcessing(true)
    const { error } = await approveClassRequest(requestId)
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
      handleCancel={handleCancel}
      handleConfirm={handleApprove}
      isProcessing={isProcessing}
      title='Confirm Approve Request'
      description={APP_MESSAGE.CONFIRM_ACTION('approve this request')}
      confirmButtonText='Agree'
      confirmButtonColor='secondary'
      cancelButtonText='Cancel'
      sx={{ '& .MuiDialog-paper': { maxWidth: '900px', width: '100%' } }}
    />
  )
}

export default ApproveCancelledClassRequestDialog

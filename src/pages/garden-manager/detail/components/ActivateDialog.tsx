import { useState } from 'react'
import { useParams } from 'react-router-dom'
import AlertDialog from '~/components/dialog/AlertDialog'
import { APP_MESSAGE } from '~/global/app-message'
import { useGardenManagerApi } from '~/hooks/api/useGardenManagerApi'
import { notifyError, notifySuccess } from '~/utils/toastify'

interface DialogProps {
  open: boolean
  handleClose: () => void
  onSuccess: () => void
}

const ActivateDialog = ({ open, handleClose, onSuccess }: DialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const params = useParams()
  const gardenManagerId = params.id
  const { activateGardenManager } = useGardenManagerApi()

  const handleActivate = async (gardenManagerId: string) => {
    setIsProcessing(true)
    const { error } = await activateGardenManager(gardenManagerId)
    if (error) {
      notifyError(error.message)
    } else {
      notifySuccess(APP_MESSAGE.ACTION_SUCCESS('Activate Garden Manager'))
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
      handleConfirm={() => gardenManagerId && handleActivate(gardenManagerId)}
      handleCancel={handleCancel}
      isProcessing={isProcessing}
      title='Confirm Activation'
      description={APP_MESSAGE.CONFIRM_ACTION('reactivate this account')}
      confirmButtonText='Activate'
      confirmButtonColor='secondary'
      cancelButtonText='Cancel'
      sx={{ '& .MuiDialog-paper': { width: '500px' } }}
    />
  )
}

export default ActivateDialog

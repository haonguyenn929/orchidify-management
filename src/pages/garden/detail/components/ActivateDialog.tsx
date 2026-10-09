import { useState } from 'react'
import { useParams } from 'react-router-dom'
import AlertDialog from '~/components/dialog/AlertDialog'
import { APP_MESSAGE } from '~/global/app-message'
import { useGardenApi } from '~/hooks/api/useGardenApi'
import { notifyError, notifySuccess } from '~/utils/toastify'

interface DialogProps {
  open: boolean
  handleClose: () => void
  onSuccess: () => void
}

const ActivateDialog = ({ open, handleClose, onSuccess }: DialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const params = useParams()
  const gardenId = params.id
  const { activateGarden } = useGardenApi()

  const handleActivate = async (gardenId: string) => {
    setIsProcessing(true)
    const { error } = await activateGarden(gardenId)
    if (error) {
      notifyError(error.message)
    } else {
      notifySuccess(APP_MESSAGE.ACTION_SUCCESS('Activate Garden'))
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
      handleConfirm={() => gardenId && handleActivate(gardenId)}
      handleCancel={handleCancel}
      isProcessing={isProcessing}
      title='Confirm Activation'
      description={APP_MESSAGE.CONFIRM_ACTION('reactivate this garden')}
      confirmButtonText='Activate'
      confirmButtonColor='secondary'
      cancelButtonText='Cancel'
      sx={{ '& .MuiDialog-paper': { width: '500px' } }}
    />
  )
}

export default ActivateDialog

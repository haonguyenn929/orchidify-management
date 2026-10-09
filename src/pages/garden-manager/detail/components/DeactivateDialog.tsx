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

const DeactivateDialog = ({ open, handleClose, onSuccess }: DialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const params = useParams()
  const gardenManagerId = params.id
  const { deactivateGardenManager } = useGardenManagerApi()
  const handleDeactivate = async (gardenManagerId: string) => {
    setIsProcessing(true)
    const { error } = await deactivateGardenManager(gardenManagerId)
    if (error) {
      notifyError(error.message)
    } else {
      notifySuccess(APP_MESSAGE.ACTION_SUCCESS('Deactivate Garden Manager'))
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
      handleConfirm={() => gardenManagerId && handleDeactivate(gardenManagerId)}
      handleCancel={handleCancel}
      isProcessing={isProcessing}
      title='Confirm Deactivation'
      description={APP_MESSAGE.CONFIRM_ACTION('deactivate this account')}
      confirmButtonText='Inactive'
      confirmButtonColor='error'
      cancelButtonText='Cancel'
      sx={{ '& .MuiDialog-paper': { width: '500px' } }}
    />
  )
}

export default DeactivateDialog

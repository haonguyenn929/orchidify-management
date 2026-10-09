import { useState } from 'react'
import { useParams } from 'react-router-dom'
import AlertDialog from '~/components/dialog/AlertDialog'
import { APP_MESSAGE } from '~/global/app-message'
import { useInstructorApi } from '~/hooks/api/useInstructorApi'
import { notifyError, notifySuccess } from '~/utils/toastify'

interface DialogProps {
  open: boolean
  handleClose: () => void
  onSuccess: () => void
}

const ActivateDialog = ({ open, handleClose, onSuccess }: DialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const params = useParams()
  const instructorId = params.id
  const { activateInstructor } = useInstructorApi()

  const handleActivate = async (instructorId: string) => {
    setIsProcessing(true)
    const { error } = await activateInstructor(instructorId)
    if (error) {
      notifyError(error.message)
    } else {
      notifySuccess(APP_MESSAGE.ACTION_SUCCESS('Activate Instructor'))
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
      handleConfirm={() => instructorId && handleActivate(instructorId)}
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

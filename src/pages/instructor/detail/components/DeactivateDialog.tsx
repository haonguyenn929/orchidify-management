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

const DeactivateDialog = ({ open, handleClose, onSuccess }: DialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const params = useParams()
  const instructorId = params.id
  const { deactivateInstructor } = useInstructorApi()
  const handleDeactivate = async (instructorId: string) => {
    setIsProcessing(true)
    const { error } = await deactivateInstructor(instructorId)
    if (error) {
      notifyError(error.message)
    } else {
      notifySuccess(APP_MESSAGE.ACTION_SUCCESS('Deactivate Instructor'))
      onSuccess()
    }
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
      handleConfirm={() => instructorId && handleDeactivate(instructorId)}
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

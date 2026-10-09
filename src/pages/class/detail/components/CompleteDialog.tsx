import { useState } from 'react'
import { useParams } from 'react-router-dom'
import AlertDialog from '~/components/dialog/AlertDialog'
import { APP_MESSAGE } from '~/global/app-message'
import { useClassApi } from '~/hooks/api/useClassApi'
import { notifyError, notifySuccess } from '~/utils/toastify'

interface DialogProps {
  open: boolean
  handleClose: () => void
  onSuccess: () => void
}

const CompleteDialog = ({ open, handleClose, onSuccess }: DialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const params = useParams()
  const classId = params.id
  const { completeClass } = useClassApi()

  const handleComplete = async (classId: string) => {
    setIsProcessing(true)
    const { error } = await completeClass(classId)

    if (error) {
      notifyError(error.message)
    } else {
      notifySuccess(APP_MESSAGE.ACTION_SUCCESS('End Class'))
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
      handleConfirm={() => classId && handleComplete(classId)}
      handleCancel={handleCancel}
      isProcessing={isProcessing}
      title='Confirm End Class'
      description={APP_MESSAGE.CONFIRM_ACTION('end class')}
      confirmButtonText='End'
      confirmButtonColor='secondary'
      cancelButtonText='Cancel'
      sx={{ '& .MuiDialog-paper': { width: '500px' } }}
    />
  )
}

export default CompleteDialog

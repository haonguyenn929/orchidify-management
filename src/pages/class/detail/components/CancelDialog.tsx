import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import FormDialog from '~/components/dialog/FormDialog'
import ControlledOutlinedInput from '~/components/form/ControlledOutlinedInput'
import { APP_MESSAGE } from '~/global/app-message'
import { useClassApi } from '~/hooks/api/useClassApi'
import { notifyError, notifySuccess } from '~/utils/toastify'

type FormValues = {
  cancelReason: string
}

const defaultFormValues: FormValues = {
  cancelReason: ''
}

const validationSchema = z.object({
  cancelReason: z
    .string()
    .min(1, APP_MESSAGE.REQUIRED_FIELD('Cancellation reason description'))
    .max(500, APP_MESSAGE.FIELD_TOO_LONG('Cancellation reason description', 500))
})

interface DialogProps {
  classId: string
  open: boolean
  handleClose: () => void
  onSuccess: () => void
}

const CancelDialog = ({ classId, open, handleClose, onSuccess }: DialogProps) => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting }
  } = useForm<FormValues>({
    defaultValues: defaultFormValues,
    resolver: zodResolver(validationSchema)
  })

  const { cancelClass } = useClassApi()
  const handleDeactivate = async (data: FormValues) => {
    const { error } = await cancelClass(classId, data)
    if (error) {
      notifyError(error.message)
    } else {
      notifySuccess(APP_MESSAGE.ACTION_SUCCESS('Cancel Class'))
      onSuccess()
    }
    handleClose()
  }

  const handleCancel = () => {
    handleClose()
  }

  return (
    <FormDialog
      open={open}
      onSubmit={handleSubmit(handleDeactivate)}
      handleCancel={handleCancel}
      isProcessing={isSubmitting}
      title='Confirm Cancel Class'
      description='This class violated regulations and you want to cancel it? This action cannot be undone.'
      confirmButtonText='Confirm'
      confirmButtonColor='error'
      cancelButtonText='Cancel'
      formContent={
        <ControlledOutlinedInput
          controller={{ name: 'cancelReason', control: control }}
          multiline
          minRows={7}
          maxRows={7}
          label='Cancellation reason description'
          fullWidth
          sx={{ marginTop: '0.5rem' }}
        />
      }
      sx={{ '& .MuiDialog-paper': { maxWidth: '900px', width: '100%' } }}
    />
  )
}

export default CancelDialog

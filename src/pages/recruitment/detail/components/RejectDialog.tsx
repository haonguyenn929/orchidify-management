import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import FormDialog from '~/components/dialog/FormDialog'
import ControlledOutlinedInput from '~/components/form/ControlledOutlinedInput'
import { APP_MESSAGE } from '~/global/app-message'
import { useRecruitmentApi } from '~/hooks/api/useRecruitmentApi'
import { notifyError, notifySuccess } from '~/utils/toastify'

type FormValues = {
  rejectReason: string
}

const defaultFormValues: FormValues = {
  rejectReason: ''
}

const validationSchema = z.object({
  rejectReason: z
    .string()
    .min(1, APP_MESSAGE.REQUIRED_FIELD('Rejection reason description'))
    .max(500, APP_MESSAGE.FIELD_TOO_LONG('Rejection reason description', 500))
})

interface RejectDialogProps {
  recruitmentId: string
  open: boolean
  handleClose: () => void
  onSuccess: () => void
}

const RejectDialog = ({ recruitmentId, open, handleClose, onSuccess }: RejectDialogProps) => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting }
  } = useForm<FormValues>({
    defaultValues: defaultFormValues,
    resolver: zodResolver(validationSchema)
  })
  const { rejectApplicant } = useRecruitmentApi()

  const handleReject = async (data: FormValues) => {
    const { error } = await rejectApplicant(recruitmentId, data)
    if (error) {
      notifyError(error.message)
    } else {
      notifySuccess(APP_MESSAGE.ACTION_SUCCESS('Reject Application'))
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
      onSubmit={handleSubmit(handleReject)}
      handleCancel={handleCancel}
      isProcessing={isSubmitting}
      title='Confirm Reject Application'
      description={APP_MESSAGE.CONFIRM_ACTION('reject this application')}
      confirmButtonText='Rejected'
      confirmButtonColor='error'
      cancelButtonText='Cancel'
      formContent={
        <ControlledOutlinedInput
          controller={{ name: 'rejectReason', control: control }}
          multiline
          minRows={7}
          maxRows={7}
          label='Rejection reason description'
          fullWidth
          sx={{ marginTop: '0.5rem' }}
        />
      }
      sx={{ '& .MuiDialog-paper': { maxWidth: '900px', width: '100%' } }}
    />
  )
}

export default RejectDialog

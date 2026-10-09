import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import FormDialog from '~/components/dialog/FormDialog'
import ControlledSelect from '~/components/form/ControlledSelect'
import { AvailableGardenDto } from '~/data/garden.dto'
import { APP_MESSAGE } from '~/global/app-message'
import { useClassRequestApi } from '~/hooks/api/useClassRequestApi'
import { notifyError, notifySuccess } from '~/utils/toastify'

type FormValues = {
  gardenId: string
}

const defaultFormValues: FormValues = {
  gardenId: ''
}

const validationSchema = z.object({
  gardenId: z.string().min(1, APP_MESSAGE.REQUIRED_FIELD('Gardens'))
})

interface ApprovePublishedRequestDialogProps {
  requestId: string
  gardenOptions: AvailableGardenDto[]
  open: boolean
  handleClose: () => void
  onSuccess: () => void
}

const ApprovePublishedClassRequestDialog = ({
  requestId,
  gardenOptions,
  open,
  handleClose,
  onSuccess
}: ApprovePublishedRequestDialogProps) => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting }
  } = useForm<FormValues>({
    defaultValues: defaultFormValues,
    resolver: zodResolver(validationSchema)
  })
  const { approveClassRequest } = useClassRequestApi()

  const handleApprove = async (data: FormValues) => {
    const { error } = await approveClassRequest(requestId, data)
    if (error) {
      notifyError(error.message)
    } else {
      notifySuccess(APP_MESSAGE.ACTION_SUCCESS('Approve Request'))
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
      onSubmit={handleSubmit(handleApprove)}
      handleCancel={handleCancel}
      isProcessing={isSubmitting}
      title='Confirm Approve Request'
      description={APP_MESSAGE.CONFIRM_ACTION('approve this request')}
      confirmButtonText='Agree'
      confirmButtonColor='secondary'
      cancelButtonText='Cancel'
      formContent={
        <ControlledSelect
          controller={{ name: 'gardenId', control: control }}
          label='Gardens'
          labelId='garden-select-label'
          placeholder={gardenOptions.length > 0 ? 'Select Garden' : 'No gardens available'}
          disabled={gardenOptions.length === 0}
          items={gardenOptions.map((option) => ({ value: option._id, name: option.name }))}
          fullWidth
          size='small'
          MenuProps={{
            PaperProps: {
              style: { maxHeight: '200px' }
            }
          }}
          sx={{ marginTop: '0.5rem' }}
        />
      }
      sx={{ '& .MuiDialog-paper': { maxWidth: '900px', width: '100%' } }}
    />
  )
}

export default ApprovePublishedClassRequestDialog

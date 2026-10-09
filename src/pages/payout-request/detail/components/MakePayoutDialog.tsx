import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { CloudinaryFileUploadedInfo } from '~/components/cloudinary/cloudinary-type'
import FormDialog from '~/components/dialog/FormDialog'
import { ControlledFileFieldUpload } from '~/components/form/ControlledFileUpload'
import ControlledOutlinedInput from '~/components/form/ControlledOutlinedInput'
import { APP_MESSAGE } from '~/global/app-message'
import { FileFormat, FileSize } from '~/global/constants'
import { usePayoutRequestApi } from '~/hooks/api/usePayoutRequestApi'
import { notifyError, notifySuccess } from '~/utils/toastify'

type FormValues = {
  transactionCode: string
  attachment: CloudinaryFileUploadedInfo[]
}

const defaultFormValues: FormValues = {
  transactionCode: '',
  attachment: []
}

const validationSchema = z.object({
  transactionCode: z
    .string()
    .min(1, APP_MESSAGE.REQUIRED_FIELD('Transaction Code'))
    .max(500, APP_MESSAGE.FIELD_TOO_LONG('Transaction Code', 500)),
  attachment: z.array(z.object({}).passthrough()).nonempty(APP_MESSAGE.REQUIRED_FIELD('Transaction Image'))
})

interface PayoutRequestDialogProps {
  requestId: string
  open: boolean
  handleClose: () => void
  onSuccess: () => void
}

const MakePayoutDialog = ({ requestId, open, handleClose, onSuccess }: PayoutRequestDialogProps) => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting }
  } = useForm<FormValues>({
    defaultValues: defaultFormValues,
    resolver: zodResolver(validationSchema)
  })
  const { makePayoutRequest } = usePayoutRequestApi()

  const handlePayout = async (data: FormValues) => {
    const payload = {
      transactionCode: data.transactionCode,
      attachment: data.attachment[0]
    }

    const { error } = await makePayoutRequest(requestId, payload)
    if (error) {
      notifyError(error.message)
    } else {
      notifySuccess(APP_MESSAGE.ACTION_SUCCESS('verify transaction'))
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
      onSubmit={handleSubmit(handlePayout)}
      handleCancel={handleCancel}
      isProcessing={isSubmitting}
      title='Verify Transaction'
      description={APP_MESSAGE.CONFIRM_ACTION('verify this transaction')}
      confirmButtonText='Confirm'
      confirmButtonColor='secondary'
      cancelButtonText='Cancel'
      formContent={
        <>
          {' '}
          <ControlledOutlinedInput
            controller={{ name: 'transactionCode', control: control }}
            label='Transaction Code'
            fullWidth
            size='small'
            sx={{ margin: '0.5rem 0 1rem' }}
          />
          <ControlledFileFieldUpload
            controller={{ name: 'attachment', control: control }}
            label='Transaction Image'
            clientAllowedFormats={[FileFormat.jpeg, FileFormat.jpg, FileFormat.png]}
            minFile={1}
            maxFileSize={FileSize['5MB']}
          />
        </>
      }
      sx={{ '& .MuiDialog-paper': { maxWidth: '900px', width: '100%' } }}
    />
  )
}

export default MakePayoutDialog

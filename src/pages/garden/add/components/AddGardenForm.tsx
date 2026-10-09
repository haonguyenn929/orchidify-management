import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Box, Button, Divider, Grid, Paper, Typography } from '@mui/material'
import ControlledOutlinedInput from '~/components/form/ControlledOutlinedInput'
import { APP_MESSAGE } from '~/global/app-message'
import { StyledForm } from './AddGardenForm.styled'
import { CloudinaryFileUploadedInfo } from '~/components/cloudinary/cloudinary-type'
import { useNavigate } from 'react-router-dom'
import GardenManagerSelect from './GardenManagerSelect'
import { useGardenApi } from '~/hooks/api/useGardenApi'
import { notifyError, notifySuccess } from '~/utils/toastify'
import { protectedRoute } from '~/routes/routes'
import GardenImageUpload from './GardenImageUpload'

type FormValues = {
  name: string
  address: string
  addressLink: string
  gardenManagerId: string
  description: string
  images: CloudinaryFileUploadedInfo[]
  maxClass: number
}

const defaultFormValues: FormValues = {
  name: '',
  address: '',
  addressLink: '',
  gardenManagerId: '',
  description: '',
  images: [],
  maxClass: 0
}

const validationSchema = z.object({
  name: z
    .string()
    .min(1, APP_MESSAGE.REQUIRED_FIELD('Garden Manager Name'))
    .max(50, APP_MESSAGE.FIELD_TOO_LONG('Garden Manager Name', 50)),
  address: z
    .string()
    .min(1, APP_MESSAGE.REQUIRED_FIELD('Address'))
    .max(100, APP_MESSAGE.FIELD_TOO_LONG('Address', 100)),
  addressLink: z
    .string()
    .min(1, APP_MESSAGE.REQUIRED_FIELD('Address Link'))
    .max(100, APP_MESSAGE.FIELD_TOO_LONG('Address Link', 100)),
  gardenManagerId: z.string().min(1, APP_MESSAGE.REQUIRED_FIELD('Garden Managers')),
  description: z
    .string()
    .min(1, APP_MESSAGE.REQUIRED_FIELD('Description'))
    .max(500, APP_MESSAGE.FIELD_TOO_LONG('Description', 500)),
  images: z.array(z.object({}).passthrough()).nonempty(APP_MESSAGE.REQUIRED_FIELD('Garden Images')),
  maxClass: z.coerce
    .number({ message: APP_MESSAGE.INVALID_VALUE(['integer']) })
    .int({ message: APP_MESSAGE.INVALID_VALUE(['integer']) })
    .min(1, APP_MESSAGE.VALUE_OUT_OF_RANGE(1, 4))
    .max(4, APP_MESSAGE.VALUE_OUT_OF_RANGE(1, 4))
})

const AddGardenForm = () => {
  const { addGarden } = useGardenApi()
  const navigate = useNavigate()
  const {
    handleSubmit,
    control,
    formState: { isSubmitting }
  } = useForm<FormValues>({
    defaultValues: defaultFormValues,
    resolver: zodResolver(validationSchema)
  })

  const onSubmit = handleSubmit(async (formValue) => {
    const { error } = await addGarden({ ...formValue, images: formValue.images.map((image) => image.secure_url) })
    if (error) {
      notifyError(error.message)
      return
    }
    notifySuccess(APP_MESSAGE.ACTION_SUCCESS('Add Garden'))
    navigate(protectedRoute.gardenList.path, { replace: true })
  })

  return (
    <StyledForm onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ width: '100%', marginY: '20px', padding: '24px' }}>
        <Box display='flex' alignItems='center' marginBottom='20px'>
          <Typography variant='h2' sx={{ fontSize: '1.5rem', fontWeight: 700, paddingRight: '10px' }}>
            Garden Details
          </Typography>
          <Divider sx={{ flexGrow: 1 }} />
        </Box>
        <Grid container columnSpacing='30px' rowSpacing='20px'>
          <Grid item xs={12} lg={6}>
            <ControlledOutlinedInput
              controller={{ name: 'name', control: control }}
              label='Garden Name'
              fullWidth
              size='small'
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <GardenManagerSelect controller={{ name: 'gardenManagerId', control: control }} />
          </Grid>
          <Grid item container xs={12} columnSpacing='30px'>
            <Grid item xs={12} lg={6}>
              <ControlledOutlinedInput
                controller={{ name: 'maxClass', control: control }}
                label='Max classes per slot'
                inputMode='numeric'
                fullWidth
                size='small'
              />
            </Grid>
          </Grid>
          <Grid item xs={12} lg={6}>
            <ControlledOutlinedInput
              controller={{ name: 'address', control: control }}
              label='Address'
              fullWidth
              size='small'
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <ControlledOutlinedInput
              controller={{ name: 'addressLink', control: control }}
              label='Address Link'
              fullWidth
              size='small'
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledOutlinedInput
              controller={{ name: 'description', control: control }}
              multiline
              minRows={5}
              maxRows={5}
              label='Description'
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <GardenImageUpload controller={{ name: 'images', control: control }} />
          </Grid>
        </Grid>
      </Paper>
      <Button disabled={isSubmitting} type='submit'>
        Add
      </Button>
    </StyledForm>
  )
}

export default AddGardenForm

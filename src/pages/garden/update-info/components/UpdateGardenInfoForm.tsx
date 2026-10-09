import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Box, Button, Divider, Grid, Paper, Typography } from '@mui/material'
import ControlledOutlinedInput from '~/components/form/ControlledOutlinedInput'
import { APP_MESSAGE } from '~/global/app-message'
import { StyledForm } from './AddGardenForm.styled'
import { CloudinaryFileUploadedInfo } from '~/components/cloudinary/cloudinary-type'
import { useNavigate } from 'react-router-dom'
import { useGardenApi } from '~/hooks/api/useGardenApi'
import { notifyError, notifySuccess } from '~/utils/toastify'
import { protectedRoute } from '~/routes/routes'
import GardenImageUpload from './GardenImageUpload'
import { Garden } from '~/data/garden.dto'

type FormValues = {
  name: string
  address: string
  gardenManagerId: string
  description: string
  images: CloudinaryFileUploadedInfo[]
}

const validationSchema = z.object({
  description: z
    .string()
    .min(1, APP_MESSAGE.REQUIRED_FIELD('Description'))
    .max(500, APP_MESSAGE.FIELD_TOO_LONG('Description', 500)),
  images: z.array(z.object({}).passthrough()).nonempty(APP_MESSAGE.REQUIRED_FIELD('Garden Images'))
})

interface UpdateGardenInfoFormProps {
  garden: Garden
}

const UpdateGardenInfoForm = ({ garden }: UpdateGardenInfoFormProps) => {
  const { updateGardenInfo } = useGardenApi()
  const navigate = useNavigate()
  const {
    handleSubmit,
    control,
    formState: { isSubmitting }
  } = useForm<FormValues>({
    defaultValues: {
      name: garden.name,
      address: garden.address,
      description: garden.description,
      images: garden.images ? garden.images.map((image) => ({ url: image })) : []
    },
    resolver: zodResolver(validationSchema)
  })

  const onSubmit = handleSubmit(async (formValue) => {
    const { error } = await updateGardenInfo(garden._id, {
      ...formValue,
      images: formValue.images.map((image) => image.url)
    })
    if (error) {
      notifyError(error.message)
      return
    }
    notifySuccess(APP_MESSAGE.ACTION_SUCCESS('Update Garden Info'))
    navigate(protectedRoute.gardenDetail.path.replace(':id', garden._id), { replace: true })
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
              disabled
              label='Garden Name'
              fullWidth
              size='small'
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <ControlledOutlinedInput
              controller={{ name: 'address', control: control }}
              disabled
              label='Address'
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
        Save
      </Button>
    </StyledForm>
  )
}

export default UpdateGardenInfoForm

import { Box, Button, Divider, Grid, Paper, Typography, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import ControlledOutlinedInput from '~/components/form/ControlledOutlinedInput'
import Field from '~/components/text-field/Field'
import { ErrorResponseDto } from '~/data/error.dto'
import { GardenManager } from '~/data/gardenManager.dto'
import { APP_MESSAGE } from '~/global/app-message'
import { useGardenManagerApi } from '~/hooks/api/useGardenManagerApi'
import { Avatar, ContentText, Image } from '~/pages/garden-manager/detail/ViewGardenManagerDetail.styled'
import { protectedRoute } from '~/routes/routes'
import { notifyError, notifySuccess } from '~/utils/toastify'
import GardenManagerSelect from '../../add/components/GardenManagerSelect'
import { StyledForm } from './UpdateGardenMangerForm.styled'
import { Garden } from '~/data/garden.dto'
import { useGardenApi } from '~/hooks/api/useGardenApi'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

type FormValues = {
  name: string
  address: string
  gardenManagerId: string
}

interface UpdateGardenInfoFormProps {
  garden: Garden
}

const validationSchema = z.object({
  gardenManagerId: z.string().min(1, APP_MESSAGE.REQUIRED_FIELD('Garden Managers'))
})

const UpdateGardenManagerForm = ({ garden }: UpdateGardenInfoFormProps) => {
  const [gardenManagerData, setGardenManagerData] = useState<GardenManager | null>(null)
  const [error, setError] = useState<ErrorResponseDto | null>(null)
  const theme = useTheme()

  const { getGardenManagerById } = useGardenManagerApi()
  const { updateGardenManager } = useGardenApi()
  const navigate = useNavigate()

  const {
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting }
  } = useForm<FormValues>({
    defaultValues: {
      name: garden.name,
      address: garden.address,
      gardenManagerId: garden.gardenManagerId
    },
    resolver: zodResolver(validationSchema)
  })

  const gardenManagerId = watch('gardenManagerId')

  const onSubmit = handleSubmit(async () => {
    const { error } = await updateGardenManager(garden._id, { gardenManagerId })
    if (error) {
      notifyError(error.message)
      return
    }
    notifySuccess(APP_MESSAGE.ACTION_SUCCESS('Update Garden Manager'))
    navigate(protectedRoute.gardenDetail.path.replace(':id', garden._id))
  })

  if (error) {
    notifyError(error.message)
  }

  const fetchGardenManager = async (managerId: string) => {
    const { data: gardenManager, error: apiError } = await getGardenManagerById(managerId)
    setGardenManagerData(gardenManager)
    setError(apiError)
  }

  useEffect(() => {
    if (gardenManagerId) {
      fetchGardenManager(gardenManagerId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gardenManagerId])

  return (
    <StyledForm onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ width: '100%', marginY: '20px', padding: '24px' }}>
        <Box display='flex' alignItems='center' marginBottom='20px'>
          <Typography variant='h2' sx={{ fontSize: '1.5rem', fontWeight: 700, paddingRight: '10px' }}>
            Garden Manager Details
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
              disabled
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <ControlledOutlinedInput
              controller={{ name: 'address', control: control }}
              label='Address'
              fullWidth
              size='small'
              disabled
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <GardenManagerSelect controller={{ name: 'gardenManagerId', control: control }} />
          </Grid>
        </Grid>
        <Avatar style={{ marginTop: '20px' }}>
          <Image src={gardenManagerData?.idCardPhoto} alt='Your Avatar' theme={theme} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Typography variant='h6' fontSize={20} fontWeight={500}>
              {gardenManagerData?.name}
            </Typography>
            <Typography variant='h6' fontSize={14} fontWeight={500} color={theme.label.secondary}>
              Garden Managers
            </Typography>
          </div>
        </Avatar>
        <Field
          label='Garden Manager Name'
          content={<ContentText>{gardenManagerData?.name || ''}</ContentText>}
          theme={theme}
        />
        <Field label='Email' content={<ContentText>{gardenManagerData?.email || ''}</ContentText>} theme={theme} />
      </Paper>
      <Button disabled={isSubmitting} type='submit'>
        Save
      </Button>
    </StyledForm>
  )
}

export default UpdateGardenManagerForm

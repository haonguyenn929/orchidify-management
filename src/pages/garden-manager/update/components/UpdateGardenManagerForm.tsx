import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Box, Button, Divider, Grid, Paper, Typography } from '@mui/material'
import ControlledOutlinedInput from '~/components/form/ControlledOutlinedInput'
import { APP_MESSAGE } from '~/global/app-message'
import { StyledForm } from './UpdateGardenManagerForm.styled'
import { GardenManager } from '~/data/gardenManager.dto'

type FormValues = {
  name: string
}

const validationSchema = z.object({
  name: z
    .string()
    .min(1, APP_MESSAGE.REQUIRED_FIELD('Garden Manager Name'))
    .max(50, APP_MESSAGE.FIELD_TOO_LONG('Garden Manager Name', 50))
})

interface UpdateGardenManagerFormProps {
  gardenManager: GardenManager
  onSubmit: SubmitHandler<FormValues>
}

const UpdateGardenManagerForm = ({ gardenManager, onSubmit }: UpdateGardenManagerFormProps) => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting }
  } = useForm<FormValues>({
    defaultValues: { name: gardenManager.name },
    resolver: zodResolver(validationSchema)
  })

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ width: '100%', marginY: '40px', padding: '24px' }}>
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
              label='Garden Manager Name'
              fullWidth
              size='small'
            />
          </Grid>
        </Grid>
      </Paper>
      <Button disabled={isSubmitting} type='submit'>
        Save
      </Button>
    </StyledForm>
  )
}

export default UpdateGardenManagerForm

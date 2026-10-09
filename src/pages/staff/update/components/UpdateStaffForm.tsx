import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Box, Button, Divider, Grid, Paper, Typography } from '@mui/material'
import ControlledOutlinedInput from '~/components/form/ControlledOutlinedInput'
import { APP_MESSAGE } from '~/global/app-message'
import { StyledForm } from './UpdateStaffForm.styled'
import { Staff } from '~/data/staff.dto'

type FormValues = {
  name: string
}

const validationSchema = z.object({
  name: z
    .string()
    .min(1, APP_MESSAGE.REQUIRED_FIELD('Staff Name'))
    .max(50, APP_MESSAGE.FIELD_TOO_LONG('Staff Name', 50))
})

interface UpdateStaffFormProps {
  staff: Staff
  onSubmit: SubmitHandler<FormValues>
}

const UpdateStaffForm = ({ staff, onSubmit }: UpdateStaffFormProps) => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting }
  } = useForm<FormValues>({
    defaultValues: { name: staff.name },
    resolver: zodResolver(validationSchema)
  })

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ width: '100%', marginY: '40px', padding: '24px' }}>
        <Box display='flex' alignItems='center' marginBottom='20px'>
          <Typography variant='h2' sx={{ fontSize: '1.5rem', fontWeight: 700, paddingRight: '10px' }}>
            Staff Details
          </Typography>
          <Divider sx={{ flexGrow: 1 }} />
        </Box>
        <Grid container columnSpacing='30px' rowSpacing='20px'>
          <Grid item xs={12} lg={6}>
            <ControlledOutlinedInput
              controller={{ name: 'name', control: control }}
              label='Staff Name'
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

export default UpdateStaffForm

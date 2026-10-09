import { zodResolver } from '@hookform/resolvers/zod'
import { Paper, Box, Typography, Divider, Grid, Button } from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import ControlledOutlinedInput from '~/components/form/ControlledOutlinedInput'
import { Instructor } from '~/data/instructor.dto'
import { APP_MESSAGE } from '~/global/app-message'
import { StyledForm } from './UpdateInstructorForm.styled'
import dayjs from 'dayjs'

type FormValues = {
  name: string
  dateOfBirth: string
  phone: string
}

const validationSchema = z.object({
  name: z
    .string()
    .min(1, APP_MESSAGE.REQUIRED_FIELD('Instructor Name'))
    .max(50, APP_MESSAGE.FIELD_TOO_LONG('Instructor Name', 50)),
  phone: z.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, APP_MESSAGE.WRONG_PHONE_FORMAT),
  dateOfBirth: z.string().min(1, APP_MESSAGE.REQUIRED_FIELD('Date of birth'))
})

interface UpdateInstructorFormProps {
  instructor: Instructor
  onSubmit: SubmitHandler<FormValues>
}

const UpdateInstructorForm = ({ instructor, onSubmit }: UpdateInstructorFormProps) => {
  const minDate = dayjs().subtract(18, 'years').format('YYYY-MM-DD')
  const {
    handleSubmit,
    control,
    formState: { isSubmitting }
  } = useForm<FormValues>({
    defaultValues: {
      name: instructor.name,
      dateOfBirth: dayjs(instructor.dateOfBirth).format('YYYY-MM-DD'),
      phone: instructor.phone
    },
    resolver: zodResolver(validationSchema)
  })

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ width: '100%', marginY: '40px', padding: '24px' }}>
        <Box display='flex' alignItems='center' marginBottom='20px'>
          <Typography variant='h2' sx={{ fontSize: '1.5rem', fontWeight: 700, paddingRight: '10px' }}>
            Instructor Details
          </Typography>
          <Divider sx={{ flexGrow: 1 }} />
        </Box>
        <Grid container columnSpacing='30px' rowSpacing='20px'>
          <Grid item xs={12} lg={6}>
            <ControlledOutlinedInput
              controller={{ name: 'name', control: control }}
              label='Instructor Name'
              fullWidth
              size='small'
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <ControlledOutlinedInput
              controller={{ name: 'dateOfBirth', control: control }}
              label='Date of birth'
              type='date'
              fullWidth
              size='small'
              inputProps={{
                max: minDate
              }}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <ControlledOutlinedInput
              controller={{ name: 'phone', control: control }}
              label='Phone number'
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

export default UpdateInstructorForm

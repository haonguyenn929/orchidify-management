import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import ControlledOutlinedInput from '~/components/form/ControlledOutlinedInput'
import { StyledForm } from './LoginForm.styled'
import ControlledSelect from '~/components/form/ControlledSelect'
import { UserRole } from '~/global/constants'
import useAuth from '~/auth/useAuth'
import { notifyError, notifySuccess } from '~/utils/toastify'
import { useState } from 'react'
import { Button, IconButton, InputAdornment } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { APP_MESSAGE } from '~/global/app-message'

type FormValues = {
  role: string
  email: string
  password: string
}

const defaultFormValues: FormValues = {
  role: UserRole.STAFF,
  email: '',
  password: ''
}

const validationSchema = z.object({
  role: z
    .string()
    .min(1, APP_MESSAGE.REQUIRED_FIELD('Role'))
    .refine((value) => UserRole[value as keyof typeof UserRole], {
      message: APP_MESSAGE.INVALID_VALUE(['Staff', 'Garden Managers'])
    }),
  email: z
    .string()
    .min(1, APP_MESSAGE.REQUIRED_FIELD('Email'))
    .max(50, APP_MESSAGE.FIELD_TOO_LONG('Email', 50))
    .email(APP_MESSAGE.WRONG_EMAIL_FORMAT),
  password: z
    .string()
    .min(1, APP_MESSAGE.REQUIRED_FIELD('Password'))
    .max(50, APP_MESSAGE.FIELD_TOO_LONG('Password', 50))
})

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const {
    handleSubmit,
    control,
    formState: { isSubmitting }
  } = useForm<FormValues>({
    defaultValues: defaultFormValues,
    resolver: zodResolver(validationSchema)
  })
  const { login } = useAuth()

  const onSubmit = handleSubmit(async (data) => {
    const error = await login(UserRole[data.role as keyof typeof UserRole], data.email, data.password)

    if (error) {
      notifyError(error.message)
    } else {
      notifySuccess(APP_MESSAGE.LOGIN_SUCCESS)
    }
  })

  return (
    <StyledForm onSubmit={onSubmit}>
      <ControlledSelect
        controller={{ name: 'role', control: control }}
        label='Role'
        labelId='role-select-label'
        placeholder='Select Role'
        items={[
          { name: 'Staff', value: UserRole.STAFF },
          { name: 'Garden Managers', value: UserRole.GARDEN_MANAGER }
        ]}
        fullWidth
        sx={{ marginBottom: '0.7rem' }}
      />
      <ControlledOutlinedInput
        controller={{ name: 'email', control: control }}
        label='Email'
        placeholder='Enter email address'
        fullWidth
        sx={{ marginBottom: '0.7rem' }}
      />
      <ControlledOutlinedInput
        controller={{ name: 'password', control: control }}
        type={showPassword ? 'text' : 'password'}
        endAdornment={
          <InputAdornment position='end'>
            <IconButton
              aria-label='toggle password visibility'
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge='end'
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label='Password'
        placeholder='Enter password'
        fullWidth
        sx={{ marginBottom: '0.7rem' }}
      />
      <Button disabled={isSubmitting} size='large' type='submit' fullWidth sx={{ marginTop: '0.7rem' }}>
        Sign In
      </Button>
    </StyledForm>
  )
}

export default LoginForm

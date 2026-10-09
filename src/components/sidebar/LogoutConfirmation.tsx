import useAuth from '~/auth/useAuth'
import AlertDialog from '../dialog/AlertDialog'
import { notifySuccess } from '~/utils/toastify'
import { APP_MESSAGE } from '~/global/app-message'

interface LogoutConfirmationProps {
  open: boolean
  handleClose: () => void
}

const LogoutConfirmation = ({ open, handleClose }: LogoutConfirmationProps) => {
  const { logout } = useAuth()

  const handleConfirm = () => {
    logout()
    notifySuccess('Logged out successfully')
    handleClose()
  }

  const handleCancel = () => {
    handleClose()
  }

  return (
    <AlertDialog
      open={open}
      handleConfirm={handleConfirm}
      handleCancel={handleCancel}
      title='Confirm Logout'
      description={APP_MESSAGE.CONFIRM_ACTION('log out')}
      confirmButtonText='Log Out'
      confirmButtonColor='error'
      cancelButtonText='Cancel'
      sx={{ '& .MuiDialog-paper': { width: '444px' } }}
    />
  )
}

export default LogoutConfirmation

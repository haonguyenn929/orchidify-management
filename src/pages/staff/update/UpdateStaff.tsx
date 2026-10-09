import { Box, Typography } from '@mui/material'
import Breadcrumbs from '~/components/breadscrumbs/Breadscrumbs'
import { protectedRoute } from '~/routes/routes'
import { useNavigate, useParams } from 'react-router-dom'
import { useStaffApi } from '~/hooks/api/useStaffApi'
import { useEffect, useState } from 'react'
import { ErrorResponseDto } from '~/data/error.dto'
import { Staff } from '~/data/staff.dto'
import { APP_MESSAGE } from '~/global/app-message'
import { notifyError, notifySuccess } from '~/utils/toastify'
import UpdateStaffForm from './components/UpdateStaffForm'
import Loading from '~/components/loading/Loading'

export default function UpdateStaff() {
  const [data, setData] = useState<Staff | null>(null)
  const [error, setError] = useState<ErrorResponseDto | null>(null)
  const { getStaffById, updateStaff } = useStaffApi()
  const navigate = useNavigate()
  const params = useParams()
  const staffId = params.id

  useEffect(() => {
    if (staffId) {
      // eslint-disable-next-line prettier/prettier
      (async () => {
        const { data: staff, error: apiError } = await getStaffById(staffId)
        setData(staff)
        setError(apiError)
      })()
    }
  }, [staffId, getStaffById])

  if (!staffId) {
    notifyError(APP_MESSAGE.LOAD_DATA_FAILED('staff information'))
    navigate(protectedRoute.staffList.path, { replace: true })
    return
  }

  const items = [
    protectedRoute.staffList,
    {
      ...protectedRoute.staffDetail,
      path: protectedRoute.staffDetail.path.replace(':id', staffId)
    },
    protectedRoute.updateStaff
  ]

  if (error) {
    notifyError(error.message)
    navigate(protectedRoute.staffList.path, { replace: true })
  }

  return data ? (
    <Box sx={{ marginBottom: '20px' }}>
      <Typography variant='h1' sx={{ fontSize: '2rem', paddingBottom: '8px', fontWeight: 700 }}>
        Update Staff
      </Typography>
      <Breadcrumbs items={items} />
      <UpdateStaffForm
        staff={data}
        onSubmit={async (formValues) => {
          const { error } = await updateStaff(data._id, { ...formValues })
          if (error) {
            notifyError(error.message)
            return
          }
          notifySuccess(APP_MESSAGE.ACTION_SUCCESS('Update Staff'))
          navigate(protectedRoute.staffDetail.path.replace(':id', staffId), { replace: true })
        }}
      />
    </Box>
  ) : (
    <Loading />
  )
}

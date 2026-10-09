import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Breadcrumbs from '~/components/breadscrumbs/Breadscrumbs'
import Loading from '~/components/loading/Loading'
import { ErrorResponseDto } from '~/data/error.dto'
import { Instructor } from '~/data/instructor.dto'
import { APP_MESSAGE } from '~/global/app-message'
import { useInstructorApi } from '~/hooks/api/useInstructorApi'
import { protectedRoute } from '~/routes/routes'
import { notifyError, notifySuccess } from '~/utils/toastify'
import UpdateInstructorForm from './components/UpdateInstructorForm'

const UpdateInstructor = () => {
  const [data, setData] = useState<Instructor | null>(null)
  const [error, setError] = useState<ErrorResponseDto | null>(null)
  const { getInstructorById, updateInstructor } = useInstructorApi()
  const navigate = useNavigate()
  const params = useParams()
  const instructorId = params.id

  useEffect(() => {
    if (instructorId) {
      // eslint-disable-next-line prettier/prettier
      (async () => {
        const { data: gardenManager, error: apiError } = await getInstructorById(instructorId)
        setData(gardenManager)
        setError(apiError)
      })()
    }
  }, [instructorId, getInstructorById])

  if (!instructorId) {
    notifyError(APP_MESSAGE.LOAD_DATA_FAILED('instructor information'))
    navigate(protectedRoute.gardenManagerList.path, { replace: true })
    return
  }

  const items = [
    protectedRoute.instructorList,
    {
      ...protectedRoute.instructorDetail,
      path: protectedRoute.instructorDetail.path.replace(':id', instructorId)
    },
    protectedRoute.updateInstructor
  ]

  if (error) {
    notifyError(error.message)
    navigate(protectedRoute.instructorList.path, { replace: true })
  }

  return data ? (
    <Box sx={{ marginBottom: '20px' }}>
      <Typography variant='h1' sx={{ fontSize: '2rem', paddingBottom: '8px', fontWeight: 700 }}>
        Update Instructor
      </Typography>
      <Breadcrumbs items={items} />
      <UpdateInstructorForm
        instructor={data}
        onSubmit={async (formValues) => {
          const { error } = await updateInstructor(data._id, { ...formValues })
          if (error) {
            notifyError(error.message)
            return
          }
          notifySuccess(APP_MESSAGE.ACTION_SUCCESS('Update Instructor'))
          navigate(protectedRoute.instructorDetail.path.replace(':id', instructorId), { replace: true })
        }}
      />
    </Box>
  ) : (
    <Loading />
  )
}

export default UpdateInstructor

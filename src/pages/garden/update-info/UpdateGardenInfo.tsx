import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Breadcrumbs from '~/components/breadscrumbs/Breadscrumbs'
import { ErrorResponseDto } from '~/data/error.dto'
import { Garden } from '~/data/garden.dto'
import { APP_MESSAGE } from '~/global/app-message'
import { useGardenApi } from '~/hooks/api/useGardenApi'
import { protectedRoute } from '~/routes/routes'
import { notifyError } from '~/utils/toastify'
import UpdateGardenInfoForm from './components/UpdateGardenInfoForm'
import Loading from '~/components/loading/Loading'

const UpdateGardenInfo = () => {
  const [data, setData] = useState<Garden | null>(null)
  const [error, setError] = useState<ErrorResponseDto | null>(null)
  const { getGardenById } = useGardenApi()
  const navigate = useNavigate()
  const params = useParams()
  const gardenId = params.id

  useEffect(() => {
    if (gardenId) {
      // eslint-disable-next-line prettier/prettier
      (async () => {
        const { data: gardenManager, error: apiError } = await getGardenById(gardenId)
        setData(gardenManager)
        setError(apiError)
      })()
    }
  }, [gardenId, getGardenById])

  if (!gardenId) {
    notifyError(APP_MESSAGE.LOAD_DATA_FAILED('garden information'))
    navigate(protectedRoute.gardenList.path, { replace: true })
    return
  }

  const items = [
    protectedRoute.gardenList,
    {
      ...protectedRoute.gardenDetail,
      path: protectedRoute.gardenDetail.path.replace(':id', gardenId)
    },
    protectedRoute.updateGardenInfo
  ]

  if (error) {
    notifyError(error.message)
    navigate(protectedRoute.gardenManagerList.path, { replace: true })
  }

  return data ? (
    <Box sx={{ marginBottom: '20px' }}>
      <Typography variant='h1' sx={{ fontSize: '2rem', paddingBottom: '8px', fontWeight: 700 }}>
        Update Garden
      </Typography>
      <Breadcrumbs items={items} />
      <UpdateGardenInfoForm garden={data} />
    </Box>
  ) : (
    <Loading />
  )
}

export default UpdateGardenInfo

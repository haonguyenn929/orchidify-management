import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Breadcrumbs from '~/components/breadscrumbs/Breadscrumbs'
import { Garden } from '~/data/garden.dto'
import { APP_MESSAGE } from '~/global/app-message'
import { useGardenApi } from '~/hooks/api/useGardenApi'
import { protectedRoute } from '~/routes/routes'
import { notifyError } from '~/utils/toastify'
import UpdateGardenManagerForm from './components/UpdateGardenManagerForm'
import { ErrorResponseDto } from '~/data/error.dto'
import Loading from '~/components/loading/Loading'

const UpdateGardenManager = () => {
  const params = useParams()
  const gardenId = params.id
  const navigate = useNavigate()
  const [data, setData] = useState<Garden | null>(null)
  const [error, setError] = useState<ErrorResponseDto | null>(null)

  const { getGardenById } = useGardenApi()

  useEffect(() => {
    if (gardenId) {
      // eslint-disable-next-line prettier/prettier
      (async () => {
        const { data: garden, error: apiError } = await getGardenById(gardenId)
        setData(garden)
        setError(apiError)
      })()
    }
  }, [gardenId, getGardenById])

  if (!gardenId) {
    notifyError(APP_MESSAGE.LOAD_DATA_FAILED('garden manager information'))
    navigate(protectedRoute.gardenList.path, { replace: true })
    return
  }

  if (error) {
    notifyError(error.message)
    navigate(protectedRoute.gardenManagerList.path, { replace: true })
  }

  const breadcrumbsItems = [
    protectedRoute.gardenList,
    {
      ...protectedRoute.gardenDetail,
      path: protectedRoute.gardenDetail.path.replace(':id', gardenId)
    },
    protectedRoute.updateGardenManagerOfGarden
  ]

  return data ? (
    <Box sx={{ marginBottom: '40px' }}>
      <Typography variant='h1' sx={{ fontSize: '2rem', paddingBottom: '8px', fontWeight: 700 }}>
        Garden Manager Details
      </Typography>
      <Breadcrumbs items={breadcrumbsItems} />
      <UpdateGardenManagerForm garden={data} />
    </Box>
  ) : (
    <Loading />
  )
}

export default UpdateGardenManager

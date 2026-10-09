import { Box, Typography } from '@mui/material'
import Breadcrumbs from '~/components/breadscrumbs/Breadscrumbs'
import { protectedRoute } from '~/routes/routes'
import { useNavigate, useParams } from 'react-router-dom'
import { useGardenManagerApi } from '~/hooks/api/useGardenManagerApi'
import { useEffect, useState } from 'react'
import { ErrorResponseDto } from '~/data/error.dto'
import { GardenManager } from '~/data/gardenManager.dto'
import { APP_MESSAGE } from '~/global/app-message'
import { notifyError, notifySuccess } from '~/utils/toastify'
import UpdateGardenManagerForm from './components/UpdateGardenManagerForm'
import Loading from '~/components/loading/Loading'

export default function UpdateGardenManager() {
  const [data, setData] = useState<GardenManager | null>(null)
  const [error, setError] = useState<ErrorResponseDto | null>(null)
  const { getGardenManagerById, updateGardenManager } = useGardenManagerApi()
  const navigate = useNavigate()
  const params = useParams()
  const gardenManagerId = params.id

  useEffect(() => {
    if (gardenManagerId) {
      // eslint-disable-next-line prettier/prettier
      (async () => {
        const { data: gardenManager, error: apiError } = await getGardenManagerById(gardenManagerId)
        setData(gardenManager)
        setError(apiError)
      })()
    }
  }, [gardenManagerId, getGardenManagerById])

  if (!gardenManagerId) {
    notifyError(APP_MESSAGE.LOAD_DATA_FAILED('garden manager information'))
    navigate(protectedRoute.gardenManagerList.path, { replace: true })
    return
  }

  const items = [
    protectedRoute.gardenManagerList,
    {
      ...protectedRoute.gardenManagerDetail,
      path: protectedRoute.gardenManagerDetail.path.replace(':id', gardenManagerId)
    },
    protectedRoute.updateGardenManager
  ]

  if (error) {
    notifyError(error.message)
    navigate(protectedRoute.gardenManagerList.path, { replace: true })
  }

  return data ? (
    <Box sx={{ marginBottom: '20px' }}>
      <Typography variant='h1' sx={{ fontSize: '2rem', paddingBottom: '8px', fontWeight: 700 }}>
        Update Garden Manager
      </Typography>
      <Breadcrumbs items={items} />
      <UpdateGardenManagerForm
        gardenManager={data}
        onSubmit={async (formValues) => {
          const { error } = await updateGardenManager(data._id, { ...formValues })
          if (error) {
            notifyError(error.message)
            return
          }
          notifySuccess(APP_MESSAGE.ACTION_SUCCESS('Update Garden Manager'))
          navigate(protectedRoute.gardenManagerDetail.path.replace(':id', gardenManagerId), { replace: true })
        }}
      />
    </Box>
  ) : (
    <Loading />
  )
}

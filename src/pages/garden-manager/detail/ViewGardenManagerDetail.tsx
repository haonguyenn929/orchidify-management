import { Box, Button, Typography, useTheme } from '@mui/material'
import { map } from 'lodash'
import { lazy, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Breadcrumbs from '~/components/breadscrumbs/Breadscrumbs'
import Loading from '~/components/loading/Loading'
import UserStatusTag from '~/components/tag/UserStatusTag'
import Field from '~/components/text-field/Field'
import { ErrorResponseDto } from '~/data/error.dto'
import { GardenManager } from '~/data/gardenManager.dto'
import { UserStatus } from '~/global/app-status'
import { useGardenManagerApi } from '~/hooks/api/useGardenManagerApi'
import { protectedRoute } from '~/routes/routes'
import { notifyError } from '~/utils/toastify'
import { Avatar, ContentText, ContentWrapper, Image, Line, TitleWrapper } from './ViewGardenManagerDetail.styled'
const ActivateDialog = lazy(() => import('./components/ActivateDialog'))
const DeactivateDialog = lazy(() => import('./components/DeactivateDialog'))

const ViewGardenManagerDetail = () => {
  const [data, setData] = useState<GardenManager | null>(null)
  const [error, setError] = useState<ErrorResponseDto | null>(null)
  const theme = useTheme()
  const params = useParams()
  const navigate = useNavigate()
  const gardenManagerId = params.id
  const { getGardenManagerById } = useGardenManagerApi()

  const [openActivateDialog, setOpenActivateDialog] = useState<boolean>(false)
  const [openDeactivateDialog, setOpenDeactivateDialog] = useState<boolean>(false)

  const breadcrumbsItems = [protectedRoute.gardenManagerList, protectedRoute.gardenManagerDetail]

  const handleOpenActivateDialog = () => {
    setOpenActivateDialog(true)
  }

  const handleCloseActivateDialog = () => {
    setOpenActivateDialog(false)
  }

  const handleOpenDeactivateDialog = () => {
    setOpenDeactivateDialog(true)
  }

  const handleCloseDeactivateDialog = () => {
    setOpenDeactivateDialog(false)
  }

  const handleUpdateButton = () => {
    if (gardenManagerId) navigate(protectedRoute.updateGardenManager.path.replace(':id', gardenManagerId))
  }

  const handleReloadData = async () => {
    if (gardenManagerId) {
      const { data: gardenManager, error: apiError } = await getGardenManagerById(gardenManagerId)
      setData(gardenManager)
      setError(apiError)
    }
  }

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

  if (error) {
    notifyError(error.message)
    navigate(protectedRoute.gardenManagerList.path, { replace: true })
  }

  return data ? (
    <>
      <TitleWrapper>
        <div>
          <Typography variant='h5' fontSize={34} fontWeight={700}>
            Garden Manager Details
          </Typography>
          <Breadcrumbs items={breadcrumbsItems} />
        </div>
        <div style={{ display: 'flex' }}>
          <Button color='warning' onClick={handleUpdateButton} sx={{ marginRight: '24px' }}>
            Update
          </Button>
          {data?.status === UserStatus.ACTIVE ? (
            <Button color='error' onClick={handleOpenDeactivateDialog}>
              Inactive
            </Button>
          ) : (
            <Button color='secondary' onClick={handleOpenActivateDialog}>
              Activate
            </Button>
          )}
        </div>
      </TitleWrapper>
      <ContentWrapper theme={theme}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant='h5' fontSize={24} fontWeight={700}>
            System Information
          </Typography>

          <Line theme={theme} />
        </div>
        <Avatar>
          <Image src={data?.idCardPhoto} alt='Your Avatar' theme={theme} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Typography variant='h6' fontSize={20} fontWeight={500}>
              {data?.name}
            </Typography>
            <Typography variant='h6' fontSize={14} fontWeight={500} color={theme.label.secondary}>
              Garden Managers
            </Typography>
          </div>
        </Avatar>
      </ContentWrapper>
      <ContentWrapper theme={theme}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant='h5' fontSize={24} fontWeight={700}>
            Personal Information
          </Typography>
          <Line theme={theme} />
        </div>
        <Box>
          <Field label='Garden Name' content={<ContentText>{data?.name || ''}</ContentText>} theme={theme} />
          <Field label='Email' content={<ContentText>{data?.email || ''}</ContentText>} theme={theme} />
          <Field
            label='Gardens'
            content={<ContentText>{map(data?.gardens || [], (garden) => garden.name).join(', ') || ''}</ContentText>}
            theme={theme}
          />
          <Field
            label='Status'
            content={data ? <UserStatusTag type={UserStatus[data.status]} /> : null}
            theme={theme}
          />
        </Box>
      </ContentWrapper>
      <DeactivateDialog
        open={openDeactivateDialog}
        handleClose={handleCloseDeactivateDialog}
        onSuccess={handleReloadData}
      />
      <ActivateDialog open={openActivateDialog} handleClose={handleCloseActivateDialog} onSuccess={handleReloadData} />
    </>
  ) : (
    <Loading />
  )
}

export default ViewGardenManagerDetail

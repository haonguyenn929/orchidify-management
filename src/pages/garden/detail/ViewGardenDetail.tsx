import { ArrowForward } from '@mui/icons-material'
import { Box, Button, Grid, Link as MuiLink, Typography, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Breadcrumbs from '~/components/breadscrumbs/Breadscrumbs'
import Loading from '~/components/loading/Loading'
import Carousel from '~/components/slider/Carousel'
import { ErrorResponseDto } from '~/data/error.dto'
import { Garden } from '~/data/garden.dto'
import { GardenStatus } from '~/global/app-status'
import { useGardenApi } from '~/hooks/api/useGardenApi'
import { ContentWrapper, Line, TitleWrapper } from '~/pages/garden-manager/detail/ViewGardenManagerDetail.styled'
import { ButtonWrapper, Image } from '~/pages/garden/detail/ViewGardenDetail.styled'
import { protectedRoute } from '~/routes/routes'
import { notifyError } from '~/utils/toastify'
import ActivateDialog from './components/ActivateDialog'
import DeactivateDialog from './components/DeactivateDialog'
import { APP_MESSAGE } from '~/global/app-message'
import useAuth from '~/auth/useAuth'
import { UserRole } from '~/global/constants'
import GardenStatusTag from '~/components/tag/GardenStatusTag'

const ViewGardenDetail = () => {
  const { userTokenPayload } = useAuth()
  const [data, setData] = useState<Garden | null>(null)
  const [error, setError] = useState<ErrorResponseDto | null>(null)
  const theme = useTheme()
  const params = useParams()
  const gardenId = params.id
  const { getGardenById } = useGardenApi()
  const navigate = useNavigate()

  const [openActivateDialog, setOpenActivateDialog] = useState<boolean>(false)
  const [openDeactivateDialog, setOpenDeactivateDialog] = useState<boolean>(false)

  const breadcrumbsItems = [protectedRoute.gardenList, protectedRoute.gardenDetail]

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
    navigate(protectedRoute.updateGardenInfo.path.replace(':id', gardenId!))
  }

  const handleReloadData = async () => {
    if (gardenId) {
      const { data: gardenManager, error: apiError } = await getGardenById(gardenId)
      setData(gardenManager)
      setError(apiError)
    }
  }

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
    notifyError(APP_MESSAGE.LOAD_DATA_FAILED('garden information'))
    navigate(protectedRoute.gardenList.path, { replace: true })
    return
  }

  if (error) {
    notifyError(error.message)
  }

  return data ? (
    <>
      <TitleWrapper>
        <div>
          <Typography variant='h5' fontSize={34} fontWeight={700}>
            Garden Details
          </Typography>
          <Breadcrumbs items={breadcrumbsItems} />
        </div>
        <div style={{ display: 'flex' }}>
          <Button color='warning' onClick={handleUpdateButton} sx={{ marginRight: '24px' }}>
            Update
          </Button>
          {userTokenPayload && userTokenPayload.role === UserRole.STAFF && (
            <>
              {data?.status === GardenStatus.ACTIVE ? (
                <Button color='error' onClick={handleOpenDeactivateDialog}>
                  Inactive
                </Button>
              ) : (
                <Button color='secondary' onClick={handleOpenActivateDialog}>
                  Activate
                </Button>
              )}
            </>
          )}
        </div>
      </TitleWrapper>
      <ContentWrapper theme={theme}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant='h5' fontSize={24} fontWeight={700}>
            Garden Details
          </Typography>
          <Line theme={theme} />
        </div>
        <Grid container mt={1} rowGap={'20px'}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex' }}>
              <Typography fontWeight={500} width={'180px'}>
                Garden Name:
              </Typography>
              {data.name}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex' }}>
              <Typography fontWeight={500} width={'180px'}>
                Address:
              </Typography>
              {data.address}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Typography fontWeight={500} width={'180px'}>
                Description:
              </Typography>
              {data.description}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex' }}>
              <Typography fontWeight={500} width={'180px'}>
                Max classes:
              </Typography>
              {data.maxClass}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex' }}>
              <Typography fontWeight={500} width={'180px'}>
                Manager:
              </Typography>
              {data.gardenManager.map((item) => item.name).join(', ')}
              {userTokenPayload && userTokenPayload.role === UserRole.STAFF ? (
                <Box sx={{ display: 'flex' }}>
                  <MuiLink
                    component={Link}
                    to={protectedRoute.updateGardenManagerOfGarden.path.replace(':id', gardenId)}
                    underline='always'
                    marginLeft={'50px'}
                    color={'inherit'}
                    fontWeight={500}
                    sx={{}}
                  >
                    Change Garden Manager
                  </MuiLink>
                  <ArrowForward />
                </Box>
              ) : null}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex' }}>
              <Typography fontWeight={500} width={'180px'}>
                Status:
              </Typography>
              <GardenStatusTag type={data.status} />
            </Box>
          </Grid>
          <Grid item xs={12}></Grid>
        </Grid>
        <Typography fontWeight={500} width={'180px'}>
          Garden Images
        </Typography>
        <Carousel>
          {data?.images?.map((value, index) => (
            <div
              key={index}
              style={{
                boxSizing: 'border-box'
              }}
            >
              <div style={{ width: '200px', height: '200px', padding: '0 2px' }}>
                <Image src={value} alt={`Garden Image ${index + 1}`} />
              </div>
            </div>
          ))}
        </Carousel>
      </ContentWrapper>
      <ButtonWrapper>
        {data.status === GardenStatus.ACTIVE ? (
          <Button onClick={() => navigate(protectedRoute.viewGardenTimesheet.path.replace(':id', gardenId))}>
            Schedule
          </Button>
        ) : null}
      </ButtonWrapper>
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

export default ViewGardenDetail

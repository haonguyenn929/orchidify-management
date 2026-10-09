import { Box, Button, Typography, useTheme, Avatar as MuiAvatar } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Breadcrumbs from '~/components/breadscrumbs/Breadscrumbs'
import Loading from '~/components/loading/Loading'
import UserStatusTag from '~/components/tag/UserStatusTag'
import Field from '~/components/text-field/Field'
import { ErrorResponseDto } from '~/data/error.dto'
import { Learner } from '~/data/learner.dto'
import { UserStatus } from '~/global/app-status'
import { useLearnerApi } from '~/hooks/api/useLearnerApi'
import {
  Avatar,
  ContentText,
  ContentWrapper,
  Line,
  TitleWrapper
} from '~/pages/garden-manager/detail/ViewGardenManagerDetail.styled'
import { protectedRoute } from '~/routes/routes'
import { notifyError } from '~/utils/toastify'
import DeactivateDialog from './components/DeactivateDialog'
import ActivateDialog from './components/ActivateDialog'

const ViewLearnerDetail = () => {
  const [data, setData] = useState<Learner | null>(null)
  const [error, setError] = useState<ErrorResponseDto | null>(null)
  const theme = useTheme()
  const params = useParams()
  const navigate = useNavigate()
  const learnerId = params.id
  const { getLearnerById } = useLearnerApi()

  const [openActivateDialog, setOpenActivateDialog] = useState<boolean>(false)
  const [openDeactivateDialog, setOpenDeactivateDialog] = useState<boolean>(false)

  const breadcrumbsItems = [protectedRoute.learnerList, protectedRoute.learnerDetail]

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

  // const handleUpdateButton = () => {
  //   if (learnerId) navigate(protectedRoute.updateGardenManager.path.replace(':id', learnerId))
  // }

  const handleReloadData = async () => {
    if (learnerId) {
      const { data: learner, error: apiError } = await getLearnerById(learnerId)
      setData(learner)
      setError(apiError)
    }
  }

  useEffect(() => {
    if (learnerId) {
      // eslint-disable-next-line prettier/prettier
      (async () => {
        const { data: gardenManager, error: apiError } = await getLearnerById(learnerId)
        setData(gardenManager)
        setError(apiError)
      })()
    }
  }, [learnerId, getLearnerById])

  if (error) {
    notifyError(error.message)
    navigate(protectedRoute.learnerList.path, { replace: true })
  }

  return data ? (
    <>
      <TitleWrapper>
        <div>
          <Typography variant='h5' fontSize={34} fontWeight={700}>
            Learner Details
          </Typography>
          <Breadcrumbs items={breadcrumbsItems} />
        </div>
        <div style={{ display: 'flex' }}>
          {/* <Button color='warning' onClick={handleUpdateButton} sx={{ marginRight: '24px' }}>
            Update
          </Button> */}
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
        <Avatar>
          <MuiAvatar
            src={data.avatar}
            alt='Your Avatar'
            sx={{
              width: '10rem',
              height: '10rem',
              margin: '20px'
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Typography variant='h6' fontSize={20} fontWeight={500}>
              {data?.name}
            </Typography>
            <Typography variant='h6' fontSize={14} fontWeight={500} color={theme.label.secondary}>
              Learners
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
          <Field label='Learner Name' content={<ContentText>{data?.name || ''}</ContentText>} theme={theme} />
          <Field
            label='Date of birth'
            content={
              <ContentText>
                {data.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString('en-US') : 'Not updated'}
              </ContentText>
            }
            theme={theme}
          />
          <Field label='Email' content={<ContentText>{data?.email || ''}</ContentText>} theme={theme} />
          <Field
            label='Phone number'
            content={<ContentText>{data?.phone || 'Not updated'}</ContentText>}
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

export default ViewLearnerDetail

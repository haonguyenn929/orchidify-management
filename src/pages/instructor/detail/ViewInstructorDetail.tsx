import { Box, Button, Divider, Typography, useTheme } from '@mui/material'
import { lazy, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Breadcrumbs from '~/components/breadscrumbs/Breadscrumbs'
import Loading from '~/components/loading/Loading'
import UserStatusTag from '~/components/tag/UserStatusTag'
import Field from '~/components/text-field/Field'
import { ErrorResponseDto } from '~/data/error.dto'
import { UserStatus } from '~/global/app-status'
import { protectedRoute } from '~/routes/routes'
import { notifyError } from '~/utils/toastify'
import { Avatar, ContentText, ContentWrapper, Image, Line, TitleWrapper } from './ViewInstructorDetail.styled'
import { Instructor } from '~/data/instructor.dto'
import { useInstructorApi } from '~/hooks/api/useInstructorApi'
import avatar from '~/assets/avatar.png'
import certificateImg from '~/assets/certificate.png'
import { formatCurrency } from '~/utils/format'
const ActivateDialog = lazy(() => import('./components/ActivateDialog'))
const DeactivateDialog = lazy(() => import('./components/DeactivateDialog'))

const ViewInstructorDetail = () => {
  const [data, setData] = useState<Instructor | null>(null)
  const [error, setError] = useState<ErrorResponseDto | null>(null)
  const theme = useTheme()
  const params = useParams()
  const navigate = useNavigate()
  const instructorId = params.id
  const { getInstructorById } = useInstructorApi()

  const [openActivateDialog, setOpenActivateDialog] = useState<boolean>(false)
  const [openDeactivateDialog, setOpenDeactivateDialog] = useState<boolean>(false)

  const breadcrumbsItems = [protectedRoute.instructorList, protectedRoute.instructorDetail]

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
    if (instructorId) navigate(protectedRoute.updateInstructor.path.replace(':id', instructorId))
  }

  const handleReloadData = async () => {
    if (instructorId) {
      const { data: instructor, error: apiError } = await getInstructorById(instructorId)
      setData(instructor)
      setError(apiError)
    }
  }

  useEffect(() => {
    if (instructorId) {
      ;(async () => {
        const { data: instructor, error: apiError } = await getInstructorById(instructorId)
        setData(instructor)
        setError(apiError)
      })()
    }
  }, [instructorId, getInstructorById])

  if (error) {
    notifyError(error.message)
    navigate(protectedRoute.instructorList.path, { replace: true })
  }

  return data ? (
    <>
      <TitleWrapper>
        <div>
          <Typography variant='h5' fontSize={34} fontWeight={700}>
            Instructor Details
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
        <Avatar>
          <Image
            src={data.idCardPhoto}
            alt='Your Avatar'
            theme={theme}
            onError={(event) => (event.currentTarget.src = avatar)}
          />
          <Box width='100%'>
            <Box display='flex' alignItems='center' justifyContent='space-between' width='100%'>
              <Box>
                <Typography variant='h6' fontSize={20} fontWeight={500}>
                  {data?.name}
                </Typography>
                <Typography variant='h6' fontSize={14} fontWeight={500} color={theme.label.secondary}>
                  Instructors
                </Typography>
              </Box>
              <Button onClick={() => navigate(protectedRoute.instructorTimesheet.path.replace(':id', data._id))}>
                Teaching Schedule
              </Button>
            </Box>
            <Typography variant='h6' fontSize={14}>
              {data.bio}
            </Typography>
          </Box>
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
          <Field label='Instructor Name' content={<ContentText>{data?.name || ''}</ContentText>} theme={theme} />
          <Field
            label='Date of birth'
            content={<ContentText>{new Date(data.dateOfBirth).toLocaleDateString('en-US')}</ContentText>}
            theme={theme}
          />
          <Field label='Email' content={<ContentText>{data?.email || ''}</ContentText>} theme={theme} />
          <Field label='Phone number' content={<ContentText>{data?.phone || ''}</ContentText>} theme={theme} />
          <Field
            label='Status'
            content={data ? <UserStatusTag type={UserStatus[data.status]} /> : null}
            theme={theme}
          />
        </Box>
      </ContentWrapper>
      <ContentWrapper theme={theme}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant='h5' fontSize={24} fontWeight={700}>
            Certificates
          </Typography>
          <Line theme={theme} />
        </div>
        {data.certificates.map((certificate, index) => (
          <Box key={certificate.name}>
            <Box display='flex' alignItems='center'>
              <Box width='107px' height='80px' marginRight='1.25rem'>
                <img
                  src={certificate.url.replace('.pdf', '.png')}
                  alt={certificate.name}
                  onError={(event) => (event.currentTarget.src = certificateImg)}
                  width='100%'
                  height='100%'
                  style={{ objectFit: 'cover' }}
                />
              </Box>
              <Typography variant='body1'>{certificate.name}</Typography>
            </Box>
            {index !== data.certificates.length - 1 ? <Divider /> : null}
          </Box>
        ))}
      </ContentWrapper>
      <ContentWrapper theme={theme}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant='h5' fontSize={24} fontWeight={700}>
            System Information
          </Typography>
          <Line theme={theme} />
        </div>
        <Avatar>
          <Image
            src={data.idCardPhoto}
            alt='Id Card Photo'
            theme={theme}
            onError={(event) => (event.currentTarget.src = avatar)}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Typography variant='h6' fontSize={20} fontWeight={500}>
              {data?.name}
            </Typography>
            <Typography variant='h6' fontSize={16} fontWeight={500} color={theme.label.secondary}>
              Wallet Balance <span style={{ color: '#000000DE' }}>{formatCurrency(data.balance)}</span>
            </Typography>
          </div>
        </Avatar>
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

export default ViewInstructorDetail

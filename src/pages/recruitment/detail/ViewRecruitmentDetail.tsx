import { InsertDriveFileOutlined } from '@mui/icons-material'
import { Box, Divider, Paper, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '~/components/loading/Loading'
import RecruitmentStatusTag from '~/components/tag/RecruitmentStatusTag'
import { ErrorResponseDto } from '~/data/error.dto'
import { RecruitmentDetailResponseDto } from '~/data/recruitment.dto'
import { RecruitmentStatus } from '~/global/app-status'
import { useRecruitmentApi } from '~/hooks/api/useRecruitmentApi'
import { protectedRoute } from '~/routes/routes'
import { notifyError } from '~/utils/toastify'
import Header from './components/Header'
import ProcessDialog from './components/ProcessDialog'
import ApproveDialog from './components/ApproveDialog'
import RejectDialog from './components/RejectDialog'

interface FieldProps {
  label: string
  content?: string
  statusTag?: RecruitmentStatus
  isLink?: boolean // Instead of 'type', just use a boolean flag for link or text
}

const Field: React.FC<FieldProps> = ({ label, content, statusTag, isLink = false }) => {
  const renderContent =
    isLink && content ? (
      <a href={content} target='_blank' rel='noopener noreferrer' style={{ color: 'inherit', textDecoration: 'none' }}>
        <Typography variant='subtitle1' fontWeight={400} color='primary'>
          {content}
        </Typography>
      </a>
    ) : (
      <Typography variant='subtitle1' fontWeight={400}>
        {content}
      </Typography>
    )

  return (
    <Box display='flex' marginY='0.25rem'>
      <Typography variant='subtitle1' fontWeight={600} width={'180px'}>
        {label}:
      </Typography>
      {content && renderContent}
      {statusTag && <RecruitmentStatusTag type={statusTag} />}
    </Box>
  )
}

const ViewRecruitmentDetail = () => {
  const [recruitment, setRecruitment] = useState<RecruitmentDetailResponseDto | null>(null)
  const [error, setError] = useState<ErrorResponseDto | null>(null)
  const [openProcessDialog, setOpenProcessDialog] = useState<boolean>(false)
  const [openApproveDialog, setOpenApproveDialog] = useState<boolean>(false)
  const [openRejectDialog, setOpenRejectDialog] = useState<boolean>(false)
  const params = useParams()
  const navigate = useNavigate()
  const recruitmentId = params.id

  const { getRecruitmentById } = useRecruitmentApi()

  const handleProcessButton = () => {
    setOpenProcessDialog(true)
  }
  const handleApproveButton = () => {
    setOpenApproveDialog(true)
  }
  const handleRejectButton = () => {
    setOpenRejectDialog(true)
  }

  const handleAddButton = () => {
    navigate(protectedRoute.addInstructor.path, {
      state: {
        name: recruitment?.applicationInfo.name,
        email: recruitment?.applicationInfo.email,
        phone: recruitment?.applicationInfo.phone
      }
    })
  }

  const handleDownload = (url: string) => {
    const pdfUrl = url
    window.open(pdfUrl, '_blank')
  }

  useEffect(() => {
    if (recruitmentId) {
      // eslint-disable-next-line prettier/prettier
      (async () => {
        const { data: recruitment, error: apiError } = await getRecruitmentById(recruitmentId)
        setRecruitment(recruitment)
        setError(apiError)
      })()
    }
  }, [recruitmentId, getRecruitmentById])

  const reloadRecruitmentData = async () => {
    if (recruitmentId) {
      const { data: recruitment, error: apiError } = await getRecruitmentById(recruitmentId)
      setRecruitment(recruitment)
      setError(apiError)
    }
  }

  if (error) {
    notifyError(error.message)
    navigate(protectedRoute.recruitmentList.path, { replace: true })
  }

  return recruitment ? (
    <>
      <Header
        handledBy={recruitment.handledBy?._id}
        isInstructorAdded={recruitment.isInstructorAdded}
        recruitmentRequestStatus={recruitment.status}
        onProcessButtonClick={handleProcessButton}
        onApproveButtonClick={handleApproveButton}
        onRejectButtonClick={handleRejectButton}
        onAddButtonClick={handleAddButton}
      />
      <Paper sx={{ width: '100%', marginTop: '1.25rem', padding: '1.5rem' }}>
        <Box display='flex' alignItems='center' marginBottom='1.25rem'>
          <Typography variant='h2' sx={{ fontSize: '1.5rem', fontWeight: 700, paddingRight: '0.75rem' }}>
            Recruitment Information
          </Typography>
          <Divider sx={{ flexGrow: 1 }} />
        </Box>
        <Field label='Applicant Name' content={recruitment.applicationInfo.name} />
        <Field label='Email' content={recruitment.applicationInfo.email} />
        <Field label='Phone number' content={recruitment.applicationInfo.phone} />
        <Box marginY='1rem'>
          <Typography variant='subtitle1' fontWeight={600} marginBottom='0.5rem'>
            Notes:
          </Typography>
          <Typography variant='subtitle1' fontWeight={400}>
            {recruitment.applicationInfo.note}
          </Typography>
        </Box>
        <Divider sx={{ flexGrow: 1 }} />
        {recruitment.handledBy ? <Field label='Approved By Staff' content={recruitment.handledBy.name} /> : null}
        <Field label='Created at' content={new Date(recruitment.createdAt).toLocaleString('en-US')} />
        <Field label='Last updated' content={new Date(recruitment.updatedAt).toLocaleString('en-US')} />
        <Field label='Status' statusTag={recruitment.status} />
        {recruitment.status === RecruitmentStatus.INTERVIEWING ? (
          <>
            <Field
              label='Meeting Time'
              content={new Date(recruitment.meetingDate).toLocaleString('VI-vn')}
            />
            <Field label='Meeting URL' content={recruitment.meetingUrl} isLink={true} />
          </>
        ) : null}
        {recruitment.rejectReason && (
          <Box marginY='1rem'>
            <Typography variant='subtitle1' fontWeight={600} marginBottom='0.5rem'>
              Rejection Reason:
            </Typography>
            <Typography variant='subtitle1' fontWeight={400}>
              {recruitment.rejectReason}
            </Typography>
          </Box>
        )}
        <Box marginTop='1rem'>
          <Typography variant='subtitle1' fontWeight={600} marginBottom='0.5rem'>
            CV
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              background: '#f4f4f4',
              width: 'fit-content',
              p: 2.5,
              borderRadius: 2,
              border: '2px solid #d7d7d7',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => handleDownload(recruitment.applicationInfo.cv)}
          >
            <InsertDriveFileOutlined />
            {recruitment.applicationInfo.name} CV
          </Box>
        </Box>
      </Paper>
      <ProcessDialog
        recruitmentId={recruitment._id}
        updatedAt={recruitment.updatedAt}
        open={openProcessDialog}
        onSuccess={reloadRecruitmentData}
        handleClose={() => setOpenProcessDialog(false)}
      />
      <ApproveDialog
        recruitmentId={recruitment._id}
        open={openApproveDialog}
        handleClose={() => setOpenApproveDialog(false)}
        onSuccess={reloadRecruitmentData}
      />
      <RejectDialog
        recruitmentId={recruitment._id}
        open={openRejectDialog}
        onSuccess={reloadRecruitmentData}
        handleClose={() => setOpenRejectDialog(false)}
      />
    </>
  ) : (
    <Loading />
  )
}

export default ViewRecruitmentDetail

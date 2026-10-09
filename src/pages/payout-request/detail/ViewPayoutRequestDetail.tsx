import { Box, Divider, Paper, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '~/components/loading/Loading'
import RequestStatusTag from '~/components/tag/RequestStatusTag'
import { ErrorResponseDto } from '~/data/error.dto'
import { PayoutRequestDetailDto } from '~/data/payoutRequest.dto'
import { RequestStatus } from '~/global/app-status'
import { usePayoutRequestApi } from '~/hooks/api/usePayoutRequestApi'
import { protectedRoute } from '~/routes/routes'
import { formatCurrency } from '~/utils/format'
import { notifyError } from '~/utils/toastify'
import ApproveRequestDialog from './components/ApproveRequestDialog'
import Header from './components/Header'
import RejectRequestDialog from './components/RejectRequestDialog'
import { Check, Close } from '@mui/icons-material'
import MakePayoutDialog from './components/MakePayoutDialog'

interface FieldProps {
  label: string
  content?: string
  statusTag?: RequestStatus
  isLink?: boolean
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
      {statusTag && <RequestStatusTag type={statusTag} />}
    </Box>
  )
}

const ViewPayoutRequestDetail = () => {
  const [payoutRequest, setPayoutRequest] = useState<PayoutRequestDetailDto | null>(null)
  const [error, setError] = useState<ErrorResponseDto | null>(null)
  const [openApproveDialog, setOpenApproveDialog] = useState<boolean>(false)
  const [openRejectDialog, setOpenRejectDialog] = useState<boolean>(false)
  const [openPayoutDialog, setOpenPayoutDialog] = useState<boolean>(false)
  const params = useParams()
  const navigate = useNavigate()
  const payoutRequestId = params.id
  const { getPayoutRequestById } = usePayoutRequestApi()

  useEffect(() => {
    if (payoutRequestId) {
      // eslint-disable-next-line prettier/prettier
      (async () => {
        const { data: payoutRequest, error: apiError } = await getPayoutRequestById(payoutRequestId)
        setPayoutRequest(payoutRequest)
        setError(apiError)
      })()
    }
  }, [payoutRequestId, getPayoutRequestById])

  const handleApproveButtonClick = () => {
    setOpenApproveDialog(true)
  }

  const handlePayoutButtonClick = () => {
    setOpenPayoutDialog(true)
  }

  const reloadClassRequestData = async () => {
    if (payoutRequestId) {
      const { data: payoutRequest, error: apiError } = await getPayoutRequestById(payoutRequestId)
      setPayoutRequest(payoutRequest)
      setError(apiError)
    }
  }

  if (error) {
    notifyError(error.message)
    navigate(protectedRoute.classRequestList.path, { replace: true })
  }

  return payoutRequest ? (
    <>
      <Header
        payoutRequestStatus={payoutRequest.status}
        onApproveButtonClick={handleApproveButtonClick}
        onRejectButtonClick={() => setOpenRejectDialog(true)}
        onPayoutButtonClick={handlePayoutButtonClick}
        hasMadePayout={payoutRequest.hasMadePayout}
      />
      <Paper sx={{ width: '100%', marginTop: '1.25rem', padding: '1.5rem', marginBottom: '1.25rem' }}>
        <Box display='flex' alignItems='center' marginBottom='1.25rem'>
          <Typography variant='h2' sx={{ fontSize: '1.5rem', fontWeight: 700, paddingRight: '0.75rem' }}>
            Request Information
          </Typography>
          <Divider sx={{ flexGrow: 1 }} />
        </Box>
        <Field label='Instructor Name' content={payoutRequest.createdBy.name} />
        <Field label='Amount' content={formatCurrency(payoutRequest.amount)} />
        <Field label='Created at' content={new Date(payoutRequest.createdAt).toLocaleString('en-US')} />
        <Field label='Last updated' content={new Date(payoutRequest.updatedAt).toLocaleString('en-US')} />
        <Field label='Status' statusTag={payoutRequest.status} />
        {payoutRequest.status === RequestStatus.REJECTED ? (
          <Box marginTop='1.5rem'>
            <Typography variant='subtitle1' fontWeight={600} marginBottom='0.5rem'>
              Rejection reason
            </Typography>
            <Typography variant='subtitle1' fontWeight={400}>
              {payoutRequest.rejectReason}
            </Typography>
          </Box>
        ) : null}
        <Box marginTop='1.5rem'>
          <Typography variant='subtitle1' fontWeight={600} marginBottom='0.5rem'>
            Request Description
          </Typography>
          <Typography variant='subtitle1' fontWeight={400}>
            {payoutRequest.description}
          </Typography>
        </Box>
      </Paper>
      <Paper sx={{ width: '100%', marginTop: '1.25rem', padding: '1.5rem', marginBottom: '1.25rem' }}>
        <Box display='flex' alignItems='center' marginBottom='1.25rem'>
          <Typography variant='h2' sx={{ fontSize: '1.5rem', fontWeight: 700, paddingRight: '0.75rem' }}>
            Payout Account Information
          </Typography>
          <Divider sx={{ flexGrow: 1 }} />
        </Box>

        <Field
          label='Bank Name'
          content={`${payoutRequest.createdBy.paymentInfo.bankShortName} - ${payoutRequest.createdBy.paymentInfo.bankName}`}
        />
        <Field label='Account Name' content={payoutRequest.createdBy.paymentInfo.accountName} />
        <Field label='STK' content={payoutRequest.createdBy.paymentInfo.accountNumber} />
      </Paper>
      {payoutRequest.status === RequestStatus.APPROVED ? (
        <Paper sx={{ width: '100%', marginTop: '1.25rem', padding: '1.5rem' }}>
          <Box display='flex' alignItems='center' marginBottom='1.25rem'>
            <Typography variant='h2' sx={{ fontSize: '1.5rem', fontWeight: 700, paddingRight: '0.75rem' }}>
              Transaction Information
            </Typography>
            <Divider sx={{ flexGrow: 1 }} />
          </Box>
          <Box display='flex' marginY='0.25rem'>
            <Typography variant='subtitle1' fontWeight={600} width={'180px'}>
              Status:
            </Typography>
            {payoutRequest.hasMadePayout ? (
              <>
                Fulfilled <Check sx={{ marginLeft: '0.5rem', color: '#34B233' }} />
              </>
            ) : (
              <>
                Pending
                <Close sx={{ marginLeft: '0.5rem', color: '#FF605C' }} />
              </>
            )}
          </Box>
          {payoutRequest.transactionCode ? (
            <Field label='Transaction Code' content={payoutRequest.transactionCode} />
          ) : null}
          {payoutRequest.attachment ? (
            <Box width='200px' height='200px'>
              <img
                src={payoutRequest.attachment.url}
                alt='Transaction Image'
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
              />
            </Box>
          ) : null}
        </Paper>
      ) : null}
      <ApproveRequestDialog
        payoutRequestId={payoutRequest._id}
        open={openApproveDialog}
        onSuccess={reloadClassRequestData}
        handleClose={() => setOpenApproveDialog(false)}
      />
      <RejectRequestDialog
        requestId={payoutRequest._id}
        open={openRejectDialog}
        onSuccess={reloadClassRequestData}
        handleClose={() => setOpenRejectDialog(false)}
      />
      <MakePayoutDialog
        requestId={payoutRequest._id}
        open={openPayoutDialog}
        onSuccess={reloadClassRequestData}
        handleClose={() => setOpenPayoutDialog(false)}
      />
    </>
  ) : (
    <Loading />
  )
}

export default ViewPayoutRequestDetail

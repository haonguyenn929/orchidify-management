import { Box, Divider, Paper, Typography } from '@mui/material'
import TransactionStatusTag from '~/components/tag/TransactionStatusTag'
import { TransactionDetailResponseDto } from '~/data/transaction.dto'
import { TransactionStatus } from '~/global/app-status'
import { PaymentType, UserRole } from '~/global/constants'
import { formatCurrency } from '~/utils/format'

interface FieldProps {
  label: string
  content?: string
  transactionType?: PaymentType
  statusTag?: TransactionStatus
}

const Field: React.FC<FieldProps> = ({ label, content, transactionType, statusTag }) => (
  <Box display='flex'>
    <Typography variant='subtitle1' fontWeight={600} width={'180px'}>
      {label}
    </Typography>
    {content && (
      <Typography variant='subtitle1' fontWeight={400}>
        {content}
      </Typography>
    )}
    {transactionType && (
      <Typography variant='subtitle1' fontWeight={400}>
        {transactionType === PaymentType.PAYMENT
          ? 'Buy Course'
          : transactionType === PaymentType.PAYOUT
            ? 'Payout'
            : 'Other'}
      </Typography>
    )}

    {statusTag && <TransactionStatusTag type={statusTag} />}
  </Box>
)

interface InformationProps {
  transaction: TransactionDetailResponseDto
}

const Information = ({ transaction }: InformationProps) => {
  return (
    <Paper sx={{ width: '100%', marginTop: '1.25rem', padding: '1.5rem' }}>
      <Box display='flex' alignItems='center' marginBottom='1.25rem'>
        <Typography variant='h2' sx={{ fontSize: '1.5rem', fontWeight: 700, paddingRight: '0.75rem' }}>
          Transaction Information
        </Typography>
        <Divider sx={{ flexGrow: 1 }} />
      </Box>
      <Box display='flex' flexDirection='column' gap={1} flexGrow='1'>
        <Field
          label='Transaction Code'
          content={
            transaction.type === PaymentType.PAYMENT
              ? transaction.payment.code || 'No data'
              : transaction.type === PaymentType.PAYOUT
                ? transaction.payout.code || 'No data'
                : 'No data'
          }
        />
        <Field label='Transaction Type' transactionType={transaction.type} />
        <Field
          label='Source Account'
          content={
            transaction.debitAccount.userRole === UserRole.SYSTEM ? 'System' : transaction.debitAccount.user.name
          }
        />
        <Field
          label='Recipient Account'
          content={
            transaction.creditAccount.userRole === UserRole.SYSTEM ? 'System' : transaction.creditAccount.user.name
          }
        />
        <Field label='Amount' content={formatCurrency(transaction.amount)} />
        <Field label='Content' content={transaction.description} />
        <Field label='Created at' content={new Date(transaction.createdAt).toLocaleString('en-US')} />
        <Field label='Last updated' content={new Date(transaction.updatedAt).toLocaleString('en-US')} />
        <Field label='Status' statusTag={transaction.status} />
      </Box>
    </Paper>
  )
}

export default Information

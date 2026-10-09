import { Box, Divider, Paper, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { PaymentPayoutHistoryDto } from '~/data/transaction.dto'

interface FieldProps {
  label: string
  content?: string
}

const Field: React.FC<FieldProps> = ({ label, content }) => (
  <Box display='flex'>
    <Typography variant='subtitle1' fontWeight={600} width={'180px'}>
      {label}
    </Typography>
    {content && (
      <Typography variant='subtitle1' fontWeight={400}>
        {content}
      </Typography>
    )}
  </Box>
)

interface HistoriesProps {
  histories: PaymentPayoutHistoryDto[]
}

const Histories = ({ histories }: HistoriesProps) => {
  return (
    <Paper sx={{ width: '100%', marginTop: '1.25rem', padding: '1.5rem' }}>
      <Box display='flex' alignItems='center' marginBottom='1.25rem'>
        <Typography variant='h2' sx={{ fontSize: '1.5rem', fontWeight: 700, paddingRight: '0.75rem' }}>
          Update History
        </Typography>
        <Divider sx={{ flexGrow: 1 }} />
      </Box>
      <Box>
        {histories.map((history, index) => (
          <>
            <Box display='flex' flexDirection='column' gap={1} flexGrow='1'>
              <Field label='Status' content={(history['status'] as string) || 'No data'} />
              <Field
                label='Created at'
                content={
                  dayjs(history['createdAt'] as string).isValid()
                    ? new Date(history['createdAt'] as string).toLocaleString('en-US')
                    : 'No data'
                }
              />
            </Box>
            {index < histories.length - 1 ? <Divider sx={{ marginY: '1.25rem' }} /> : null}
          </>
        ))}
      </Box>
    </Paper>
  )
}

export default Histories

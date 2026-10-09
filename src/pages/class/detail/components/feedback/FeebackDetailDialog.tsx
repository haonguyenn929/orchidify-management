import { Box, Typography, Dialog, DialogContent, Rating } from '@mui/material'
import avatar from '~/assets/avatar.png'
import { FeedbackListItemResponseDto } from '~/data/feedback.dto'

interface FieldProps {
  label: string
  content?: string
}

const Field: React.FC<FieldProps> = ({ label, content }) => (
  <Box display='flex'>
    <Typography variant='subtitle1' fontWeight={500} width={'180px'}>
      {label}
    </Typography>
    {content && (
      <Typography variant='subtitle1' fontWeight={400}>
        {content}
      </Typography>
    )}
  </Box>
)

interface FeedbackDetailDialogProps {
  open: boolean
  onClose: () => void
  feedback: FeedbackListItemResponseDto
}

const FeedbackDetailDialog = ({ open, onClose, feedback }: FeedbackDetailDialogProps) => {
  return (
    <Dialog onClose={onClose} open={open} PaperProps={{ sx: { width: '100%', maxWidth: '1000px' } }}>
      <>
        <DialogContent>
          <Box display='flex' gap='1rem' marginBottom='1.25rem'>
            <Box width='250px' height='250px'>
              <img
                src={feedback.learner.avatar}
                alt={feedback.learner.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                onError={(event) => (event.currentTarget.src = avatar)}
              />
            </Box>
            <Box display='flex' flexDirection='column' justifyContent='center' gap={1} flexGrow='1'>
              <Field label='Learner Name' content={feedback.learner.name} />
              <Field label='Email' content={feedback.learner.email} />
              <Field label='Date of birth' content={new Date(feedback.learner.dateOfBirth).toLocaleDateString()} />
              <Field label='Phone number' content={feedback.learner.phone} />
            </Box>
          </Box>
          <Box display='flex' gap={1} marginTop='1.25rem'>
            <Typography variant='subtitle1' fontWeight={500} marginBottom='0.5rem'>
              Rating Stars
            </Typography>
            <Rating defaultValue={feedback.rate} precision={0.5} readOnly />
          </Box>
          <Box marginTop='1.25rem'>
            <Typography variant='subtitle1' fontWeight={500} marginBottom='0.5rem'>
              Feedback
            </Typography>
            <Typography variant='subtitle1' fontWeight={400} fontSize='14px'>
              {feedback.comment}
            </Typography>
          </Box>
        </DialogContent>
      </>
    </Dialog>
  )
}

export default FeedbackDetailDialog

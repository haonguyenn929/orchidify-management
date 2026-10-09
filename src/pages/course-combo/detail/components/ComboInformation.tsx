import { Box, Divider, Paper, Rating, Typography } from '@mui/material'
import { CourseComboDetailResponseDto } from '~/data/courseCombo.dto'

interface FieldProps {
  label: string
  content?: string
  rate?: number
}

const Field: React.FC<FieldProps> = ({ label, content, rate }) => (
  <Box display='flex'>
    <Typography variant='subtitle1' fontWeight={600} width={'180px'}>
      {label}
    </Typography>
    {content && (
      <Typography variant='subtitle1' fontWeight={400}>
        {content}
      </Typography>
    )}
    {rate && (
      <Box display='flex'>
        <Rating defaultValue={rate} precision={0.5} readOnly />
        <Typography variant='body1' marginLeft='0.5rem'>
          {rate}
        </Typography>
      </Box>
    )}
  </Box>
)

interface ComboInformationProps {
  comboDetail: CourseComboDetailResponseDto
}

const ComboInformation = ({ comboDetail }: ComboInformationProps) => {
  return (
    <Paper sx={{ width: '100%', marginTop: '1.25rem', padding: '1.5rem' }}>
      <Box display='flex' alignItems='center' marginBottom='1.25rem'>
        <Typography variant='h2' sx={{ fontSize: '1.5rem', fontWeight: 700, paddingRight: '0.75rem' }}>
          Course Combo Information
        </Typography>
        <Divider sx={{ flexGrow: 1 }} />
      </Box>
      <Box display='flex' gap='1rem' marginBottom='1.25rem'>
        <Box display='flex' flexDirection='column' gap={1} flexGrow='1'>
          <Field label='Combo Name' content={comboDetail.title} />
          <Field label='Instructors' content={comboDetail.instructor.name} />
          <Field label='Discount' content={`${comboDetail.discount}%`} />
        </Box>
      </Box>
      <Box>
        <Typography variant='subtitle1' fontWeight={600} marginBottom='0.5rem'>
          Description Course Combos
        </Typography>
        <Typography variant='subtitle1' fontWeight={400}>
          {comboDetail.description}
        </Typography>
      </Box>
    </Paper>
  )
}

export default ComboInformation

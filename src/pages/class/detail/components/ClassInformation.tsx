import { Paper, Box, Typography, Divider, Grid } from '@mui/material'
import ClassStatusTag from '~/components/tag/ClassStatusTag'
import { ClassDetailResponseDto } from '~/data/class.dto'
import { ClassStatus } from '~/global/app-status'
import { SlotNumber, Weekday } from '~/global/constants'

interface FieldProps {
  label: string
  content?: string
  weekDays?: Array<Weekday>
  slotNumbers?: Array<SlotNumber>
  statusTag?: ClassStatus
}

const Field: React.FC<FieldProps> = ({ label, content, weekDays = [], slotNumbers = [], statusTag }) => {
  const weekDayText = weekDays.length > 0 && {
    [Weekday.MONDAY]: 'Monday',
    [Weekday.TUESDAY]: 'Tuesday',
    [Weekday.WEDNESDAY]: 'Wednesday',
    [Weekday.THURSDAY]: 'Thursday',
    [Weekday.FRIDAY]: 'Friday',
    [Weekday.SATURDAY]: 'Saturday',
    [Weekday.SUNDAY]: 'Sunday'
  }

  const slotNumberText = slotNumbers.length > 0 && {
    [SlotNumber.ONE]: 'Slot 1',
    [SlotNumber.TWO]: 'Slot 2',
    [SlotNumber.THREE]: 'Slot 3',
    [SlotNumber.FOUR]: 'Slot 4'
  }

  return (
    <Box display='flex' marginY='0.25rem'>
      <Typography variant='subtitle1' fontWeight={600} width={'180px'}>
        {label}
      </Typography>
      {content && (
        <Typography variant='subtitle1' fontWeight={400}>
          {content}
        </Typography>
      )}
      {weekDays.length > 0 && (
        <Typography variant='subtitle1' fontWeight={400}>
          {weekDays.map((day) => weekDayText && weekDayText[day as keyof typeof weekDayText]).join(', ')}
        </Typography>
      )}
      {slotNumbers.length > 0 && (
        <Typography variant='subtitle1' fontWeight={400}>
          {slotNumbers.map((day) => slotNumberText && slotNumberText[day as keyof typeof slotNumberText]).join(', ')}
        </Typography>
      )}
      {statusTag && <ClassStatusTag type={statusTag} />}
    </Box>
  )
}

interface ClassInformationProps {
  classDetail: ClassDetailResponseDto
}

const ClassInformation = ({ classDetail }: ClassInformationProps) => {
  return (
    <Paper sx={{ width: '100%', marginTop: '1.25rem', padding: '1.5rem' }}>
      <Box display='flex' alignItems='center' marginBottom='1.25rem'>
        <Typography variant='h2' sx={{ fontSize: '1.5rem', fontWeight: 700, paddingRight: '0.75rem' }}>
          Class Information
        </Typography>
        <Divider sx={{ flexGrow: 1 }} />
      </Box>
      <Grid container>
        <Grid item xs={12}>
          <Field label='Class Code' content={classDetail.code} />
        </Grid>
        <Grid item xs={12}>
          <Field label='Number of Learners' content={`${classDetail.learnerQuantity}/${classDetail.learnerLimit}`} />
        </Grid>
        <Grid item xs={12}>
          <Field label='Status' statusTag={classDetail.status} />
        </Grid>
        <Grid item xs={12}>
          <Field label='Gardens' content={classDetail.garden.name} />
        </Grid>
        <Grid item xs={6}>
          <Field label='Start date' content={new Date(classDetail.startDate).toLocaleDateString('en-US')} />
        </Grid>
        <Grid item xs={6}>
          <Field label='Duration' content={`${classDetail.duration} weeks`} />
        </Grid>
        <Grid item xs={6}>
          <Field label='Days of week' weekDays={classDetail.weekdays} />
        </Grid>
        <Grid item xs={6}>
          <Field label='Slot' slotNumbers={classDetail.slotNumbers} />
        </Grid>
      </Grid>
    </Paper>
  )
}

export default ClassInformation

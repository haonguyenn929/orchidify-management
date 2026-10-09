import { Paper } from '@mui/material'
import CustomTabs from '~/components/tabs/CustomTabs'
import { SessionDto } from '~/data/course.dto'
import SessionTable from './resource/SessionTable'
import FeedbackTable from './feedback/FeedbackTable'

interface CourseDetailResourceAndFeedbackProps {
  sessions: SessionDto[]
  courseId: string
}

const CourseDetailResourceAndFeedback = ({ sessions, courseId }: CourseDetailResourceAndFeedbackProps) => {
  return (
    <Paper sx={{ width: '100%', marginTop: '1.25rem', padding: '1.5rem' }}>
      <CustomTabs
        name='courseDetail'
        items={[
          { label: 'SESSIONS', content: <SessionTable courseId={courseId} sessions={sessions} /> },
          { label: 'FEEDBACK', content: <FeedbackTable courseId={courseId} /> }
        ]}
      />
      '
    </Paper>
  )
}

export default CourseDetailResourceAndFeedback

import { Paper } from '@mui/material'
import CustomTabs from '~/components/tabs/CustomTabs'
import { SessionDto } from '~/data/course.dto'
import SessionTable from './sessions/SessionTable'
import LearnerTable from './learners/LearnerTable'
import { ClassLearnerDto } from '~/data/class.dto'
import FeedbackTable from './feedback/FeedbackTable'

interface CourseDetailResourceAndFeedbackProps {
  classId: string
  sessions: SessionDto[]
  learners: ClassLearnerDto[]
}

const SessionLearnerFeedbackList = ({ classId, sessions, learners }: CourseDetailResourceAndFeedbackProps) => {
  return (
    <Paper sx={{ width: '100%', marginTop: '1.25rem', padding: '1.5rem' }}>
      <CustomTabs
        name='classDetail'
        items={[
          { label: 'SESSIONS', content: <SessionTable classId={classId} sessions={sessions} /> },
          { label: 'LEARNERS', content: <LearnerTable learners={learners} /> },
          { label: 'FEEDBACK', content: <FeedbackTable classId={classId} /> }
        ]}
      />
    </Paper>
  )
}

export default SessionLearnerFeedbackList

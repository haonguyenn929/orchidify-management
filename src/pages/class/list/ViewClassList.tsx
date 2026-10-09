import PageHeader from '~/components/header/PageHeader'
import CustomTabs from '~/components/tabs/CustomTabs'
import ClassTable from './components/ClassTable'
import { ClassStatus } from '~/global/app-status'

export default function ViewClassList() {
  return (
    <>
      <PageHeader title='Classes' />
      <CustomTabs
        name='courseList'
        items={[
          { label: 'Published', content: <ClassTable statusFilter={ClassStatus.PUBLISHED} /> },
          { label: 'In Progress', content: <ClassTable statusFilter={ClassStatus.IN_PROGRESS} /> },
          { label: 'Completed', content: <ClassTable statusFilter={ClassStatus.COMPLETED} /> },
          { label: 'All', content: <ClassTable /> }
        ]}
      />
    </>
  )
}

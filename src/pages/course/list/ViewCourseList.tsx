import PageHeader from '~/components/header/PageHeader'
import CourseTable from './components/CourseTable'

const ViewCourseList = () => {
  return (
    <>
      <PageHeader title='Courses' />
      <CourseTable />
    </>
  )
}

export default ViewCourseList

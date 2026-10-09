import { Box } from '@mui/material'
import PageHeader from '~/components/header/PageHeader'
import { protectedRoute } from '~/routes/routes'

const CourseDetailHeader = () => {
  const breadcrumbsItems = [protectedRoute.courseList, protectedRoute.courseDetail]

  return (
    <Box display='flex' justifyContent='space-between' alignItems='center'>
      <PageHeader title='Course Details' breadcrumbsItems={breadcrumbsItems} />
    </Box>
  )
}

export default CourseDetailHeader

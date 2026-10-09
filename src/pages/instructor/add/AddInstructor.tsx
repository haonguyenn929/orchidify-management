import { Box, Typography } from '@mui/material'
import Breadcrumbs from '~/components/breadscrumbs/Breadscrumbs'
import { protectedRoute } from '~/routes/routes'
import AddInstructorForm from './components/AddInstructorForm'

const AddInstructor = () => {
  const items = [protectedRoute.instructorList, protectedRoute.addInstructor]
  return (
    <Box sx={{ marginBottom: '20px' }}>
      <Typography variant='h1' sx={{ fontSize: '2rem', paddingBottom: '8px', fontWeight: 700 }}>
        Add Instructor
      </Typography>
      <Breadcrumbs items={items} />
      <AddInstructorForm />
    </Box>
  )
}

export default AddInstructor

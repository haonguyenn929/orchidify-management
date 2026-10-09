import { Box, Typography } from '@mui/material'
import Breadcrumbs from '~/components/breadscrumbs/Breadscrumbs'
import { protectedRoute } from '~/routes/routes'
import AddStaffForm from './components/AddStaffForm'

export default function AddStaff() {
  const items = [protectedRoute.staffList, protectedRoute.addStaff]
  return (
    <Box sx={{ marginBottom: '20px' }}>
      <Typography variant='h1' sx={{ fontSize: '2rem', paddingBottom: '8px', fontWeight: 700 }}>
        Add Staff
      </Typography>
      <Breadcrumbs items={items} />
      <AddStaffForm />
    </Box>
  )
}

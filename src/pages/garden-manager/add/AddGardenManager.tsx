import { Box, Typography } from '@mui/material'
import Breadcrumbs from '~/components/breadscrumbs/Breadscrumbs'
import { protectedRoute } from '~/routes/routes'
import AddGardenManagerForm from './components/AddGardenManagerForm'

export default function AddGardenManager() {
  const items = [protectedRoute.gardenManagerList, protectedRoute.addGardenManager]
  return (
    <Box sx={{ marginBottom: '20px' }}>
      <Typography variant='h1' sx={{ fontSize: '2rem', paddingBottom: '8px', fontWeight: 700 }}>
        Add Garden Manager
      </Typography>
      <Breadcrumbs items={items} />
      <AddGardenManagerForm />
    </Box>
  )
}

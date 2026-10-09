import { Box, Typography } from '@mui/material'
import Breadcrumbs from '~/components/breadscrumbs/Breadscrumbs'
import { protectedRoute } from '~/routes/routes'
import AddGardenForm from './components/AddGardenForm'

export default function AddGardenManager() {
  const items = [protectedRoute.gardenList, protectedRoute.addGarden]
  return (
    <>
      <Box sx={{ marginBottom: '40px' }}>
        <Typography variant='h1' sx={{ fontSize: '2rem', paddingBottom: '8px', fontWeight: 700 }}>
          Add Garden
        </Typography>
        <Breadcrumbs items={items} />
        <AddGardenForm />
      </Box>
    </>
  )
}

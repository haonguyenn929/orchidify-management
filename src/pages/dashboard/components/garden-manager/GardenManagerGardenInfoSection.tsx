import { Box, Divider, Grid, MenuItem, Paper, Select, Typography } from '@mui/material'
import GardenListTable from './GardenListTable'
import { Link } from 'react-router-dom'
import { protectedRoute } from '~/routes/routes'
import StatisticCard from '~/components/card/StatisticCard'
import { LocalFlorist } from '@mui/icons-material'
import { notifyError } from '~/utils/toastify'
import { ErrorResponseDto } from '~/data/error.dto'
import { Garden } from '~/data/garden.dto'
import { ListResponseDto } from '~/data/common.dto'
import { useGardenApi } from '~/hooks/api/useGardenApi'
import { useEffect, useState } from 'react'
import { GardenStatus } from '~/global/app-status'
import InactiveGardenTimesheetTable from './InactiveGardenTimesheetTable'

const GardenManagerGardenInfoSection = () => {
  const { getAllGardens } = useGardenApi()
  const [data, setData] = useState<ListResponseDto<Garden>>({
    docs: [],
    totalDocs: 0,
    offset: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null
  })
  const [selectedGarden, setSelectedGarden] = useState<string | null>('')
  const [error, setError] = useState<ErrorResponseDto | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const { data: gardens, error: apiError } = await getAllGardens(
        1,
        99,
        [],
        [
          {
            field: 'status',
            value: GardenStatus.ACTIVE
          }
        ]
      )
      if (gardens) {
        setData(gardens)
        setSelectedGarden(gardens.docs[0]?._id || '')
      } else {
        setData({
          docs: [],
          totalDocs: 0,
          offset: 0,
          limit: 0,
          totalPages: 0,
          page: 0,
          pagingCounter: 0,
          hasPrevPage: false,
          hasNextPage: false,
          prevPage: null,
          nextPage: null
        })
      }
      setError(apiError)
      setIsLoading(false)
    })()
  }, [getAllGardens])

  if (error) {
    notifyError(error.message)
  }

  return (
    <Grid container spacing={2.5} marginBottom={2.5}>
      <Grid item xs={12} md={6}>
        <Grid container spacing={2.5} direction={'column'}>
          <Grid item xs={12} md={6}>
            <StatisticCard
              title='Gardens'
              value={data.totalDocs}
              Icon={LocalFlorist}
              bgcolor='#F88C3D66'
              borderColor='#FF9242'
              iconBgcolor='#FF9242'
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={2}>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}
              >
                <Typography variant='h6'>Garden List</Typography>
                <Typography
                  variant='caption'
                  sx={{ color: 'inherit' }}
                  component={Link}
                  to={protectedRoute.gardenList.path}
                >
                  View all
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ padding: 3, overflow: 'auto' }}>
                <GardenListTable gardenData={data.docs} isLoading={isLoading} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper elevation={2} sx={{ height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
            <Typography variant='h6'>Day Off</Typography>
            <Select
              size='small'
              displayEmpty
              value={selectedGarden}
              onChange={(e) => setSelectedGarden(e.target.value)}
            >
              <MenuItem value=''>Select Garden</MenuItem>
              {data.docs.map((item) => (
                <MenuItem key={item.name} value={item._id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Divider />
          <Box sx={{ padding: 3 }}>
            <InactiveGardenTimesheetTable gardenId={selectedGarden} />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default GardenManagerGardenInfoSection

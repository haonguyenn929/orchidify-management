import { Box, Divider, Grid, Paper, Typography } from '@mui/material'
import { DayPicker } from 'react-day-picker'

import { format } from 'date-fns'
import 'react-day-picker/style.css'
import GardenTimesheetTable from './GardenTimesheetTable'

const GardenManagerTimesheetSection = () => {
  return (
    <Grid item xs={12}>
      <Paper elevation={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
          <Typography variant='h6'>Schedule</Typography>
        </Box>
        <Divider />
        <Box sx={{ padding: 3, gap: 1, display: 'flex' }}>
          <DayPicker
            formatters={{
              formatCaption: (date, options) => format(date, 'LLL, yyyy', options),
              formatWeekdayName: (day, options) => format(day, 'eeeee', options)
            }}
            style={{
              minWidth: '308px',
              aspectRatio: '1/1'
            }}
            timeZone='+07:00'
            hideNavigation
          />
          <Divider orientation='vertical' variant='middle' flexItem />
          <Box sx={{ width: '100%', overflow: 'auto' }}>
            <GardenTimesheetTable />
          </Box>
        </Box>
      </Paper>
    </Grid>
  )
}

export default GardenManagerTimesheetSection

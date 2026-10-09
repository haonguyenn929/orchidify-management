import { Grid, Typography } from '@mui/material'
import ClassRateChart from './components/ClassRateChart'
import ClassStatusChart from './components/ClassStatusChart'
import CourseDataChart from './components/CourseDataChart'
import CourseRateChart from './components/CourseRateChart'
import InstructorChart from './components/InstructorChart'
import InstructorStatusChart from './components/InstructorStatusChart'
import LearnerChart from './components/LearnerChart'
import LearnerStatusChart from './components/LearnerStatusChart'
import RevenueChart from '../dashboard/components/admin/RevenueChart'
import TransactionChart from '../dashboard/components/admin/TransactionChart'

const Statistic = () => {
  return (
    <>
      <Typography variant='h1' fontSize='2.125rem' fontWeight='700' marginBottom='1.25rem'>
        Statistics
      </Typography>
      <Grid container columnSpacing='1.875rem' rowSpacing='1.25rem'>
        <Grid item xs={12} lg={6}>
          <CourseDataChart />
        </Grid>
        <Grid item xs={12} lg={6}>
          <CourseRateChart />
        </Grid>
        <Grid item xs={12} lg={6}>
          <ClassStatusChart />
        </Grid>
        <Grid item xs={12} lg={6}>
          <ClassRateChart />
        </Grid>
        <Grid item xs={12} lg={6}>
          <InstructorChart />
        </Grid>
        <Grid item xs={12} lg={6}>
          <InstructorStatusChart />
        </Grid>
        <Grid item xs={12} lg={6}>
          <LearnerChart />
        </Grid>
        <Grid item xs={12} lg={6}>
          <LearnerStatusChart />
        </Grid>
        <Grid item xs={12} lg={6}>
          <RevenueChart />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TransactionChart />
        </Grid>
      </Grid>
    </>
  )
}

export default Statistic

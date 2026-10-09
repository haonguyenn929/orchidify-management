import { Typography } from '@mui/material'
import useAuth from '~/auth/useAuth'
import { UserRole } from '~/global/constants'
import StaffStatisticSection from './components/staff/StaffStatisticSection'
import StaffChartSection from './components/staff/StaffChartSection'
import GardenManagerGardenInfoSection from './components/garden-manager/GardenManagerGardenInfoSection'
import GardenManagerTimesheetSection from './components/garden-manager/GardenManagerTimesheetSection'
import AdminStatisticSection from './components/admin/AdminStatisticSection'
import AdminChartSection from './components/admin/AdminChartSection'

export default function Dashboard() {
  const { userTokenPayload } = useAuth()

  if (!userTokenPayload) return null

  switch (userTokenPayload.role) {
    case UserRole.ADMIN:
      return <AdminDashboard username={userTokenPayload.name || ''} />
    case UserRole.STAFF:
      return <StaffDashboard username={userTokenPayload.name || ''} />
    case UserRole.GARDEN_MANAGER:
      return <GardenManagerDashboard username={userTokenPayload.name || ''} />
    default:
      return null
  }
}

interface DashboardProps {
  username: string
}

const AdminDashboard = ({ username }: DashboardProps) => {
  return (
    <>
      <Typography variant='h1' fontSize='2.125rem' fontWeight='700' marginBottom='1.25rem'>
        Welcome, {username}
      </Typography>
      <AdminStatisticSection />
      <AdminChartSection />
    </>
  )
}

const StaffDashboard = ({ username }: DashboardProps) => {
  return (
    <>
      <Typography variant='h1' fontSize='2.125rem' fontWeight='700' marginBottom='1.25rem'>
        Welcome, {username}
      </Typography>
      <StaffStatisticSection />
      <StaffChartSection />
    </>
  )
}

const GardenManagerDashboard = ({ username }: DashboardProps) => {
  return (
    <>
      <Typography variant='h1' fontSize='2.125rem' fontWeight='700' marginBottom='1.25rem'>
        Welcome, {username}
      </Typography>
      <GardenManagerGardenInfoSection />
      <GardenManagerTimesheetSection />
    </>
  )
}

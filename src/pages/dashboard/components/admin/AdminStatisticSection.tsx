import { CoPresentOutlined, MenuBookSharp, SchoolOutlined, TrendingUp } from '@mui/icons-material'
import { Grid } from '@mui/material'
import { useEffect, useState } from 'react'
import StatisticCard from '~/components/card/StatisticCard'
import { ListResponseDto } from '~/data/common.dto'
import { ErrorResponseDto } from '~/data/error.dto'
import { ReportTotalSummaryListItemResponseDto } from '~/data/report.dto'
import { ReportTotalSummaryType } from '~/global/constants'
import { useReportAdminApi } from '~/hooks/api/useReportAdminApi'
import { formatCurrencyDashboard } from '~/utils/format'
import { notifyError } from '~/utils/toastify'

const AdminStatisticSection = () => {
  const { getReportTotalSummary } = useReportAdminApi()
  const [data, setData] = useState<ListResponseDto<ReportTotalSummaryListItemResponseDto>>({
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
  const [error, setError] = useState<ErrorResponseDto | null>(null)

  useEffect(() => {
    ;(async () => {
      const { data: reportData, error: apiError } = await getReportTotalSummary()
      if (reportData) {
        setData(reportData)
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
    })()
  }, [getReportTotalSummary])

  if (error) {
    notifyError(error.message)
  }

  return (
    <Grid container spacing='1.875rem' marginBottom='1.25rem'>
      <Grid item xs={6} lg={3}>
        <StatisticCard
          title='Courses'
          value={
            (data.docs.find((item) => item.type === ReportTotalSummaryType.CourseSum)?.data.quantity as number) || 0
          }
          Icon={MenuBookSharp}
          bgcolor='#F88C3D66'
          borderColor='#FF9242'
          iconBgcolor='#FF9242'
        />
      </Grid>
      <Grid item xs={6} lg={3}>
        <StatisticCard
          title='Learners'
          value={
            (data.docs.find((item) => item.type === ReportTotalSummaryType.LearnerSum)?.data.quantity as number) || 0
          }
          Icon={SchoolOutlined}
          bgcolor='#5BADD066'
          borderColor='#5BADD0'
          iconBgcolor='#5BADD0'
        />
      </Grid>
      <Grid item xs={6} lg={3}>
        <StatisticCard
          title='Instructors'
          value={
            (data.docs.find((item) => item.type === ReportTotalSummaryType.InstructorSum)?.data.quantity as number) || 0
          }
          Icon={CoPresentOutlined}
          bgcolor='#FFCF2266'
          borderColor='#FFCF22'
          iconBgcolor='#FFCF22'
        />
      </Grid>
      <Grid item xs={6} lg={3}>
        <StatisticCard
          title='Revenue'
          value={formatCurrencyDashboard(
            Number(data.docs.find((item) => item.type === ReportTotalSummaryType.RevenueSum)?.data.total) || 0
          )}
          Icon={TrendingUp}
          bgcolor='#20C01766'
          borderColor='#20C017'
          iconBgcolor='#20C017'
        />
      </Grid>
    </Grid>
  )
}

export default AdminStatisticSection

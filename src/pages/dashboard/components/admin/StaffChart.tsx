import { Box, Paper, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import Chart from 'react-apexcharts'
import { Link } from 'react-router-dom'
import { ListResponseDto } from '~/data/common.dto'
import { ErrorResponseDto } from '~/data/error.dto'
import { ReportStaffByStatusListItemResponseDto } from '~/data/reportAdmin.dto'
import { UserStatus } from '~/global/app-status'
import { useReportAdminApi } from '~/hooks/api/useReportAdminApi'
import { protectedRoute } from '~/routes/routes'
import { notifyError } from '~/utils/toastify'

const StaffChart = () => {
  const { getReportStaffDataByStatus } = useReportAdminApi()
  const [chartData, setChartData] = useState<ListResponseDto<ReportStaffByStatusListItemResponseDto>>({
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
      const { data: reportData, error: apiError } = await getReportStaffDataByStatus()
      if (reportData) {
        setChartData(reportData)
      } else {
        setChartData({
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
  }, [getReportStaffDataByStatus])

  if (error) {
    notifyError(error.message)
  }

  return (
    <Paper>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        paddingX='1.5rem'
        paddingY='1rem'
        borderBottom='1px solid #0000001F'
      >
        <Typography fontSize='1.25rem' fontWeight='500'>
          Staff Report
        </Typography>
        <Typography
          variant='caption'
          component={Link}
          color='#000000DE'
          to={protectedRoute.staffList.path}
          sx={{ textDecoration: 'none' }}
        >
          View all
        </Typography>
      </Box>
      <ChartDisplay data={chartData.docs} />
    </Paper>
  )
}

export default StaffChart

interface ChartDisplayProps {
  data: ReportStaffByStatusListItemResponseDto[]
}

const ChartDisplay = ({ data }: ChartDisplayProps) => {
  const chartSeries: ApexCharts.ApexOptions['series'] = useMemo(() => {
    const series: ApexCharts.ApexOptions['series'] = [
      data.find((item) => item.status === UserStatus.ACTIVE)?.quantity || 0,
      data.find((item) => item.status === UserStatus.INACTIVE)?.quantity || 0
    ]

    return series
  }, [data])

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      toolbar: { show: false }
    },
    labels: ['Active', 'Inactive'],
    colors: ['#20C017', '#F66868'],
    legend: {
      position: 'bottom',
      fontSize: '12px',
      labels: {
        colors: '#333333'
      },
      markers: {
        size: 8,
        shape: 'circle'
      },
      itemMargin: {
        horizontal: 12
      },
      offsetY: -8
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total'
            }
          }
        }
      }
    }
  }

  return <Chart type='donut' options={chartOptions} series={chartSeries} height='321px' />
}

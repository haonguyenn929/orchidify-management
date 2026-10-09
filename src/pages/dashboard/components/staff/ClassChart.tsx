import { Box, Paper, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { protectedRoute } from '~/routes/routes'
import Chart from 'react-apexcharts'
import { ReportClassByStatusListItemResponseDto } from '~/data/report.dto'
import { useEffect, useMemo, useState } from 'react'
import { ClassStatus } from '~/global/app-status'
import { notifyError } from '~/utils/toastify'
import { ListResponseDto } from '~/data/common.dto'
import { useReportApi } from '~/hooks/api/useReportApi'
import { ErrorResponseDto } from '~/data/error.dto'

const ClassChart = () => {
  const { getReportClassByStatus } = useReportApi()
  const [chartData, setChartData] = useState<ListResponseDto<ReportClassByStatusListItemResponseDto>>({
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
      const { data: reportData, error: apiError } = await getReportClassByStatus()
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
  }, [getReportClassByStatus])

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
          Classes
        </Typography>
        <Typography
          variant='caption'
          component={Link}
          color='#000000DE'
          to={protectedRoute.classList.path}
          sx={{ textDecoration: 'none' }}
        >
          View all
        </Typography>
      </Box>
      <ChartDisplay data={chartData.docs} />
    </Paper>
  )
}

export default ClassChart

interface ChartDisplayProps {
  data: ReportClassByStatusListItemResponseDto[]
}

const ChartDisplay = ({ data }: ChartDisplayProps) => {
  const chartSeries: ApexCharts.ApexOptions['series'] = useMemo(() => {
    const series: ApexCharts.ApexOptions['series'] = [
      data.find((item) => item.status === ClassStatus.PUBLISHED)?.quantity || 0,
      data.find((item) => item.status === ClassStatus.IN_PROGRESS)?.quantity || 0,
      data.find((item) => item.status === ClassStatus.COMPLETED)?.quantity || 0,
      data.find((item) => item.status === ClassStatus.CANCELED)?.quantity || 0
    ]

    return series
  }, [data])

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      toolbar: { show: false }
    },
    labels: ['Published', 'In Progress', 'Completed', 'Canceled'],
    colors: ['#FFCF22', '#20C017', '#F66868', '#707070'],
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
    }
  }

  return <Chart type='pie' options={chartOptions} series={chartSeries} height='337px' />
}

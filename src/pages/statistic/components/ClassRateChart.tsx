import { Box, Paper, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import Chart from 'react-apexcharts'
import { ListResponseDto } from '~/data/common.dto'
import { ErrorResponseDto } from '~/data/error.dto'
import { ReportCourseByRateListItemResponseDto } from '~/data/reportAdmin.dto'
import { Rating } from '~/global/constants'
import { useStatisticApi } from '~/hooks/api/useStatisticApi'
import { notifyError } from '~/utils/toastify'

const ClassRateChart = () => {
  const { getReportClassByRate } = useStatisticApi()
  const [chartData, setChartData] = useState<ListResponseDto<ReportCourseByRateListItemResponseDto>>({
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
      const { data: reportData, error: apiError } = await getReportClassByRate()
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
  }, [getReportClassByRate])

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
          Class Feedback
        </Typography>
      </Box>
      <ChartDisplay data={chartData.docs} />
    </Paper>
  )
}

export default ClassRateChart

interface ChartDisplayProps {
  data: ReportCourseByRateListItemResponseDto[]
}

const ChartDisplay = ({ data }: ChartDisplayProps) => {
  const chartSeries: ApexCharts.ApexOptions['series'] = useMemo(() => {
    const series: ApexCharts.ApexOptions['series'] = [
      data.find((item) => item._id === Rating.ZERO)?.count || 0,
      data.find((item) => item._id === Rating.ONE)?.count || 0,
      data.find((item) => item._id === Rating.TWO)?.count || 0,
      data.find((item) => item._id === Rating.THREE)?.count || 0,
      data.find((item) => item._id === Rating.FOUR)?.count || 0
    ]

    return series
  }, [data])

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      toolbar: { show: false }
    },
    labels: ['<1', '1+', '2+', '3+', '4+'],
    colors: ['#D5F3F0', '#ABE7E2', '#82DCD3', '#58D0C5', '#2EC4B6'],
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

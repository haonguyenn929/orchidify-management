import { Box, MenuItem, Paper, Typography, Select } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { ListResponseDto } from '~/data/common.dto'
import { ErrorResponseDto } from '~/data/error.dto'
import { ReportRevenueByMonthListItemResponseDto } from '~/data/reportAdmin.dto'
import { useReportAdminApi } from '~/hooks/api/useReportAdminApi'
import { notifyError } from '~/utils/toastify'
import Chart from 'react-apexcharts'
import { formatCurrency } from '~/utils/format'

const RevenueChart = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2024)
  const { getReportRevenueDataByMonth } = useReportAdminApi()
  const [chartData, setChartData] = useState<ListResponseDto<ReportRevenueByMonthListItemResponseDto>>({
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
      const { data: reportData, error: apiError } = await getReportRevenueDataByMonth(selectedYear)
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
  }, [getReportRevenueDataByMonth, selectedYear])

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
          Revenue
        </Typography>
        <Select
          size='small'
          displayEmpty
          value={selectedYear}
          onChange={(e) => {
            if (typeof e.target.value === 'string') setSelectedYear(Number.parseInt(e.target.value))
            else setSelectedYear(e.target.value)
          }}
        >
          {[{ name: '2024', value: 2024 }].map((item) => (
            <MenuItem key={item.name} value={item.value}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <ChartDisplay data={chartData.docs} />
    </Paper>
  )
}

export default RevenueChart

interface ChartDisplayProps {
  data: ReportRevenueByMonthListItemResponseDto[]
}

const ChartDisplay = ({ data }: ChartDisplayProps) => {
  const chartSeries: ApexCharts.ApexOptions['series'] = useMemo(() => {
    const revenue: number[] = []

    const series: ApexCharts.ApexOptions['series'] = [{ name: 'Revenue', data: revenue }]

    data.forEach((month) => {
      revenue.push(month.revenue.total)
    })

    return series
  }, [data])

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      id: 'revenue-by-month',
      type: 'area',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      },
      parentHeightOffset: 0,
      animations: {
        enabled: true
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    yaxis: {
      max: Math.ceil(Math.max(...(data?.map((item) => item.revenue.total) || []), 1000000) / 1000000) * 1000000,
      min: 0,
      tickAmount: 5,
      labels: {
        formatter: (value: number) => {
          return formatCurrency(value)
        },
        style: {
          fontSize: '12px',
          colors: ['#304758']
        }
      }
    },
    markers: {
      size: 5
    },
    grid: {
      xaxis: {
        lines: {
          show: true
        }
      },
      strokeDashArray: 5
    },
    tooltip: {
      enabled: true,
      intersect: false,
      y: {
        formatter: (value: number) => {
          return formatCurrency(value)
        }
      }
    },
    colors: ['#2ec4b6']
  }

  return <Chart type='area' options={chartOptions} series={chartSeries} height='326px' />
}

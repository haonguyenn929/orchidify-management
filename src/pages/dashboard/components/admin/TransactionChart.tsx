import { Paper, Box, Typography, TextField } from '@mui/material'
import { useState, useEffect, useMemo } from 'react'
import { ErrorResponseDto } from '~/data/error.dto'
import { ReportTransactionByDateListItemResponseDto } from '~/data/reportAdmin.dto'
import { useReportAdminApi } from '~/hooks/api/useReportAdminApi'
import { notifyError } from '~/utils/toastify'
import Chart from 'react-apexcharts'
import dayjs from 'dayjs'
import { formatCurrency } from '~/utils/format'
import isoWeek from 'dayjs/plugin/isoWeek'

const fillWeekData = (data: ReportTransactionByDateListItemResponseDto[], selectedDate: string) => {
  // Determine the start and end of the week based on the selectedDate
  const startDate = dayjs(selectedDate).startOf('isoWeek') // Start of the week (Monday)
  const endDate = startDate.add(6, 'days') // End of the week (Sunday)

  // Generate all dates in the week
  const allDates = []
  for (let date = startDate; date.isBefore(endDate) || date.isSame(endDate); date = date.add(1, 'day')) {
    allDates.push(date.format('YYYY-MM-DD'))
  }

  // Create a map of the input data for quick lookup
  const dataMap = data.reduce((map: { [key: string]: ReportTransactionByDateListItemResponseDto }, item) => {
    map[item._id] = item
    return map
  }, {})

  // Fill in missing dates with default values
  return allDates.map((date) => {
    return (
      dataMap[date] || {
        _id: date,
        paymentAmount: 0,
        payoutAmount: 0,
        date: dayjs(date).toISOString()
      }
    )
  })
}

const TransactionChart = () => {
  const [selectedDate, setSelectedDate] = useState<string>(dayjs(new Date()).format('YYYY-MM-DD'))
  const { getReportTransactionDataByDate } = useReportAdminApi()
  const [chartData, setChartData] = useState<ReportTransactionByDateListItemResponseDto[]>([])
  const [error, setError] = useState<ErrorResponseDto | null>(null)

  useEffect(() => {
    ;(async () => {
      const { data: reportData, error: apiError } = await getReportTransactionDataByDate(selectedDate)
      if (reportData) {
        setChartData(fillWeekData(reportData, selectedDate)) // Pass selectedDate
      } else {
        setChartData(fillWeekData([], selectedDate)) // Ensure missing data is handled
      }
      setError(apiError)
    })()
  }, [getReportTransactionDataByDate, selectedDate])

  if (error) {
    notifyError(error.message)
  }

  dayjs.extend(isoWeek)

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
          Transactions
        </Typography>
        <TextField
          id='weekSelect'
          type='week'
          size='small'
          inputProps={{
            min: dayjs(new Date()).format('YYYY-[W]') + '01',
            max: dayjs(new Date()).format('YYYY-[W]') + dayjs(new Date()).isoWeek()
          }}
          value={dayjs(selectedDate).format('YYYY-[W]') + dayjs(selectedDate).isoWeek().toString().padStart(2, '0')}
          onChange={(e) => {
            const [year, week] = e.target.value.split('-W')
            setSelectedDate(
              dayjs().year(Number.parseInt(year)).isoWeek(parseInt(week)).startOf('isoWeek').format('YYYY-MM-DD')
            )
          }}
        />
      </Box>
      <ChartDisplay data={chartData} />
    </Paper>
  )
}

export default TransactionChart

interface ChartDisplayProps {
  data: ReportTransactionByDateListItemResponseDto[]
}

const ChartDisplay = ({ data }: ChartDisplayProps) => {
  const chartSeries: ApexCharts.ApexOptions['series'] = useMemo(() => {
    const payoutAmount: number[] = []
    const paymentAmount: number[] = []

    const series: ApexCharts.ApexOptions['series'] = [
      { name: 'Top Up', color: '#2DCE89', data: paymentAmount },
      { name: 'Deduct', color: '#F56767', data: payoutAmount }
    ]

    data.forEach((date) => {
      payoutAmount.push(-date.payoutAmount)
      paymentAmount.push(date.paymentAmount)
    })

    return series
  }, [data])

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      stacked: true,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#333333'],
        fontSize: '0.75rem',
        fontWeight: 400
      },
      formatter: (value: number) => {
        return formatCurrency(value)
      },
      offsetY: -15
    },
    grid: {
      borderColor: '#CCCCCC',
      position: 'back',
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    xaxis: {
      categories: [...data.map((date) => dayjs(date.date).format('D/MM'))],
      labels: {
        style: {
          colors: '#333333',
          fontSize: '0.75rem',
          fontWeight: 400
        }
      }
    },
    yaxis: {
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
    legend: {
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
      }
    },
    tooltip: {
      enabled: true,
      intersect: false,
      hideEmptySeries: false,
      shared: true
    }
  }

  return <Chart type='bar' options={chartOptions} series={chartSeries} height='312px' />
}

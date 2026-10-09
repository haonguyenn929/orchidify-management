import { Box, Button } from '@mui/material'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isoWeek from 'dayjs/plugin/isoWeek'
import PageHeader from '~/components/header/PageHeader'
import { ClassStatus } from '~/global/app-status'
import { Weekday } from '~/global/constants'
import { protectedRoute } from '~/routes/routes'
import { useMemo } from 'react'

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(isoWeek)

const calculateEndDate = (startDate: string, duration: number, weekdays: Weekday[]) => {
  const isoWeekday = {
    [Weekday.MONDAY]: 1,
    [Weekday.TUESDAY]: 2,
    [Weekday.WEDNESDAY]: 3,
    [Weekday.THURSDAY]: 4,
    [Weekday.FRIDAY]: 5,
    [Weekday.SATURDAY]: 6,
    [Weekday.SUNDAY]: 7
  }
  const startOfDate = dayjs(startDate).startOf('date')
  const endOfDate = startOfDate.add(duration, 'week').startOf('date')

  const classDates: dayjs.Dayjs[] = []
  let currentDate = startOfDate.clone()
  while (currentDate.isSameOrBefore(endOfDate)) {
    weekdays.forEach((weekday) => {
      const classDate = currentDate.isoWeekday(isoWeekday[weekday])
      if (classDate.isSameOrAfter(startOfDate) && classDate.isBefore(endOfDate)) {
        classDates.push(classDate)
      }
    })

    currentDate = currentDate.add(1, 'week')
  }

  return classDates[classDates.length - 1]
}

interface HeaderProps {
  classStatus: ClassStatus
  startDate: string
  duration: number
  weekdays: Weekday[]
  onCompleteButtonClick: () => void
  onCancelButtonClick: () => void
}

const Header = ({
  classStatus,
  startDate,
  duration,
  weekdays,
  onCompleteButtonClick,
  onCancelButtonClick
}: HeaderProps) => {
  const breadcrumbsItems = [protectedRoute.classList, protectedRoute.classDetail]

  const endDate = useMemo(() => calculateEndDate(startDate, duration, weekdays), [duration, startDate, weekdays])

  return (
    <Box display='flex' justifyContent='space-between' alignItems='center'>
      <PageHeader title='Class Details' breadcrumbsItems={breadcrumbsItems} />
      <Box display='flex' justifyContent='space-between' gap='1.5rem'>
        {classStatus === ClassStatus.IN_PROGRESS && dayjs().startOf('date') > endDate ? (
          <Button color='secondary' onClick={onCompleteButtonClick}>
            End
          </Button>
        ) : null}
        {classStatus === ClassStatus.PUBLISHED || classStatus === ClassStatus.IN_PROGRESS ? (
          <Button color='error' onClick={onCancelButtonClick}>
            Cancel
          </Button>
        ) : null}
      </Box>
    </Box>
  )
}

export default Header

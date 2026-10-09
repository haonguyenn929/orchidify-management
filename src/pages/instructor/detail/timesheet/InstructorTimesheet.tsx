import { CalendarType } from '~/global/constants'
import InstructorCalendar, { CalendarEvent } from './components/InstructorCalendar'
import { useState } from 'react'
import { ErrorResponseDto } from '~/data/error.dto'
import { notifyError } from '~/utils/toastify'
import useGardenTimesheetApi from '~/hooks/api/useGardenTimesheetApi'
import { Navigate, useParams } from 'react-router-dom'
import Header from './components/Header'
import { protectedRoute } from '~/routes/routes'
import { APP_MESSAGE } from '~/global/app-message'

const mapViewTypeToApi = (viewType: string) => {
  switch (viewType) {
    case 'dayGridMonth':
      return CalendarType.MONTH
    case 'timeGridWeek':
      return CalendarType.WEEK
    default:
      return CalendarType.MONTH
  }
}

const InstructorTimesheet = () => {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  const [error, setError] = useState<ErrorResponseDto | null>(null)
  const params = useParams()
  const instructorId = params.id

  const { getInstructorTimesheet } = useGardenTimesheetApi()

  if (!instructorId) {
    notifyError(APP_MESSAGE.LOAD_DATA_FAILED('instructor schedule information'))
    return <Navigate to={protectedRoute.instructorList.path} replace />
  }

  if (error) {
    notifyError(error.message)
  }

  const handleDatesChange = async (viewType: string, startDate: string) => {
    if (instructorId) {
      const apiViewType = mapViewTypeToApi(viewType)
      const { data: instructorTimesheet, error: apiError } = await getInstructorTimesheet(
        instructorId,
        startDate,
        apiViewType
      )

      if (instructorTimesheet) {
        const transformedEventData: CalendarEvent[] = instructorTimesheet.map<CalendarEvent>((slot) => ({
          start: slot.start,
          end: slot.end,
          title: slot.metadata ? `${slot.metadata.code} - ${slot.metadata.title}` : 'Classes',
          display: 'block',
          backgroundColor: '#0ea5e919'
        }))
        setCalendarEvents(transformedEventData)
      }

      setError(apiError)
    }
  }

  return (
    <>
      <Header instructorId={instructorId} />
      <InstructorCalendar events={calendarEvents} onDatesChange={handleDatesChange} />
    </>
  )
}

export default InstructorTimesheet

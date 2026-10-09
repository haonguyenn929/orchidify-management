import { CalendarType } from '~/global/constants'
import GardenCalendar, { CalendarEvent } from './components/GardenCalendar'
import useGardenTimesheetApi from '~/hooks/api/useGardenTimesheetApi'
import { useGardenApi } from '~/hooks/api/useGardenApi'
import { lazy, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ErrorResponseDto } from '~/data/error.dto'
import { GardenTimesheetItemResponseDto } from '~/data/gardenTimesheet.dto'
import { GardenTimesheetStatus } from '~/global/app-status'
import { APP_MESSAGE } from '~/global/app-message'
import { protectedRoute } from '~/routes/routes'
import { notifyError } from '~/utils/toastify'
import { Garden } from '~/data/garden.dto'
import Loading from '~/components/loading/Loading'
import GardenInformation from './components/GardenInformation'
import Header from './components/Header'
import { Box, Typography } from '@mui/material'
const ActivateDialog = lazy(() => import('./components/ActivateDialog'))
const DeactivateDialog = lazy(() => import('./components/DeactivateDialog'))

const transformGardenTimesheetData = (data: GardenTimesheetItemResponseDto[]) => {
  const transformedGardenTimesheetData: CalendarEvent[] = []

  const gardenTimesheetMap = new Map<
    string,
    { [key: string]: GardenTimesheetItemResponseDto & { classQuantity: number } }
  >()
  data.forEach((slot) => {
    if (slot.status !== GardenTimesheetStatus.INACTIVE) {
      const date = new Date(slot.start).getDate().toString()
      const dateData = gardenTimesheetMap.get(date)
      if (dateData) {
        gardenTimesheetMap.set(date, {
          ...dateData,
          [slot.slotNumber!]: {
            start: slot.start,
            end: slot.end,
            status: slot.status,
            classQuantity: dateData[slot.slotNumber!] ? dateData[slot.slotNumber!].classQuantity + 1 : 1
          }
        })
      } else {
        gardenTimesheetMap.set(date, {
          [slot.slotNumber!]: {
            ...slot,
            classQuantity: 1
          }
        })
      }
    } else {
      transformedGardenTimesheetData.push({
        start: slot.start,
        end: slot.end,
        status: slot.status,
        allDay: true,
        display: 'background',
        backgroundColor: '#d0d0d0'
      })
    }
  })

  gardenTimesheetMap.forEach((value) => {
    transformedGardenTimesheetData.push(
      ...Object.keys(value).map((slotNumber) => ({
        start: value[slotNumber].start,
        end: value[slotNumber].end,
        status: value[slotNumber].status,
        title: `Slot ${slotNumber} (${value[slotNumber].classQuantity})`,
        display: 'block',
        hasEvent: true
      }))
    )
  })

  return transformedGardenTimesheetData
}

export default function UpdateGardenTimesheet() {
  const [gardenData, setGardenData] = useState<Garden | null>(null)
  const [calendarStartDate, setCalendarStartDate] = useState<string>(new Date().toISOString())
  const [eventData, setEventData] = useState<CalendarEvent[]>([])
  const [error, setError] = useState<ErrorResponseDto | null>(null)
  const [openActivateDialog, setOpenActivateDialog] = useState<boolean>(false)
  const [openDeactivateDialog, setOpenDeactivateDialog] = useState<boolean>(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const { getGardenById } = useGardenApi()
  const { getGardenTimesheet } = useGardenTimesheetApi()

  const params = useParams()
  const navigate = useNavigate()

  const gardenId = params.id

  useEffect(() => {
    if (gardenId) {
      ;(async () => {
        const { data: garden, error: apiError } = await getGardenById(gardenId)
        setGardenData(garden)
        setError(apiError)
      })()
    }
  }, [gardenId, getGardenById])

  if (!gardenId) {
    notifyError(APP_MESSAGE.LOAD_DATA_FAILED('garden schedule information'))
    navigate(protectedRoute.gardenList.path, { replace: true })
    return
  }

  if (error) {
    notifyError(error.message)
  }

  const handleDatesChange = async (_: unknown, startDate: string) => {
    setCalendarStartDate(startDate)
    const { data: gardenTimesheet, error: apiError } = await getGardenTimesheet(gardenId, startDate, CalendarType.MONTH)

    if (gardenTimesheet) {
      const transformedEventData = transformGardenTimesheetData(gardenTimesheet)
      setEventData(transformedEventData)
    }
    setError(apiError)
  }

  const handleReloadData = async () => {
    const { data: gardenTimesheet, error: apiError } = await getGardenTimesheet(
      gardenId,
      calendarStartDate,
      CalendarType.MONTH
    )

    if (gardenTimesheet) {
      const transformedEventData = transformGardenTimesheetData(gardenTimesheet)
      setEventData(transformedEventData)
    }
    setError(apiError)
  }

  const handleDateClick = ({ date }: { date: Date; view: { type: string } }) => {
    const today = new Date()
    const sevenDaysFromNow = new Date(today)
    sevenDaysFromNow.setDate(today.getDate() + 7)

    const event = eventData.find((event) => new Date(event.start).toDateString() === date.toDateString())

    if (!(date < sevenDaysFromNow || event?.hasEvent)) {
      if (event && event.status === GardenTimesheetStatus.INACTIVE) {
        setOpenActivateDialog(true)
      } else {
        setOpenDeactivateDialog(true)
      }
      setSelectedDate(date.toISOString())
    }
  }

  return gardenData && eventData ? (
    <>
      <Header gardenId={gardenId} />
      <GardenInformation garden={{ name: gardenData.name, address: gardenData.address }} />
      <Box height='1.25rem' marginBottom='0.5rem'>
        <Typography variant='caption'>
          Schedule can only be updated for days with no classes and must be at least 7 days from today
        </Typography>
      </Box>
      <GardenCalendar events={eventData} onDatesChange={handleDatesChange} onDateClick={handleDateClick} />
      <DeactivateDialog
        open={openDeactivateDialog}
        gardenId={gardenId}
        date={selectedDate ?? ''}
        handleClose={() => setOpenDeactivateDialog(false)}
        onSuccess={handleReloadData}
      />
      <ActivateDialog
        open={openActivateDialog}
        gardenId={gardenId}
        date={selectedDate ?? ''}
        handleClose={() => setOpenActivateDialog(false)}
        onSuccess={handleReloadData}
      />
    </>
  ) : (
    <Loading />
  )
}

import { Box, Divider, Grid, Paper, Typography } from '@mui/material'
import { lazy, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '~/components/loading/Loading'
import { ErrorResponseDto } from '~/data/error.dto'
import { GardenTimesheetItemResponseDto } from '~/data/gardenTimesheet.dto'
import { Garden } from '~/data/garden.dto'
import { APP_MESSAGE } from '~/global/app-message'
import { CalendarType, UserRole } from '~/global/constants'
import { useGardenApi } from '~/hooks/api/useGardenApi'
import useGardenTimesheetApi from '~/hooks/api/useGardenTimesheetApi'
import { protectedRoute } from '~/routes/routes'
import { notifyError } from '~/utils/toastify'
import GardenCalendar, { CalendarEvent } from './components/GardenCalendar'
import { GardenTimesheetStatus } from '~/global/app-status'
const ClassToolkitRequirementsDialog = lazy(() => import('./components/ClassToolkitRequirementsDialog'))
import useAuth from '~/auth/useAuth'
import Header from './components/Header'

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

const GardenTimesheet = () => {
  const navigate = useNavigate()
  const { getGardenById } = useGardenApi()
  const { getGardenTimesheet } = useGardenTimesheetApi()
  const [classIdToolkitRequirements, setClassIdToolkitRequirements] = useState<{
    classId: string
    slotId: string
  } | null>(null)
  const params = useParams()
  const { userTokenPayload } = useAuth()
  const gardenId = params.id

  const [data, setData] = useState<Garden | null>(null)
  const [error, setError] = useState<ErrorResponseDto | null>(null)

  const [eventData, setEventData] = useState<CalendarEvent[]>([])

  useEffect(() => {
    if (gardenId) {
      ;(async () => {
        const { data: garden, error: apiError } = await getGardenById(gardenId)
        setData(garden)
        setError(apiError)
      })()
    }
  }, [gardenId, getGardenById])

  const handleDatesChange = async (viewType: string, startDate: string) => {
    if (gardenId) {
      const apiViewType = mapViewTypeToApi(viewType)
      const { data: gardenTimesheet, error: apiError } = await getGardenTimesheet(gardenId, startDate, apiViewType)
      if (gardenTimesheet) {
        let transformedEventData: CalendarEvent[] = []

        if (apiViewType === CalendarType.MONTH) {
          const gardenTimesheetMap = new Map<
            string,
            { [key: string]: GardenTimesheetItemResponseDto & { classQuantity: number } }
          >()
          gardenTimesheet.forEach((slot) => {
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
              transformedEventData.push({
                start: slot.start,
                end: slot.end,
                allDay: true,
                display: 'background',
                backgroundColor: '#d0d0d0'
              })
            }
          })

          gardenTimesheetMap.forEach((value) => {
            transformedEventData.push(
              ...Object.keys(value).map((slotNumber) => ({
                start: value[slotNumber].start,
                end: value[slotNumber].end,
                title: `Slot ${slotNumber} (${value[slotNumber].classQuantity})`,
                display: 'block',
                classId: value[slotNumber].classId,
                slotId: value[slotNumber]._id
              }))
            )
          })
        } else {
          transformedEventData = gardenTimesheet.map<CalendarEvent>((slot) =>
            slot.status !== GardenTimesheetStatus.INACTIVE
              ? {
                  start: slot.start,
                  end: slot.end,
                  title: slot.metadata ? `${slot.metadata.code} - ${slot.metadata.title}` : 'Classes',
                  display: 'block',
                  backgroundColor: '#0ea5e919',
                  classNames: userTokenPayload?.role === UserRole.GARDEN_MANAGER ? 'clickable-event' : undefined,
                  classId: slot.classId,
                  slotId: slot._id
                }
              : {
                  start: slot.start,
                  end: slot.end,
                  display: 'background',
                  backgroundColor: '#d0d0d0'
                }
          )
        }

        setEventData(transformedEventData)
      }
      setError(apiError)
    }
  }

  const handleEventClick = ({
    event,
    view
  }: {
    event: { extendedProps?: { classId?: string; slotId?: string } }
    view: { type: string }
  }) => {
    if (mapViewTypeToApi(view.type) === CalendarType.WEEK && userTokenPayload?.role === UserRole.GARDEN_MANAGER) {
      if (event.extendedProps?.classId && event.extendedProps?.slotId) {
        setClassIdToolkitRequirements({
          classId: event.extendedProps.classId,
          slotId: event.extendedProps.slotId
        })
      } else {
        setClassIdToolkitRequirements(null)
      }
    }
  }

  if (!gardenId) {
    notifyError(APP_MESSAGE.LOAD_DATA_FAILED('garden schedule information'))
    navigate(protectedRoute.gardenList.path, { replace: true })
    return
  }

  if (error) {
    notifyError(error.message)
  }

  return data ? (
    <>
      <Box sx={{ marginBottom: '40px' }}>
        <Header
          gardenId={gardenId}
          onUpdateButtonClick={() => navigate(protectedRoute.updateGardenTimesheet.path.replace(':id', gardenId))}
        />
        <Paper sx={{ width: '100%', marginY: '20px', padding: '24px' }}>
          <Box display='flex' alignItems='center' marginBottom='20px'>
            <Typography variant='h2' sx={{ fontSize: '1.5rem', fontWeight: 700, paddingRight: '10px' }}>
              Garden Details
            </Typography>
            <Divider sx={{ flexGrow: 1 }} />
          </Box>
          <Grid container mt={1} rowGap={'20px'}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex' }}>
                <Typography fontWeight={500} width={'180px'}>
                  Garden Name:
                </Typography>
                {data.name}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex' }}>
                <Typography fontWeight={500} width={'180px'}>
                  Address:
                </Typography>
                {data.address}
              </Box>
            </Grid>
          </Grid>
        </Paper>
        <GardenCalendar events={eventData} onDatesChange={handleDatesChange} onEventClick={handleEventClick} />
      </Box>
      <ClassToolkitRequirementsDialog
        open={!!classIdToolkitRequirements}
        onClose={() => setClassIdToolkitRequirements(null)}
        data={classIdToolkitRequirements || { classId: '', slotId: '' }}
      />
    </>
  ) : (
    <Loading />
  )
}

export default GardenTimesheet

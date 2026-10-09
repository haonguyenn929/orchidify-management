import Table from '~/components/table/Table'
import { Typography } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'
import { useEffect, useState } from 'react'
import { notifyError } from '~/utils/toastify'
import useGardenTimesheetApi from '~/hooks/api/useGardenTimesheetApi'
import { GardenTimesheetItemResponseDto } from '~/data/gardenTimesheet.dto'
import dayjs from 'dayjs'
import ClassToolkitRequirementsDialog from '~/pages/garden/garden-timesheet/components/ClassToolkitRequirementsDialog'

const GardenTimesheetTable = () => {
  const [slot, setSlot] = useState<GardenTimesheetItemResponseDto[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { getSlotList } = useGardenTimesheetApi()
  const [classIdToolkitRequirements, setClassIdToolkitRequirements] = useState<{
    classId: string
    slotId: string
  } | null>(null)

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const { data: slot, error: apiError } = await getSlotList(dayjs().format('YYYY-MM-DD'))
      if (slot) {
        setSlot(
          slot.sort((a, b) => {
            const slotNumberComparison = (a.slotNumber ?? 0) - (b.slotNumber ?? 0)
            if (slotNumberComparison !== 0) {
              return slotNumberComparison
            }
            const gardenNameA = a.garden?.name?.toLowerCase() ?? ''
            const gardenNameB = b.garden?.name?.toLowerCase() ?? ''
            return gardenNameA.localeCompare(gardenNameB)
          })
        )
      }
      if (apiError) {
        notifyError(apiError.message)
      }
      setIsLoading(false)
    })()
  }, [getSlotList])

  return (
    <>
      <Table
        title='Slot List'
        isLoading={isLoading}
        tableOptions={{
          layoutMode: 'grid',
          columns: timesheetColumns,
          data: slot || [],
          rowCount: slot.length,
          renderEmptyRowsFallback: () => (
            <Typography
              variant='body1'
              sx={{ color: 'rgba(0, 0, 0, 0.6)', fontStyle: 'italic', py: '2rem', textAlign: 'center', width: '100%' }}
            >
              No slots available
            </Typography>
          ),
          enableSorting: false,
          enableColumnFilters: false,
          enableHiding: false,
          enableColumnActions: false,
          enableStickyFooter: false,
          enablePagination: false,
          enableBottomToolbar: false,
          enableTopToolbar: false,
          enableTableHead: false,
          muiTablePaperProps: {
            sx: {
              boxShadow: 'none'
            }
          },
          muiTableBodyRowProps: ({ row }) => ({
            onClick: () => {
              if (row.original.classId) {
                setClassIdToolkitRequirements({ classId: row.original.classId, slotId: row.original._id })
              }
            },
            sx: {
              cursor: 'pointer'
            }
          })
        }}
      />
      <ClassToolkitRequirementsDialog
        open={!!classIdToolkitRequirements}
        onClose={() => setClassIdToolkitRequirements(null)}
        data={classIdToolkitRequirements || { classId: '', slotId: '' }}
      />
    </>
  )
}
export default GardenTimesheetTable

const timesheetColumns: MRT_ColumnDef<GardenTimesheetItemResponseDto>[] = [
  {
    accessorKey: 'garden.name',
    header: 'Gardens',
    size: 180,
    grow: false
  },
  {
    accessorKey: 'metadata.code',
    header: 'Class Code',
    size: 120,
    grow: false
  },
  {
    accessorKey: 'metadata.title',
    header: 'Course Name',
    size: 200,
    grow: true
  },
  {
    accessorKey: 'instructor.name',
    header: 'Instructor Name',
    size: 100,
    grow: true
  },
  {
    accessorKey: 'slotNumber',
    header: 'Slot',
    size: 75,
    grow: false,
    Cell: ({ cell }) => {
      const slotNumber = cell.getValue() as number
      return (
        <Typography
          variant='body2'
          fontWeight={'500'}
          color={slotNumber === 1 ? '#0084ff' : slotNumber === 2 ? '#00ba34' : slotNumber === 3 ? '#ff9f2d' : '#e92c2c'}
        >
          Slot {slotNumber}
        </Typography>
      )
    }
  },
  {
    accessorKey: 'start',
    header: 'Class time',
    size: 120,
    grow: false,
    Cell: ({ row }) =>
      `${new Date(row.original.start).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })} - ${new Date(row.original.end).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })}`,
    muiTableBodyCellProps: {
      align: 'right'
    }
  }
]

import Typography from '@mui/material/Typography'
import { MRT_ColumnDef } from 'material-react-table'
import RequestStatusTag from '~/components/tag/RequestStatusTag'
import { ClassRequestListItemResponseDto } from '~/data/classRequest.dto'
import { RequestStatus } from '~/global/app-status'
import { RequestType } from '~/global/constants'
import { formatRequestType } from '~/utils/format'

export const ClassRequestColumns: MRT_ColumnDef<ClassRequestListItemResponseDto>[] = [
  {
    accessorKey: 'type',
    header: 'Request Type',
    size: 140,
    grow: false,
    Cell: ({ row }) => {
      const type = row.original.type
      return formatRequestType(type)
    },
    filterVariant: 'multi-select',
    filterSelectOptions: [
      { label: 'Open Class', value: RequestType.PUBLISH_CLASS },
      { label: 'Cancel Class', value: RequestType.CANCEL_CLASS }
    ]
  },
  {
    accessorKey: 'metadata.code',
    header: 'Class Code',
    size: 150,
    Cell: ({ row: { original } }) => {
      return original.type === RequestType.PUBLISH_CLASS ? 'No data' : original.metadata.code
    },
    enableColumnFilter: false
  },
  {
    accessorFn: (row) => row.metadata.course,
    header: 'Course Code',
    size: 140,
    grow: false,
    Cell: ({ row: { original } }) => {
      return original.type === RequestType.PUBLISH_CLASS ? original.metadata.code : original.metadata.course!.code
    },
    enableColumnFilter: false
  },
  {
    accessorFn: (row) => row.metadata.title,
    header: 'Course Name',
    enableColumnFilter: false
  },
  {
    accessorKey: 'createdBy.name',
    header: 'Instructors',
    size: 160,
    grow: false,
    enableColumnFilter: false
  },
  {
    accessorKey: 'createdAt',
    header: 'Created at',
    size: 150,
    grow: false,
    enableColumnFilter: false,
    muiTableBodyCellProps: {
      style: {
        flexDirection: 'column',
        alignItems: 'flex-start'
      }
    },
    Cell: ({ cell }) => {
      const date = cell.getValue() as string
      return (
        <>
          <Typography variant='subtitle2' sx={{ fontWeight: 400 }}>
            {new Date(date).toLocaleTimeString('en-US')}
          </Typography>
          <Typography variant='subtitle2' sx={{ fontWeight: 400 }}>
            {new Date(date).toLocaleDateString('en-US')}
          </Typography>
        </>
      )
    }
  },
  {
    accessorKey: 'updatedAt',
    header: 'Last updated',
    size: 150,
    grow: false,
    enableColumnFilter: false,
    muiTableBodyCellProps: {
      style: {
        flexDirection: 'column',
        alignItems: 'flex-start'
      }
    },
    Cell: ({ cell }) => {
      const date = cell.getValue() as string
      return (
        <>
          <Typography variant='subtitle2' sx={{ fontWeight: 400 }}>
            {new Date(date).toLocaleTimeString('en-US')}
          </Typography>
          <Typography variant='subtitle2' sx={{ fontWeight: 400 }}>
            {new Date(date).toLocaleDateString('en-US')}
          </Typography>
        </>
      )
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 130,
    grow: false,
    Cell: ({ row }) => {
      const type = row.original.status
      return <RequestStatusTag type={type} />
    },
    filterVariant: 'multi-select',
    filterSelectOptions: [
      { label: 'Pending', value: RequestStatus.PENDING },
      { label: 'Accepted', value: RequestStatus.APPROVED },
      { label: 'Rejected', value: RequestStatus.REJECTED },
      { label: 'Canceled', value: RequestStatus.CANCELED },
      { label: 'Expired', value: RequestStatus.EXPIRED }
    ],
    enableSorting: false
  }
]

import { Check, Close } from '@mui/icons-material'
import Typography from '@mui/material/Typography'
import { MRT_ColumnDef } from 'material-react-table'
import RequestStatusTag from '~/components/tag/RequestStatusTag'
import { PayoutRequestListItemDto } from '~/data/payoutRequest.dto'
import { RequestStatus } from '~/global/app-status'
import { formatCurrency } from '~/utils/format'

export const PayoutRequestColumns: MRT_ColumnDef<PayoutRequestListItemDto>[] = [
  {
    accessorKey: 'createdBy.name',
    header: 'Instructor Name',
    size: 160,
    grow: false,
    enableColumnFilter: false
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    size: 150,
    grow: false,
    enableColumnFilter: false,
    Cell: ({ cell }) => {
      const price = cell.getValue() as number
      return formatCurrency(price)
    }
  },
  {
    accessorKey: 'description',
    header: 'Request Description',
    size: 250,
    enableColumnFilter: false,
    Cell: ({ cell }) => {
      const description = cell.getValue() as string
      return (
        <Typography
          variant='subtitle2'
          sx={{
            fontWeight: 400,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden'
          }}
        >
          {description}
        </Typography>
      )
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Created at',
    size: 150,
    muiTableBodyCellProps: {
      style: {
        flexDirection: 'column',
        alignItems: 'flex-start'
      }
    },
    enableColumnFilter: false,
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
    muiTableBodyCellProps: {
      style: {
        flexDirection: 'column',
        alignItems: 'flex-start'
      }
    },
    enableColumnFilter: false,
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
    ]
  },
  {
    accessorKey: 'hasMadePayout',
    header: 'Fulfilled',
    size: 120,
    grow: false,
    muiTableHeadCellProps: { align: 'center' },
    muiTableBodyCellProps: { align: 'center' },
    enableSorting: false,
    filterVariant: 'select',
    filterSelectOptions: [
      { label: 'Fulfilled', value: true },
      { label: 'Not transferred', value: 'false' }
    ],
    Cell: ({ row }) => {
      return row.original.status === RequestStatus.APPROVED ? (
        row.original.hasMadePayout ? (
          <Check sx={{ color: '#34B233' }} />
        ) : (
          <Close sx={{ color: '#FF605C' }} />
        )
      ) : null
    }
  },
  {
    accessorKey: 'rejectReason',
    header: 'Rejection reason',
    enableColumnFilter: false,
    Cell: ({ cell }) => {
      const reason = cell.getValue() as string
      return (
        <Typography
          variant='subtitle2'
          sx={{
            fontWeight: 400,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            maxWidth: '130px',
            overflow: 'hidden'
          }}
        >
          {reason}
        </Typography>
      )
    }
  }
]

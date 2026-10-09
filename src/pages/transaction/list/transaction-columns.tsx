import Typography from '@mui/material/Typography'
import { MRT_ColumnDef } from 'material-react-table'
import TransactionStatusTag from '~/components/tag/TransactionStatusTag'
import { TransactionListItemResponseDto } from '~/data/transaction.dto'
import { TransactionStatus } from '~/global/app-status'
import { PaymentType, UserRole } from '~/global/constants'
import { formatCurrency } from '~/utils/format'

export const transactionColumns: MRT_ColumnDef<TransactionListItemResponseDto>[] = [
  {
    accessorKey: 'type',
    header: 'Transaction Type',
    size: 150,
    grow: false,
    enableSorting: false,
    filterVariant: 'multi-select',
    filterSelectOptions: [
      { label: 'Buy Course', value: PaymentType.PAYMENT },
      { label: 'Payout', value: PaymentType.PAYOUT }
    ],
    Cell: ({ row }) => {
      return row.original.type === PaymentType.PAYMENT
        ? 'Buy Course'
        : row.original.type === PaymentType.PAYOUT
          ? 'Payout'
          : 'Other'
    }
  },
  {
    accessorKey: 'debitAccount.user.name',
    header: 'Source Account',
    enableSorting: false,
    enableColumnFilter: false,
    Cell: ({ row }) => {
      return row.original.debitAccount.userRole === UserRole.SYSTEM ? 'System' : row.original.debitAccount.user.name
    }
  },
  {
    accessorKey: 'creditAccount.user.name',
    header: 'Recipient Account',
    enableSorting: false,
    enableColumnFilter: false,
    Cell: ({ row }) => {
      return row.original.creditAccount.userRole === UserRole.SYSTEM ? 'System' : row.original.creditAccount.user.name
    }
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    muiTableHeadCellProps: {
      align: 'right'
    },
    muiTableBodyCellProps: {
      align: 'right'
    },
    enableColumnFilter: false,
    Cell: ({ cell }) => {
      const price = cell.getValue() as number
      return formatCurrency(price)
    }
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
    enableSorting: false,
    filterVariant: 'multi-select',
    filterSelectOptions: [
      { label: 'Success', value: TransactionStatus.CAPTURED },
      { label: 'Failed', value: TransactionStatus.ERROR },
      { label: 'Refund', value: TransactionStatus.REFUNDED }
    ],
    Cell: ({ row }) => {
      const type = row.original.status
      return <TransactionStatusTag type={type} />
    }
  }
]

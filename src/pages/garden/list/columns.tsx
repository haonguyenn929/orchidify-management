import { MRT_ColumnDef } from 'material-react-table'
import UserStatusTag from '~/components/tag/UserStatusTag'
import { Garden } from '~/data/garden.dto'
import { UserStatus } from '~/global/app-status'

export const GardenColumns: MRT_ColumnDef<Garden>[] = [
  {
    accessorKey: 'name',
    header: 'Garden Name',
    size: 150
  },
  {
    accessorKey: 'address',
    header: 'Address',
    size: 200
  },
  {
    accessorKey: 'maxClass',
    header: 'Max classes',
    size: 200,
    enableColumnFilter: false,
    muiTableHeadCellProps: {
      align: 'right'
    },
    muiTableBodyCellProps: {
      align: 'right'
    }
  },
  {
    accessorFn: (row) => row.gardenManager?.[0]?.name || '',
    header: 'Manager',
    size: 300,
    enableColumnFilter: false
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 150,
    Cell: ({ cell }) => {
      const type = cell.getValue() as UserStatus
      return <UserStatusTag type={type} />
    },
    filterVariant: 'multi-select',
    filterSelectOptions: [
      { label: 'Active', value: UserStatus.ACTIVE },
      { label: 'Inactive', value: UserStatus.INACTIVE }
    ]
  }
]

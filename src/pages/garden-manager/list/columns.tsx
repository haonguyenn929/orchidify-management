import { MRT_ColumnDef } from 'material-react-table'
import UserStatusTag from '~/components/tag/UserStatusTag'
import { GardenManager } from '~/data/gardenManager.dto'
import { UserStatus } from '~/global/app-status'

export const GardenManagerColumns: MRT_ColumnDef<GardenManager>[] = [
  {
    accessorKey: 'name',
    header: 'Garden Manager Name',
    size: 250
  },
  {
    accessorKey: 'email',
    header: 'Email',
    size: 250
  },
  {
    accessorKey: 'createdAt',
    header: 'Created date',
    size: 200,
    Cell: ({ cell }) => {
      const date = new Date(cell.getValue() as unknown as string)
      return date.toLocaleDateString('en-US')
    },
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

import { MRT_ColumnDef } from 'material-react-table'
import UserStatusTag from '~/components/tag/UserStatusTag'
import { Staff } from '~/data/staff.dto'
import { UserStatus } from '~/global/app-status'

export const StaffColumns: MRT_ColumnDef<Staff>[] = [
  {
    accessorKey: 'staffCode',
    header: 'Staff ID',
    size: 150,
    enableSorting: false
  },
  {
    accessorKey: 'name',
    header: 'Staff Name',
    size: 250
  },
  {
    accessorKey: 'email',
    header: 'Email',
    size: 250
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

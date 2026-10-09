import { MRT_ColumnDef } from 'material-react-table'
import UserStatusTag from '~/components/tag/UserStatusTag'
import { Instructor } from '~/data/instructor.dto'
import { UserStatus } from '~/global/app-status'

export const InstructorColumns: MRT_ColumnDef<Instructor>[] = [
  {
    accessorKey: 'name',
    header: 'Instructor Name',
    size: 180
  },
  {
    accessorKey: 'email',
    header: 'Email',
    size: 150
  },
  {
    accessorKey: 'phone',
    header: 'Phone number',
    size: 100,
    enableColumnFilter: false
  },
  {
    accessorKey: 'dateOfBirth',
    header: 'Date of birth',
    enableColumnFilter: false,
    size: 100,
    Cell: ({ cell }) => {
      const date = new Date(cell.getValue() as unknown as string)
      return date.toLocaleDateString('en-US')
    }
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

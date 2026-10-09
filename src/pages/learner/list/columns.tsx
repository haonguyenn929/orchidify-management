import { MRT_ColumnDef } from 'material-react-table'
import UserStatusTag from '~/components/tag/UserStatusTag'
import { Learner } from '~/data/learner.dto'
import { UserStatus } from '~/global/app-status'

export const LearnerColumns: MRT_ColumnDef<Learner>[] = [
  {
    accessorKey: 'name',
    header: 'Learner Name',
    size: 200
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
    enableColumnFilter: false,
    Cell: ({ cell }) => {
      return (cell.getValue() as string) || 'Not updated'
    }
  },
  {
    accessorKey: 'dateOfBirth',
    header: 'Date of birth',
    enableColumnFilter: false,
    size: 100,
    Cell: ({ cell }) => {
      return (
        <>
          {cell.getValue() ? new Date(cell.getValue() as string | number).toLocaleDateString('en-US') : 'Not updated'}
        </>
      )
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

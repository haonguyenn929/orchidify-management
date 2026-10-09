import Typography from '@mui/material/Typography'
import { MRT_ColumnDef } from 'material-react-table'
import RecruitmentStatusTag from '~/components/tag/RecruitmentStatusTag'
import { RecruitmentListItemResponseDto } from '~/data/recruitment.dto'
import { RecruitmentStatus } from '~/global/app-status'

export const RecruitmentColumns: MRT_ColumnDef<RecruitmentListItemResponseDto>[] = [
  {
    accessorFn: (row) => row.applicationInfo.name,
    header: 'Applicant',
    size: 250
  },
  {
    accessorFn: (row) => row.applicationInfo.email,
    header: 'Email',
    size: 150
  },
  {
    accessorFn: (row) => row.applicationInfo.phone,
    header: 'Phone number',
    size: 100,
    enableColumnFilter: false
  },
  {
    accessorKey: 'createdAt',
    header: 'Created at',
    size: 100,
    enableColumnFilter: false,
    Cell: ({ cell }) => {
      const date = new Date(cell.getValue() as unknown as string)
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
    size: 100,
    enableColumnFilter: false,
    Cell: ({ cell }) => {
      const date = new Date(cell.getValue() as unknown as string)
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
    accessorKey: 'handledBy.name',
    header: 'Approved By Staff',
    size: 250,
    enableColumnFilter: false
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 150,
    Cell: ({ row }) => {
      const type = row.original.status
      return <RecruitmentStatusTag type={type} />
    },
    filterVariant: 'multi-select',
    filterSelectOptions: [
      { label: 'Pending', value: RecruitmentStatus.PENDING },
      { label: 'Interviewing', value: RecruitmentStatus.INTERVIEWING },
      { label: 'Accepted', value: RecruitmentStatus.SELECTED },
      { label: 'Rejected', value: RecruitmentStatus.REJECTED },
      { label: 'Expired', value: RecruitmentStatus.EXPIRED }
    ]
  }
]

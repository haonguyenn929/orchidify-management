import { MRT_ColumnDef } from 'material-react-table'
import ClassStatusTag from '~/components/tag/ClassStatusTag'
import { ClassListItemResponseDto } from '~/data/class.dto'

export const classColumns: MRT_ColumnDef<ClassListItemResponseDto>[] = [
  {
    accessorKey: 'code',
    header: 'Class Code',
    size: 130,
    grow: false,
    enableColumnFilter: false
  },
  {
    accessorKey: 'course.code',
    header: 'Course Code',
    size: 140,
    grow: false,
    enableColumnFilter: false
  },
  {
    accessorKey: 'title',
    header: 'Course Name'
  },
  {
    accessorKey: 'instructor.name',
    size: 160,
    grow: false,
    header: 'Instructors',
    enableColumnFilter: false
  },
  {
    accessorKey: 'startDate',
    header: 'Start date',
    enableColumnFilter: false,
    size: 130,
    grow: false,
    Cell: ({ row }) => {
      const date = new Date(row.original.startDate)
      return date.toLocaleDateString('en-US')
    }
  },
  {
    accessorKey: 'duration',
    size: 110,
    grow: false,
    header: 'Duration',
    enableColumnFilter: false,
    Cell: ({ row }) => {
      return `${row.original.duration} weeks`
    }
  },
  {
    accessorKey: 'progress',
    size: 130,
    grow: false,
    header: 'Progress',
    enableColumnFilter: false,
    muiTableHeadCellProps: {
      align: 'right'
    },
    muiTableBodyCellProps: {
      align: 'right'
    },
    Cell: ({ row }) => {
      return `${row.original.progress?.percentage}% (${row.original.progress?.completed}/${row.original.progress?.total})`
    }
  },
  {
    accessorKey: 'learnerQuantity',
    header: 'Learner Count',
    size: 150,
    grow: false,
    muiTableHeadCellProps: {
      align: 'right'
    },
    muiTableBodyCellProps: {
      align: 'right'
    },
    enableColumnFilter: false,
    Cell: ({ row }) => {
      return `${row.original.learnerQuantity} / ${row.original.learnerLimit}`
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 130,
    grow: false,
    enableColumnFilter: false,
    enableSorting: false,
    Cell: ({ row }) => {
      const type = row.original.status
      return <ClassStatusTag type={type} />
    }
  }
]

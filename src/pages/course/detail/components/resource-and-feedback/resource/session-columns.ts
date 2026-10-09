import { MRT_ColumnDef } from 'material-react-table'
import { SessionDto } from '~/data/course.dto'

export const sessionColumns: MRT_ColumnDef<SessionDto>[] = [
  {
    accessorKey: 'sessionNumber',
    header: 'STT',
    size: 50,
    muiTableHeadCellProps: {
      align: 'center'
    },
    muiTableBodyCellProps: {
      align: 'center'
    }
  },
  {
    accessorKey: 'title',
    header: 'Lesson Title'
  },
  {
    accessorKey: 'description',
    header: 'Description',
    size: 500
  },
  {
    /*
      Only allow 1 assignment per session 
     */
    header: 'Assignments',
    size: 200,
    Cell: ({ row }) => (row.original.assignments.length > 0 ? row.original.assignments[0].title : '')
  }
]

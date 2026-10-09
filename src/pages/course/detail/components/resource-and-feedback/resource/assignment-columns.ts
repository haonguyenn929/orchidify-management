import { MRT_ColumnDef } from 'material-react-table'
import { AssignmentDto } from '~/data/course.dto'

export const assignmentColumns: MRT_ColumnDef<AssignmentDto>[] = [
  {
    accessorKey: 'title',
    header: 'Assignment Title'
  }
]

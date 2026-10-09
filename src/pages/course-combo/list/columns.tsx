import { MRT_ColumnDef } from 'material-react-table'
import { CourseComboListItemResponseDto } from '~/data/courseCombo.dto'

export const CourseComboColumns: MRT_ColumnDef<CourseComboListItemResponseDto>[] = [
  {
    accessorKey: 'title',
    header: 'Course Combos'
  },
  {
    accessorKey: 'instructor.name',
    size: 160,
    grow: false,
    header: 'Instructors',
    enableColumnFilter: false
  },
  {
    accessorKey: 'discount',
    header: 'Discount',
    size: 150,
    grow: false,
    muiTableHeadCellProps: {
      align: 'right'
    },
    muiTableBodyCellProps: {
      align: 'right'
    },
    Cell: ({ cell }) => {
      return `${cell.getValue()}%`
    },
    enableColumnFilter: false
  },
  {
    accessorKey: 'childCourseIds.length',
    header: 'Courses in Combo',
    size: 180,
    grow: false,
    muiTableHeadCellProps: {
      align: 'right'
    },
    muiTableBodyCellProps: {
      align: 'right'
    },
    enableColumnFilter: false,
    enableSorting: false
  }
]

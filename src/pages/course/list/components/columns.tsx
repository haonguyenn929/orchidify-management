import { Typography } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'
import { CourseListItemResponseDto } from '~/data/course.dto'
import { CourseLevel } from '~/global/constants'
import { formatCourseLevel, formatCurrency } from '~/utils/format'

export const courseColumns: MRT_ColumnDef<CourseListItemResponseDto>[] = [
  {
    accessorKey: 'code',
    header: 'Course Code',
    size: 150,
    grow: false
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
    accessorKey: 'price',
    header: 'Price',
    size: 100,
    grow: false,
    muiTableHeadCellProps: {
      align: 'right'
    },
    muiTableBodyCellProps: {
      align: 'right'
    },
    Cell: ({ cell }) => {
      const price = cell.getValue() as number
      return formatCurrency(price)
    },
    enableColumnFilter: false
  },
  {
    accessorKey: 'level',
    header: 'Level',
    size: 100,
    grow: false,
    Cell: ({ cell }) => {
      const level = cell.getValue() as CourseLevel

      return (
        <Typography
          variant='subtitle2'
          color={
            level === CourseLevel.BASIC
              ? '#20c017'
              : level === CourseLevel.INTERMEDIATE
                ? '#ffcf22'
                : level === CourseLevel.ADVANCED
                  ? '#f66868'
                  : undefined
          }
        >
          {formatCourseLevel(level)}
        </Typography>
      )
    },
    filterVariant: 'multi-select',
    filterSelectOptions: [
      { label: 'Basic', value: CourseLevel.BASIC },
      { label: 'Intermediate', value: CourseLevel.INTERMEDIATE },
      { label: 'Advanced', value: CourseLevel.ADVANCED }
    ],
    enableSorting: false
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: 'Category',
    size: 120,
    grow: false,
    filterVariant: 'select',
    filterSelectOptions: [],
    Cell: ({ cell }) => {
      return (cell.getValue() as []).join(', ')
    },
    enableSorting: false
  },
  {
    accessorKey: 'learnerLimit',
    header: 'Learner Limit',
    size: 170,
    grow: false,
    muiTableHeadCellProps: {
      align: 'right'
    },
    muiTableBodyCellProps: {
      align: 'right'
    },
    enableColumnFilter: false
  }
]

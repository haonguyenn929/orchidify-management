import { MRT_ColumnFiltersState, MRT_PaginationState, MRT_SortingState } from 'material-react-table'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Table from '~/components/table/Table'
import { ListResponseDto } from '~/data/common.dto'
import { CourseListItemResponseDto } from '~/data/course.dto'
import { ErrorResponseDto } from '~/data/error.dto'
import { useCourseApi } from '~/hooks/api/useCourseApi'
import { protectedRoute } from '~/routes/routes'
import { notifyError } from '~/utils/toastify'
import { courseColumns } from './columns'
import { useSettingApi } from '~/hooks/api/useSettingApi'

const CourseTable = () => {
  const { getCourseList } = useCourseApi()
  const { getCourseTypes } = useSettingApi()
  const [data, setData] = useState<ListResponseDto<CourseListItemResponseDto>>({
    docs: [],
    totalDocs: 0,
    offset: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null
  })
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })
  const [sorting, setSorting] = useState<MRT_SortingState>([])
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([])
  const [error, setError] = useState<ErrorResponseDto | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const { data: courses, error: apiError } = await getCourseList(
        pagination.pageIndex + 1,
        pagination.pageSize,
        sorting.map((sort) => ({ field: sort.id, desc: sort.desc })),
        columnFilters.map((filter) => ({ field: filter.id, value: filter.value }))
      )
      if (courses) {
        setData(courses)
      } else {
        setData({
          docs: [],
          totalDocs: 0,
          offset: 0,
          limit: 0,
          totalPages: 0,
          page: 0,
          pagingCounter: 0,
          hasPrevPage: false,
          hasNextPage: false,
          prevPage: null,
          nextPage: null
        })
      }
      setError(apiError)
      setIsLoading(false)
    })()
  }, [getCourseList, pagination.pageIndex, pagination.pageSize, sorting, columnFilters])

  useEffect(() => {
    ;(async () => {
      const { data: courseTypes, error: apiError } = await getCourseTypes()
      const transformedCourseTypes: string[] = []

      if (courseTypes) {
        courseTypes.docs.forEach((type) => type.groupItems.forEach((item) => transformedCourseTypes.push(item)))
        courseColumns[courseColumns.findIndex((column) => column.id === 'type')].filterSelectOptions =
          transformedCourseTypes
      }

      setError(apiError)
    })()
  }, [getCourseTypes])

  if (error) {
    notifyError(error.message)
  }

  return (
    <Table
      title='Course List'
      isLoading={isLoading}
      tableOptions={{
        columns: courseColumns,
        data: data.docs || [],
        rowCount: data.totalDocs,
        layoutMode: 'grid',
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        muiTableBodyRowProps: ({ row }) => ({
          onClick: () => navigate(protectedRoute.courseDetail.path.replace(':id', row.original._id)),
          sx: {
            cursor: 'pointer'
          }
        }),
        muiPaginationProps: {
          rowsPerPageOptions: [5, 10, 20]
        },
        state: {
          pagination: pagination,
          sorting: sorting,
          columnFilters: columnFilters
        }
      }}
    />
  )
}

export default CourseTable

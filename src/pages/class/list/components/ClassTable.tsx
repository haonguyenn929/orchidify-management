import { MRT_ColumnFiltersState, MRT_PaginationState, MRT_SortingState } from 'material-react-table'
import { useEffect, useState } from 'react'
import { ErrorResponseDto } from '~/data/error.dto'
import { notifyError } from '~/utils/toastify'
import Table from '~/components/table/Table'
import { classColumns } from './class-columns'
import { ListResponseDto } from '~/data/common.dto'
import { useNavigate } from 'react-router-dom'
import { protectedRoute } from '~/routes/routes'
import { ClassStatus } from '~/global/app-status'
import { ClassListItemResponseDto } from '~/data/class.dto'
import { useClassApi } from '~/hooks/api/useClassApi'

interface ClassTableProps {
  statusFilter?: ClassStatus
}

const ClassTable = ({ statusFilter }: ClassTableProps) => {
  const { getClassList } = useClassApi()
  const [data, setData] = useState<ListResponseDto<ClassListItemResponseDto>>({
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
    // eslint-disable-next-line prettier/prettier
    (async () => {
      setIsLoading(true)
      const { data: classes, error: apiError } = await getClassList(
        pagination.pageIndex + 1,
        pagination.pageSize,
        sorting.map((sort) => ({ field: sort.id, desc: sort.desc })),
        [
          ...columnFilters.map((filter) => ({ field: filter.id, value: filter.value })),
          { field: 'status', value: statusFilter }
        ]
      )
      if (classes) {
        setData(classes)
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
  }, [getClassList, pagination.pageIndex, pagination.pageSize, sorting, columnFilters, statusFilter])

  if (error) {
    notifyError(error.message)
  }

  return (
    <Table
      title='Class List'
      isLoading={isLoading}
      tableOptions={{
        columns: classColumns,
        data: data.docs || [],
        rowCount: data.totalDocs,
        layoutMode: 'grid',
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        muiTableBodyRowProps: ({ row }) => ({
          onClick: () => navigate(protectedRoute.classDetail.path.replace(':id', row.original._id)),
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

export default ClassTable

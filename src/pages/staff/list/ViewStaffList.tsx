import AddIcon from '@mui/icons-material/Add'
import { Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Table from '~/components/table/Table'
import { TitleWrapper } from '~/pages/garden-manager/detail/ViewGardenManagerDetail.styled'
import { protectedRoute } from '~/routes/routes'
import { StaffColumns } from './columns'
import { Staff } from '~/data/staff.dto'
import { ListResponseDto } from '~/data/common.dto'
import { MRT_PaginationState, MRT_SortingState, MRT_ColumnFiltersState } from 'material-react-table'
import { useEffect, useState } from 'react'
import { ErrorResponseDto } from '~/data/error.dto'
import { notifyError } from '~/utils/toastify'
import { useStaffApi } from '~/hooks/api/useStaffApi'

const ViewStaffList = () => {
  const navigate = useNavigate()
  const { getAllStaffs } = useStaffApi()
  const [data, setData] = useState<ListResponseDto<Staff>>({
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

  useEffect(() => {
    // eslint-disable-next-line prettier/prettier
    (async () => {
      setIsLoading(true)
      const { data: staff, error: apiError } = await getAllStaffs(
        pagination.pageIndex + 1,
        pagination.pageSize,
        sorting.map((sort) => ({ field: sort.id, desc: sort.desc })),
        columnFilters.map((filter) => ({ field: filter.id, value: filter.value }))
      )
      if (staff) {
        setData(staff)
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
  }, [getAllStaffs, pagination.pageIndex, pagination.pageSize, sorting, columnFilters])

  if (error) {
    notifyError(error.message)
  }

  return (
    <>
      <TitleWrapper>
        <Typography variant='h5' fontSize={34} fontWeight={700}>
          Staff
        </Typography>
        <div style={{ display: 'flex' }}>
          <Button
            color='secondary'
            onClick={() => {
              navigate(protectedRoute.addStaff.path)
            }}
            sx={{ marginRight: '24px' }}
            endIcon={<AddIcon />}
          >
            Add
          </Button>
        </div>
      </TitleWrapper>
      <Table
        title='Staff List'
        isLoading={isLoading}
        tableOptions={{
          columns: StaffColumns,
          data: data.docs || [],
          rowCount: data.totalDocs,
          onPaginationChange: setPagination,
          onSortingChange: setSorting,
          onColumnFiltersChange: setColumnFilters,
          muiTableBodyRowProps: ({ row }) => ({
            onClick: () => navigate(protectedRoute.staffDetail.path.replace(':id', row.original._id)),
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
    </>
  )
}

export default ViewStaffList

import AddIcon from '@mui/icons-material/Add'
import { Button, Typography } from '@mui/material'
import { MRT_ColumnFiltersState, MRT_PaginationState, MRT_SortingState } from 'material-react-table'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Table from '~/components/table/Table'
import { ListResponseDto } from '~/data/common.dto'
import { ErrorResponseDto } from '~/data/error.dto'
import { Garden } from '~/data/garden.dto'
import { TitleWrapper } from '~/pages/garden-manager/detail/ViewGardenManagerDetail.styled'
import { protectedRoute } from '~/routes/routes'
import { notifyError } from '~/utils/toastify'
import { GardenColumns } from './columns'
import { useGardenApi } from '~/hooks/api/useGardenApi'
import useAuth from '~/auth/useAuth'
import { UserRole } from '~/global/constants'

const ViewGardenList = () => {
  const { userTokenPayload } = useAuth()
  const navigate = useNavigate()
  const { getAllGardens } = useGardenApi()
  const [data, setData] = useState<ListResponseDto<Garden>>({
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
      const { data: gardens, error: apiError } = await getAllGardens(
        pagination.pageIndex + 1,
        pagination.pageSize,
        sorting.map((sort) => ({ field: sort.id, desc: sort.desc })),
        columnFilters.map((filter) => ({ field: filter.id, value: filter.value }))
      )
      if (gardens) {
        setData(gardens)
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
  }, [getAllGardens, pagination.pageIndex, pagination.pageSize, sorting, columnFilters])

  if (error) {
    notifyError(error.message)
  }

  return (
    <>
      <TitleWrapper>
        <Typography variant='h5' fontSize={34} fontWeight={700}>
          Gardens
        </Typography>
        <div style={{ display: 'flex' }}>
          {userTokenPayload && userTokenPayload.role === UserRole.STAFF ? (
            <Button
              color='secondary'
              onClick={() => {
                navigate(protectedRoute.addGarden.path)
              }}
              sx={{ marginRight: '24px' }}
              endIcon={<AddIcon />}
            >
              Add
            </Button>
          ) : null}
        </div>
      </TitleWrapper>
      <Table
        title='Garden List'
        isLoading={isLoading}
        tableOptions={{
          columns: GardenColumns,
          data: data.docs || [],
          rowCount: data.totalDocs,
          onPaginationChange: setPagination,
          onSortingChange: setSorting,
          onColumnFiltersChange: setColumnFilters,
          muiTableBodyRowProps: ({ row }) => ({
            onClick: () => navigate(protectedRoute.gardenDetail.path.replace(':id', row.original._id)),
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

export default ViewGardenList

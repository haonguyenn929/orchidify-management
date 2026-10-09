import { Typography } from '@mui/material'
import { MRT_ColumnFiltersState, MRT_PaginationState, MRT_SortingState } from 'material-react-table'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Table from '~/components/table/Table'
import { ListResponseDto } from '~/data/common.dto'
import { ErrorResponseDto } from '~/data/error.dto'
import { PayoutRequestListItemDto } from '~/data/payoutRequest.dto'
import { usePayoutRequestApi } from '~/hooks/api/usePayoutRequestApi'
import { TitleWrapper } from '~/pages/garden-manager/detail/ViewGardenManagerDetail.styled'
import { protectedRoute } from '~/routes/routes'
import { notifyError } from '~/utils/toastify'
import { PayoutRequestColumns } from './columns'

const ViewPayoutRequestList = () => {
  const navigate = useNavigate()
  const { getAllPayoutRequests } = usePayoutRequestApi()
  const [data, setData] = useState<ListResponseDto<PayoutRequestListItemDto>>({
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
      const { data: payoutRequest, error: apiError } = await getAllPayoutRequests(
        pagination.pageIndex + 1,
        pagination.pageSize,
        sorting.map((sort) => ({ field: sort.id, desc: sort.desc })),
        columnFilters.map((filter) => ({ field: filter.id, value: filter.value }))
      )
      if (payoutRequest) {
        setData(payoutRequest)
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
  }, [getAllPayoutRequests, pagination.pageIndex, pagination.pageSize, sorting, columnFilters])

  if (error) {
    notifyError(error.message)
  }

  return (
    <>
      <TitleWrapper>
        <Typography variant='h5' fontSize={34} fontWeight={700}>
          Payout Requests
        </Typography>
      </TitleWrapper>
      <Table
        title='Request List'
        isLoading={isLoading}
        tableOptions={{
          columns: PayoutRequestColumns,
          data: data.docs || [],
          rowCount: data.totalDocs,
          layoutMode: 'grid',
          onPaginationChange: setPagination,
          onSortingChange: setSorting,
          onColumnFiltersChange: setColumnFilters,
          muiTableBodyRowProps: ({ row }) => ({
            onClick: () => navigate(protectedRoute.payoutRequestDetail.path.replace(':id', row.original._id)),
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

export default ViewPayoutRequestList

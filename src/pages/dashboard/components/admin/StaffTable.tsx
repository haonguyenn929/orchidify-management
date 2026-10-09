import { Box, Paper, Typography } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Table from '~/components/table/Table'
import { ListResponseDto } from '~/data/common.dto'
import { ErrorResponseDto } from '~/data/error.dto'
import { Staff } from '~/data/staff.dto'
import { UserStatus } from '~/global/app-status'
import { useStaffApi } from '~/hooks/api/useStaffApi'
import { protectedRoute } from '~/routes/routes'
import { notifyError } from '~/utils/toastify'

const StaffTable = () => {
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
  const [error, setError] = useState<ErrorResponseDto | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const { data: staffs, error: apiError } = await getAllStaffs(
        1,
        5,
        [],
        [{ field: 'status', value: UserStatus.ACTIVE }]
      )
      if (staffs) {
        setData(staffs)
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
  }, [getAllStaffs])

  if (error) {
    notifyError(error.message)
  }

  return (
    <Paper>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        paddingX='1.5rem'
        paddingY='1rem'
        borderBottom='1px solid #0000001F'
      >
        <Typography fontSize='1.25rem' fontWeight='500'>
          Staff
        </Typography>
        <Typography
          variant='caption'
          component={Link}
          color='#000000DE'
          to={protectedRoute.staffList.path}
          sx={{ textDecoration: 'none' }}
        >
          View all
        </Typography>
      </Box>
      <TableDisplay data={data.docs} isLoading={isLoading} />
    </Paper>
  )
}

export default StaffTable

interface TableDisplayProps {
  data: Staff[]
  isLoading?: boolean
}

const TableDisplay = ({ data, isLoading }: TableDisplayProps) => {
  const navigate = useNavigate()
  const staffColumns: MRT_ColumnDef<Staff>[] = [
    {
      accessorKey: 'staffCode',
      header: 'Staff ID',
      size: 100,
      Cell: ({ cell }) => {
        return (
          <Typography
            variant='subtitle2'
            sx={{
              fontWeight: 400,
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
            }}
          >
            {cell.getValue() as string}
          </Typography>
        )
      }
    },
    {
      accessorKey: 'name',
      header: 'Staff Name',
      size: 150,
      Cell: ({ cell }) => {
        return (
          <Typography
            variant='subtitle2'
            sx={{
              fontWeight: 400,
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
            }}
          >
            {cell.getValue() as string}
          </Typography>
        )
      }
    },
    {
      accessorKey: 'email',
      header: 'Email',
      Cell: ({ cell }) => {
        return (
          <Typography
            variant='subtitle2'
            sx={{
              fontWeight: 400,
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
            }}
          >
            {cell.getValue() as string}
          </Typography>
        )
      }
    }
  ]

  return (
    <Table
      isLoading={isLoading}
      tableOptions={{
        columns: staffColumns,
        data: data || [],
        rowCount: data.length,
        layoutMode: 'grid',
        manualSorting: false,
        enableFullScreenToggle: false,
        enableBottomToolbar: false,
        enableTopToolbar: false,
        enableSorting: false,
        enableColumnFilters: false,
        enableHiding: false,
        enableColumnActions: false,
        muiTablePaperProps: {
          sx: { boxShadow: 'none' }
        },
        muiTableHeadCellProps: {
          sx: { bgcolor: '#F2F2F7' }
        },
        muiTableBodyRowProps: ({ row }) => ({
          onClick: () => navigate(protectedRoute.staffDetail.path.replace(':id', row.original._id)),
          sx: {
            cursor: 'pointer'
          }
        })
      }}
    />
  )
}

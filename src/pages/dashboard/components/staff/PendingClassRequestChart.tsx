import { Box, Paper, Typography } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Table from '~/components/table/Table'
import { ClassRequestListItemResponseDto } from '~/data/classRequest.dto'
import { ListResponseDto } from '~/data/common.dto'
import { ErrorResponseDto } from '~/data/error.dto'
import { RequestStatus } from '~/global/app-status'
import { useClassRequestApi } from '~/hooks/api/useClassRequestApi'
import { protectedRoute } from '~/routes/routes'
import { formatRequestType } from '~/utils/format'
import { notifyError } from '~/utils/toastify'

const PendingClassRequestChart = () => {
  const { getAllClassRequests } = useClassRequestApi()
  const [data, setData] = useState<ListResponseDto<ClassRequestListItemResponseDto>>({
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
      const { data: classRequests, error: apiError } = await getAllClassRequests(
        1,
        5,
        [],
        [{ field: 'status', value: RequestStatus.PENDING }]
      )
      if (classRequests) {
        setData(classRequests)
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
  }, [getAllClassRequests])

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
          Pending Class Requests
        </Typography>
        <Typography
          variant='caption'
          component={Link}
          color='#000000DE'
          to={protectedRoute.classRequestList.path}
          sx={{ textDecoration: 'none' }}
        >
          View all
        </Typography>
      </Box>
      <TableDisplay data={data.docs} isLoading={isLoading} />
    </Paper>
  )
}

export default PendingClassRequestChart

interface TableDisplayProps {
  data: ClassRequestListItemResponseDto[]
  isLoading?: boolean
}

const TableDisplay = ({ data, isLoading }: TableDisplayProps) => {
  const navigate = useNavigate()
  const classRequestColumns: MRT_ColumnDef<ClassRequestListItemResponseDto>[] = [
    {
      accessorKey: 'type',
      header: 'Request Type',
      size: 115,
      grow: false,
      Cell: ({ row }) => {
        const type = row.original.type
        return formatRequestType(type)
      }
    },
    {
      accessorKey: 'createdBy.name',
      header: 'Instructors',
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
      accessorKey: 'metadata.title',
      header: 'Course Name',
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
      accessorKey: 'createdAt',
      header: 'Created at',
      grow: false,
      size: 120,
      muiTableBodyCellProps: {
        style: {
          flexDirection: 'column',
          alignItems: 'flex-start'
        }
      },
      Cell: ({ cell }) => {
        const date = cell.getValue() as string
        return (
          <>
            <Typography variant='subtitle2' sx={{ fontWeight: 400 }}>
              {new Date(date).toLocaleTimeString('en-US')}
            </Typography>
            <Typography variant='subtitle2' sx={{ fontWeight: 400 }}>
              {new Date(date).toLocaleDateString('en-US')}
            </Typography>
          </>
        )
      }
    }
  ]

  return (
    <Table
      isLoading={isLoading}
      tableOptions={{
        columns: classRequestColumns,
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
          onClick: () => navigate(protectedRoute.classRequestDetail.path.replace(':id', row.original._id)),
          sx: {
            cursor: 'pointer'
          }
        })
      }}
    />
  )
}

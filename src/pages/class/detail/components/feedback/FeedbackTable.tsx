import Table from '~/components/table/Table'
import { feedbackColumns } from './feedback-columns'
import { useFeedbackApi } from '~/hooks/api/useFeedbackApi'
import { useEffect, useState } from 'react'
import { MRT_SortingState, MRT_ColumnFiltersState } from 'material-react-table'
import { ErrorResponseDto } from '~/data/error.dto'
import { notifyError } from '~/utils/toastify'
import FeedbackDetailDialog from './FeebackDetailDialog'
import { FeedbackListItemResponseDto } from '~/data/feedback.dto'
import { ListResponseDto } from '~/data/common.dto'

interface FeedbackTableProps {
  classId: string
}

const FeedbackTable = ({ classId }: FeedbackTableProps) => {
  const { getClassFeedbackList } = useFeedbackApi()
  const [data, setData] = useState<ListResponseDto<FeedbackListItemResponseDto>>({
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
  const [sorting, setSorting] = useState<MRT_SortingState>([])
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([])
  const [openFeedbackDetailDialog, setOpenFeedbackDetailDialog] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackListItemResponseDto | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const { data: feedbacks, error: apiError } = await getClassFeedbackList(
        classId,
        sorting.map((sort) => ({ field: sort.id, desc: sort.desc })),
        columnFilters.map((filter) => ({ field: filter.id, value: filter.value }))
      )
      if (feedbacks) {
        setData(feedbacks)
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
  }, [getClassFeedbackList, sorting, columnFilters, classId])

  if (error) {
    notifyError(error.message)
  }

  const handleOpenFeedbackDetailDialog = (feedback: FeedbackListItemResponseDto) => {
    setSelectedFeedback(feedback)
    setOpenFeedbackDetailDialog(true)
  }

  return (
    <>
      <Table
        title='Feedback'
        isLoading={isLoading}
        tableOptions={{
          columns: feedbackColumns,
          data: data.docs || [],
          rowCount: data.totalDocs,
          layoutMode: 'grid-no-grow',
          enableHiding: false,
          enableColumnActions: false,
          enableBottomToolbar: false,
          onSortingChange: setSorting,
          onColumnFiltersChange: setColumnFilters,
          muiTableBodyRowProps: ({ row }) => ({
            onClick: () => handleOpenFeedbackDetailDialog(row.original),
            sx: {
              cursor: 'pointer'
            }
          }),
          muiPaginationProps: {
            rowsPerPageOptions: [5, 10, 20]
          },
          state: {
            sorting: sorting,
            columnFilters: columnFilters
          }
        }}
      />
      {selectedFeedback ? (
        <FeedbackDetailDialog
          open={openFeedbackDetailDialog}
          onClose={() => setOpenFeedbackDetailDialog(false)}
          feedback={selectedFeedback}
        />
      ) : null}
    </>
  )
}

export default FeedbackTable

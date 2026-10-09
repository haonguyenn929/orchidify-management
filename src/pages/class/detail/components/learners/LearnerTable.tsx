import Table from '~/components/table/Table'
import { learnerColumns } from './learner-columns'
import { useNavigate } from 'react-router-dom'
import { protectedRoute } from '~/routes/routes'
import { ClassLearnerDto } from '~/data/class.dto'

interface LearnerTableProps {
  learners: ClassLearnerDto[]
}

const LearnerTable = ({ learners }: LearnerTableProps) => {
  const navigate = useNavigate()
  return (
    <Table
      title='Learner List'
      tableOptions={{
        columns: learnerColumns,
        data: learners || [],
        rowCount: learners.length,
        enableBottomToolbar: false,
        enableSorting: true,
        enableColumnFilters: false,
        enableHiding: false,
        enableColumnActions: false,
        muiTableBodyRowProps: ({ row }) => ({
          onClick: () => navigate(protectedRoute.learnerDetail.path.replace(':id', row.original._id)),
          sx: {
            cursor: 'pointer'
          }
        })
      }}
    />
  )
}
export default LearnerTable

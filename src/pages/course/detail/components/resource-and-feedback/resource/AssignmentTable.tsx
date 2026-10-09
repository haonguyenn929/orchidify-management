// import Table from '~/components/table/Table'
// import { useNavigate } from 'react-router-dom'
// import { protectedRoute } from '~/routes/routes'
// import { AssignmentDto } from '~/data/course/course.dto'
// import { assignmentColumns } from './assignment-columns'

// interface AssignmentTableProps {
//   assignments: AssignmentDto[]
//   courseId: string
// }

// const AssignmentTable = ({ assignments, courseId }: AssignmentTableProps) => {
//   const navigate = useNavigate()
//   return (
//     <Table
//       title='Assignment List'
//       tableOptions={{
//         columns: assignmentColumns,
//         data: assignments || [],
//         rowCount: assignments.length,
//         enableBottomToolbar: false,
//         enableSorting: true,
//         enableColumnFilters: false,
//         enableHiding: false,
//         manualSorting: false,
//         muiTableBodyRowProps: ({ row }) => ({
//           onClick: () =>
//             navigate(
//               protectedRoute.courseAssignmentDetail.path
//                 .replace(':courseId', courseId)
//                 .replace(':assignmentId', row.original._id)
//             ),
//           sx: {
//             cursor: 'pointer'
//           }
//         })
//       }}
//     />
//   )
// }
// export default AssignmentTable

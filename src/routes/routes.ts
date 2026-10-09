import { lazy } from 'react'
import { UserRole } from '~/global/constants'

const Dashboard = lazy(() => import('~/pages/dashboard/Dashboard'))
const Login = lazy(() => import('~/pages/login/Login'))
const ViewGardenManagerList = lazy(() => import('~/pages/garden-manager/list/ViewGardenManagerList'))
const ViewGardenManagerDetail = lazy(() => import('~/pages/garden-manager/detail/ViewGardenManagerDetail'))
const AddGardenManager = lazy(() => import('~/pages/garden-manager/add/AddGardenManager'))
const UpdateGardenManager = lazy(() => import('~/pages/garden-manager/update/UpdateGardenManager'))
const ViewGardenList = lazy(() => import('~/pages/garden/list/ViewGardenList'))
const AddGarden = lazy(() => import('~/pages/garden/add/AddGarden'))
const ViewGardenDetail = lazy(() => import('~/pages/garden/detail/ViewGardenDetail'))
const UpdateGardenInfo = lazy(() => import('~/pages/garden/update-info/UpdateGardenInfo'))
const UpdateGardenMangerOfGarden = lazy(() => import('~/pages/garden/update-garden-manager/UpdateGardenManager'))
const ViewStaffList = lazy(() => import('~/pages/staff/list/ViewStaffList'))
const ViewStaffDetail = lazy(() => import('~/pages/staff/detail/ViewStaffDetail'))
const AddStaff = lazy(() => import('~/pages/staff/add/AddStaff'))
const UpdateStaff = lazy(() => import('~/pages/staff/update/UpdateStaff'))
const ViewLearnerList = lazy(() => import('~/pages/learner/list/ViewLearnerList'))
const ViewLearnerDetail = lazy(() => import('~/pages/learner/detail/ViewLearnerDetail'))
const ViewInstructorList = lazy(() => import('~/pages/instructor/list/ViewInstructorList'))
const ViewInstructorDetail = lazy(() => import('~/pages/instructor/detail/ViewInstructorDetail'))
const ViewClassRequestList = lazy(() => import('~/pages/class-request/list/ViewClassRequestList'))
const ViewClassRequestDetail = lazy(() => import('~/pages/class-request/detail/ViewClassRequestDetail'))
const ViewRecruitmentList = lazy(() => import('~/pages/recruitment/list/ViewRecruitmentList'))
const ViewGardenTimesheet = lazy(() => import('~/pages/garden/garden-timesheet/GardenTimesheet'))
const UpdateGardenTimesheet = lazy(() => import('~/pages/garden/garden-timesheet/update/UpdateGardenTimesheet'))
const ViewCourseList = lazy(() => import('~/pages/course/list/ViewCourseList'))
const CourseDetail = lazy(() => import('~/pages/course/detail/CourseDetail'))
const CourseSessionDetail = lazy(() => import('~/pages/course/detail/session-detail/SessionDetail'))
const ViewClassList = lazy(() => import('~/pages/class/list/ViewClassList'))
const ViewClassDetail = lazy(() => import('~/pages/class/detail/ViewClassDetail'))
const ClassSessionDetail = lazy(() => import('~/pages/class/detail/session-detail/SessionDetail'))
const ViewRecruitmentDetail = lazy(() => import('~/pages/recruitment/detail/ViewRecruitmentDetail'))
const InstructorTimesheet = lazy(() => import('~/pages/instructor/detail/timesheet/InstructorTimesheet'))
const AddInstructor = lazy(() => import('~/pages/instructor/add/AddInstructor'))
const UpdateInstructor = lazy(() => import('~/pages/instructor/update/UpdateInstructor'))
const ViewPayoutRequestList = lazy(() => import('~/pages/payout-request/list/ViewPayoutRequestList'))
const ViewPayoutRequestDetail = lazy(() => import('~/pages/payout-request/detail/ViewPayoutRequestDetail'))
const ViewCourseComboList = lazy(() => import('~/pages/course-combo/list/ViewCourseComboList'))
const ViewCourseComboDetail = lazy(() => import('~/pages/course-combo/detail/ViewCourseComboDetail'))
const ViewTransactionList = lazy(() => import('~/pages/transaction/list/ViewTransactionList'))
const ViewTransactionDetail = lazy(() => import('~/pages/transaction/detail/ViewTransactionDetail'))
const Statistic = lazy(() => import('~/pages/statistic/Statistic'))

export const publicRoute = {
  login: {
    name: 'Sign In',
    path: '/',
    Component: Login
  }
}

export const protectedRoute = {
  dashboard: {
    name: 'Dashboard',
    path: '/dashboard',
    Component: Dashboard,
    roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.GARDEN_MANAGER]
  },
  gardenManagerList: {
    name: 'Garden Managers',
    path: '/garden-managers',
    Component: ViewGardenManagerList,
    roles: [UserRole.STAFF]
  },
  gardenManagerDetail: {
    name: 'Garden Manager Details',
    path: '/garden-managers/:id',
    Component: ViewGardenManagerDetail,
    roles: [UserRole.STAFF]
  },
  addGardenManager: {
    name: 'Add Garden Manager',
    path: '/garden-managers/add',
    Component: AddGardenManager,
    roles: [UserRole.STAFF]
  },
  updateGardenManager: {
    name: 'Update Garden Manager',
    path: '/garden-managers/:id/update',
    Component: UpdateGardenManager,
    roles: [UserRole.STAFF]
  },
  gardenList: {
    name: 'Gardens',
    path: '/gardens',
    Component: ViewGardenList,
    roles: [UserRole.STAFF, UserRole.GARDEN_MANAGER]
  },
  addGarden: {
    name: 'Add Garden',
    path: '/gardens/add',
    Component: AddGarden,
    roles: [UserRole.STAFF]
  },
  gardenDetail: {
    name: 'Garden Details',
    path: '/gardens/:id',
    Component: ViewGardenDetail,
    roles: [UserRole.STAFF, UserRole.GARDEN_MANAGER]
  },
  updateGardenInfo: {
    name: 'Update Garden',
    path: '/gardens/:id/update',
    Component: UpdateGardenInfo,
    roles: [UserRole.STAFF, UserRole.GARDEN_MANAGER]
  },
  updateGardenManagerOfGarden: {
    name: 'Change Garden Manager',
    path: '/gardens/:id/update-garden-manager',
    Component: UpdateGardenMangerOfGarden,
    roles: [UserRole.STAFF]
  },
  staffList: {
    name: 'Staff',
    path: '/staffs',
    Component: ViewStaffList,
    roles: [UserRole.ADMIN]
  },
  staffDetail: {
    name: 'Staff Details',
    path: '/staffs/:id',
    Component: ViewStaffDetail,
    roles: [UserRole.ADMIN]
  },
  addStaff: {
    name: 'Add Staff',
    path: '/staffs/add',
    Component: AddStaff,
    roles: [UserRole.ADMIN]
  },
  updateStaff: {
    name: 'Update Staff',
    path: '/staffs/:id/update',
    Component: UpdateStaff,
    roles: [UserRole.ADMIN]
  },
  learnerList: {
    name: 'Learners',
    path: '/learners',
    Component: ViewLearnerList,
    roles: [UserRole.STAFF]
  },
  learnerDetail: {
    name: 'Learner Details',
    path: '/learners/:id',
    Component: ViewLearnerDetail,
    roles: [UserRole.STAFF]
  },
  instructorList: {
    name: 'Instructors',
    path: '/instructors',
    Component: ViewInstructorList,
    roles: [UserRole.STAFF]
  },
  instructorDetail: {
    name: 'Instructor Details',
    path: '/instructors/:id',
    Component: ViewInstructorDetail,
    roles: [UserRole.STAFF]
  },
  instructorTimesheet: {
    name: 'Teaching Schedule',
    path: '/instructors/:id/timesheet',
    Component: InstructorTimesheet,
    roles: [UserRole.STAFF]
  },
  classRequestList: {
    name: 'Class Requests',
    path: '/class-requests',
    Component: ViewClassRequestList,
    roles: [UserRole.STAFF]
  },
  classRequestDetail: {
    name: 'Request Details',
    path: '/class-requests/:id',
    Component: ViewClassRequestDetail,
    roles: [UserRole.STAFF]
  },
  recruitmentList: {
    name: 'Recruitments',
    path: '/recruitments',
    Component: ViewRecruitmentList,
    roles: [UserRole.STAFF]
  },
  viewGardenTimesheet: {
    name: 'Schedule',
    path: '/gardens/:id/timesheet',
    Component: ViewGardenTimesheet,
    roles: [UserRole.STAFF, UserRole.GARDEN_MANAGER]
  },
  updateGardenTimesheet: {
    name: 'Update Schedule',
    path: '/gardens/:id/timesheet/update',
    Component: UpdateGardenTimesheet,
    roles: [UserRole.STAFF]
  },
  courseList: {
    name: 'Courses',
    path: '/courses',
    Component: ViewCourseList,
    roles: [UserRole.STAFF]
  },
  courseDetail: {
    name: 'Course Details',
    path: '/courses/:id',
    Component: CourseDetail,
    roles: [UserRole.STAFF]
  },
  courseSessionDetail: {
    name: 'Session Details',
    path: '/courses/:courseId/sessions/:sessionId',
    Component: CourseSessionDetail,
    roles: [UserRole.STAFF]
  },
  classList: {
    name: 'Classes',
    path: '/classes',
    Component: ViewClassList,
    roles: [UserRole.STAFF]
  },
  classDetail: {
    name: 'Class Details',
    path: '/classes/:id',
    Component: ViewClassDetail,
    roles: [UserRole.STAFF]
  },
  classSessionDetail: {
    name: 'Session Details',
    path: '/classes/:classId/sessions/:sessionId',
    Component: ClassSessionDetail,
    roles: [UserRole.STAFF]
  },
  recruitmentDetail: {
    name: 'Recruitment Details',
    path: '/recruitments/:id',
    Component: ViewRecruitmentDetail,
    roles: [UserRole.STAFF]
  },
  addInstructor: {
    name: 'Add Instructor',
    path: '/instructors/add',
    Component: AddInstructor,
    roles: [UserRole.STAFF]
  },
  updateInstructor: {
    name: 'Update Instructor',
    path: '/instructors/:id/update',
    Component: UpdateInstructor,
    roles: [UserRole.STAFF]
  },
  payoutRequestList: {
    name: 'Payout Requests',
    path: '/payout-requests',
    Component: ViewPayoutRequestList,
    roles: [UserRole.STAFF]
  },
  payoutRequestDetail: {
    name: 'Request Details',
    path: '/payout-requests/:id',
    Component: ViewPayoutRequestDetail,
    roles: [UserRole.STAFF]
  },
  courseComboList: {
    name: 'Course Combos',
    path: '/course-combos',
    Component: ViewCourseComboList,
    roles: [UserRole.STAFF]
  },
  courseComboDetail: {
    name: 'Course Combo Details',
    path: '/course-combos/:id',
    Component: ViewCourseComboDetail,
    roles: [UserRole.STAFF]
  },
  transactionList: {
    name: 'Transactions',
    path: '/transactions',
    Component: ViewTransactionList,
    roles: [UserRole.ADMIN]
  },
  transactionDetail: {
    name: 'Transaction Details',
    path: '/transactions/:id',
    Component: ViewTransactionDetail,
    roles: [UserRole.ADMIN]
  },
  statistic: {
    name: 'Statistics',
    path: '/statistic',
    Component: Statistic,
    roles: [UserRole.ADMIN]
  }
}

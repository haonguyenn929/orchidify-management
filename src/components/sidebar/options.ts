import {
  AutoAwesomeMotion,
  Class,
  ContactPage,
  CoPresent,
  CurrencyExchange,
  Home,
  LocalFlorist,
  ManageAccounts,
  MenuBook,
  NoteAlt,
  RequestQuote,
  School,
  BarChart
} from '@mui/icons-material'
import { protectedRoute } from '~/routes/routes'

export const OptionsAdmin = [
  { id: 1, text: 'Dashboard', link: protectedRoute.dashboard.path, Icon: Home },
  { id: 2, text: 'Staff', link: protectedRoute.staffList.path, Icon: ManageAccounts },
  { id: 3, text: 'Transactions', link: protectedRoute.transactionList.path, Icon: CurrencyExchange },
  { id: 8, text: 'Statistics', link: protectedRoute.statistic.path, Icon: BarChart }
]

export const OptionsStaff = [
  { id: 1, text: 'Dashboard', link: protectedRoute.dashboard.path, Icon: Home },
  { id: 2, text: 'Courses', link: protectedRoute.courseList.path, Icon: MenuBook },
  { id: 3, text: 'Course Combos', link: protectedRoute.courseComboList.path, Icon: AutoAwesomeMotion },
  { id: 4, text: 'Classes', link: protectedRoute.classList.path, Icon: Class },
  { id: 5, text: 'Class Requests', link: protectedRoute.classRequestList.path, Icon: NoteAlt },
  { id: 6, text: 'Recruitments', link: protectedRoute.recruitmentList.path, Icon: ContactPage },
  { id: 7, text: 'Instructors', link: protectedRoute.instructorList.path, Icon: CoPresent },
  { id: 8, text: 'Learners', link: protectedRoute.learnerList.path, Icon: School },
  { id: 9, text: 'Gardens', link: protectedRoute.gardenList.path, Icon: LocalFlorist },
  { id: 10, text: 'Garden Managers', link: protectedRoute.gardenManagerList.path, Icon: ManageAccounts },
  { id: 11, text: 'Payout Requests', link: protectedRoute.payoutRequestList.path, Icon: RequestQuote }
]

export const OptionsGardenManager = [
  { id: 1, text: 'Dashboard', link: protectedRoute.dashboard.path, Icon: Home },
  { id: 2, text: 'Gardens', link: protectedRoute.gardenList.path, Icon: LocalFlorist }
]

import { Chip, SxProps, Theme } from '@mui/material'
import { RecruitmentStatus } from '~/global/app-status'
import { baseTagStyles } from './tag.styles'

interface RecruitmentStatusTagProps {
  type: RecruitmentStatus
}

const RecruitmentStatusTag = ({ type }: RecruitmentStatusTagProps) => {
  let label = ''
  let styles: SxProps<Theme> | undefined = undefined

  switch (type) {
    case RecruitmentStatus.PENDING: {
      label = 'Pending'
      styles = {
        backgroundColor: '#d4f7ff',
        '& .MuiChip-label': { color: '#5badd0' }
      }
      break
    }
    case RecruitmentStatus.INTERVIEWING: {
      label = 'Interviewing'
      styles = {
        backgroundColor: '#ffcf221f',
        '& .MuiChip-label': { color: '#ffcf22' }
      }
      break
    }
    case RecruitmentStatus.SELECTED: {
      label = 'Accepted'
      styles = {
        backgroundColor: '#20c0171f',
        '& .MuiChip-label': { color: '#20c017' }
      }
      break
    }
    case RecruitmentStatus.REJECTED: {
      label = 'Rejected'
      styles = {
        backgroundColor: '#f668681f',
        '& .MuiChip-label': { color: '#f66868' }
      }
      break
    }
    case RecruitmentStatus.EXPIRED: {
      label = 'Expired'
      styles = {
        backgroundColor: '#0000000a',
        '& .MuiChip-label': { color: '#0000007a' }
      }
      break
    }
  }

  return <Chip label={label} sx={[baseTagStyles, ...(Array.isArray(styles) ? styles : [styles])]} />
}

export default RecruitmentStatusTag

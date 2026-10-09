import { Chip, SxProps, Theme } from '@mui/material'
import { CourseStatus } from '~/global/app-status'
import { baseTagStyles } from './tag.styles'

interface CourseStatusTagProps {
  type: CourseStatus
}

const CourseStatusTag = ({ type }: CourseStatusTagProps) => {
  let label = ''
  let styles: SxProps<Theme> | undefined = undefined

  switch (type) {
    case CourseStatus.DRAFT: {
      label = 'Draft'
      styles = {
        backgroundColor: '#0000000a',
        '& .MuiChip-label': { color: '#0000007a' }
      }
      break
    }
    case CourseStatus.REQUESTING: {
      label = 'Pending'
      styles = {
        backgroundColor: '#d4f7ff',
        '& .MuiChip-label': { color: '#5badd0' }
      }
      break
    }
    case CourseStatus.ACTIVE: {
      label = 'Published'
      styles = {
        display: 'none'
      }
      break
    }
  }

  return (
    <Chip
      label={label}
      variant='filled'
      sx={[baseTagStyles, ...(Array.isArray(styles) ? styles : [styles])]}
    />
  )
}

export default CourseStatusTag

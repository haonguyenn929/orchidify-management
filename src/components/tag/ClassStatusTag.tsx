import { Chip, SxProps, Theme } from '@mui/material'
import { ClassStatus } from '~/global/app-status'
import { baseTagStyles } from './tag.styles'

interface ClassStatusTagProps {
  type: ClassStatus
}

const ClassStatusTag = ({ type }: ClassStatusTagProps) => {
  let label = ''
  let styles: SxProps<Theme> | undefined = undefined

  switch (type) {
    case ClassStatus.PUBLISHED: {
      label = 'Published'
      styles = {
        backgroundColor: '#ffcf221f',
        '& .MuiChip-label': { color: '#ffcf22' }
      }
      break
    }
    case ClassStatus.IN_PROGRESS: {
      label = 'In Progress'
      styles = {
        backgroundColor: '#20c0171f',
        '& .MuiChip-label': { color: '#20c017' }
      }
      break
    }
    case ClassStatus.COMPLETED: {
      label = 'Completed'
      styles = {
        backgroundColor: '#f668681f',
        '& .MuiChip-label': { color: '#f66868' }
      }
      break
    }
    case ClassStatus.CANCELED: {
      label = 'Canceled'
      styles = {
        backgroundColor: '#7575751f',
        '& .MuiChip-label': { color: '#757575' }
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

export default ClassStatusTag

import { Chip, SxProps, Theme } from '@mui/material'
import { RequestStatus } from '~/global/app-status'
import { baseTagStyles } from './tag.styles'

interface RequestStatusTagProps {
  type: RequestStatus
}

const RequestStatusTag = ({ type }: RequestStatusTagProps) => {
  let label = ''
  let styles: SxProps<Theme> | undefined = undefined

  switch (type) {
    case RequestStatus.PENDING: {
      label = 'Pending'
      styles = {
        backgroundColor: '#d4f7ff',
        '& .MuiChip-label': { color: '#5badd0' }
      }
      break
    }
    case RequestStatus.APPROVED: {
      label = 'Accepted'
      styles = {
        backgroundColor: '#20c0171f',
        '& .MuiChip-label': { color: '#20c017' }
      }
      break
    }
    case RequestStatus.REJECTED: {
      label = 'Rejected'
      styles = {
        backgroundColor: '#f668681f',
        '& .MuiChip-label': { color: '#f66868' }
      }
      break
    }
    case RequestStatus.EXPIRED: {
      label = 'Expired'
      styles = {
        backgroundColor: '#0000000a',
        '& .MuiChip-label': { color: '#0000007a' }
      }
      break
    }
    case RequestStatus.CANCELED: {
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

export default RequestStatusTag

import { Chip, SxProps, Theme } from '@mui/material'
import { TransactionStatus } from '~/global/app-status'
import { baseTagStyles } from './tag.styles'

interface TransactionStatusTagProps {
  type: TransactionStatus
}

const TransactionStatusTag = ({ type }: TransactionStatusTagProps) => {
  let label = ''
  let styles: SxProps<Theme> | undefined = undefined

  switch (type) {
    case TransactionStatus.CAPTURED: {
      label = 'Success'
      styles = {
        backgroundColor: '#20c0171f',
        '& .MuiChip-label': { color: '#20c017' }
      }
      break
    }
    case TransactionStatus.ERROR: {
      label = 'Failed'
      styles = {
        backgroundColor: '#f668681f',
        '& .MuiChip-label': { color: '#f66868' }
      }
      break
    }
    case TransactionStatus.REFUNDED: {
      label = 'Refund'
      styles = {
        backgroundColor: '#ffcf221f',
        '& .MuiChip-label': { color: '#ffcf22' }
      }
      break
    }
  }

  return <Chip label={label} sx={[baseTagStyles, ...(Array.isArray(styles) ? styles : [styles])]} />
}

export default TransactionStatusTag

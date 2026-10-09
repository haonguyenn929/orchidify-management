import { Chip, SxProps, Theme } from '@mui/material'
import { ReactNode } from 'react'
import { UserStatus } from '~/global/app-status'
import { baseTagStyles } from './tag.styles'

interface UserStatusTagProps {
  type: UserStatus
}

const UserStatusTag = ({ type }: UserStatusTagProps): ReactNode => {
  let label = ''
  let styles: SxProps<Theme> | undefined = undefined

  switch (type) {
    case UserStatus.ACTIVE: {
      label = 'Active'
      styles = {
        backgroundColor: '#20c0171f',
        '& .MuiChip-label': { color: '#20c017' }
      }
      break
    }
    case UserStatus.INACTIVE: {
      label = 'Inactive'
      styles = {
        backgroundColor: '#f668681f',
        '& .MuiChip-label': { color: '#f66868' }
      }
      break
    }
  }

  return <Chip label={label} sx={[baseTagStyles, ...(Array.isArray(styles) ? styles : [styles])]} />
}

export default UserStatusTag

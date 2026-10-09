import { SxProps, Theme } from '@mui/material'

export const baseTagStyles: SxProps<Theme> = {
  width: '100px',
  justifyContent: 'center',
  '& .MuiChip-label': {
    px: 1,
    textAlign: 'center'
  }
}

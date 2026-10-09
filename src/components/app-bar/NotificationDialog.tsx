import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Popover,
  ListSubheader,
  Typography,
  Divider
} from '@mui/material'
import dayjs from 'dayjs'
import { collection, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { bindPopover, PopupState } from 'material-ui-popup-state/hooks'
import { memo, useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '~/auth/useAuth'
import { NotificationDto } from '~/data/notification.dto'
import { db } from '~/utils/firebase/firestore'
import { formatNotificationType } from '~/utils/format'

type NotificationDialogProps = {
  popupState: PopupState
}

const NotificationDialog = memo(({ popupState }: NotificationDialogProps) => {
  const { userTokenPayload } = useAuth()

  const [notifications, setNotifications] = useState<NotificationDto[]>([])

  const loadNotification = useCallback(() => {
    if (!db) return
    const notificationQuery = query(
      collection(db, 'notification'),
      where('receiverIds', 'array-contains', userTokenPayload?.sub),
      orderBy('createdAt', 'desc'),
      limit(100)
    )

    const unsubscribe = onSnapshot(notificationQuery, (querySnapshot) => {
      const fetchedNotifications: NotificationDto[] = []
      querySnapshot.forEach((doc) => {
        fetchedNotifications.push({ id: doc.id, ...doc.data() } as NotificationDto)
      })

      setNotifications(fetchedNotifications)
    })

    return unsubscribe
  }, [userTokenPayload?.sub])

  useEffect(() => {
    const unsubscribe = loadNotification()
    return () => unsubscribe?.()
  }, [loadNotification])

  const groupedNotifications = notifications.reduce(
    (acc, notification) => {
      const isToday = dayjs().isSame(notification.createdAt.toDate(), 'day')
      if (isToday) {
        acc.today.push(notification)
      } else {
        acc.earlier.push(notification)
      }
      return acc
    },
    { today: [] as NotificationDto[], earlier: [] as NotificationDto[] }
  )

  const formatRelativeTime = (date: Date) => {
    const diffMins = dayjs().diff(date, 'minute')
    const diffHours = dayjs().diff(date, 'hour')
    const diffDays = dayjs().diff(date, 'day')
    const diffWeeks = dayjs().diff(date, 'week')
    const diffMonths = dayjs().diff(date, 'month')
    const diffYears = dayjs().diff(date, 'year')

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffWeeks < 4) return `${diffWeeks} weeks ago`
    if (diffMonths < 12) return `${diffMonths} months ago`
    return `${diffYears} years ago`
  }

  return (
    <Popover
      {...bindPopover(popupState)}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
    >
      <Typography
        sx={{
          color: '#000',
          p: '12px 16px',
          fontWeight: 500
        }}
      >
        Notifications
      </Typography>
      <Divider />
      <Paper sx={{ width: 350, height: 650, overflow: 'auto' }}>
        {notifications.length > 0 ? (
          <List disablePadding>
            {groupedNotifications.today.length > 0 && (
              <ListSubheader sx={{ fontSize: 16, color: '#000', lineHeight: 2.25 }}>Today</ListSubheader>
            )}
            {groupedNotifications.today.map((notification) => (
              <ListItem key={notification.id} disableGutters disablePadding>
                <ListItemButton
                  sx={{ flexDirection: 'column', alignItems: 'flex-start' }}
                  component={Link}
                  to={
                    formatNotificationType(notification.data.type) === ''
                      ? ''
                      : `/${formatNotificationType(notification.data.type)}/${notification.data.id}`
                  }
                >
                  <ListItemText
                    primary={notification.title}
                    secondary={notification.body}
                    secondaryTypographyProps={{ py: 0.25 }}
                  />
                  <ListItemText secondary={formatRelativeTime(notification.createdAt.toDate())} />
                </ListItemButton>
              </ListItem>
            ))}

            {groupedNotifications.earlier.length > 0 && (
              <ListSubheader sx={{ fontSize: 16, color: '#000', lineHeight: 2.25 }}>Earlier</ListSubheader>
            )}
            {groupedNotifications.earlier.map((notification) => (
              <ListItem key={notification.id} disableGutters disablePadding>
                <ListItemButton
                  sx={{ flexDirection: 'column', alignItems: 'flex-start' }}
                  component={Link}
                  to={
                    formatNotificationType(notification.data.type) === ''
                      ? ''
                      : `/${formatNotificationType(notification.data.type)}/${notification.data.id}`
                  }
                >
                  <ListItemText
                    primary={notification.title}
                    secondary={notification.body}
                    secondaryTypographyProps={{ py: 0.25 }}
                  />
                  <ListItemText secondary={formatRelativeTime(notification.createdAt.toDate())} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textWrap: 'nowrap',
              fontStyle: 'italic'
            }}
          >
            No new notifications
          </Typography>
        )}
      </Paper>
    </Popover>
  )
})

export default NotificationDialog

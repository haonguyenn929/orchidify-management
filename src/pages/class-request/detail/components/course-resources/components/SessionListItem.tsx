import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { ListItemButton, ListItemText, Collapse, Box, Typography, Divider } from '@mui/material'
import Carousel from '~/components/slider/Carousel'
import { SessionDto } from '~/data/course.dto'
import { APP_MESSAGE } from '~/global/app-message'
import AssignmentDetailInformation from './AssignmentDetailInformation'

interface SessionListItemProps {
  session: SessionDto
  open: boolean
  onClick: () => void
}

const SessionListItem = ({ session, open, onClick }: SessionListItemProps) => {
  const videos = session.media.filter((value) => value.resource_type === 'video')

  const images = session.media.filter((value) => value.resource_type === 'image')

  return (
    <>
      <ListItemButton onClick={onClick}>
        <ListItemText
          primary={
            <Typography variant='body1' fontWeight={600}>
              Session #{session.sessionNumber}: {session.title}
            </Typography>
          }
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout='auto' unmountOnExit sx={{ width: '100%', padding: '0.5rem 1rem' }}>
        {/* <Box display='flex' alignItems='center' marginBottom='1.25rem'>
          <Typography variant='h2' sx={{ fontSize: '1.5rem', fontWeight: 700, paddingRight: '0.75rem' }}>
            Session Content
          </Typography>
          <Divider sx={{ flexGrow: 1 }} />
        </Box> */}
        <Box key={session.title}>
          {/* <Box display='flex' gap='1rem' marginBottom='1.25rem'>
            <Box display='flex' flexDirection='column' justifyContent='space-between' flexGrow='1'>
              <Typography variant='subtitle1' fontWeight={600}>
                Session #{session.sessionNumber}: {session.title}
              </Typography>
            </Box>
          </Box> */}
          <Box marginBottom='1.25rem'>
            <Typography variant='subtitle1' fontWeight={600} marginBottom='0.5rem'>
              Description
            </Typography>
            <Typography variant='subtitle1' fontWeight={400}>
              {session.description}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 4 }}>
            {videos.length > 0 && (
              <Box display='flex' flexDirection='column' gap='0.5rem' width='50%'>
                <Typography variant='subtitle1' fontWeight={600}>
                  Session Video
                </Typography>
                {videos.map((value) => (
                  <video
                    key={value.public_id}
                    controls
                    style={{ width: '100%', borderRadius: 4, backgroundColor: '#00000025' }}
                  >
                    <source src={value.url} type='video/mp4' />
                    {APP_MESSAGE.LOAD_DATA_FAILED('video')}
                  </video>
                ))}
              </Box>
            )}

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                width: session.media.some((value) => value.resource_type === 'video') ? '50%' : '100%'
              }}
            >
              <Typography variant='subtitle1' fontWeight={600}>
                Session Resources
              </Typography>
              <Carousel
                {...(videos.length > 0 && {
                  slidesToShow: 3,
                  responsive: [
                    {
                      breakpoint: 1440,
                      settings: {
                        slidesToShow: 2
                      }
                    }
                  ]
                })}
              >
                {images.map((value) => (
                  <div
                    key={value.public_id}
                    style={{
                      boxSizing: 'border-box'
                    }}
                  >
                    <div style={{ width: '200px', height: '200px', padding: '0 2px' }}>
                      <img
                        src={value.url}
                        alt={`Lesson resource ${value.public_id}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    </div>
                  </div>
                ))}
              </Carousel>
            </Box>
          </Box>
        </Box>
        {/*
          Only allow 1 assignment per session 
        */}
        {session.assignments.length > 0 ? (
          <>
            <Divider sx={{ margin: '1.25rem 0' }} />
            <AssignmentDetailInformation assignment={session.assignments[0]} />
          </>
        ) : null}
      </Collapse>
    </>
  )
}

export default SessionListItem

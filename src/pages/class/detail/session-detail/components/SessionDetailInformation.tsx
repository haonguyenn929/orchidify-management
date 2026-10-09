import { Box, Divider, Paper, Typography } from '@mui/material'
import Carousel from '~/components/slider/Carousel'
import { SessionDto } from '~/data/course.dto'
import { APP_MESSAGE } from '~/global/app-message'

const SessionDetailInformation = ({ session }: { session: SessionDto }) => {
  const { sessionNumber, title, description, media } = session

  return (
    <Paper sx={{ width: '100%', marginTop: '1.25rem', padding: '1.5rem' }}>
      <Box display='flex' alignItems='center' marginBottom='1.25rem'>
        <Typography variant='h2' sx={{ fontSize: '1.5rem', fontWeight: 700, paddingRight: '0.75rem' }}>
          Lesson Information
        </Typography>
        <Divider sx={{ flexGrow: 1 }} />
      </Box>
      <Box display='flex' gap='1rem' marginBottom='1.25rem'>
        <Box display='flex' flexDirection='column' justifyContent='space-between' flexGrow='1'>
          <Typography variant='subtitle1' fontWeight={600}>
            Lesson #{sessionNumber}: {title}
          </Typography>
        </Box>
      </Box>
      <Box marginBottom='1.25rem'>
        <Typography variant='subtitle1' fontWeight={600} marginBottom='0.5rem'>
          Description
        </Typography>
        <Typography variant='subtitle1' fontWeight={400}>
          {description}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 4 }}>
        {media.some((value) => value.resource_type === 'video') && (
          <Box display='flex' flexDirection='column' gap='0.5rem' width='50%'>
            <Typography variant='subtitle1' fontWeight={600}>
              Session Video
            </Typography>
            {media
              .filter((value) => value.resource_type === 'video')
              .map((value) => (
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
            slidesToShow={3}
            responsive={[
              {
                breakpoint: 1440,
                settings: {
                  slidesToShow: 2
                }
              }
            ]}
          >
            {media
              .filter((value) => value.resource_type === 'image')
              .map((value) => (
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
    </Paper>
  )
}

export default SessionDetailInformation

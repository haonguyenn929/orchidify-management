import { InsertDriveFileOutlined } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import Carousel from '~/components/slider/Carousel'
import { AssignmentDto } from '~/data/course.dto'

const AssignmentDetailInformation = ({ assignment }: { assignment: AssignmentDto }) => {
  const { title, description, attachments } = assignment

  const handleDownload = (url: string) => {
    const pdfUrl = url
    const link = document.createElement('a')
    link.href = pdfUrl
    link.target = '_blank'
    link.download = 'document.pdf' // specify the filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <Box display='flex' gap='1rem' marginBottom='1.25rem'>
        <Box display='flex' flexDirection='column' justifyContent='space-between' flexGrow='1'>
          <Typography variant='subtitle1' fontWeight={600}>
            Assignments: {title}
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
      <Box>
        <Typography variant='subtitle1' fontWeight={600} marginBottom='0.5rem'>
          Documents
        </Typography>
        <Carousel>
          {attachments.map((value, index) => (
            <div
              key={index}
              style={{
                boxSizing: 'border-box'
              }}
            >
              <div style={{ width: '200px', height: '200px', padding: '0 2px' }}>
                {value.resource_type === 'image' ? (
                  <img
                    src={value.url}
                    alt={`Assignment resource ${value.public_id}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                  />
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      background: '#f4f4f4',
                      width: 'fit-content',
                      p: 2.5,
                      borderRadius: 2,
                      border: '2px solid #d7d7d7',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleDownload(value.url)}
                  >
                    <InsertDriveFileOutlined />
                    <Typography variant='subtitle1'>{value.public_id}</Typography>
                  </Box>
                )}
              </div>
            </div>
          ))}
        </Carousel>
      </Box>
    </>
  )
}

export default AssignmentDetailInformation

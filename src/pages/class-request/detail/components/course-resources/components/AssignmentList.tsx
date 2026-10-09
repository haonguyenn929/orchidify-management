import { Paper, Box, Typography, Divider } from '@mui/material'
import { InsertDriveFileOutlined } from '@mui/icons-material'
import Carousel from '~/components/slider/Carousel'
import { AssignmentDto } from '~/data/course.dto'

interface AssignmentListProps {
  assignments: Array<AssignmentDto>
}

const AssignmentList = ({ assignments }: AssignmentListProps) => {
  const handleDownload = (url: string) => {
    const pdfUrl = url
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = 'document.pdf' // specify the filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Paper sx={{ width: '100%', marginY: '1.25rem', padding: '1.5rem' }}>
      <Box display='flex' alignItems='center' marginBottom='1.25rem'>
        <Typography variant='h2' sx={{ fontSize: '1.5rem', fontWeight: 700, paddingRight: '0.75rem' }}>
          Assignment Information
        </Typography>
        <Divider sx={{ flexGrow: 1 }} />
      </Box>
      {assignments.map((assignment, index) => (
        <Box key={assignment.title}>
          <Box display='flex' gap='1rem' marginBottom='1.25rem'>
            <Box display='flex' flexDirection='column' justifyContent='space-between' flexGrow='1'>
              <Typography variant='subtitle1' fontWeight={600}>
                Assignments #{index + 1}: {assignment.title}
              </Typography>
            </Box>
          </Box>
          <Box marginBottom='1.25rem'>
            <Typography variant='subtitle1' fontWeight={600} marginBottom='0.5rem'>
              Description
            </Typography>
            <Typography variant='subtitle1' fontWeight={400}>
              {assignment.description}
            </Typography>
          </Box>
          <Box>
            <Typography variant='subtitle1' fontWeight={600} marginBottom='0.5rem'>
              Documents
            </Typography>
            <Carousel>
              {assignment.attachments.map((value, index) => (
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
                        alt={`Lesson resource ${value.public_id}`}
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
            {index !== assignments.length - 1 ? <Divider sx={{ margin: '1.25rem 0' }} /> : null}
          </Box>
        </Box>
      ))}
    </Paper>
  )
}

export default AssignmentList

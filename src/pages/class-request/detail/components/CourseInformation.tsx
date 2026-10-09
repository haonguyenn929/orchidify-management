import { Box, Divider, Paper, Rating, Typography } from '@mui/material'
import Carousel from '~/components/slider/Carousel'
import { ClassRequestMetadataDto, ClassRequestCreatedByDto, ClassRequestClassDto } from '~/data/classRequest.dto'
import { RequestType } from '~/global/constants'
import { formatCourseLevel, formatCurrency } from '~/utils/format'

interface FieldProps {
  label: string
  content?: string
  rate?: number
}

const Field: React.FC<FieldProps> = ({ label, content, rate }) => (
  <Box display='flex'>
    <Typography variant='subtitle1' fontWeight={600} width={'180px'}>
      {label}
    </Typography>
    {content && (
      <Typography variant='subtitle1' fontWeight={400}>
        {content}
      </Typography>
    )}
    {rate && (
      <Box display='flex'>
        <Rating defaultValue={rate} precision={0.5} readOnly />
        <Typography variant='body1' marginLeft='0.5rem'>
          {rate}
        </Typography>
      </Box>
    )}
  </Box>
)

interface CourseInformationProps {
  type: RequestType
  course: ClassRequestMetadataDto | ClassRequestClassDto
  createdBy: ClassRequestCreatedByDto | string
}

const CourseInformation = ({ type, course, createdBy }: CourseInformationProps) => {
  return (
    <Paper sx={{ width: '100%', marginTop: '1.25rem', padding: '1.5rem' }}>
      <Box display='flex' alignItems='center' marginBottom='1.25rem'>
        <Typography variant='h2' sx={{ fontSize: '1.5rem', fontWeight: 700, paddingRight: '0.75rem' }}>
          Course Details
        </Typography>
        <Divider sx={{ flexGrow: 1 }} />
      </Box>
      <Box display='flex' gap='1rem' marginBottom='1.25rem'>
        <Box width='250px' height='250px'>
          <img
            src={course.thumbnail}
            alt={course.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
          />
        </Box>
        <Box display='flex' flexDirection='column' gap={1} flexGrow='1'>
          {type === RequestType.PUBLISH_CLASS ? (
            <Field label='Course Code' content={course.code} />
          ) : (
            <Field label='Course Code' content={course.course?.code} />
          )}
          <Field label='Course Name' content={course.title} />
          <Field label='Instructors' content={typeof createdBy === 'string' ? '' : createdBy.name} />
          <Field label='Price' content={formatCurrency(course.price)} />
          <Field label='Level' content={formatCourseLevel(course.level)} />
          <Field label='Category' content={course.type.join(', ')} />
          <Field label='Learner Limit' content={course.learnerLimit.toString()} />
          <Field label='Duration' content={`${course.duration} weeks`} />
          {course.rate !== undefined ? <Field label='Feedback' rate={course.rate} /> : null}
        </Box>
      </Box>
      <Box marginBottom='1.25rem'>
        <Typography variant='subtitle1' fontWeight={600} marginBottom='0.5rem'>
          Description
        </Typography>
        <Typography variant='subtitle1' fontWeight={400}>
          {course.description}
        </Typography>
      </Box>
      <Box marginBottom='1.25rem'>
        <Typography variant='subtitle1' fontWeight={600} marginBottom='0.5rem'>
          Required Toolkits
        </Typography>
        <Typography variant='subtitle1' fontWeight={400}>
          {course.gardenRequiredToolkits}
        </Typography>
      </Box>
      <Box>
        <Typography variant='subtitle1' fontWeight={600} marginBottom='0.5rem'>
          Course Images
        </Typography>
        <Carousel>
          {course.media.map((media) => (
            <div
              key={media.public_id}
              style={{
                boxSizing: 'border-box'
              }}
            >
              <div style={{ width: '200px', height: '200px', padding: '0 2px' }}>
                <img
                  src={media.url}
                  alt={`Course Image ${media.public_id}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                />
              </div>
            </div>
          ))}
        </Carousel>
      </Box>
    </Paper>
  )
}

export default CourseInformation

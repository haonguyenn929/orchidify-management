import { Delete } from '@mui/icons-material'
import { IconButton, ImageListItem, ImageListItemBar, useTheme } from '@mui/material'
import { FieldValues, UseControllerProps } from 'react-hook-form'
import { CloudinaryFileUploadedInfo } from '~/components/cloudinary/cloudinary-type'
import { ControlledFileAreaUpload } from '~/components/form/ControlledFileUpload'
import Carousel from '~/components/slider/Carousel'
import { FileFormat, FileSize } from '~/global/constants'

interface DisplayFileProps {
  files: CloudinaryFileUploadedInfo[]
  onRemoveFile: (index: number) => void
}

const DisplayFile = ({ files, onRemoveFile }: DisplayFileProps) => {
  const theme = useTheme()

  return files.length > 0 ? (
    <Carousel>
      {files.map((image, index) => (
        <ImageListItem
          key={image.public_id}
          sx={{ width: '200px !important', height: '200px !important', padding: '0 2px' }}
        >
          <img
            src={image.url}
            alt={image.display_name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
          />
          <ImageListItemBar
            sx={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' + 'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
            }}
            position='top'
            actionIcon={
              <IconButton sx={{ color: theme.palette.error.main }} onClick={() => onRemoveFile(index)}>
                <Delete />
              </IconButton>
            }
            actionPosition='right'
          />
        </ImageListItem>
      ))}
    </Carousel>
  ) : null
}

interface GardenImageUploadProps<TFieldValues extends FieldValues> {
  controller: UseControllerProps<TFieldValues>
}

const GardenImageUpload = <TFieldValues extends FieldValues>({ controller }: GardenImageUploadProps<TFieldValues>) => {
  return (
    <>
      <ControlledFileAreaUpload
        controller={controller}
        label='Garden Images'
        clientAllowedFormats={[FileFormat.jpeg, FileFormat.jpg, FileFormat.png]}
        multiple
        minFile={1}
        maxFiles={8}
        maxFileSize={FileSize['5MB']}
        FileDisplayComponent={DisplayFile}
      />
    </>
  )
}

export default GardenImageUpload

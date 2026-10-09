import { FC, useEffect, useState } from 'react'
import { Box, FormHelperText, InputLabel, OutlinedInput, Typography, useTheme } from '@mui/material'
import { FieldValues, useController, UseControllerProps } from 'react-hook-form'
import { Cloud } from '@mui/icons-material'
import CloudinaryUploadWidget from '../cloudinary/CloudinaryUploadWidget'
import { CloudinaryFileUploadedInfo } from '../cloudinary/cloudinary-type'

interface ControlledFileInputProps<TFieldValues extends FieldValues> {
  controller: UseControllerProps<TFieldValues>
  label: string
  multiple?: boolean
  minFile: number
  maxFiles?: number
  clientAllowedFormats?: string[]
  maxFileSize?: { text: string; size: number }
  onUploadSuccess?: (files: CloudinaryFileUploadedInfo[]) => void
  FileDisplayComponent?: FC<{ files: CloudinaryFileUploadedInfo[]; onRemoveFile: (index: number) => void }>
}

export const ControlledFileFieldUpload = <TFieldValues extends FieldValues>({
  controller,
  label,
  multiple,
  minFile,
  maxFiles = 20,
  clientAllowedFormats,
  maxFileSize,
  onUploadSuccess
}: ControlledFileInputProps<TFieldValues>) => {
  const {
    field: { onChange, ...field },
    fieldState: { error }
  } = useController(controller)
  const [selectedFiles, setSelectedFiles] = useState<CloudinaryFileUploadedInfo[]>([])

  useEffect(() => {
    onChange(selectedFiles)
    if (onUploadSuccess) onUploadSuccess(selectedFiles)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFiles])

  const handleUploadSuccess = (info: CloudinaryFileUploadedInfo) => {
    if (multiple) {
      setSelectedFiles((prev) => [...prev, info])
    } else {
      setSelectedFiles([info])
    }
  }

  return (
    <Box>
      <InputLabel sx={{ marginBottom: '0.7rem', color: '#000000' }}>{label}</InputLabel>
      <Box display='flex'>
        <CloudinaryUploadWidget
          buttonStyle={{ marginRight: '8px' }}
          onSuccess={handleUploadSuccess}
          minFile={minFile}
          maxFiles={maxFiles - selectedFiles.length}
          clientAllowedFormats={clientAllowedFormats}
          maxFileSize={maxFileSize}
          multiple={multiple}
        />
        <OutlinedInput
          {...field}
          size='small'
          value={selectedFiles.map((file: CloudinaryFileUploadedInfo) => file.original_filename).join(', ')}
          disabled={!error}
          readOnly={!!error}
          error={!!error}
          sx={{
            flexGrow: 1
          }}
        />
      </Box>
      {error ? <FormHelperText error>{error.message}</FormHelperText> : null}
    </Box>
  )
}

export const ControlledFileAreaUpload = <TFieldValues extends FieldValues>({
  controller,
  label,
  multiple,
  minFile,
  maxFiles = 20,
  clientAllowedFormats,
  maxFileSize,
  onUploadSuccess,
  FileDisplayComponent
}: ControlledFileInputProps<TFieldValues>) => {
  const theme = useTheme()
  const {
    field: { value, onChange },
    fieldState: { error }
  } = useController(controller)
  const [selectedFiles, setSelectedFiles] = useState<CloudinaryFileUploadedInfo[]>(
    value as CloudinaryFileUploadedInfo[]
  )

  useEffect(() => {
    onChange(selectedFiles)
    if (onUploadSuccess) onUploadSuccess(selectedFiles)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFiles])

  const handleUploadSuccess = (info: CloudinaryFileUploadedInfo) => {
    if (multiple) {
      setSelectedFiles((prev) => [...prev, info])
    } else {
      setSelectedFiles([info])
    }
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)])
  }

  return (
    <Box>
      <InputLabel sx={{ marginBottom: '0.7rem', color: '#000000' }}>{label}</InputLabel>
      {FileDisplayComponent ? <FileDisplayComponent files={selectedFiles} onRemoveFile={handleRemoveFile} /> : null}
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        minHeight={200}
        border={`1px solid ${error ? theme.palette.error.main : '#0000001F'}`}
      >
        <Box display='flex' flexDirection='column' alignItems='center' paddingBottom={2}>
          <Cloud sx={{ width: 35, height: 35 }} color='primary' />
          <Typography variant='caption' margin='10px 0'>
            Click to upload
          </Typography>
          <CloudinaryUploadWidget
            buttonStyle={{ width: 'fit-content' }}
            onSuccess={handleUploadSuccess}
            minFile={minFile}
            maxFiles={maxFiles - selectedFiles.length}
            clientAllowedFormats={clientAllowedFormats}
            maxFileSize={maxFileSize}
            multiple={multiple}
          />
        </Box>
      </Box>
      {error ? <FormHelperText error>{error.message}</FormHelperText> : null}
    </Box>
  )
}

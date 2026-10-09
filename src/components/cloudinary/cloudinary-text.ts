export const text = {
  vi: {
    or: 'Or',
    back: 'Back',
    advanced: 'Advanced',
    close: 'Close',
    menu: {
      files: 'My files '
    },
    notifications: {
      limit_reached: 'No more files can be selected.'
    },
    queue: {
      title: 'Upload queue',
      title_uploading_with_counter: 'Uploading {{num}} files',
      title_processing_with_counter: 'Processing {{num}} files',
      title_uploading_processing_with_counters: 'Uploading {{uploading}} files, processing {{processing}} files',
      title_uploading: 'Uploading file',
      mini_title: 'Uploaded',
      mini_title_uploading: 'Uploading',
      mini_title_processing: 'Processing',
      show_completed: 'Show completed',
      retry_failed: 'Retry failed files',
      abort_all: 'Cancel All',
      upload_more: 'Upload more',
      done: 'Xong',
      mini_upload_count: '{{num}} uploaded',
      mini_failed: '{{num}} failed',
      statuses: {
        uploading: 'Uploading...',
        processing: 'Processing...',
        timeout: 'A large file is being uploaded. It may take a while to appear in your environment.',
        error: 'Error',
        uploaded: 'Completed',
        aborted: 'Canceled'
      }
    },
    uploader: {
      filesize: {
        na: 'Not available',
        b: '{{size}} Bytes',
        k: '{{size}} KB',
        m: '{{size}} MB',
        g: '{{size}} GB',
        t: '{{size}} TB'
      },
      errors: {
        file_too_large: 'File size ({{size}}) exceeds allowed limit ({{allowed}})',
        max_dimensions_validation:
          'Image dimensions ({{width}}X{{height}}) are larger than max allowed: ({{maxWidth}}X{{maxHeight}})',
        min_dimensions_validation:
          'Image dimensions ({{width}}X{{height}}) are smaller than min required: ({{minWidth}}X{{minHeight}})',
        unavailable: 'Not available',
        max_number_of_files: 'Number of files exceeds limit',
        allowed_formats: 'File format not allowed',
        max_file_size: 'File too large',
        min_file_size: 'File too small'
      },
      close_mid_upload: 'Uploads in progress. Click OK to abort.'
    },
    local: {
      browse: 'Approve',
      dd_title_single: 'Drag and drop a file here',
      dd_title_multi: 'Drag and drop files here',
      drop_title_single: 'Drop file to upload',
      drop_title_multiple: 'Drop files to upload'
    }
  }
}

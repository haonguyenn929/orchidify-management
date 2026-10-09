export const APP_MESSAGE = {
  REQUIRED_FIELD: (name: string = '') => `${name} is required`,
  FIELD_TOO_LONG: (name: string = '', maxLength: number = 0) => `${name} cannot exceed ${maxLength} characters`,
  WRONG_EMAIL_FORMAT: 'Please enter a valid email address.',
  LOGIN_SUCCESS: 'Sign in successful',
  LOGIN_FAIL: 'Sign in failed. Please try again.',
  CONFIRM_ACTION: (action: string = '', object: string = '') => `Are you sure you want to ${action}${object ? ' ' + object : ''}?`,
  ACTION_SUCCESS: (action: string = '') => `${action} successfully.`,
  ACTION_FAILED: (action: string = '') => `${action} failed. Please try again.`,
  LOAD_DATA_FAILED: (data: string = '') => `An error occurred while loading ${data}. Please try again later.`,
  INVALID_FILE_FORMAT_OR_SIZE: (format: string, size: string) =>
    `Media must be in supported format (${format}) and size not exceeding ${size}`,
  INCORRECT_NUMBER_OF_FILES: (min: number, max: number) => `Number of files must be between ${min} and ${max}.`,
  INVALID_VALUE: (valueList: string[]) =>
    `Only accepted values: ${valueList.join(', ')}`,
  VALUE_OUT_OF_RANGE: (min: number | string, max: number | string) =>
    `Value must be between ${min} and ${max}.`,
  WRONG_PHONE_FORMAT: 'Phone number must be 10 characters and start with 0.'
}

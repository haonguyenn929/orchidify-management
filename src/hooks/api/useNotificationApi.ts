import { useCallback } from 'react'
import { useProtectedApi } from './useProtectedApi'
import { SuccessResponseDto } from '~/data/common.dto'
import { ErrorResponseDto } from '~/data/error.dto'
import { APP_MESSAGE } from '~/global/app-message'

const ROOT_ENDPOINT = '/notifications/user-devices'

interface RegisterUserDeviceRequest {
  fcmToken: string
  browser: string
  os: string
}

export const useNotificationApi = () => {
  const { callAppProtectedApi } = useProtectedApi()

  const registerUserDevice = useCallback(
    async (request: RegisterUserDeviceRequest) => {
      const result = await callAppProtectedApi<SuccessResponseDto>(ROOT_ENDPOINT, 'POST', {}, {}, request)

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.ACTION_SUCCESS('register device for notifications') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  return { registerUserDevice }
}

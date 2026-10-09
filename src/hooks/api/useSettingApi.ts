import { ListResponseDto } from './../../data/common.dto'
import { useCallback } from 'react'
import { useProtectedApi } from './useProtectedApi'
import { CourseTypeSettingDetailResponseDto } from '~/data/setting.dto'
import { ErrorResponseDto } from '~/data/error.dto'
import { APP_MESSAGE } from '~/global/app-message'

const ROOT_ENDPOINT = '/settings'

export const useSettingApi = () => {
  const { callAppProtectedApi } = useProtectedApi()

  const getCourseTypes = useCallback(async () => {
    const endpoint = `${ROOT_ENDPOINT}/course-types`
    const result = await callAppProtectedApi<ListResponseDto<CourseTypeSettingDetailResponseDto>>(
      endpoint,
      'GET',
      {},
      {},
      {}
    )

    if (result) {
      const { data, error } = result
      if (data) return { data: data, error: null }
      if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
    }

    return {
      data: null,
      error: { message: APP_MESSAGE.LOAD_DATA_FAILED('course categories list') } as ErrorResponseDto
    }
  }, [callAppProtectedApi])

  return { getCourseTypes }
}

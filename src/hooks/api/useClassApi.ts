import { useCallback } from 'react'
import { ListResponseDto, SuccessResponseDto } from '~/data/common.dto'
import { ErrorResponseDto } from '~/data/error.dto'
import { APP_MESSAGE } from '~/global/app-message'
import { useProtectedApi } from './useProtectedApi'
import { ClassDetailResponseDto, ClassListItemResponseDto, ClassToolkitRequirementDto } from '~/data/class.dto'
import { SessionDto } from '~/data/course.dto'

const ROOT_ENDPOINT = '/classes/management'

interface CancelClassRequest {
  cancelReason: string
}

export const useClassApi = () => {
  const { callAppProtectedApi } = useProtectedApi()

  const getClassList = useCallback(
    async (
      page = 1,
      pageSize = 10,
      sorting: { field: string; desc: boolean }[] = [],
      filters: { field: string; value: unknown }[] = []
    ) => {
      const endpoint = `${ROOT_ENDPOINT}`
      const sortingFormat = sorting.map((sort) => `${sort.field}.${sort.desc ? 'desc' : 'asc'}`).join('_')
      let filtersFormat = {}
      filters.forEach((filter) => {
        filtersFormat = Object.assign({ [filter.field]: filter.value }, filtersFormat)
      })
      const result = await callAppProtectedApi<ListResponseDto<ClassListItemResponseDto>>(
        endpoint,
        'GET',
        {},
        {
          page,
          limit: pageSize,
          sort: sortingFormat,
          ...filtersFormat
        },
        {}
      )

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.LOAD_DATA_FAILED('class list') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const getClassById = useCallback(
    async (classId: string) => {
      const endpoint = `${ROOT_ENDPOINT}/${classId}`
      const result = await callAppProtectedApi<ClassDetailResponseDto>(endpoint, 'GET', {}, {}, {})

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.LOAD_DATA_FAILED('class information') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const getSessionById = useCallback(
    async (classId: string, sessionId: string) => {
      const endpoint = `${ROOT_ENDPOINT}/${classId}/sessions/${sessionId}`
      const result = await callAppProtectedApi<SessionDto>(endpoint, 'GET')

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.LOAD_DATA_FAILED('session details') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const getClassToolkitRequirements = useCallback(
    async (classId: string) => {
      const endpoint = `${ROOT_ENDPOINT}/${classId}/gardenRequiredToolkits`
      const result = await callAppProtectedApi<ClassToolkitRequirementDto>(endpoint, 'GET')

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.LOAD_DATA_FAILED('class toolkit information') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const completeClass = useCallback(
    async (classId: string) => {
      const endpoint = `${ROOT_ENDPOINT}/${classId}/complete`
      const result = await callAppProtectedApi<SuccessResponseDto>(endpoint, 'PATCH')

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.ACTION_FAILED('End Course') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const cancelClass = useCallback(
    async (classId: string, request: CancelClassRequest) => {
      const endpoint = `${ROOT_ENDPOINT}/${classId}/cancel`
      const result = await callAppProtectedApi<SuccessResponseDto>(endpoint, 'PATCH', {}, {}, request)

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.ACTION_FAILED('Cancel Class') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  return { getClassList, getClassById, getSessionById, getClassToolkitRequirements, completeClass, cancelClass }
}

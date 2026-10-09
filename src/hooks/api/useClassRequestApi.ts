import { useCallback } from 'react'
import { ClassRequestDetailResponseDto, ClassRequestListItemResponseDto } from '~/data/classRequest.dto'
import { useProtectedApi } from './useProtectedApi'
import { APP_MESSAGE } from '~/global/app-message'
import { ErrorResponseDto } from '~/data/error.dto'
import { ListResponseDto, SuccessResponseDto } from '~/data/common.dto'

const ROOT_ENDPOINT = '/class-requests/management'

interface ApproveClassRequest {
  gardenId: string
}

interface RejectClassRequest {
  rejectReason: string
}

export const useClassRequestApi = () => {
  const { callAppProtectedApi } = useProtectedApi()

  const getAllClassRequests = useCallback(
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
      const result = await callAppProtectedApi<ListResponseDto<ClassRequestListItemResponseDto>>(
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
        error: { message: APP_MESSAGE.LOAD_DATA_FAILED('class request list') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const getClassRequestById = useCallback(
    async (classRequestId: string) => {
      const endpoint = `${ROOT_ENDPOINT}/${classRequestId}`
      const result = await callAppProtectedApi<ClassRequestDetailResponseDto>(endpoint, 'GET', {}, {}, {})

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.LOAD_DATA_FAILED('request information') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const approveClassRequest = useCallback(
    async (classRequestId: string, data?: ApproveClassRequest) => {
      const endpoint = `${ROOT_ENDPOINT}/${classRequestId}/approve`
      const result = await callAppProtectedApi<SuccessResponseDto>(endpoint, 'PATCH', {}, {}, data)

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.ACTION_FAILED('Approve Request') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const rejectClassRequest = useCallback(
    async (classRequestId: string, data: RejectClassRequest) => {
      const endpoint = `${ROOT_ENDPOINT}/${classRequestId}/reject`
      const result = await callAppProtectedApi<SuccessResponseDto>(endpoint, 'PATCH', {}, {}, data)

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.ACTION_FAILED('Reject Request') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  return { getAllClassRequests, getClassRequestById, approveClassRequest, rejectClassRequest }
}

import { useCallback } from 'react'
import { ListResponseDto, SuccessResponseDto } from '~/data/common.dto'
import { ErrorResponseDto } from '~/data/error.dto'
import { PayoutRequestDetailDto, PayoutRequestListItemDto } from '~/data/payoutRequest.dto'
import { APP_MESSAGE } from '~/global/app-message'
import { useProtectedApi } from './useProtectedApi'
import { CloudinaryFileUploadedInfo } from '~/components/cloudinary/cloudinary-type'

const ROOT_ENDPOINT = '/payout-requests/management'

interface RejectClassRequest {
  rejectReason: string
}

interface MakePayout {
  transactionCode: string
  attachment: CloudinaryFileUploadedInfo
}

export const usePayoutRequestApi = () => {
  const { callAppProtectedApi } = useProtectedApi()

  const getAllPayoutRequests = useCallback(
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
      const result = await callAppProtectedApi<ListResponseDto<PayoutRequestListItemDto>>(
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
        error: { message: APP_MESSAGE.LOAD_DATA_FAILED('payout request list') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const getPayoutRequestById = useCallback(
    async (payoutRequestId: string) => {
      const endpoint = `${ROOT_ENDPOINT}/${payoutRequestId}`
      const result = await callAppProtectedApi<PayoutRequestDetailDto>(endpoint, 'GET', {}, {}, {})

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

  const approvePayoutRequest = useCallback(
    async (payoutRequestId: string) => {
      const endpoint = `${ROOT_ENDPOINT}/${payoutRequestId}/approve`
      const result = await callAppProtectedApi<SuccessResponseDto>(endpoint, 'PATCH', {}, {}, {})

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

  const rejectPayoutRequest = useCallback(
    async (payoutRequestId: string, data: RejectClassRequest) => {
      const endpoint = `${ROOT_ENDPOINT}/${payoutRequestId}/reject`
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

  const makePayoutRequest = useCallback(
    async (payoutRequestId: string, data: MakePayout) => {
      const endpoint = `${ROOT_ENDPOINT}/${payoutRequestId}/make-payout`
      const result = await callAppProtectedApi<SuccessResponseDto>(endpoint, 'PATCH', {}, {}, data)

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.ACTION_FAILED('update transaction') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  return { getAllPayoutRequests, getPayoutRequestById, approvePayoutRequest, rejectPayoutRequest, makePayoutRequest }
}

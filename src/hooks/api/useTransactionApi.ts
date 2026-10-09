import { useCallback } from 'react'
import { ListResponseDto } from '~/data/common.dto'
import { TransactionDetailResponseDto, TransactionListItemResponseDto } from '~/data/transaction.dto'
import { useProtectedApi } from './useProtectedApi'
import { ErrorResponseDto } from '~/data/error.dto'
import { APP_MESSAGE } from '~/global/app-message'

const ROOT_ENDPOINT = '/transactions'

export const useTransactionApi = () => {
  const { callAppProtectedApi } = useProtectedApi()

  const getTransactionList = useCallback(
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
        if (filter.field === 'amount') {
          filtersFormat = Object.assign(
            { fromAmount: (filter.value as [number, number])[0], toAmount: (filter.value as [number, number])[1] },
            filtersFormat
          )
          return
        }

        filtersFormat = Object.assign({ [filter.field]: filter.value }, filtersFormat)
      })
      const result = await callAppProtectedApi<ListResponseDto<TransactionListItemResponseDto>>(
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
        error: { message: APP_MESSAGE.LOAD_DATA_FAILED('transaction list') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const getTransactionById = useCallback(
    async (transactionId: string) => {
      const endpoint = `${ROOT_ENDPOINT}/${transactionId}`
      const result = await callAppProtectedApi<TransactionDetailResponseDto>(endpoint, 'GET', {}, {}, {})

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.LOAD_DATA_FAILED('transaction information') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  return { getTransactionList, getTransactionById }
}

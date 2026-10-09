import { useCallback } from 'react'
import { ListResponseDto, SuccessResponseDto } from '~/data/common.dto'
import { ErrorResponseDto } from '~/data/error.dto'
import { Learner } from '~/data/learner.dto'
import { APP_MESSAGE } from '~/global/app-message'
import { useProtectedApi } from './useProtectedApi'

const ROOT_ENDPOINT = '/learners/management'

export const useLearnerApi = () => {
  const { callAppProtectedApi } = useProtectedApi()

  const getAllLearners = useCallback(
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
      const result = await callAppProtectedApi<ListResponseDto<Learner>>(
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
        error: { message: APP_MESSAGE.LOAD_DATA_FAILED('learner list') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const getLearnerById = useCallback(
    async (learnerId: string) => {
      const endpoint = `${ROOT_ENDPOINT}/${learnerId}`
      const result = await callAppProtectedApi<Learner>(endpoint, 'GET', {}, {}, {})

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.LOAD_DATA_FAILED('learner information') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const activateLearner = useCallback(
    async (learnerId: string) => {
      const endpoint = `${ROOT_ENDPOINT}/${learnerId}/active`
      const result = await callAppProtectedApi<SuccessResponseDto>(endpoint, 'PATCH', {}, {}, {})

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.ACTION_FAILED('Activate Learner') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const deactivateLearner = useCallback(
    async (learnerId: string) => {
      const endpoint = `${ROOT_ENDPOINT}/${learnerId}/deactivate`
      const result = await callAppProtectedApi<SuccessResponseDto>(endpoint, 'PATCH', {}, {}, {})

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.ACTION_FAILED('Deactivate Learner') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  return { getAllLearners, getLearnerById, activateLearner, deactivateLearner }
}

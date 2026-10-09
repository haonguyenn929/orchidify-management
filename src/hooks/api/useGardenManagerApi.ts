import { ErrorResponseDto } from '~/data/error.dto'
import { APP_MESSAGE } from '~/global/app-message'
import { useCallback } from 'react'
import { GardenManager } from '~/data/gardenManager.dto'
import { useProtectedApi } from './useProtectedApi'
import { IdResponseDto, SuccessResponseDto, ListResponseDto } from '~/data/common.dto'

const ROOT_ENDPOINT = '/garden-managers'

interface AddGardenManagerRequest {
  email: string
  name: string
  idCardPhoto: string
}

interface UpdateGardenManagerRequest {
  name: string
}

export const useGardenManagerApi = () => {
  const { callAppProtectedApi } = useProtectedApi()

  const addGardenManager = useCallback(
    async (gardenManager: AddGardenManagerRequest) => {
      const result = await callAppProtectedApi<IdResponseDto>(ROOT_ENDPOINT, 'POST', {}, {}, gardenManager)

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.ACTION_FAILED('add garden manager') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const getAllGardenManagers = useCallback(
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
      const result = await callAppProtectedApi<ListResponseDto<GardenManager>>(
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
        error: { message: APP_MESSAGE.LOAD_DATA_FAILED('garden manager list') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const getGardenManagerById = useCallback(
    async (gardenManagerId: string) => {
      const endpoint = `${ROOT_ENDPOINT}/${gardenManagerId}`
      const result = await callAppProtectedApi<GardenManager>(endpoint, 'GET', {}, {}, {})

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.LOAD_DATA_FAILED('garden manager information') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const updateGardenManager = useCallback(
    async (gardenManagerId: string, gardenManager: UpdateGardenManagerRequest) => {
      const endpoint = `${ROOT_ENDPOINT}/${gardenManagerId}`
      const result = await callAppProtectedApi<SuccessResponseDto>(endpoint, 'PUT', {}, {}, gardenManager)

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.ACTION_FAILED('update garden manager') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const activateGardenManager = useCallback(
    async (gardenManagerId: string) => {
      const endpoint = `${ROOT_ENDPOINT}/${gardenManagerId}/active`
      const result = await callAppProtectedApi<SuccessResponseDto>(endpoint, 'PATCH', {}, {}, {})

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.ACTION_FAILED('Activate Garden Manager') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const deactivateGardenManager = useCallback(
    async (gardenManagerId: string) => {
      const endpoint = `${ROOT_ENDPOINT}/${gardenManagerId}/deactivate`
      const result = await callAppProtectedApi<SuccessResponseDto>(endpoint, 'PATCH', {}, {}, {})

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.ACTION_FAILED('Deactivate Garden Manager') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  return {
    getAllGardenManagers,
    addGardenManager,
    getGardenManagerById,
    updateGardenManager,
    activateGardenManager,
    deactivateGardenManager
  }
}

import { useCallback } from 'react'
import { IdResponseDto, ListResponseDto, SuccessResponseDto } from '~/data/common.dto'
import { ErrorResponseDto } from '~/data/error.dto'
import { AvailableGardenDto, Garden } from '~/data/garden.dto'
import { APP_MESSAGE } from '~/global/app-message'
import { useProtectedApi } from './useProtectedApi'
import { SlotNumber, Weekday } from '~/global/constants'

const ROOT_ENDPOINT = '/gardens'

interface AddGardenRequest {
  name: string
  address: string
  addressLink: string
  gardenManagerId: string
  description: string
  images: string[]
}

interface UpdateGardenInfoRequest {
  name: string
  address: string
  description: string
  images: string[]
}

interface UpdateGardenManager {
  gardenManagerId: string
}

export const useGardenApi = () => {
  const { callAppProtectedApi } = useProtectedApi()

  const getAllGardens = useCallback(
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
      const result = await callAppProtectedApi<ListResponseDto<Garden>>(
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
        error: { message: APP_MESSAGE.LOAD_DATA_FAILED('garden list') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const getGardenById = useCallback(
    async (gardenId: string) => {
      const endpoint = `${ROOT_ENDPOINT}/${gardenId}`
      const result = await callAppProtectedApi<Garden>(endpoint, 'GET', {}, {}, {})

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.LOAD_DATA_FAILED('garden information') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const addGarden = useCallback(
    async (garden: AddGardenRequest) => {
      const result = await callAppProtectedApi<IdResponseDto>(ROOT_ENDPOINT, 'POST', {}, {}, garden)

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.ACTION_FAILED('add garden') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const updateGardenInfo = useCallback(
    async (gardenId: string, garden: UpdateGardenInfoRequest) => {
      const endpoint = `${ROOT_ENDPOINT}/${gardenId}`
      const result = await callAppProtectedApi<SuccessResponseDto>(endpoint, 'PUT', {}, {}, garden)

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.ACTION_FAILED('update garden information') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const activateGarden = useCallback(
    async (gardenId: string) => {
      const endpoint = `${ROOT_ENDPOINT}/${gardenId}/active`
      const result = await callAppProtectedApi<SuccessResponseDto>(endpoint, 'PATCH', {}, {}, {})

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.ACTION_FAILED('Activate Garden') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const deactivateGarden = useCallback(
    async (gardenId: string) => {
      const endpoint = `${ROOT_ENDPOINT}/${gardenId}/deactivate`
      const result = await callAppProtectedApi<SuccessResponseDto>(endpoint, 'PATCH', {}, {}, {})

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.ACTION_FAILED('Deactivate Garden') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const updateGardenManager = useCallback(
    async (gardenId: string, garden: UpdateGardenManager) => {
      const endpoint = `${ROOT_ENDPOINT}/${gardenId}`
      const result = await callAppProtectedApi<SuccessResponseDto>(endpoint, 'PUT', {}, {}, garden)

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

  const getAvailableGardens = useCallback(
    async (
      startDate: Date,
      duration: number,
      weekdays: Array<Weekday>,
      slotNumbers: Array<SlotNumber>,
      instructorId: string
    ) => {
      const endpoint = `${ROOT_ENDPOINT}/available`
      const result = await callAppProtectedApi<ListResponseDto<AvailableGardenDto>>(
        endpoint,
        'GET',
        {},
        {
          startDate: startDate.toISOString(),
          duration: duration,
          weekdays: weekdays,
          slotNumbers: slotNumbers,
          instructorId: instructorId
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
        error: { message: APP_MESSAGE.LOAD_DATA_FAILED('selectable gardens') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  return {
    getAllGardens,
    getGardenById,
    addGarden,
    updateGardenInfo,
    activateGarden,
    deactivateGarden,
    updateGardenManager,
    getAvailableGardens
  }
}

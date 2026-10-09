import { useCallback } from 'react'
import { IdResponseDto, ListResponseDto, SuccessResponseDto } from '~/data/common.dto'
import { ErrorResponseDto } from '~/data/error.dto'
import { Staff } from '~/data/staff.dto'
import { APP_MESSAGE } from '~/global/app-message'
import { useProtectedApi } from './useProtectedApi'

const ROOT_ENDPOINT = '/staffs'

interface AddStaffRequest {
  email: string
  name: string
  idCardPhoto: string
}

interface UpdateStaffRequest {
  name: string
}

export const useStaffApi = () => {
  const { callAppProtectedApi } = useProtectedApi()

  const getAllStaffs = useCallback(
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
      const result = await callAppProtectedApi<ListResponseDto<Staff>>(
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
        error: { message: APP_MESSAGE.LOAD_DATA_FAILED('staff list') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const getStaffById = useCallback(
    async (staffId: string) => {
      const endpoint = `${ROOT_ENDPOINT}/${staffId}`
      const result = await callAppProtectedApi<Staff>(endpoint, 'GET', {}, {}, {})

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.LOAD_DATA_FAILED('staff information') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const addStaff = useCallback(
    async (staff: AddStaffRequest) => {
      const result = await callAppProtectedApi<IdResponseDto>(ROOT_ENDPOINT, 'POST', {}, {}, staff)

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.ACTION_FAILED('add staff') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const updateStaff = useCallback(
    async (staffId: string, staff: UpdateStaffRequest) => {
      const endpoint = `${ROOT_ENDPOINT}/${staffId}`
      const result = await callAppProtectedApi<SuccessResponseDto>(endpoint, 'PUT', {}, {}, staff)

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.ACTION_FAILED('update staff') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const activateStaff = useCallback(
    async (staffId: string) => {
      const endpoint = `${ROOT_ENDPOINT}/${staffId}/active`
      const result = await callAppProtectedApi<SuccessResponseDto>(endpoint, 'PATCH', {}, {}, {})

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.ACTION_FAILED('Activate Staff') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const deactivateStaff = useCallback(
    async (staffId: string) => {
      const endpoint = `${ROOT_ENDPOINT}/${staffId}/deactivate`
      const result = await callAppProtectedApi<SuccessResponseDto>(endpoint, 'PATCH', {}, {}, {})

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.ACTION_FAILED('Deactivate Staff') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  return { getAllStaffs, getStaffById, addStaff, updateStaff, activateStaff, deactivateStaff }
}

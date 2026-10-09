import { useCallback } from 'react'
import { useProtectedApi } from './useProtectedApi'
import { IdResponseDto, ListResponseDto, SuccessResponseDto } from '~/data/common.dto'
import { Instructor } from '~/data/instructor.dto'
import { ErrorResponseDto } from '~/data/error.dto'
import { APP_MESSAGE } from '~/global/app-message'

const ROOT_ENDPOINT = '/instructors/management'

interface AddInstructorRequest {
  email: string
  name: string
  phone: string
  dateOfBirth: string
  idCardPhoto: string
}

interface UpdateInstructorRequest {
  name: string
  dateOfBirth: string
  phone: string
}

export const useInstructorApi = () => {
  const { callAppProtectedApi } = useProtectedApi()

  const getAllInstructors = useCallback(
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
      const result = await callAppProtectedApi<ListResponseDto<Instructor>>(
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
        error: { message: APP_MESSAGE.LOAD_DATA_FAILED('instructor list') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const getInstructorById = useCallback(
    async (instructorId: string) => {
      const endpoint = `${ROOT_ENDPOINT}/${instructorId}`
      const result = await callAppProtectedApi<Instructor>(endpoint, 'GET', {}, {}, {})

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.LOAD_DATA_FAILED('instructor information') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const activateInstructor = useCallback(
    async (instructorId: string) => {
      const endpoint = `${ROOT_ENDPOINT}/${instructorId}/active`
      const result = await callAppProtectedApi<SuccessResponseDto>(endpoint, 'PATCH', {}, {}, {})

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.ACTION_FAILED('Activate Instructor') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const deactivateInstructor = useCallback(
    async (instructorId: string) => {
      const endpoint = `${ROOT_ENDPOINT}/${instructorId}/deactivate`
      const result = await callAppProtectedApi<SuccessResponseDto>(endpoint, 'PATCH', {}, {}, {})

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.ACTION_FAILED('Deactivate Instructor') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const addInstructor = useCallback(
    async (instructor: AddInstructorRequest) => {
      const result = await callAppProtectedApi<IdResponseDto>(ROOT_ENDPOINT, 'POST', {}, {}, instructor)

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.ACTION_FAILED('add instructor') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const updateInstructor = useCallback(
    async (instructorId: string, instructor: UpdateInstructorRequest) => {
      const endpoint = `${ROOT_ENDPOINT}/${instructorId}`
      const result = await callAppProtectedApi<SuccessResponseDto>(endpoint, 'PUT', {}, {}, instructor)

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.ACTION_FAILED('update instructor') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  return {
    getAllInstructors,
    getInstructorById,
    activateInstructor,
    deactivateInstructor,
    addInstructor,
    updateInstructor
  }
}

import { useCallback } from 'react'
import { ErrorResponseDto } from '~/data/error.dto'
import { APP_MESSAGE } from '~/global/app-message'
import { useProtectedApi } from './useProtectedApi'
import { ListResponseDto } from '~/data/common.dto'
import {
  GardenTimesheetItemResponseDto,
  InstructorTimesheetItemResponseDto,
  SlotDetailDto
} from '~/data/gardenTimesheet.dto'

const ROOT_ENDPOINT = '/garden-timesheets/management'

interface UpdateGardenTimesheetRequestDto {
  gardenId: string
  date: string
  status: string
}

const useGardenTimesheetApi = () => {
  const { callAppProtectedApi } = useProtectedApi()

  const getGardenTimesheet = useCallback(
    async (gardenId: string, date: string, type: string) => {
      const endpoint = `${ROOT_ENDPOINT}`
      const result = await callAppProtectedApi<ListResponseDto<GardenTimesheetItemResponseDto>>(
        endpoint,
        'GET',
        {},
        { gardenId, date, type },
        {}
      )

      if (result) {
        const { data, error } = result
        if (data) return { data: data.docs, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.LOAD_DATA_FAILED('garden schedule information') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const updateGardenTimesheet = useCallback(
    async (gardenTimesheet: UpdateGardenTimesheetRequestDto) => {
      const endpoint = `${ROOT_ENDPOINT}`
      const result = await callAppProtectedApi<ListResponseDto<GardenTimesheetItemResponseDto>>(
        endpoint,
        'PUT',
        {},
        {},
        gardenTimesheet
      )

      if (result) {
        const { data, error } = result
        if (data) return { data: data.docs, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.ACTION_FAILED('Update Garden Schedule') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const getInstructorTimesheet = useCallback(
    async (instructorId: string, date: string, type: string) => {
      const endpoint = `${ROOT_ENDPOINT}/instructor-timesheet`
      const result = await callAppProtectedApi<ListResponseDto<InstructorTimesheetItemResponseDto>>(
        endpoint,
        'GET',
        {},
        { instructorId, date, type },
        {}
      )

      if (result) {
        const { data, error } = result
        if (data) return { data: data.docs, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.LOAD_DATA_FAILED('instructor schedule information') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const getSlotList = useCallback(
    async (date: string) => {
      const endpoint = `${ROOT_ENDPOINT}/garden-manager/slots`
      const result = await callAppProtectedApi<{ docs: GardenTimesheetItemResponseDto[] }>(
        endpoint,
        'GET',
        {},
        { date },
        {}
      )

      if (result) {
        const { data, error } = result
        if (data) return { data: data.docs, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.LOAD_DATA_FAILED('garden slot list') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const getInactiveGardenTimesheet = useCallback(
    async (gardenId: string, date: string) => {
      const endpoint = `${ROOT_ENDPOINT}/garden-manager/inactive-timesheets`
      const result = await callAppProtectedApi<{ docs: GardenTimesheetItemResponseDto[] }>(
        endpoint,
        'GET',
        {},
        { gardenId, date },
        {}
      )

      if (result) {
        const { data, error } = result
        if (data) return { data: data.docs, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.LOAD_DATA_FAILED('garden days off') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const getSlotDetail = useCallback(
    async (slotId: string) => {
      const endpoint = `${ROOT_ENDPOINT}/garden-manager/slots/${slotId}`
      const result = await callAppProtectedApi<SlotDetailDto>(endpoint, 'GET', {}, {})

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.LOAD_DATA_FAILED('slot information') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  return {
    getGardenTimesheet,
    updateGardenTimesheet,
    getInstructorTimesheet,
    getSlotList,
    getInactiveGardenTimesheet,
    getSlotDetail
  }
}

export default useGardenTimesheetApi

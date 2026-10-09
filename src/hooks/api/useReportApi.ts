import { useCallback } from 'react'
import { useProtectedApi } from './useProtectedApi'
import { ListResponseDto } from '~/data/common.dto'
import {
  ReportClassByStatusListItemResponseDto,
  ReportTotalSummaryListItemResponseDto,
  ReportUserByMonthListItemResponseDto
} from '~/data/report.dto'
import { ErrorResponseDto } from '~/data/error.dto'
import { APP_MESSAGE } from '~/global/app-message'

const ROOT_ENDPOINT = '/reports/management'

export const useReportApi = () => {
  const { callAppProtectedApi } = useProtectedApi()

  const getReportTotalSummary = useCallback(async () => {
    const endpoint = `${ROOT_ENDPOINT}/total-summary`
    const result = await callAppProtectedApi<ListResponseDto<ReportTotalSummaryListItemResponseDto>>(endpoint, 'GET')

    if (result) {
      const { data, error } = result
      if (data) return { data: data, error: null }
      if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
    }

    return {
      data: null,
      error: { message: APP_MESSAGE.LOAD_DATA_FAILED('overview report') } as ErrorResponseDto
    }
  }, [callAppProtectedApi])

  const getReportUserDataByMonth = useCallback(
    async (year: number) => {
      const endpoint = `${ROOT_ENDPOINT}/user-by-month`
      const result = await callAppProtectedApi<ListResponseDto<ReportUserByMonthListItemResponseDto>>(
        endpoint,
        'GET',
        {},
        { year }
      )

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.LOAD_DATA_FAILED('monthly users report') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const getReportClassByStatus = useCallback(async () => {
    const endpoint = `${ROOT_ENDPOINT}/class-by-status`
    const result = await callAppProtectedApi<ListResponseDto<ReportClassByStatusListItemResponseDto>>(endpoint, 'GET')

    if (result) {
      const { data, error } = result
      if (data) return { data: data, error: null }
      if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
    }

    return {
      data: null,
      error: { message: APP_MESSAGE.LOAD_DATA_FAILED('class count by status report') } as ErrorResponseDto
    }
  }, [callAppProtectedApi])

  return { getReportTotalSummary, getReportUserDataByMonth, getReportClassByStatus }
}

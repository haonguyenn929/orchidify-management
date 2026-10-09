import { useCallback } from 'react'
import { ListResponseDto } from '~/data/common.dto'
import { ErrorResponseDto } from '~/data/error.dto'
import { ReportTotalSummaryListItemResponseDto } from '~/data/report.dto'
import {
  ReportRevenueByMonthListItemResponseDto,
  ReportStaffByStatusListItemResponseDto,
  ReportTransactionByDateListItemResponseDto
} from '~/data/reportAdmin.dto'
import { APP_MESSAGE } from '~/global/app-message'
import { useProtectedApi } from './useProtectedApi'

const ROOT_ENDPOINT = '/reports/management/admin'

export const useReportAdminApi = () => {
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

  const getReportStaffDataByStatus = useCallback(async () => {
    const endpoint = `${ROOT_ENDPOINT}/staff-by-status`
    const result = await callAppProtectedApi<ListResponseDto<ReportStaffByStatusListItemResponseDto>>(endpoint, 'GET')

    if (result) {
      const { data, error } = result
      if (data) return { data: data, error: null }
      if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
    }

    return {
      data: null,
      error: { message: APP_MESSAGE.LOAD_DATA_FAILED('staff count by status report') } as ErrorResponseDto
    }
  }, [callAppProtectedApi])

  const getReportTransactionDataByDate = useCallback(
    async (date: string) => {
      const endpoint = `${ROOT_ENDPOINT}/transaction-by-date`
      const result = await callAppProtectedApi<{ docs: ReportTransactionByDateListItemResponseDto[] }>(
        endpoint,
        'GET',
        {},
        { date }
      )

      if (result) {
        const { data, error } = result
        if (data) return { data: data.docs, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.LOAD_DATA_FAILED('daily transaction report') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const getReportRevenueDataByMonth = useCallback(
    async (year: number) => {
      const endpoint = `${ROOT_ENDPOINT}/revenue-by-month`
      const result = await callAppProtectedApi<ListResponseDto<ReportRevenueByMonthListItemResponseDto>>(
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
        error: { message: APP_MESSAGE.LOAD_DATA_FAILED('monthly revenue report') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  return {
    getReportTotalSummary,
    getReportStaffDataByStatus,
    getReportTransactionDataByDate,
    getReportRevenueDataByMonth
  }
}

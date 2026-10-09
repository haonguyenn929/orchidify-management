import { useCallback } from 'react'
import { useProtectedApi } from './useProtectedApi'
import { ListResponseDto, SuccessResponseDto } from '~/data/common.dto'
import { ErrorResponseDto } from '~/data/error.dto'
import { APP_MESSAGE } from '~/global/app-message'
import { RecruitmentDetailResponseDto, RecruitmentListItemResponseDto } from '~/data/recruitment.dto'

const ROOT_ENDPOINT = '/recruitments/management'

interface ApproveProcessApplicant {
  meetingDate: string
  meetingUrl: string
}

interface RejectApplicant {
  rejectReason: string
}

export const useRecruitmentApi = () => {
  const { callAppProtectedApi } = useProtectedApi()

  const getAllRecruitments = useCallback(
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
      const result = await callAppProtectedApi<ListResponseDto<RecruitmentListItemResponseDto>>(
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
        error: { message: APP_MESSAGE.LOAD_DATA_FAILED('recruitment list') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const getRecruitmentById = useCallback(
    async (recruitmentId: string) => {
      const endpoint = `${ROOT_ENDPOINT}/${recruitmentId}`
      const result = await callAppProtectedApi<RecruitmentDetailResponseDto>(endpoint, 'GET', {}, {}, {})

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.LOAD_DATA_FAILED('recruitment information') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const approveProcessApplicant = useCallback(
    async (recruitmentId: string, data: ApproveProcessApplicant) => {
      const endpoint = `${ROOT_ENDPOINT}/${recruitmentId}/process-application`
      const result = await callAppProtectedApi<SuccessResponseDto>(endpoint, 'PATCH', {}, {}, data)

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.ACTION_FAILED('Process Recruitment') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const approveInterviewApplicant = useCallback(
    async (recruitmentId: string) => {
      const endpoint = `${ROOT_ENDPOINT}/${recruitmentId}/process-interview`
      const result = await callAppProtectedApi<SuccessResponseDto>(endpoint, 'PATCH', {}, {}, {})

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.ACTION_FAILED('Accept Applicant') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  const rejectApplicant = useCallback(
    async (classRequestId: string, data: RejectApplicant) => {
      const endpoint = `${ROOT_ENDPOINT}/${classRequestId}/reject-process`
      const result = await callAppProtectedApi<SuccessResponseDto>(endpoint, 'PATCH', {}, {}, data)

      if (result) {
        const { data, error } = result
        if (data) return { data: data, error: null }
        if (error.response) return { data: null, error: error.response.data as ErrorResponseDto }
      }

      return {
        data: null,
        error: { message: APP_MESSAGE.ACTION_FAILED('Reject Application') } as ErrorResponseDto
      }
    },
    [callAppProtectedApi]
  )

  return { getAllRecruitments, getRecruitmentById, approveProcessApplicant, approveInterviewApplicant, rejectApplicant }
}

import { CourseLevel, NotificationType, RequestType } from '~/global/constants'

export const formatNumber = (num: number): string => {
  const numStr = num.toString()
  const formattedNum: string[] = []
  const len = numStr.length
  for (let i = len - 1; i >= 0; i--) {
    formattedNum.push(numStr[i])
    if ((len - i) % 3 === 0 && i > 0) {
      formattedNum.push('.')
    }
  }
  return formattedNum.reverse().join('')
}

export function formatCurrency(value: number, currency: string = 'VND', locale: string = 'vi-VN'): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  })
  return formatter.format(value)
}

export function formatCurrencyDashboard(value: number, currency: string = 'VND', locale: string = 'vi-VN'): string {
  if (value < 0) {
    return `-${formatCurrencyDashboard(-value, currency, locale)}`
  }

  const ranges = [
    { limit: 1_000_000_000, label: ' B', divisor: 1_000_000_000 },
    { limit: 1_000_000, label: ' M', divisor: 1_000_000 },
    { limit: 100_000, label: ' K', divisor: 1_000 }
  ]

  for (let i = 0; i < ranges.length; i++) {
    const { limit, label, divisor } = ranges[i]
    if (value >= limit) {
      const formattedValue = (value / divisor).toFixed(1)
      return formattedValue === String(Math.floor(value / divisor))
        ? `${Math.floor(value / divisor)}${label}`
        : `${parseFloat(formattedValue).toString().replace('.', ',')}${label}`
    }
  }

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  })
  return formatter.format(value).replace('₫', '')
}

export function formatCourseLevel(level: CourseLevel): string {
  switch (level) {
    case CourseLevel.BASIC:
      return 'Basic'
    case CourseLevel.INTERMEDIATE:
      return 'Intermediate'
    case CourseLevel.ADVANCED:
      return 'Advanced'
    default:
      return 'Unknown'
  }
}

export function formatRequestType(type: RequestType): string {
  switch (type) {
    case RequestType.PUBLISH_CLASS:
      return 'Open Class'
    case RequestType.CANCEL_CLASS:
      return 'Cancel Class'
    default:
      return 'Unknown'
  }
}

export function formatNotificationType(type: string): string {
  switch (type) {
    case NotificationType.CLASS_REQUEST:
      return 'class-requests'
    case NotificationType.PAYOUT_REQUEST:
      return 'payout-requests'
    default:
      return ''
  }
}

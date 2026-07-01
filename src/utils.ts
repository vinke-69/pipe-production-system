import dayjs from 'dayjs'

export const formatDate = (value?: string | null, seconds = false) =>
  value ? dayjs(value).format(seconds ? 'YYYY/MM/DD HH:mm:ss' : 'YYYY/MM/DD HH:mm') : '—'

export const toLocalInput = (value?: string | null) => value ? dayjs(value).format('YYYY-MM-DDTHH:mm') : ''
export const toIso = (value: string) => value ? dayjs(value).toISOString() : null

export function durationText(start?: string | null, end?: string | null) {
  if (!start || !end) return '—'
  const minutes = dayjs(end).diff(dayjs(start), 'minute')
  if (minutes < 0) return '時間錯誤'
  return `${Math.floor(minutes / 1440)}d ${Math.floor((minutes % 1440) / 60)}h ${minutes % 60}m`
}

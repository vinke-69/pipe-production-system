import type { ProductionRecord } from '@prisma/client'

export function dateOrNull(value?: string | null) {
  return value ? new Date(value) : null
}

export function duration(start?: Date | null, end?: Date | null) {
  if (!start || !end) return { minutes: null, text: '' }
  const minutes = Math.floor((end.getTime() - start.getTime()) / 60000)
  if (minutes < 0) return { minutes: null, text: '' }
  const days = Math.floor(minutes / 1440)
  const hours = Math.floor((minutes % 1440) / 60)
  return { minutes, text: `${days}d ${hours}h ${minutes % 60}m` }
}

export function automaticStatus(actualStart?: Date | null, actualEnd?: Date | null) {
  if (!actualStart) return actualEnd ? '異常' : '未生產'
  if (!actualEnd) return '生產中'
  return actualEnd < actualStart ? '異常' : '已完成'
}

export function normalizeRecord(input: Record<string, unknown>) {
  const plannedStartTime = dateOrNull(input.plannedStartTime as string)
  const plannedEndTime = dateOrNull(input.plannedEndTime as string)
  const actualStartTime = dateOrNull(input.actualStartTime as string)
  const actualEndTime = dateOrNull(input.actualEndTime as string)
  const total = duration(actualStartTime, actualEndTime)
  return {
    ...input,
    plannedStartTime, plannedEndTime, actualStartTime, actualEndTime,
    totalProductionMinutes: total.minutes,
    totalProductionText: total.text,
    status: automaticStatus(actualStartTime, actualEndTime),
  }
}

export function withAutomaticStatus<T extends { actualStartTime?: Date | null; actualEndTime?: Date | null }>(record: T) {
  return { ...record, status: automaticStatus(record.actualStartTime, record.actualEndTime) }
}

export function specSummary(r: ProductionRecord) {
  return `ID ${r.specIdValue || '-'}±${r.specIdTolerance || '-'}，厚度 ${r.thicknessValue || '-'}mm±${r.thicknessTolerance || '-'}，長度 ${r.lengthValue || '-'}${r.lengthUnit}，重量 ${r.weightValue || '-'}±${r.weightTolerance || '-'}kg`
}

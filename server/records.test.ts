import { describe, expect, it } from 'vitest'
import { automaticStatus, duration } from './records'
import { createRecordSchema } from './validation'

describe('production record calculations', () => {
  it('formats durations across days', () => {
    const result = duration(new Date('2026-07-01T08:00:00Z'), new Date('2026-07-02T10:35:00Z'))
    expect(result).toEqual({ minutes: 1595, text: '1d 2h 35m' })
  })

  it('rejects negative durations', () => {
    expect(duration(new Date('2026-07-02'), new Date('2026-07-01'))).toEqual({ minutes: null, text: '' })
  })

  it('derives production status from actual timestamps', () => {
    const start = new Date('2026-07-01T08:00:00Z')
    expect(automaticStatus(null, null)).toBe('未生產')
    expect(automaticStatus(null, new Date('2026-07-01T09:00:00Z'))).toBe('異常')
    expect(automaticStatus(start, null)).toBe('生產中')
    expect(automaticStatus(start, new Date('2026-07-01T09:00:00Z'))).toBe('已完成')
  })

  it('rejects an actual end time without an actual start time', () => {
    const result = createRecordSchema.safeParse({
      userName: '測試人員', productionLine: 'C2', productName: '測試管',
      quantityMaru: 1, actualEndTime: '2026-07-01T09:00:00.000Z',
    })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues[0]?.message).toContain('必須先填寫實際開始時間')
  })
})

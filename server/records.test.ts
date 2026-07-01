import { describe, expect, it } from 'vitest'
import { automaticStatus, duration } from './records'

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
    expect(automaticStatus(null, null)).toBe('未開始')
    expect(automaticStatus(start, null)).toBe('生產中')
    expect(automaticStatus(start, new Date('2026-07-01T09:00:00Z'))).toBe('已完成')
  })
})

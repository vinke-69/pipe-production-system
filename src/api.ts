import type { ProductionRecord, RecordInput } from './types'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options)
  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: '網路連線失敗' }))
    throw new Error(body.message || '操作失敗')
  }
  return response.status === 204 ? undefined as T : response.json()
}

const json = (method: string, data: unknown): RequestInit => ({
  method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
})

export const api = {
  list: (query = '') => request<ProductionRecord[]>(`/api/production-records${query}`),
  get: (id: string) => request<ProductionRecord>(`/api/production-records/${id}`),
  create: (data: RecordInput) => request<ProductionRecord>('/api/production-records', json('POST', data)),
  update: (id: string, data: RecordInput) => request<ProductionRecord>(`/api/production-records/${id}`, json('PUT', data)),
  remove: (id: string) => request<void>(`/api/production-records/${id}`, { method: 'DELETE' }),
  products: () => request<string[]>('/api/products/options'),
  gantt: (line = '') => request<ProductionRecord[]>(`/api/gantt-records${line ? `?line=${line}` : ''}`),
}

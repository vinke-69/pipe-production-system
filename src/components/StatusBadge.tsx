import type { ProductionRecord } from '../types'

const styles = { '未開始': 'bg-slate-100 text-slate-700', '生產中': 'bg-blue-100 text-blue-700', '已完成': 'bg-emerald-100 text-emerald-700', '異常': 'bg-red-100 text-red-700' }
export function StatusBadge({ status }: { status: ProductionRecord['status'] }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${styles[status]}`}>{status}</span>
}

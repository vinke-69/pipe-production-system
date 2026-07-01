import { CalendarDays, Download, Edit3, FileSpreadsheet, Filter, Plus, Search, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { StatusBadge } from '../components/StatusBadge'
import type { ProductionRecord } from '../types'
import { formatDate } from '../utils'

export function RecordsPage() {
  const [records,setRecords] = useState<ProductionRecord[]>([])
  const [products,setProducts] = useState<string[]>([])
  const [filters,setFilters] = useState({startDate:'',endDate:'',productName:''})
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState('')

  const load = async (withFilters = true) => {
    setLoading(true); setError('')
    try {
      const query = withFilters ? '?' + new URLSearchParams(Object.entries(filters).filter(([,v])=>v)).toString() : ''
      setRecords(await api.list(query === '?' ? '' : query))
    } catch(e) { setError((e as Error).message) } finally { setLoading(false) }
  }
  useEffect(()=>{ void load(false); api.products().then(setProducts).catch(()=>{}) },[])
  const clear = () => { setFilters({startDate:'',endDate:'',productName:''}); setLoading(true); api.list().then(setRecords).catch(e=>setError(e.message)).finally(()=>setLoading(false)) }
  const remove = async (record: ProductionRecord) => {
    if (!confirm(`確定刪除「${record.productName}」生產紀錄？此操作無法復原。`)) return
    try { await api.remove(record.id); setRecords(records.filter(r=>r.id!==record.id)) } catch(e) { alert((e as Error).message) }
  }
  return <div className="mx-auto max-w-[1500px] px-4 py-6 lg:px-8 lg:py-8">
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="mb-1 text-sm font-bold uppercase tracking-widest text-blue-700">Production Records</p><h1 className="text-2xl font-black text-slate-900 sm:text-3xl">生產紀錄</h1><p className="mt-1 text-sm text-slate-500">查詢、管理與匯出所有產線生產資料</p></div>
      <div className="flex gap-2"><a className="btn-secondary" href="/api/export/excel"><Download size={17}/>匯出 Excel</a><Link className="btn-primary" to="/mobile/report"><Plus size={17}/>新增紀錄</Link></div>
    </div>
    <section className="card mb-6 p-4 lg:p-5">
      <div className="mb-4 flex items-center gap-2 font-bold text-slate-800"><Filter size={18} className="text-blue-700"/>資料篩選</div>
      <div className="grid gap-3 md:grid-cols-4">
        <label><span className="label">開始日期</span><input className="input" type="date" value={filters.startDate} onChange={e=>setFilters({...filters,startDate:e.target.value})}/></label>
        <label><span className="label">結束日期</span><input className="input" type="date" value={filters.endDate} onChange={e=>setFilters({...filters,endDate:e.target.value})}/></label>
        <label><span className="label">品名</span><input className="input" list="products" placeholder="輸入品名關鍵字" value={filters.productName} onChange={e=>setFilters({...filters,productName:e.target.value})}/><datalist id="products">{products.map(p=><option key={p}>{p}</option>)}</datalist></label>
        <div className="flex items-end gap-2"><button className="btn-primary flex-1" onClick={()=>load()}><Search size={17}/>查詢</button><button className="btn-secondary" onClick={clear}>清除</button></div>
      </div>
    </section>
    {error && <div className="mb-4 rounded-xl bg-red-50 p-4 text-red-700">{error}</div>}
    <section className="card overflow-hidden">
      <div className="flex items-center justify-between border-b px-5 py-4"><div className="flex items-center gap-2 font-bold"><CalendarDays size={19} className="text-blue-700"/>紀錄列表</div><span className="text-sm text-slate-500">共 {records.length} 筆</span></div>
      {loading ? <div className="p-16 text-center text-slate-500">資料載入中…</div> : records.length === 0 ? <div className="p-16 text-center"><FileSpreadsheet className="mx-auto mb-3 text-slate-300" size={42}/><b className="text-slate-700">查無生產紀錄</b><p className="mt-1 text-sm text-slate-500">請調整篩選條件或新增第一筆資料</p></div> : <>
        <div className="hidden overflow-x-auto lg:block"><table className="w-full min-w-[1200px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{['日期','產線','品名','數量','規格摘要','預計時間','實際時間','總時數','狀態','操作'].map(x=><th className="whitespace-nowrap px-4 py-3" key={x}>{x}</th>)}</tr></thead><tbody className="divide-y">{records.map(r=><tr key={r.id} className="hover:bg-slate-50"><td className="whitespace-nowrap px-4 py-4 text-slate-600">{formatDate(r.recordDate)}</td><td className="px-4 py-4"><b className="rounded bg-slate-100 px-2 py-1">{r.productionLine}</b></td><td className="max-w-48 px-4 py-4 font-bold text-slate-900">{r.productName}</td><td className="whitespace-nowrap px-4 py-4">{r.quantityMaru} 丸<br/><span className="text-slate-500">{r.quantityBox} 箱</span></td><td className="max-w-60 px-4 py-4 text-xs leading-5 text-slate-600">ID {r.specIdValue||'—'} ± {r.specIdTolerance||'—'}<br/>厚度 {r.thicknessValue||'—'} mm</td><td className="whitespace-nowrap px-4 py-4 text-xs leading-5">{formatDate(r.plannedStartTime)}<br/>{formatDate(r.plannedEndTime)}</td><td className="whitespace-nowrap px-4 py-4 text-xs leading-5">{formatDate(r.actualStartTime)}<br/>{formatDate(r.actualEndTime)}</td><td className="whitespace-nowrap px-4 py-4 font-bold">{r.totalProductionText||'—'}</td><td className="px-4 py-4"><StatusBadge status={r.status}/></td><td className="px-4 py-4"><div className="flex gap-1"><Link title="編輯" className="rounded-lg p-2 text-blue-700 hover:bg-blue-50" to={`/admin/records/${r.id}/edit`}><Edit3 size={17}/></Link><a title="匯出單筆" className="rounded-lg p-2 text-emerald-700 hover:bg-emerald-50" href={`/api/export/excel?id=${r.id}`}><Download size={17}/></a><button title="刪除" className="rounded-lg p-2 text-red-700 hover:bg-red-50" onClick={()=>remove(r)}><Trash2 size={17}/></button></div></td></tr>)}</tbody></table></div>
        <div className="divide-y lg:hidden">{records.map(r=><article key={r.id} className="p-4"><div className="mb-3 flex items-start justify-between"><div><span className="mr-2 rounded bg-slate-100 px-2 py-1 text-xs font-bold">{r.productionLine}</span><b>{r.productName}</b><p className="mt-2 text-xs text-slate-500">{formatDate(r.recordDate)}</p></div><StatusBadge status={r.status}/></div><div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-sm"><div><small className="text-slate-500">數量</small><b className="block">{r.quantityMaru} 丸 / {r.quantityBox} 箱</b></div><div><small className="text-slate-500">總生產時數</small><b className="block">{r.totalProductionText||'—'}</b></div></div><div className="mt-3 flex gap-2"><Link className="btn-secondary flex-1" to={`/admin/records/${r.id}/edit`}><Edit3 size={16}/>編輯</Link><a className="btn-secondary" href={`/api/export/excel?id=${r.id}`}><Download size={16}/></a><button className="btn-danger" onClick={()=>remove(r)}><Trash2 size={16}/></button></div></article>)}</div>
      </>}
    </section>
  </div>
}

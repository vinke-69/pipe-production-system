import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'
import { RecordForm } from '../components/RecordForm'
import type { RecordInput } from '../types'

export function EditPage() {
  const {id=''}=useParams(); const navigate=useNavigate(); const [form,setForm]=useState<RecordInput|null>(null); const [busy,setBusy]=useState(false); const [error,setError]=useState('')
  useEffect(()=>{api.get(id).then(({id:_,createdAt:__,updatedAt:___,recordDate:____,totalProductionMinutes:_____,totalProductionText:______,specSummary:_______,...data})=>setForm(data)).catch(e=>setError(e.message))},[id])
  const save=async()=>{if(!form)return;setBusy(true);setError('');try{await api.update(id,form);navigate('/admin/records')}catch(e){setError((e as Error).message)}finally{setBusy(false)}}
  if(!form)return <div className="mx-auto max-w-5xl p-8">{error?<div className="rounded-xl bg-red-50 p-4 text-red-700">{error}</div>:<p>資料載入中…</p>}</div>
  return <div className="mx-auto max-w-5xl px-4 py-6 lg:py-8"><Link className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-700" to="/admin/records"><ArrowLeft size={17}/>返回紀錄列表</Link><div className="mb-6"><p className="mb-1 text-sm font-bold uppercase tracking-widest text-blue-700">Administrator</p><h1 className="text-2xl font-black text-slate-900 sm:text-3xl">編輯生產紀錄</h1><p className="mt-1 text-sm text-slate-500">管理者可修改所有製令、排程與生產欄位。</p></div><RecordForm value={form} onChange={setForm} onSubmit={save} onCancel={()=>navigate('/admin/records')} admin busy={busy} error={error}/></div>
}

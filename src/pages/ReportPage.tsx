import { CheckCircle2, QrCode } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../api'
import { RecordForm } from '../components/RecordForm'
import { emptyRecord, LINES } from '../types'

export function ReportPage() {
  const [params] = useSearchParams(); const navigate = useNavigate()
  const qrLine = useMemo(() => { const line=params.get('line')||''; return (LINES as readonly string[]).includes(line) ? line : '' },[params])
  const [form,setForm] = useState(()=>emptyRecord(qrLine)); const [busy,setBusy]=useState(false); const [error,setError]=useState(''); const [done,setDone]=useState(false)
  const save = async () => {
    setBusy(true); setError('')
    try { await api.create({...form, sourceQrLine:qrLine}); setDone(true); window.scrollTo({top:0,behavior:'smooth'}) }
    catch(e){setError((e as Error).message)} finally{setBusy(false)}
  }
  if(done) return <div className="mx-auto max-w-xl px-4 py-20"><div className="card p-8 text-center"><CheckCircle2 className="mx-auto text-emerald-600" size={56}/><h1 className="mt-4 text-2xl font-black">儲存成功</h1><p className="mt-2 text-slate-500">生產紀錄已安全寫入資料庫。</p><div className="mt-7 flex justify-center gap-3"><button className="btn-secondary" onClick={()=>navigate('/admin/records')}>查看紀錄</button><button className="btn-primary" onClick={()=>{setForm(emptyRecord(qrLine));setDone(false)}}>繼續填報</button></div></div></div>
  return <div className="mx-auto max-w-5xl px-4 py-6 lg:py-8"><div className="mb-6"><div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-blue-700"><QrCode size={18}/>Mobile Report</div><h1 className="text-2xl font-black text-slate-900 sm:text-3xl">現場生產填報</h1><p className="mt-1 text-sm text-slate-500">填寫當前產線生產資訊；標示 * 為必填欄位。</p>{qrLine && <div className="mt-4 inline-flex rounded-full bg-blue-100 px-3 py-1.5 text-sm font-bold text-blue-800">QR Code 已帶入產線：{qrLine}</div>}</div><RecordForm value={form} onChange={setForm} onSubmit={save} onCancel={()=>navigate('/admin/records')} onClear={()=>setForm(emptyRecord(qrLine))} busy={busy} error={error}/></div>
}

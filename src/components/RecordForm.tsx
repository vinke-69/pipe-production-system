import { AlertTriangle, Clock3, Package, Save, Trash2, Wrench } from 'lucide-react'
import { useMemo } from 'react'
import { LINES, USERS, type RecordInput } from '../types'
import { durationText, toIso, toLocalInput } from '../utils'

type Props = { value: RecordInput; onChange: (value: RecordInput) => void; onSubmit: () => void; onCancel: () => void; onClear?: () => void; admin?: boolean; busy?: boolean; error?: string }

const field = (value: RecordInput, onChange: Props['onChange'], key: keyof RecordInput) => ({
  value: String(value[key] ?? ''), onChange: (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => onChange({ ...value, [key]: e.target.value }),
})

function DateTime({ label, value, disabled, onChange }: {label:string; value:string|null; disabled?:boolean; onChange:(v:string|null)=>void}) {
  return <label><span className="label">{label}</span><input className="input" type="datetime-local" value={toLocalInput(value)} disabled={disabled} onChange={(e) => onChange(toIso(e.target.value))}/></label>
}

export function RecordForm({ value, onChange, onSubmit, onCancel, onClear, admin, busy, error }: Props) {
  const duration = useMemo(() => durationText(value.actualStartTime, value.actualEndTime), [value.actualStartTime, value.actualEndTime])
  const missingActualStart = Boolean(value.actualEndTime && !value.actualStartTime)
  const timeOrderInvalid = Boolean(value.actualStartTime && value.actualEndTime && new Date(value.actualEndTime) < new Date(value.actualStartTime))
  const timeInvalid = missingActualStart || timeOrderInvalid
  const numberField = (key: 'quantityMaru'|'quantityBox') => ({ value: value[key] || '', onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange({...value, [key]: Number(e.target.value)}) })
  return <div className="space-y-5">
    {error && <div role="alert" className="flex gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"><AlertTriangle className="shrink-0" size={19}/>{error}</div>}
    {admin && (!value.plannedStartTime || !value.plannedEndTime) && <div className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><AlertTriangle className="shrink-0" size={19}/><span><b>排程資料尚未完成</b><br/>請補上預計開始與結束時間，以利甘特圖呈現。</span></div>}
    <section className="card overflow-hidden">
      <div className="flex items-center gap-2 border-b bg-slate-50 px-5 py-4 font-bold text-slate-900"><Package size={19} className="text-blue-700"/>製令資訊</div>
      <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <label><span className="label">使用者 *</span><select className="input" {...field(value,onChange,'userName')}><option value="">請選擇</option>{USERS.map(x=><option key={x}>{x}</option>)}</select></label>
        <label><span className="label">產線 *</span><select className="input" {...field(value,onChange,'productionLine')}><option value="">請選擇</option>{LINES.map(x=><option key={x}>{x}</option>)}</select></label>
        <label className="sm:col-span-2 lg:col-span-1"><span className="label">品名 *</span><input className="input" placeholder="例如：PVC 給水管 2吋" {...field(value,onChange,'productName')}/></label>
        <label><span className="label">數量（丸）</span><input className="input" type="number" min="0" inputMode="numeric" {...numberField('quantityMaru')}/></label>
        <label><span className="label">數量（箱）</span><input className="input" type="number" min="0" inputMode="numeric" {...numberField('quantityBox')}/></label>
      </div>
    </section>
    <section className="card overflow-hidden">
      <div className="flex items-center gap-2 border-b bg-slate-50 px-5 py-4 font-bold text-slate-900"><Wrench size={19} className="text-blue-700"/>規格與料號</div>
      <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <label><span className="label">ID</span><input className="input" {...field(value,onChange,'specIdValue')}/></label>
        <label><span className="label">ID 公差（±）</span><input className="input" {...field(value,onChange,'specIdTolerance')}/></label>
        <label><span className="label">厚度（mm）</span><input className="input" {...field(value,onChange,'thicknessValue')}/></label>
        <label><span className="label">厚度公差（±）</span><input className="input" {...field(value,onChange,'thicknessTolerance')}/></label>
        <label><span className="label">長度</span><input className="input" {...field(value,onChange,'lengthValue')}/></label>
        <label><span className="label">長度單位</span><select className="input" {...field(value,onChange,'lengthUnit')}><option>FT</option><option>M</option></select></label>
        <label><span className="label">重量（kg）</span><input className="input" {...field(value,onChange,'weightValue')}/></label>
        <label><span className="label">重量公差（±）</span><input className="input" {...field(value,onChange,'weightTolerance')}/></label>
        {[['materialInnerPipe','內管'],['materialInnerMiddle','內中'],['materialOuterMiddle','外中'],['materialOuterPipe','外管'],['materialColorStrip','色條']].map(([key,label])=><label key={key}><span className="label">料號：{label}</span><input className="input" {...field(value,onChange,key as keyof RecordInput)}/></label>)}
      </div>
    </section>
    <section className="card overflow-hidden">
      <div className="flex items-center gap-2 border-b bg-slate-50 px-5 py-4 font-bold text-slate-900"><Clock3 size={19} className="text-blue-700"/>生產資訊</div>
      <div className="grid gap-4 p-5 sm:grid-cols-2">
        <DateTime label="預計開始時間" value={value.plannedStartTime} disabled={!admin} onChange={(v)=>onChange({...value,plannedStartTime:v})}/>
        <DateTime label="預計結束時間" value={value.plannedEndTime} disabled={!admin} onChange={(v)=>onChange({...value,plannedEndTime:v})}/>
        <DateTime label="實際開始時間 *" value={value.actualStartTime} onChange={(v)=>onChange({...value,actualStartTime:v})}/>
        <DateTime label="實際結束時間 *" value={value.actualEndTime} onChange={(v)=>onChange({...value,actualEndTime:v})}/>
        <div className={`rounded-xl border p-4 sm:col-span-2 ${timeInvalid ? 'border-red-200 bg-red-50' : 'border-blue-100 bg-blue-50'}`}><span className="text-xs font-bold uppercase tracking-wider text-slate-500">總生產時數（自動計算）</span><strong className={`mt-1 block text-2xl ${timeInvalid ? 'text-red-700' : 'text-blue-800'}`}>{duration}</strong>{timeInvalid && <small className="font-semibold text-red-700">{missingActualStart ? '時間填寫錯誤：請先填寫實際開始時間' : '實際結束時間不可早於實際開始時間'}</small>}</div>
        <label className="sm:col-span-2"><span className="label">備註</span><textarea className="input min-h-28 resize-y" placeholder="輸入現場狀況或異常說明" {...field(value,onChange,'note')}/></label>
      </div>
    </section>
    <div className="sticky bottom-3 z-20 flex flex-wrap justify-end gap-3 rounded-xl border bg-white/95 p-3 shadow-lg backdrop-blur">
      {onClear && <button type="button" className="btn-secondary mr-auto" onClick={onClear}><Trash2 size={17}/>清除</button>}
      <button type="button" className="btn-secondary" onClick={onCancel}>取消</button>
      <button type="button" className="btn-primary" disabled={busy || timeInvalid} onClick={onSubmit}><Save size={17}/>{busy ? '儲存中…' : '儲存資料'}</button>
    </div>
  </div>
}

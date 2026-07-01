import { ClipboardList, Factory, Menu, QrCode, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const links = [
  ['/admin/records', ClipboardList, '生產紀錄'],
  ['/admin/gantt', Factory, '排程甘特圖'],
  ['/mobile/report', QrCode, '現場填報'],
] as const

export function Layout() {
  const [open, setOpen] = useState(false)
  return <div className="min-h-screen bg-slate-50">
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 lg:px-8">
        <NavLink to="/admin/records" className="flex items-center gap-3 text-slate-900">
          <span className="grid size-10 place-items-center rounded-xl bg-[#0f2d4a] text-white"><Factory size={21}/></span>
          <span><b className="block text-[15px] leading-tight sm:text-base">水管生產管理系統</b><small className="text-slate-500">Production Control</small></span>
        </NavLink>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map(([to, Icon, label]) => <NavLink key={to} to={to} className={({isActive}) => `flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}><Icon size={17}/>{label}</NavLink>)}
        </nav>
        <button aria-label="開啟選單" className="rounded-lg p-2 md:hidden" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
      </div>
      {open && <nav className="border-t bg-white p-3 md:hidden">{links.map(([to, Icon, label]) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 font-semibold text-slate-700"><Icon size={19}/>{label}</NavLink>)}</nav>}
    </header>
    <main><Outlet/></main>
  </div>
}

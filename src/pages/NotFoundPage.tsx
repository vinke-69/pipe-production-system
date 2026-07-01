import { Link } from 'react-router-dom'
export function NotFoundPage(){return <div className="grid min-h-[70vh] place-items-center p-6 text-center"><div><div className="text-7xl font-black text-slate-200">404</div><h1 className="mt-3 text-2xl font-black">找不到此頁面</h1><Link className="btn-primary mt-6" to="/admin/records">返回生產紀錄</Link></div></div>}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Layout } from './components/Layout'
import './index.css'
import { EditPage } from './pages/EditPage'
import { GanttPage } from './pages/GanttPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { RecordsPage } from './pages/RecordsPage'
import { ReportPage } from './pages/ReportPage'

const router=createBrowserRouter([{element:<Layout/>,children:[
  {path:'/',element:<Navigate to="/admin/records" replace/>},
  {path:'/admin/records',element:<RecordsPage/>},
  {path:'/admin/records/:id/edit',element:<EditPage/>},
  {path:'/admin/gantt',element:<GanttPage/>},
  {path:'/mobile/report',element:<ReportPage/>},
  {path:'*',element:<NotFoundPage/>},
]}])

createRoot(document.getElementById('root')!).render(<StrictMode><RouterProvider router={router}/></StrictMode>)

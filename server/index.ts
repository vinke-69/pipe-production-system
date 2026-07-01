import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import ExcelJS from 'exceljs'
import { PrismaClient } from '@prisma/client'
import { ZodError } from 'zod'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRecordSchema, recordSchema } from './validation.js'
import { normalizeRecord, specSummary } from './records.js'

const app = express()
const prisma = new PrismaClient()
const port = Number(process.env.PORT || 3001)

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.get('/api/production-records', async (req, res) => {
  const { startDate, endDate, productName, line } = req.query
  const where: Record<string, unknown> = {}
  if (startDate || endDate) where.recordDate = {
    ...(startDate ? { gte: new Date(`${startDate}T00:00:00`) } : {}),
    ...(endDate ? { lte: new Date(`${endDate}T23:59:59.999`) } : {}),
  }
  if (productName) where.productName = { contains: String(productName) }
  if (line) where.productionLine = String(line)
  const records = await prisma.productionRecord.findMany({ where, orderBy: { createdAt: 'desc' } })
  res.json(records)
})

app.get('/api/production-records/:id', async (req, res) => {
  const record = await prisma.productionRecord.findUnique({ where: { id: req.params.id } })
  if (!record) return res.status(404).json({ message: '找不到此生產紀錄' })
  res.json(record)
})

app.post('/api/production-records', async (req, res) => {
  const parsed = createRecordSchema.parse(req.body)
  const record = await prisma.productionRecord.create({ data: normalizeRecord({ ...parsed, status: undefined }) as never })
  res.status(201).json(record)
})

app.put('/api/production-records/:id', async (req, res) => {
  const parsed = recordSchema.parse(req.body)
  const record = await prisma.productionRecord.update({
    where: { id: req.params.id }, data: normalizeRecord(parsed) as never,
  })
  res.json(record)
})

app.delete('/api/production-records/:id', async (req, res) => {
  await prisma.productionRecord.delete({ where: { id: req.params.id } })
  res.status(204).end()
})

app.get('/api/products/options', async (_req, res) => {
  const products = await prisma.productionRecord.findMany({ select: { productName: true }, distinct: ['productName'] })
  res.json(products.map((item) => item.productName).sort())
})

app.get('/api/gantt-records', async (req, res) => {
  const where = req.query.line ? { productionLine: String(req.query.line) } : undefined
  const records = await prisma.productionRecord.findMany({ where, orderBy: { productionLine: 'asc' } })
  res.json(records.filter((r) =>
    (r.plannedStartTime && r.plannedEndTime) || (r.actualStartTime && r.actualEndTime)
  ).map((r) => ({ ...r, specSummary: specSummary(r) })))
})

app.get('/api/export/excel', async (req, res) => {
  const records = req.query.id
    ? await prisma.productionRecord.findMany({ where: { id: String(req.query.id) } })
    : await prisma.productionRecord.findMany({ orderBy: { createdAt: 'desc' } })
  const workbook = new ExcelJS.Workbook()
  workbook.creator = '水管生產流程管理系統'
  const sheet = workbook.addWorksheet('生產紀錄', { views: [{ state: 'frozen', ySplit: 1 }] })
  const excelColumns: Array<[string, string, number]> = [
    ['建立時間','createdAt',20], ['使用者','userName',12], ['產線','productionLine',9], ['品名','productName',24],
    ['丸','quantityMaru',8], ['箱','quantityBox',8], ['ID','specIdValue',10], ['ID公差','specIdTolerance',10],
    ['厚度','thicknessValue',10], ['厚度公差','thicknessTolerance',10], ['長度','lengthValue',10], ['長度單位','lengthUnit',10],
    ['重量','weightValue',10], ['重量公差','weightTolerance',10], ['內管','materialInnerPipe',14], ['內中','materialInnerMiddle',14],
    ['外中','materialOuterMiddle',14], ['外管','materialOuterPipe',14], ['色條','materialColorStrip',14],
    ['預計開始','plannedStartTime',20], ['預計結束','plannedEndTime',20], ['實際開始','actualStartTime',20], ['實際結束','actualEndTime',20],
    ['總生產時數','totalProductionText',14], ['狀態','status',10], ['備註','note',30],
  ]
  sheet.columns = excelColumns.map(([header, key, width]) => ({ header, key, width }))
  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF173B57' } }
  records.forEach((record) => sheet.addRow(record))
  ;['createdAt','plannedStartTime','plannedEndTime','actualStartTime','actualEndTime'].forEach((key) => {
    sheet.getColumn(key).numFmt = 'yyyy/mm/dd hh:mm'
  })
  sheet.autoFilter = { from: 'A1', to: 'Z1' }
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', `attachment; filename="production-${new Date().toISOString().slice(0,10)}.xlsx"`)
  await workbook.xlsx.write(res)
  res.end()
})

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
app.use(express.static(path.join(root, 'dist')))
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/')) return res.sendFile(path.join(root, 'dist', 'index.html'))
  next()
})

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error)
  if (error instanceof ZodError) return res.status(400).json({ message: error.issues[0]?.message, issues: error.issues })
  if (typeof error === 'object' && error && 'code' in error && error.code === 'P2025') return res.status(404).json({ message: '找不到此生產紀錄' })
  res.status(500).json({ message: '伺服器發生錯誤，請稍後再試' })
})

app.listen(port, '0.0.0.0', () => console.log(`API server: http://localhost:${port}`))

import { z } from 'zod'

const nullableDate = z.union([z.string().datetime(), z.string().length(0), z.null()]).optional()

export const recordSchema = z.object({
  userName: z.string().trim().min(1, '請選擇使用者'),
  productionLine: z.string().trim().min(1, '請選擇產線'),
  productName: z.string().trim().min(1, '請輸入品名'),
  quantityMaru: z.coerce.number().int().min(0).default(0),
  quantityBox: z.coerce.number().int().min(0).default(0),
  specIdValue: z.string().default(''),
  specIdTolerance: z.string().default(''),
  thicknessValue: z.string().default(''),
  thicknessTolerance: z.string().default(''),
  lengthValue: z.string().default(''),
  lengthUnit: z.enum(['FT', 'M']).default('FT'),
  weightValue: z.string().default(''),
  weightTolerance: z.string().default(''),
  materialInnerPipe: z.string().default(''),
  materialInnerMiddle: z.string().default(''),
  materialOuterMiddle: z.string().default(''),
  materialOuterPipe: z.string().default(''),
  materialColorStrip: z.string().default(''),
  plannedStartTime: nullableDate,
  plannedEndTime: nullableDate,
  actualStartTime: nullableDate,
  actualEndTime: nullableDate,
  note: z.string().default(''),
  status: z.enum(['未生產', '生產中', '已完成', '異常']).optional(),
  sourceQrLine: z.string().default(''),
}).refine((v) => v.quantityMaru > 0 || v.quantityBox > 0, {
  message: '數量至少填寫丸或箱其中一項', path: ['quantityMaru']
}).superRefine((v, ctx) => {
  if (v.actualEndTime && !v.actualStartTime) {
    ctx.addIssue({ code: 'custom', message: '時間填寫錯誤：填寫實際結束時間前，必須先填寫實際開始時間', path: ['actualStartTime'] })
  }
  const pairs: Array<[string | null | undefined, string | null | undefined, string]> = [
    [v.actualStartTime, v.actualEndTime, '實際結束時間不可早於實際開始時間'],
    [v.plannedStartTime, v.plannedEndTime, '預計結束時間不可早於預計開始時間'],
  ]
  for (const [start, end, message] of pairs) {
    if (start && end && new Date(end) < new Date(start)) ctx.addIssue({ code: 'custom', message })
  }
})

export const createRecordSchema = recordSchema.refine((v) => v.actualStartTime || v.actualEndTime, {
  message: '實際開始時間或實際結束時間至少填寫一個', path: ['actualStartTime']
})

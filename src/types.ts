export const LINES = ['C2','C3','C4','C5','C6','C7','C8','C9','A1','A2','A4'] as const
export const USERS = ['王小明', '陳美玲', '林志偉', '張雅婷']
export const STATUSES = ['未開始', '生產中', '已完成', '異常'] as const

export type ProductionRecord = {
  id: string
  createdAt: string
  updatedAt: string
  recordDate: string
  userName: string
  productionLine: string
  productName: string
  quantityMaru: number
  quantityBox: number
  specIdValue: string
  specIdTolerance: string
  thicknessValue: string
  thicknessTolerance: string
  lengthValue: string
  lengthUnit: 'FT' | 'M'
  weightValue: string
  weightTolerance: string
  materialInnerPipe: string
  materialInnerMiddle: string
  materialOuterMiddle: string
  materialOuterPipe: string
  materialColorStrip: string
  plannedStartTime: string | null
  plannedEndTime: string | null
  actualStartTime: string | null
  actualEndTime: string | null
  totalProductionMinutes: number | null
  totalProductionText: string
  note: string
  status: typeof STATUSES[number]
  sourceQrLine: string
  specSummary?: string
}

export type RecordInput = Omit<ProductionRecord, 'id'|'createdAt'|'updatedAt'|'recordDate'|'totalProductionMinutes'|'totalProductionText'|'specSummary'>

export const emptyRecord = (line = ''): RecordInput => ({
  userName: '', productionLine: line, productName: '', quantityMaru: 0, quantityBox: 0,
  specIdValue: '', specIdTolerance: '', thicknessValue: '', thicknessTolerance: '',
  lengthValue: '', lengthUnit: 'FT', weightValue: '', weightTolerance: '',
  materialInnerPipe: '', materialInnerMiddle: '', materialOuterMiddle: '',
  materialOuterPipe: '', materialColorStrip: '', plannedStartTime: null, plannedEndTime: null,
  actualStartTime: null, actualEndTime: null, note: '', status: '未開始', sourceQrLine: line,
})

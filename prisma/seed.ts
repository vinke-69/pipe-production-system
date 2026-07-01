import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const now = new Date()
const at = (days: number, hour: number) => {
  const value = new Date(now)
  value.setDate(value.getDate() + days)
  value.setHours(hour, 0, 0, 0)
  return value
}

async function main() {
  if (await prisma.productionRecord.count()) return
  await prisma.productionRecord.createMany({ data: [
    {
      userName: '王小明', productionLine: 'C2', productName: 'PVC 給水管 2吋',
      quantityMaru: 120, quantityBox: 10, specIdValue: '50', specIdTolerance: '0.3',
      thicknessValue: '3.7', thicknessTolerance: '0.2', lengthValue: '4', lengthUnit: 'M',
      weightValue: '2.8', weightTolerance: '0.1', materialInnerPipe: 'PVC-I01',
      materialOuterPipe: 'PVC-O01', plannedStartTime: at(0, 8), plannedEndTime: at(0, 14),
      actualStartTime: at(0, 8), status: '生產中', sourceQrLine: 'C2'
    },
    {
      userName: '陳美玲', productionLine: 'C5', productName: 'PE 灌溉管 1吋',
      quantityMaru: 200, quantityBox: 18, specIdValue: '25', specIdTolerance: '0.2',
      thicknessValue: '2.3', thicknessTolerance: '0.1', lengthValue: '100', lengthUnit: 'M',
      weightValue: '5.2', weightTolerance: '0.2', materialInnerPipe: 'PE-100',
      materialColorStrip: 'BLUE-01', plannedStartTime: at(1, 7), plannedEndTime: at(1, 16),
      status: '未生產', sourceQrLine: 'C5'
    }
  ]})
}

main().finally(() => prisma.$disconnect())

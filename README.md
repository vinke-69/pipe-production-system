# 塑膠射出成型水管工廠生產流程填報系統

可直接執行的全端生產流程管理系統。現場人員可用手機掃描產線 QR Code 填報，管理者可查詢、編輯、刪除、檢視甘特圖並匯出 Excel。所有資料先寫入 SQLite，不使用 LocalStorage。

## 已完成功能

- 手機響應式填報頁：`/mobile/report`
- QR 產線參數：`/mobile/report?line=C2`
- 後台資料列表、日期區間與品名篩選：`/admin/records`
- 管理者完整欄位編輯：`/admin/records/:id/edit`
- 實際生產時數與狀態自動計算
- 產線 × 時間甘特圖（日／週／月、產線篩選、預計黃色、實際紅色、超時深紅色）：`/admin/gantt`
- 後端產生全表或單筆 `.xlsx`
- Express REST API、Prisma ORM、SQLite 持久化
- 前後端與後端雙層驗證、中文錯誤提示
- 預設產線：C2–C9、A1、A2、A4

## 技術

React 19、Vite、TypeScript、Tailwind CSS、React Router、Node.js、Express、Prisma、SQLite、ExcelJS。

甘特圖採專案內自製時間軸，避免 FullCalendar Resource Timeline 的商用授權限制。

## 環境需求

- Node.js 20 以上
- pnpm 10 以上

## 第一次啟動

```powershell
pnpm install
pnpm approve-builds --all
pnpm db:generate
pnpm db:push
pnpm db:seed
pnpm dev
```

開啟：

- 前端：http://localhost:5173
- API：http://localhost:3001/api/health

`pnpm db:seed` 僅在資料庫為空時建立兩筆示範資料，不會覆蓋既有資料。

## 正式版

```powershell
pnpm build
pnpm start
```

正式版由 Express 同時提供 API 與已建置前端，開啟 http://localhost:3001。

## 常用指令

```powershell
pnpm dev        # 同時啟動前後端開發伺服器
pnpm build      # TypeScript 檢查與正式版建置
pnpm test       # 核心計算單元測試
pnpm db:push    # 將 Prisma schema 套用至 SQLite
pnpm db:seed    # 建立示範資料（僅空資料庫）
```

## QR Code

每條產線建立固定網址即可，例如：

```text
http://你的伺服器位址:3001/mobile/report?line=C2
http://你的伺服器位址:3001/mobile/report?line=C3
http://你的伺服器位址:3001/mobile/report?line=A1
```

手機必須能連到伺服器所在電腦；工廠內網部署時請使用該電腦的區網 IP，不要使用 `localhost`。

## API

| Method | Path | 用途 |
|---|---|---|
| GET / POST | `/api/production-records` | 列表／新增 |
| GET / PUT / DELETE | `/api/production-records/:id` | 單筆查詢／更新／刪除 |
| GET | `/api/products/options` | 品名選項 |
| GET | `/api/gantt-records` | 甘特圖資料 |
| GET | `/api/export/excel` | 匯出全表 |
| GET | `/api/export/excel?id=:id` | 匯出單筆 |

## 資料與備份

- SQLite 檔案：`prisma/dev.db`
- 環境設定：`.env`
- 備份時請停止寫入，再複製 `prisma/dev.db`。
- 要改用 PostgreSQL 時，調整 `prisma/schema.prisma` 的 provider 與 `.env` 的 `DATABASE_URL`，再執行 migration。

目前版本依需求未加入登入權限。若部署到多人可存取的網路，應在正式上線前加入管理者登入、角色權限、HTTPS 與稽核紀錄。

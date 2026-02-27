# Content Flow App - AI 智能圖文生成器

[![Framework](https://img.shields.io/badge/Framework-Next.js%2016-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![AI](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=flat-square&logo=google-gemini)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

**Content Flow App** 是一款專為內容創作者設計的一站式圖文生成平台。透過 AI 驅動的智能分析，將冗長的文章、筆記或結構化資料瞬間轉化為高品質、具備社群吸引力的 **Instagram 輪播貼文**或**限時動態**。

---

## 核心功能

### AI 智能提煉

- 搭載 **Google Gemini 2.0 Flash** 模型
- 自動分析文章結構，精準抓取核心要點
- 支援兩種生成模式：
  - **輪播貼文 (Carousel)**: 適合長篇文章，分段呈現
  - **限時動態 (Story)**: 適合短文案，全屏展示

### 專業級編輯器

- **實時預覽**: 即時查看編輯效果
- **9 種設計主題**: Editorial、Minimal、Bold、Typewriter、Compact、Balanced、Opening、Content、Closing
- **限時動態主題**: 針對 Instagram Stories 優化的垂直版面
- **便捷編輯面板**:
  - 標題、內文、背景圖片一鍵編輯
  - 品牌名稱自訂
  - 支援拖放調整幻燈片順序

### 智能解析技術 (Smart Parse)

系統能智能識別多種輸入格式並自動提取內容：

- **純文字**: 直接解析
- **Markdown**: 自動清理標記
- **結構化 JSON**:
  - 陣列物件：自動識別文字欄位與圖片 URL
  - 複雜嵌套：遞迴搜尋最長文本和圖片資源

### 專案管理系統

- **自動儲存**: 支援為編輯中的專案設定名稱並儲存
- **最近編輯**: 主頁顯示最近編輯的 3 個專案
- **載入/刪除**: 完整的專案生命週期管理
- **本地儲存**: 使用 JSON 格式保存在 `/saved_projects` 目錄

### 高效批量導出

- **單張導出**: 下載當前幻燈片為 PNG 高品質圖片
- **批量導出**: 一鍵打包所有幻燈片為 ZIP 文件
- **高清品質**: 2x 像素比率 (pixelRatio: 2)，確保社群平台上的清晰度
- **跨源圖片支援**: 自動代理外部圖片，確保導出時順利載入

### 圖片管理

- **URL 輸入**: 直接貼上圖片連結
- **本地上傳**: 拖放或點擊上傳本地圖片
- **圖片代理**: API 代理外部圖片，避免跨域問題
- **點擊編輯**: 在預覽中直接點擊圖片區域更換

---

## 技術棧

| 層級               | 技術                    | 版本     |
| ------------------ | ----------------------- | -------- |
| **框架**     | Next.js                 | 16.1.1   |
| **前端**     | React                   | 19.2.3   |
| **語言**     | TypeScript              | ^5       |
| **AI 模型**  | Google Gemini 2.0 Flash | 最新     |
| **樣式**     | CSS Modules             | -        |
| **圖示**     | lucide-react            | ^0.562.0 |
| **圖片轉換** | html-to-image           | ^1.11.13 |
| **壓縮打包** | jszip                   | ^3.10.1  |

### 特點

- **Server Components 友善**: 支援 Next.js App Router
- **類型安全**: 完整的 TypeScript 型別定義
- **性能優化**: 記憶體管理配置（Node 選項：`--max-old-space-size=4096`）

---

## 快速開始

### 前置條件

- Node.js >= 16
- npm 或 yarn
- Google Gemini API Key（[申請](https://ai.google.dev/)）

### 安裝步驟

#### 1. 複製專案

```bash
git clone <repo-url>
cd content-flow-app
```

#### 2. 安裝依賴

```bash
npm install
```

#### 3. 配置環境變數

在根目錄建立 `.env.local` 檔案：

```env
GEMINI_API_KEY=your_google_gemini_api_key
```

**重要**: 不要將 API Key 提交到版本控制系統。

#### 4. 啟動開發伺服器

```bash
npm run dev
```

瀏覽器打開 [http://localhost:3000](http://localhost:3000) 開始使用。

### 其他命令

```bash
npm run build    # 構建生產版本
npm start        # 啟動生產伺服器
npm run lint     # 執行代碼檢查
```

---

## 使用指南

### 基本工作流程

#### 步驟 1: 輸入內容

在首頁粘貼您的內容：

```
- 純文字文章
- 結構化 JSON 資料
- Markdown 格式筆記
```

#### 步驟 2: 選擇生成模式

- **生成貼文輪播**: 多張幻燈片的橫向輪播格式
- **生成限時動態**: 全屏垂直故事格式

#### 步驟 3: AI 自動分析

系統會：

1. 解析輸入內容格式
2. 自動提取文字和圖片
3. 調用 Gemini AI 生成幻燈片
4. 返回結構化的投影片資料

#### 步驟 4: 編輯和客製化

在編輯器中：

- **調整佈局**: 從 9 種主題選擇
- **修改內容**: 編輯標題和正文
- **添加圖片**: 上傳或貼上圖片 URL
- **管理幻燈片**: 拖放重排、新增、刪除

#### 步驟 5: 儲存和導出

- **儲存專案**: 點擊「另存新檔」保留工作
- **導出圖片**:
  - 導出單張：「Export Active Slide」
  - 導出全部：「Download All as ZIP」

### 進階技巧

**智能 JSON 識別:**

```json
[
  {
    "text": "第一段文章內容...",
    "image": "https://example.com/image1.jpg"
  },
  {
    "text": "第二段文章內容...",
    "image": "https://example.com/image2.jpg"
  }
]
```

**使用圖片代理 (CORS):**

- 輸入外部圖片 URL 時，應用會自動代理
- 支援的格式：JPG、PNG、WebP、GIF

**自訂品牌名稱:**

- 在右側面板的「Brand Name」欄位設定
- 會在所有設計主題中一致顯示

---

## 專案結構

```
content-flow-app/
├── src/
│   └── app/
│       ├── page.tsx                      # 首頁 (內容輸入)
│       ├── page.module.css               # 首頁樣式
│       ├── layout.tsx                    # 全局佈局
│       ├── globals.css                   # 全局樣式
│       ├── editor/
│       │   ├── page.tsx                  # 編輯器頁面
│       │   └── editor.module.css         # 編輯器樣式
│       └── api/
│           ├── generate/
│           │   ├── route.ts              # 輪播生成 API 端點
│           │   └── prompt.ts             # 輪播提示詞
│           ├── generate-story/
│           │   ├── route.ts              # 故事生成 API 端點
│           │   └── prompt.ts             # 故事提示詞
│           ├── projects/
│           │   ├── route.ts              # 專案列表和保存
│           │   └── [filename]/route.ts   # 單個專案的載入/刪除
│           └── proxy/
│               └── route.ts              # 圖片代理端點
├── saved_projects/                       # 本地專案存檔
├── public/                               # 靜態資源
├── package.json
├── tsconfig.json
├── next.config.ts
└── eslint.config.mjs
```

### 關鍵檔案說明

| 檔案                                    | 說明                                       |
| --------------------------------------- | ------------------------------------------ |
| `src/app/page.tsx`                    | 首頁：內容輸入、最近專案、生成按鈕         |
| `src/app/editor/page.tsx`             | 編輯器：幻燈片編輯、預覽、導出             |
| `src/app/api/generate/route.ts`       | 輪播生成端點：調用 AI 分析文章並返回幻燈片 |
| `src/app/api/generate-story/route.ts` | 故事生成端點：短格式 AI 生成               |
| `src/app/api/projects/route.ts`       | 專案管理：列表、保存                       |
| `src/app/api/proxy/route.ts`          | 圖片代理：解決 CORS 跨域問題               |

---

## 設計主題詳解

### 輪播貼文主題

| 主題                 | 特徵                           | 適用場景       |
| -------------------- | ------------------------------ | -------------- |
| **Editorial**  | 專業報導風格，有框線和分類標籤 | 新聞、評論文章 |
| **Minimal**    | 簡約設計，文字為主             | 靜思、引言     |
| **Bold**       | 大膽配色，高對比度             | 促銷、重點強調 |
| **Typewriter** | 復古打字機風格                 | 創意文案、詩句 |
| **Compact**    | 信息密集，適合多文字           | 教學、清單     |
| **Balanced**   | 左圖右文，層次分明             | 對比說明、故事 |
| **Opening**    | 開場風格，圖片為中心           | 系列首頁、介紹 |
| **Content**    | 步驟提示風格                   | 教程、操作指南 |
| **Closing**    | 結尾風格，呼籲行動             | 系列尾頁、號召 |

### 限時動態主題

| 主題            | 特徵                                                |
| --------------- | --------------------------------------------------- |
| **Story** | 全屏垂直（1080x1920），品牌頭部，標題+正文+底部引導 |

---

## API 參考

### POST `/api/generate`

生成 Instagram 輪播貼文幻燈片。

**請求體:**

```json
{
  "text": "文章內容或 JSON 字符串",
  "images": ["https://example.com/img1.jpg", "https://example.com/img2.jpg"]
}
```

**回應:**

```json
{
  "slides": [
    {
      "id": "1",
      "title": "標題",
      "content": "正文",
      "type": "Cover|Content|Quote|End",
      "image": "https://..."
    }
  ]
}
```

### POST `/api/generate-story`

生成 Instagram 限時動態幻燈片。

**請求體:**

```json
{
  "text": "故事文本"
}
```

**回應:**

```json
{
  "slides": [
    {
      "id": "1",
      "title": "標題",
      "content": "正文",
      "theme": "Story"
    }
  ]
}
```

### GET/POST/DELETE `/api/projects`

專案管理端點。

- **GET**: 取得所有專案列表
- **POST**: 保存新專案
- **DELETE**: 刪除指定專案

### GET `/api/proxy?url=<encoded-url>`

代理圖片 URL 以解決 CORS 問題。

---

## 常見問題

### Q: 如何設定 API Key?

**A:** 在 `.env.local` 中設定 `GEMINI_API_KEY`。該檔案不應提交到版本控制。

### Q: 為什麼圖片不顯示?

**A:**

1. 檢查 URL 是否有效
2. 使用 `/api/proxy?url=<url>` 代理 CORS 限制的圖片
3. 確保圖片格式支援（JPG、PNG、WebP、GIF）

### Q: 如何導出高品質圖片?

**A:** 應用默認使用 2x 像素比率導出。若需更高品質，編輯 `editor.module.css` 中的導出設定。

### Q: 我可以離線使用嗎?

**A:** 否。該應用需要網際網路連接以調用 Google Gemini API。

### Q: 專案存儲在哪裡?

**A:** 本地專案以 JSON 文件形式儲存在 `/saved_projects` 目錄。

---

## 部署指南

### Vercel (推薦)

```bash
# 連接 Git 倉庫後自動部署
# 在 Vercel 環境變數中設定：
# GEMINI_API_KEY=your_key
```

### 自托管 (VPS/Docker)

```bash
# 構建
npm run build

# 啟動生產伺服器
npm start
```

### 環境變數清單

| 變數               | 說明                  | 必須 |
| ------------------ | --------------------- | ---- |
| `GEMINI_API_KEY` | Google Gemini API Key | 必須 |

---

## 效能優化

### 記憶體管理

- 開發和構建時使用 `--max-old-space-size=4096`
- 適應大型輪播導出（20 張以上幻燈片）

### 圖片處理

- `html-to-image` 搭配 `pixelRatio: 2` 確保清晰度
- JSZip 使用 0.9 品質降低記憶體佔用
- 支援 `data:image/*` 格式和外部 URL

### 代碼分割

- 編輯器使用客戶端組件
- 主頁優化首屏加載

---

## 貢獻指南

歡迎提交 Issue 和 Pull Request！

### 開發流程

1. Fork 本倉庫
2. 創建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

---

## 授權協議

本專案採用 **MIT 授權協議**。您可以自由地進行修改、分發和商用。詳見 [LICENSE](LICENSE) 文件。

---

## 聯繫與支援

- **提交 Bug**: [GitHub Issues](../../issues)
- **功能請求**: [GitHub Discussions](../../discussions)
- **其他問題**: 提交 Issue 並詳述情況

---

## 致謝

- [Google Generative AI](https://ai.google.dev/) - AI 核心引擎
- [Next.js](https://nextjs.org/) - 優秀的 React 框架
- [html-to-image](https://github.com/bubkoo/html-to-image) - 圖片轉換
- [JSZip](https://stuk.github.io/jszip/) - ZIP 文件操作

---

*由 **Antigravity** 團隊打造。讓內容創作變得更簡單。*

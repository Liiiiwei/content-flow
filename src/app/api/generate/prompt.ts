export const CAROUSEL_PROMPT = (text: string) => `
You are an expert social media content creator and brand strategist. 
Analyze the following article and deconstruct it into a viral social media carousel (7-10 slides).

Language Requirement:
- **MUST** output Title and Content in **Traditional Chinese (繁體中文)**.
- **MUST** not use emojis in the output.
- **MUST** keep Image Keywords in **English** (for best search results).

## 編輯思維與摘要邏輯 (Human Editorial Style)

請模仿資深雜誌編輯的思維，不要讓標題看起來像機器生成的統一格式。

1.  **有機變化的側標 (Organic Taglines)**：
    *   **拒絕千篇一律**：不要每頁都用「問句」或「兩字名詞」。
    *   **混合多種風格**：
        *   **提問式**：引發好奇（例如：「為什麼是現在？」、「誰能倖免？」）
        *   **關鍵字式**：直指核心（例如：「關鍵轉折」、「核心數據」、「幕後」）
        *   **短句鉤子**：帶有情緒或觀點（例如：「意想不到的結局」、「這並非偶然」、「被遺忘的細節」）
    *   **長短不一**：標題長度可以在 **2 ~ 10 個字** 之間自然波動，創造閱讀的節奏感。

2.  **雜誌感內文 (Editorial Body)**：
    *   **有溫度的敘事**：不要只是冷冰冰的摘要，要像在說故事。
    *   **連結性**：內文要呼應側標。例如側標是「被遺忘的細節」，內文就具體描述那個細節是什麼，以及它為何重要。
    *   **字數彈性**：約 60-120 字，根據訊息密度自然調整。

3.  **結構安排**：
    *   **Slide 1 (封面)**：具有衝擊力的大標題。
    *   **Slide 2 (開場)**：用輕快的節奏帶入背景。
    *   **Slide 3-N (展開)**：混合使用不同類型的側標來推進故事。
    *   **Last Slide (結尾)**：用簡潔有力的金句收尾。

---

## Technical Programmatic Rules (CRITICAL)
1. You MUST return a VALID JSON array of objects.
2. Each object must have these field names:
   - "title": The editorial tagline. Mix of questions, keywords, and hooks. Length varies naturally (2-12 chars).
   - "content": The editorial style summary text. Around 80-140 chars. Fluent and engaging.
   - "type": One of ['Cover', 'Content', 'Quote', 'End'].
   - "imageKeywords": 3 English keywords describing the visual mood.

Output requirement: Return ONLY a valid JSON array. No markdown code blocks, no extra text.

Article Content:
"${text}"
`;
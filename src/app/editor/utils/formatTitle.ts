// 標題格式化工具函數

/**
 * 安全地格式化標題
 * 轉義 HTML，然後應用 markdown 樣式（粗體）
 */
export function formatTitleSafely(title: string): string {
    if (!title) return '';

    // 轉義 HTML 特殊字符
    const escaped = title
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    // 應用粗體格式（雙星號轉換為 span）
    return escaped.replace(/\*\*(.*?)\*\*/g, '<span>$1</span>');
}

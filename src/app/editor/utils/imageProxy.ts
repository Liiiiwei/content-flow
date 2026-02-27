// 圖片代理工具函數

/**
 * 取得代理後的圖片 URL
 * - data: URL 直接返回
 * - 非 http 開頭的 URL 直接返回
 * - http(s) URL 透過 /api/proxy 代理
 */
export function getProxyUrl(url: string | undefined): string | undefined {
    if (!url) return undefined;
    if (url.startsWith("data:")) return url;
    if (!url.startsWith("http")) return url;
    return `/api/proxy?url=${encodeURIComponent(url)}`;
}

import { NextResponse } from 'next/server';

// 允許的圖像來源白名單
const ALLOWED_DOMAINS = [
    'images.unsplash.com',
    'cdn.pixabay.com',
    'source.unsplash.com',
    'picsum.photos',
];

// 阻止的內部網路模式
const BLOCKED_PATTERNS = [
    /^localhost/,
    /^127\./,
    /^192\.168\./,
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[01])\./,
    /internal/,
    /local\.?$/,
];

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
        return new NextResponse('Missing url parameter', { status: 400 });
    }

    try {
        // 驗證 URL 格式
        const parsedUrl = new URL(url);

        // 只允許 HTTP 和 HTTPS
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            return new NextResponse('Invalid protocol', { status: 400 });
        }

        const hostname = parsedUrl.hostname;

        // 檢查域名白名單
        const isAllowed = ALLOWED_DOMAINS.some(domain =>
            hostname === domain || hostname.endsWith(`.${domain}`)
        );

        if (!isAllowed) {
            return new NextResponse('Domain not allowed', { status: 403 });
        }

        // 阻止內部網路訪問
        if (BLOCKED_PATTERNS.some(pattern => pattern.test(hostname))) {
            return new NextResponse('Internal URLs not allowed', { status: 403 });
        }

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Content-Flow-App/1.0',
            },
        });

        if (!response.ok) {
            return new NextResponse('Failed to fetch image', { status: response.status });
        }

        const buffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/jpeg';

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Proxy error:', error instanceof Error ? error.message : String(error));
        return new NextResponse('Failed to fetch image', { status: 500 });
    }
}

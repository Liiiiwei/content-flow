import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const PROJECTS_DIR = path.join(process.cwd(), 'saved_projects');
const MAX_FILENAME_LENGTH = 255;
const MAX_DATA_SIZE = 10 * 1024 * 1024; // 10MB

// 初始化目錄
if (!fs.existsSync(PROJECTS_DIR)) {
    fs.mkdirSync(PROJECTS_DIR, { recursive: true });
}

interface ProjectMetadata {
    filename: string;
    name: string;
    updatedAt: Date;
}

export async function GET() {
    try {
        const files = fs.readdirSync(PROJECTS_DIR).filter(file => file.endsWith('.json'));

        // 根據修改時間排序（最新的在前）
        const projects: ProjectMetadata[] = files.map(filename => {
            const filePath = path.join(PROJECTS_DIR, filename);
            const stats = fs.statSync(filePath);
            return {
                filename,
                name: filename.replace('.json', ''),
                updatedAt: stats.mtime
            };
        }).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

        return NextResponse.json({ projects });
    } catch (error) {
        console.error('List projects error:', error instanceof Error ? error.message : String(error));
        return NextResponse.json({ error: 'Failed to list projects' }, { status: 500 });
    }
}

interface ProjectRequest {
    filename: string;
    data: unknown;
}

export async function POST(req: Request) {
    try {
        const body = await req.json() as ProjectRequest;
        const { filename, data } = body;

        // 驗證必要的欄位
        if (!filename || typeof filename !== 'string') {
            return NextResponse.json({ error: 'Filename must be a non-empty string' }, { status: 400 });
        }

        if (!data) {
            return NextResponse.json({ error: 'Data is required' }, { status: 400 });
        }

        // 驗證檔案名稱長度
        if (filename.length > MAX_FILENAME_LENGTH) {
            return NextResponse.json({
                error: `Filename exceeds maximum length of ${MAX_FILENAME_LENGTH}`
            }, { status: 400 });
        }

        // 清理檔案名稱（防止注入）
        const safeFilename = filename
            .replace(/[^a-z0-9\u4e00-\u9fa5\-_]/gi, '_')
            .substring(0, MAX_FILENAME_LENGTH - 5); // 留出 .json 的空間

        if (!safeFilename) {
            return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
        }

        // 驗證資料大小
        const dataString = JSON.stringify(data, null, 2);
        if (dataString.length > MAX_DATA_SIZE) {
            return NextResponse.json({
                error: `Data exceeds maximum size of ${MAX_DATA_SIZE / 1024 / 1024}MB`
            }, { status: 400 });
        }

        const filePath = path.join(PROJECTS_DIR, `${safeFilename}.json`);

        fs.writeFileSync(filePath, dataString);

        return NextResponse.json({ success: true, filename: `${safeFilename}.json` });
    } catch (error) {
        console.error('Save project error:', error instanceof Error ? error.message : String(error));
        return NextResponse.json({ error: 'Failed to save project' }, { status: 500 });
    }
}

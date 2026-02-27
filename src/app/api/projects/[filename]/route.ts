import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PROJECTS_DIR = path.join(process.cwd(), 'saved_projects');

// 驗證常數
const ALLOWED_FILE_EXTENSION = '.json';
const MAX_FILENAME_LENGTH = 255;

/**
 * 驗證檔案名稱是否安全
 * 防止路徑遍歷攻擊
 */
function isValidFilename(filename: string): boolean {
    if (!filename || filename.length > MAX_FILENAME_LENGTH) {
        return false;
    }

    // 阻止路徑遍歷
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        return false;
    }

    // 只允許 .json 副檔名
    if (!filename.endsWith(ALLOWED_FILE_EXTENSION)) {
        return false;
    }

    // 確保只有合法字符 (字母、數字、下劃線、連字符)
    if (!/^[a-zA-Z0-9_-]+\.json$/.test(filename)) {
        return false;
    }

    return true;
}

interface ProjectData {
    name: string;
    slides?: unknown[];
    [key: string]: unknown;
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ filename: string }> }
) {
    try {
        const { filename } = await params;

        if (!filename) {
            return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
        }

        // 驗證檔案名稱安全性
        if (!isValidFilename(filename)) {
            return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
        }

        const filePath = path.join(PROJECTS_DIR, filename);

        // 確保路徑在允許的目錄內
        const resolvedPath = path.resolve(filePath);
        const resolvedDir = path.resolve(PROJECTS_DIR);
        if (!resolvedPath.startsWith(resolvedDir)) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        const content = fs.readFileSync(filePath, 'utf-8');
        const projectData = JSON.parse(content) as ProjectData;

        return NextResponse.json(projectData);
    } catch (error) {
        console.error('Read project error:', error instanceof Error ? error.message : String(error));
        return NextResponse.json({ error: 'Failed to read project' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ filename: string }> }
) {
    try {
        const { filename } = await params;

        if (!filename) {
            return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
        }

        // 驗證檔案名稱安全性
        if (!isValidFilename(filename)) {
            return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
        }

        const filePath = path.join(PROJECTS_DIR, filename);

        // 確保路徑在允許的目錄內
        const resolvedPath = path.resolve(filePath);
        const resolvedDir = path.resolve(PROJECTS_DIR);
        if (!resolvedPath.startsWith(resolvedDir)) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete project error:', error instanceof Error ? error.message : String(error));
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}

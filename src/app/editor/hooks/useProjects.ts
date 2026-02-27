import { useState, useCallback } from 'react';
import { Slide, ThemeType, Project } from '../types';

// useProjects Hook - 專案管理

export interface UseProjectsReturn {
    currentFilename: string | null;
    setCurrentFilename: React.Dispatch<React.SetStateAction<string | null>>;
    isProjectModalOpen: boolean;
    setIsProjectModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    projectList: Project[];
    handleSaveProject: () => Promise<void>;
    handleOpenProjectManager: () => Promise<void>;
    loadProject: (filename: string) => Promise<void>;
    deleteProject: (filename: string, e: React.MouseEvent) => Promise<void>;
}

interface UseProjectsOptions {
    slides: Slide[];
    theme: ThemeType;
    brandName: string;
    setSlides: React.Dispatch<React.SetStateAction<Slide[]>>;
    setTheme: React.Dispatch<React.SetStateAction<ThemeType>>;
    setBrandName: React.Dispatch<React.SetStateAction<string>>;
    setActiveSlideIndex: React.Dispatch<React.SetStateAction<number>>;
}

export function useProjects({
    slides,
    theme,
    brandName,
    setSlides,
    setTheme,
    setBrandName,
    setActiveSlideIndex
}: UseProjectsOptions): UseProjectsReturn {
    const [currentFilename, setCurrentFilename] = useState<string | null>(null);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [projectList, setProjectList] = useState<Project[]>([]);

    // 儲存專案
    const handleSaveProject = useCallback(async () => {
        let filename = currentFilename;
        if (!filename) {
            filename = prompt("請輸入專案名稱 (無需副檔名):", `my-carousel-${Date.now()}`);
            if (!filename) return;
        }

        const projectData = {
            slides,
            theme,
            brandName,
            version: '1.0',
            savedAt: new Date().toISOString()
        };

        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename, data: projectData })
            });
            const result = await res.json();
            if (result.success) {
                setCurrentFilename(result.filename);
                alert('專案已儲存！');
            } else {
                alert('儲存失敗: ' + result.error);
            }
        } catch (error) {
            console.error(error);
            alert('儲存時發生錯誤');
        }
    }, [currentFilename, slides, theme, brandName]);

    // 開啟專案管理器
    const handleOpenProjectManager = useCallback(async () => {
        setIsProjectModalOpen(true);
        try {
            const res = await fetch('/api/projects');
            const data = await res.json();
            if (data.projects) {
                setProjectList(data.projects);
            }
        } catch (e) {
            console.error("Failed to fetch projects", e);
        }
    }, []);

    // 載入專案
    const loadProject = useCallback(async (filename: string) => {
        try {
            const res = await fetch(`/api/projects/${filename}`);
            const data = await res.json();

            if (data.slides) setSlides(data.slides);
            if (data.theme) setTheme(data.theme);
            if (data.brandName) setBrandName(data.brandName);

            setCurrentFilename(filename);
            setActiveSlideIndex(0);
            setIsProjectModalOpen(false);
        } catch (e) {
            console.error("Failed to load project", e);
            alert('載入失敗');
        }
    }, [setSlides, setTheme, setBrandName, setActiveSlideIndex]);

    // 刪除專案
    const deleteProject = useCallback(async (filename: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm(`確定要刪除 ${filename} 嗎？`)) return;

        try {
            const res = await fetch(`/api/projects/${filename}`, { method: 'DELETE' });
            if (res.ok) {
                setProjectList(prev => prev.filter(p => p.filename !== filename));
                if (currentFilename === filename) setCurrentFilename(null);
            }
        } catch (e) {
            console.error("Failed to delete", e);
        }
    }, [currentFilename]);

    return {
        currentFilename,
        setCurrentFilename,
        isProjectModalOpen,
        setIsProjectModalOpen,
        projectList,
        handleSaveProject,
        handleOpenProjectManager,
        loadProject,
        deleteProject
    };
}

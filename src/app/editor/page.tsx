"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./editor.module.css";

// 類型和常數
import { Slide, ThemeType, DEFAULT_SLIDES, CAROUSEL_THEMES, STORY_THEMES } from "./types";

// 自定義 Hooks
import { useSlides } from "./hooks/useSlides";
import { useSlideExport } from "./hooks/useSlideExport";
import { useProjects } from "./hooks/useProjects";

// UI 組件
import { SlideOutline } from "./components/SlideOutline";
import { CanvasPreview } from "./components/CanvasPreview";
import { PropertiesPanel } from "./components/PropertiesPanel";
import { ToolBar } from "./components/ToolBar";
import { ProjectModal } from "./components/ProjectModal";
import { HiddenExportContainer } from "./components/HiddenExportContainer";

function EditorContent() {
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode') || 'carousel';
    const isStoryMode = mode === 'story';

    // 畫布設定
    const canvasWidth = 1080;
    const canvasHeight = isStoryMode ? 1920 : 1350;
    const canvasRef = useRef<HTMLDivElement>(null);

    // 全域狀態
    const [theme, setTheme] = useState<ThemeType>(isStoryMode ? 'Story' : 'Editorial');
    const [brandName, setBrandName] = useState('CONTENT FLOW');
    const [scale, setScale] = useState(0.8);

    // 幻燈片管理
    const slidesHook = useSlides(DEFAULT_SLIDES);
    const {
        slides,
        setSlides,
        activeSlideIndex,
        setActiveSlideIndex,
        activeSlide,
        updateSlide,
        nextSlide,
        prevSlide,
        draggedSlideIndex,
        handleDragStart,
        handleDragOver,
        handleDrop
    } = slidesHook;

    // 導出功能
    const exportHook = useSlideExport({
        slides,
        activeSlideIndex,
        canvasRef,
        canvasWidth,
        canvasHeight
    });
    const { exportingIndex, handleDownload, handleExportAll } = exportHook;

    // 專案管理
    const projectsHook = useProjects({
        slides,
        theme,
        brandName,
        setSlides,
        setTheme,
        setBrandName,
        setActiveSlideIndex
    });
    const {
        currentFilename,
        isProjectModalOpen,
        setIsProjectModalOpen,
        projectList,
        handleSaveProject,
        handleOpenProjectManager,
        loadProject,
        deleteProject
    } = projectsHook;

    // 從 localStorage 載入幻燈片
    useEffect(() => {
        const saved = localStorage.getItem("generated_slides");
        if (saved) {
            try {
                const parsed = JSON.parse(saved) as Slide[];
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setSlides(parsed);
                }
            } catch (error) {
                console.error("Failed to parse saved slides:", error instanceof Error ? error.message : String(error));
            }
        }
    }, [setSlides]);

    // 可用主題列表
    const availableThemes = isStoryMode ? STORY_THEMES : CAROUSEL_THEMES;

    // 新增幻燈片
    const handleAddSlide = () => {
        const newId = Date.now().toString();
        const newSlide: Slide = {
            id: newId,
            type: 'Content',
            title: 'New Slide',
            content: 'Edit me...',
            theme
        };
        setSlides(prev => [...prev, newSlide]);
        setActiveSlideIndex(slides.length);
    };

    // 刪除幻燈片
    const handleDeleteSlide = (index: number) => {
        if (slides.length <= 1) return;
        setSlides(prev => prev.filter((_, i) => i !== index));
        setActiveSlideIndex(Math.max(0, index - 1));
    };

    // 更新當前幻燈片主題
    const handleThemeChange = (newTheme: ThemeType) => {
        setSlides(prev => {
            const newSlides = [...prev];
            newSlides[activeSlideIndex] = { ...newSlides[activeSlideIndex], theme: newTheme };
            return newSlides;
        });
    };

    // 觸發圖片上傳
    const triggerImageUpload = () => {
        document.getElementById('file-upload')?.click();
    };

    return (
        <div className={styles.container} style={{ paddingTop: 'var(--header-height)' }}>
            {/* 左側大綱面板 */}
            <SlideOutline
                slides={slides}
                activeSlideIndex={activeSlideIndex}
                draggedSlideIndex={draggedSlideIndex}
                theme={theme}
                onSelectSlide={setActiveSlideIndex}
                onAddSlide={handleAddSlide}
                onDeleteSlide={handleDeleteSlide}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            />

            {/* 主預覽區域 */}
            <main className={styles.previewArea}>
                <ToolBar
                    scale={scale}
                    activeSlideIndex={activeSlideIndex}
                    totalSlides={slides.length}
                    currentFilename={currentFilename}
                    onZoomIn={() => setScale(s => Math.min(1.5, s + 0.1))}
                    onZoomOut={() => setScale(s => Math.max(0.3, s - 0.1))}
                    onPrevSlide={prevSlide}
                    onNextSlide={nextSlide}
                    onExportCurrent={handleDownload}
                    onExportAll={handleExportAll}
                    onSave={handleSaveProject}
                    onOpenProjects={handleOpenProjectManager}
                />

                <CanvasPreview
                    slide={activeSlide}
                    slides={slides}
                    theme={theme}
                    brandName={brandName}
                    scale={scale}
                    canvasWidth={canvasWidth}
                    canvasHeight={canvasHeight}
                    canvasRef={canvasRef}
                    slideIndex={activeSlideIndex}
                    totalSlides={slides.length}
                    onImageClick={triggerImageUpload}
                />
            </main>

            {/* 右側屬性面板 */}
            <PropertiesPanel
                slide={activeSlide}
                theme={theme}
                brandName={brandName}
                availableThemes={availableThemes}
                onThemeChange={handleThemeChange}
                onBrandNameChange={setBrandName}
                onSlideUpdate={updateSlide}
            />

            {/* 隱藏的導出容器 */}
            <HiddenExportContainer
                slides={slides}
                theme={theme}
                brandName={brandName}
                exportingIndex={exportingIndex}
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
            />

            {/* 專案管理彈窗 */}
            <ProjectModal
                isOpen={isProjectModalOpen}
                projectList={projectList}
                onClose={() => setIsProjectModalOpen(false)}
                onLoadProject={loadProject}
                onDeleteProject={deleteProject}
            />
        </div>
    );
}

export default function EditorPage() {
    return (
        <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
            <EditorContent />
        </Suspense>
    );
}

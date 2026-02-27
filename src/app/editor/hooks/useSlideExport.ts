import { useState, useCallback, RefObject } from 'react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { Slide } from '../types';

// useSlideExport Hook - 導出邏輯

export interface UseSlideExportReturn {
    exportingIndex: number | null;
    setExportingIndex: React.Dispatch<React.SetStateAction<number | null>>;
    handleDownload: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
    handleExportAll: () => Promise<void>;
}

interface UseSlideExportOptions {
    slides: Slide[];
    activeSlideIndex: number;
    canvasRef: RefObject<HTMLDivElement | null>;
    canvasWidth: number;
    canvasHeight: number;
}

export function useSlideExport({
    slides,
    activeSlideIndex,
    canvasRef,
    canvasWidth,
    canvasHeight
}: UseSlideExportOptions): UseSlideExportReturn {
    const [exportingIndex, setExportingIndex] = useState<number | null>(null);

    // 單張導出
    const handleDownload = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!canvasRef.current) return;
        const btn = e.currentTarget;
        const originalText = btn.innerText;

        try {
            btn.innerText = "Exporting...";
            btn.disabled = true;

            const dataUrl = await toPng(canvasRef.current, {
                width: canvasWidth,
                height: canvasHeight,
                style: {
                    transform: 'scale(1)',
                    transformOrigin: 'top left',
                    boxShadow: 'none',
                },
                quality: 1,
                pixelRatio: 2,
                cacheBust: true,
                skipFonts: false,
            });

            const link = document.createElement('a');
            link.download = `slide-${activeSlideIndex + 1}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err: unknown) {
            console.error('Export Error Detail:', err);
            const errorMsg = err instanceof Error ? err.message : String(err);
            alert(`Export failed: ${errorMsg}`);
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    }, [canvasRef, canvasWidth, canvasHeight, activeSlideIndex]);

    // 批量導出 ZIP
    const handleExportAll = useCallback(async () => {
        const btn = document.querySelector('[data-export-all-btn]') as HTMLButtonElement;
        const originalText = btn?.innerText || "Export All Slides";

        try {
            if (btn) {
                btn.innerText = "Initializing...";
                btn.disabled = true;
            }

            const zip = new JSZip();

            for (let i = 0; i < slides.length; i++) {
                // 設定當前要渲染的幻燈片索引
                setExportingIndex(i);
                if (btn) btn.innerText = `Preparing Slide ${i + 1}/${slides.length}...`;

                // 等待 React 渲染 DOM
                await new Promise(r => setTimeout(r, 600));

                const exportElement = document.getElementById(`export-slide-${i}`);
                if (!exportElement) {
                    console.error(`Export element for slide ${i} not found`);
                    continue;
                }

                try {
                    if (btn) btn.innerText = `Capturing Slide ${i + 1}/${slides.length}...`;

                    const dataUrl = await toPng(exportElement, {
                        width: canvasWidth,
                        height: canvasHeight,
                        style: {
                            transform: 'scale(1)',
                            transformOrigin: 'top left',
                            boxShadow: 'none',
                        },
                        quality: 0.9,
                        pixelRatio: 2,
                        cacheBust: true,
                    });

                    const base64Data = dataUrl.split(',')[1];
                    zip.file(`slide-${i + 1}.png`, base64Data, { base64: true });

                    // 釋放內存
                    URL.revokeObjectURL(dataUrl);
                } catch (slideErr) {
                    console.error(`Error capturing slide ${i + 1}:`, slideErr);
                }
            }

            // 匯出完成，清理狀態
            setExportingIndex(null);

            if (btn) btn.innerText = "Generating ZIP...";
            const blob = await zip.generateAsync({ type: "blob" });

            const link = document.createElement('a');
            link.download = `carousel-bundle-${Date.now()}.zip`;
            link.href = URL.createObjectURL(blob);
            link.click();

            alert("Success! All slides have been bundled into a single ZIP file.");
        } catch (err: unknown) {
            console.error('Export All Error:', err);
            const errorMsg = err instanceof Error ? err.message : 'Unknown error';
            alert(`Failed to export all slides: ${errorMsg}`);
            setExportingIndex(null);
        } finally {
            if (btn) {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        }
    }, [slides, canvasWidth, canvasHeight]);

    return {
        exportingIndex,
        setExportingIndex,
        handleDownload,
        handleExportAll
    };
}

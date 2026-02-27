import { Plus, Minus, Download, ChevronLeft, ChevronRight, Save, Upload } from 'lucide-react';
import styles from '../editor.module.css';

// ToolBar - 工具列

export interface ToolBarProps {
    scale: number;
    activeSlideIndex: number;
    totalSlides: number;
    currentFilename: string | null;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onPrevSlide: () => void;
    onNextSlide: () => void;
    onExportCurrent: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onExportAll: () => void;
    onSave: () => void;
    onOpenProjects: () => void;
}

export function ToolBar({
    scale,
    activeSlideIndex,
    totalSlides,
    currentFilename,
    onZoomIn,
    onZoomOut,
    onPrevSlide,
    onNextSlide,
    onExportCurrent,
    onExportAll,
    onSave,
    onOpenProjects
}: ToolBarProps) {
    return (
        <>
            {/* 頂部操作列 */}
            <div className={styles.topActionsBar}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button
                        className={styles.exportAllBtn}
                        onClick={onExportAll}
                        data-export-all-btn
                    >
                        <Download size={18} />
                        <span>Download All as ZIP (.zip)</span>
                    </button>
                    <button className={styles.btnSecondary} onClick={onSave}>
                        <Save size={18} />
                        <span>{currentFilename ? '儲存 (' + currentFilename.replace('.json', '') + ')' : '另存新檔'}</span>
                    </button>
                    <button className={styles.btnSecondary} onClick={onOpenProjects}>
                        <Upload size={18} />
                        <span>開啟專案</span>
                    </button>
                </div>
            </div>

            {/* 工具列 */}
            <div className={styles.toolbar}>
                <div className={styles.zoomControls}>
                    <button onClick={onZoomOut}><Minus size={16} /></button>
                    <span style={{ fontSize: '0.8rem', width: '40px', textAlign: 'center' }}>{Math.round(scale * 100)}%</span>
                    <button onClick={onZoomIn}><Plus size={16} /></button>
                </div>

                <div className={styles.navControls}>
                    <button onClick={onPrevSlide} disabled={activeSlideIndex === 0}><ChevronLeft size={20} /></button>
                    <span style={{ fontSize: '0.9rem' }}>{activeSlideIndex + 1} / {totalSlides}</span>
                    <button onClick={onNextSlide} disabled={activeSlideIndex === totalSlides - 1}><ChevronRight size={20} /></button>
                </div>

                <button
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}
                    onClick={onExportCurrent}
                >
                    <Download size={18} />
                    <span>Export Active Slide</span>
                </button>
            </div>
        </>
    );
}

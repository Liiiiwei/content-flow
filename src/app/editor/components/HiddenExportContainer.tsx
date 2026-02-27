import { Slide, ThemeType } from '../types';
import { SlideTemplate } from './templates/SlideTemplate';

// HiddenExportContainer - 隱藏的導出容器

export interface HiddenExportContainerProps {
    slides: Slide[];
    theme: ThemeType;
    brandName: string;
    exportingIndex: number | null;
    canvasWidth: number;
    canvasHeight: number;
}

export function HiddenExportContainer({
    slides,
    theme,
    brandName,
    exportingIndex,
    canvasWidth,
    canvasHeight
}: HiddenExportContainerProps) {
    if (exportingIndex === null || !slides[exportingIndex]) {
        return (
            <div
                id="hidden-export-container"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: '-8000px',
                    pointerEvents: 'none',
                    opacity: 0,
                    zIndex: -9999
                }}
            />
        );
    }

    const slide = slides[exportingIndex];
    const slideTheme = slide.theme || theme;

    return (
        <div
            id="hidden-export-container"
            style={{
                position: 'fixed',
                top: 0,
                left: '-8000px',
                pointerEvents: 'none',
                opacity: 0,
                zIndex: -9999
            }}
        >
            <div
                key={slide.id}
                id={`export-slide-${exportingIndex}`}
                className="slide-export-item"
                style={{
                    width: `${canvasWidth}px`,
                    height: `${canvasHeight}px`,
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div style={{ width: '100%', height: '100%', transform: 'scale(1)' }}>
                    <SlideTemplate
                        slide={slide}
                        theme={slideTheme}
                        brandName={brandName}
                        slideIndex={exportingIndex}
                        totalSlides={slides.length}
                        slides={slides}
                        isExport={true}
                    />
                </div>
            </div>
        </div>
    );
}

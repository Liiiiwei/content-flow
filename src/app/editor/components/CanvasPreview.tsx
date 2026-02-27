import { RefObject } from 'react';
import { Slide, ThemeType } from '../types';
import { SlideTemplate } from './templates/SlideTemplate';
import styles from '../editor.module.css';

// CanvasPreview - 中央畫布預覽

export interface CanvasPreviewProps {
    slide: Slide;
    slides: Slide[];
    theme: ThemeType;
    brandName: string;
    scale: number;
    canvasWidth: number;
    canvasHeight: number;
    canvasRef: RefObject<HTMLDivElement | null>;
    slideIndex: number;
    totalSlides: number;
    onImageClick: () => void;
}

export function CanvasPreview({
    slide,
    slides,
    theme,
    brandName,
    scale,
    canvasWidth,
    canvasHeight,
    canvasRef,
    slideIndex,
    totalSlides,
    onImageClick
}: CanvasPreviewProps) {
    const currentTheme = slide.theme || theme;

    return (
        <div className={styles.canvasContainer}>
            <div
                ref={canvasRef}
                className={styles.canvas}
                style={{
                    transform: `scale(${scale})`,
                    width: canvasWidth,
                    height: canvasHeight
                }}
            >
                <SlideTemplate
                    slide={slide}
                    theme={currentTheme}
                    brandName={brandName}
                    slideIndex={slideIndex}
                    totalSlides={totalSlides}
                    slides={slides}
                    isExport={false}
                    onImageClick={onImageClick}
                />
            </div>
        </div>
    );
}

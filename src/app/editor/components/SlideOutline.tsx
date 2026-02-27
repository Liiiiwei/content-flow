import { Plus, Minus, Layout as LayoutIcon } from 'lucide-react';
import { Slide, ThemeType } from '../types';
import styles from '../editor.module.css';

// SlideOutline - 左側大綱面板

export interface SlideOutlineProps {
    slides: Slide[];
    activeSlideIndex: number;
    draggedSlideIndex: number | null;
    theme: ThemeType;
    onSelectSlide: (index: number) => void;
    onAddSlide: () => void;
    onDeleteSlide: (index: number) => void;
    onDragStart: (index: number) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (index: number) => void;
}

export function SlideOutline({
    slides,
    activeSlideIndex,
    draggedSlideIndex,
    onSelectSlide,
    onAddSlide,
    onDeleteSlide,
    onDragStart,
    onDragOver,
    onDrop
}: SlideOutlineProps) {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LayoutIcon size={18} />
                    <span>Outline</span>
                </div>
                <button className={styles.addBtn} onClick={onAddSlide}>
                    <Plus size={16} />
                </button>
            </div>
            <div className={styles.sidebarContent}>
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        draggable
                        onDragStart={() => onDragStart(index)}
                        onDragOver={onDragOver}
                        onDrop={() => onDrop(index)}
                        className={`${styles.slideItem} ${index === activeSlideIndex ? styles.active : ''}`}
                        onClick={() => onSelectSlide(index)}
                        style={{
                            position: 'relative',
                            cursor: 'grab',
                            opacity: draggedSlideIndex === index ? 0.5 : 1,
                            border: draggedSlideIndex === index ? '1px dashed var(--accent-primary)' : undefined
                        }}
                    >
                        <div className={styles.slideHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Slide {index + 1}</span>
                            {slides.length > 1 && index === activeSlideIndex && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm('Delete this slide?')) {
                                            onDeleteSlide(index);
                                        }
                                    }}
                                    className={styles.deleteMiniBtn}
                                >
                                    <Minus size={12} />
                                </button>
                            )}
                        </div>
                        <div className={styles.slideTitlePreview}>{slide.title}</div>
                    </div>
                ))}
                <button className={styles.addSlideFullWidthBtn} onClick={onAddSlide}>
                    <Plus size={14} /> Add New Slide
                </button>
            </div>
        </aside>
    );
}

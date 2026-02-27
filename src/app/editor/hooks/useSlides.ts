import { useState, useCallback } from 'react';
import { Slide, ThemeType, DEFAULT_SLIDES } from '../types';

// useSlides Hook - 幻燈片狀態管理

export interface UseSlidesReturn {
    slides: Slide[];
    setSlides: React.Dispatch<React.SetStateAction<Slide[]>>;
    activeSlideIndex: number;
    setActiveSlideIndex: React.Dispatch<React.SetStateAction<number>>;
    activeSlide: Slide;
    updateSlide: (key: keyof Slide, value: string) => void;
    nextSlide: () => void;
    prevSlide: () => void;
    addSlide: (theme: ThemeType) => void;
    deleteSlide: (index: number) => void;
    draggedSlideIndex: number | null;
    handleDragStart: (index: number) => void;
    handleDragOver: (e: React.DragEvent) => void;
    handleDrop: (index: number) => void;
}

export function useSlides(initialSlides: Slide[] = DEFAULT_SLIDES): UseSlidesReturn {
    const [slides, setSlides] = useState<Slide[]>(initialSlides);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const [draggedSlideIndex, setDraggedSlideIndex] = useState<number | null>(null);

    // 當前選中的幻燈片
    const activeSlide = slides[activeSlideIndex] || DEFAULT_SLIDES[0];

    // 更新當前幻燈片的屬性
    const updateSlide = useCallback((key: keyof Slide, value: string) => {
        setSlides(prev => {
            const newSlides = [...prev];
            newSlides[activeSlideIndex] = { ...newSlides[activeSlideIndex], [key]: value };
            return newSlides;
        });
    }, [activeSlideIndex]);

    // 導航
    const nextSlide = useCallback(() => {
        setActiveSlideIndex(prev => Math.min(slides.length - 1, prev + 1));
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        setActiveSlideIndex(prev => Math.max(0, prev - 1));
    }, []);

    // 新增幻燈片
    const addSlide = useCallback((theme: ThemeType) => {
        const newId = Date.now().toString();
        const newSlide: Slide = {
            id: newId,
            type: 'Content',
            title: 'New Slide',
            content: 'Edit me...',
            theme
        };
        setSlides(prev => [...prev, newSlide]);
        setActiveSlideIndex(prev => prev + 1);
    }, []);

    // 刪除幻燈片
    const deleteSlide = useCallback((index: number) => {
        if (slides.length <= 1) return;
        setSlides(prev => prev.filter((_, i) => i !== index));
        setActiveSlideIndex(prev => Math.max(0, prev - 1));
    }, [slides.length]);

    // 拖放功能
    const handleDragStart = useCallback((index: number) => {
        setDraggedSlideIndex(index);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
    }, []);

    const handleDrop = useCallback((index: number) => {
        if (draggedSlideIndex === null || draggedSlideIndex === index) return;

        setSlides(prev => {
            const newSlides = [...prev];
            const [movedSlide] = newSlides.splice(draggedSlideIndex, 1);
            newSlides.splice(index, 0, movedSlide);
            return newSlides;
        });
        setActiveSlideIndex(index);
        setDraggedSlideIndex(null);
    }, [draggedSlideIndex]);

    return {
        slides,
        setSlides,
        activeSlideIndex,
        setActiveSlideIndex,
        activeSlide,
        updateSlide,
        nextSlide,
        prevSlide,
        addSlide,
        deleteSlide,
        draggedSlideIndex,
        handleDragStart,
        handleDragOver,
        handleDrop
    };
}

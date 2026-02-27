// 幻燈片類型定義

export type SlideType = "Cover" | "Content" | "Quote" | "End" | "Story";

export type ThemeType =
    | 'Editorial'
    | 'Minimal'
    | 'Bold'
    | 'Typewriter'
    | 'Compact'
    | 'Balanced'
    | 'Opening'
    | 'Content'
    | 'Closing'
    | 'Story'
    | 'StoryInteractive';

export interface Slide {
    id: string;
    type: SlideType;
    title: string;
    content: string;
    image?: string;
    theme?: ThemeType;
}

export interface Project {
    filename: string;
    name: string;
    updatedAt: Date | string;
}

// 預設幻燈片
export const DEFAULT_SLIDES: Slide[] = [
    {
        id: "1",
        type: "Cover",
        title: "Your Content Awaits",
        content: "Paste an article on the home page to see the AI magic.",
        image: undefined
    }
];

// 各模式可用的主題
export const CAROUSEL_THEMES: ThemeType[] = [
    'Editorial',
    'Minimal',
    'Bold',
    'Typewriter',
    'Compact',
    'Balanced',
    'Opening',
    'Content',
    'Closing'
];

export const STORY_THEMES: ThemeType[] = [
    'Story',
    'StoryInteractive'
];

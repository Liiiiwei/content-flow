import { Type, Minus, Image as ImageIcon, Layout as LayoutIcon } from 'lucide-react';
import { Slide, ThemeType } from '../types';
import styles from '../editor.module.css';

// PropertiesPanel - 右側屬性面板

export interface PropertiesPanelProps {
    slide: Slide;
    theme: ThemeType;
    brandName: string;
    availableThemes: ThemeType[];
    onThemeChange: (theme: ThemeType) => void;
    onBrandNameChange: (name: string) => void;
    onSlideUpdate: (key: keyof Slide, value: string) => void;
}

export function PropertiesPanel({
    slide,
    theme,
    brandName,
    availableThemes,
    onThemeChange,
    onBrandNameChange,
    onSlideUpdate
}: PropertiesPanelProps) {
    // 處理檔案上傳
    const handleFileUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (typeof e.target?.result === 'string') {
                onSlideUpdate('image', e.target.result);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className={styles.propertiesPanel}>
            <h3 style={{ marginBottom: 24, fontSize: '1.1rem', fontWeight: 600 }}>Properties</h3>

            {/* 主題選擇 */}
            <div className={styles.propGroup}>
                <label><LayoutIcon size={14} /> Layout Style (This Slide)</label>
                <div className={styles.themeSelectorGrid}>
                    {availableThemes.map((t) => (
                        <button
                            key={t}
                            onClick={() => onThemeChange(t)}
                            className={`${styles.themeBtn} ${(slide.theme || theme) === t ? styles.themeBtnActive : ''}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* 品牌名稱 */}
            <div className={styles.propGroup}>
                <label><Type size={14} /> Brand Name</label>
                <input
                    className={styles.inputField}
                    value={brandName}
                    onChange={(e) => onBrandNameChange(e.target.value)}
                />
            </div>

            {/* 標題 */}
            <div className={styles.propGroup}>
                <label><Type size={14} /> Headline</label>
                <textarea
                    className={styles.inputField}
                    value={slide.title}
                    onChange={(e) => onSlideUpdate('title', e.target.value)}
                />
            </div>

            {/* 內文 */}
            <div className={styles.propGroup}>
                <label><Minus size={14} /> Body Text</label>
                <textarea
                    className={styles.textArea}
                    value={slide.content}
                    onChange={(e) => onSlideUpdate('content', e.target.value)}
                />
            </div>

            {/* 背景圖片 */}
            <div className={styles.propGroup}>
                <label><ImageIcon size={14} /> Background Image</label>
                <div className={styles.imageUploadControl}>
                    {/* URL 輸入 */}
                    <input
                        className={styles.inputField}
                        value={slide.image || ''}
                        onChange={(e) => onSlideUpdate('image', e.target.value)}
                        placeholder="https://..."
                        style={{ marginBottom: '8px' }}
                    />

                    {/* 檔案上傳區域 */}
                    <div
                        className={styles.uploadArea}
                        onClick={() => document.getElementById('file-upload')?.click()}
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.currentTarget.style.borderColor = 'var(--accent-primary)';
                            e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
                        }}
                        onDragLeave={(e) => {
                            e.preventDefault();
                            e.currentTarget.style.borderColor = 'var(--border-subtle)';
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        onDrop={(e) => {
                            e.preventDefault();
                            e.currentTarget.style.borderColor = 'var(--border-subtle)';
                            e.currentTarget.style.backgroundColor = 'transparent';
                            const file = e.dataTransfer.files[0];
                            if (file && file.type.startsWith('image/')) {
                                handleFileUpload(file);
                            }
                        }}
                    >
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            Drag & Drop or Click to Upload
                        </span>
                    </div>
                    <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                handleFileUpload(file);
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

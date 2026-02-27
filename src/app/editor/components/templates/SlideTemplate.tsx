import { ChevronRight } from 'lucide-react';
import { Slide, ThemeType } from '../../types';
import { getProxyUrl } from '../../utils/imageProxy';
import { formatTitleSafely } from '../../utils/formatTitle';
import styles from '../../editor.module.css';

// SlideTemplate - 統一的主題渲染組件

export interface SlideTemplateProps {
    slide: Slide;
    theme: ThemeType;
    brandName: string;
    slideIndex: number;
    totalSlides: number;
    slides: Slide[];
    isExport?: boolean;
    onImageClick?: () => void;
}

// 可點擊的圖片屬性
function getImageProps(isExport: boolean, onImageClick?: () => void) {
    if (isExport) return {};
    return {
        onClick: onImageClick,
        style: { cursor: 'pointer' },
        title: "Click to change image"
    };
}

// 跨域圖片屬性
function getCrossOriginProps(imageUrl?: string) {
    if (!imageUrl || imageUrl.startsWith('data:')) return {};
    return { crossOrigin: 'anonymous' as const };
}

export function SlideTemplate({
    slide,
    theme,
    brandName,
    slideIndex,
    totalSlides,
    slides,
    isExport = false,
    onImageClick
}: SlideTemplateProps) {
    const imgProps = getImageProps(isExport, onImageClick);
    const proxyUrl = getProxyUrl(slide.image);

    // Story 主題
    if (theme === 'Story') {
        return (
            <div className={styles.templateStory}>
                {slide.image ? (
                    <img
                        src={proxyUrl}
                        alt="story-bg"
                        className={styles.storyBg}
                        {...getCrossOriginProps(slide.image)}
                        {...imgProps}
                    />
                ) : (
                    <div className={styles.storyBg} {...imgProps}></div>
                )}
                <div className={styles.storyContent}>
                    <div className={styles.storyHeader}>
                        <span className={styles.brandName}>{brandName}</span>
                    </div>
                    <div className={styles.storyMain}>
                        <h1 className={styles.storyTitle}>{slide.title}</h1>
                        <p className={styles.storyBody}>{slide.content}</p>
                    </div>
                    <div className={styles.storyFooter}>
                        <span>Tap to next →</span>
                    </div>
                </div>
            </div>
        );
    }

    // StoryInteractive 主題
    if (theme === 'StoryInteractive') {
        return (
            <div className={styles.templateStoryInteractive}>
                {slide.image ? (
                    <img
                        src={proxyUrl}
                        alt="background"
                        className={styles.storyInteractiveBg}
                        {...getCrossOriginProps(slide.image)}
                        {...imgProps}
                    />
                ) : (
                    <div className={styles.storyInteractiveBg} {...imgProps}></div>
                )}
                <div className={styles.storyInteractiveOverlay}></div>
                <div className={styles.storyInteractiveSidebar}>
                    <div className={styles.storyInteractiveTitleBox}>
                        <h1 className={styles.storyInteractiveTitle}>
                            {slide.title || '重新探索我的人生'}
                        </h1>
                    </div>
                </div>
                <div className={styles.storyInteractiveFooter}>
                    <p>{slide.content || '關於我你需要知道的 _ 件事'}</p>
                    <div className={styles.storyInteractiveArrow}>
                        <ChevronRight size={48} />
                    </div>
                </div>
            </div>
        );
    }

    // Editorial 主題
    if (theme === 'Editorial') {
        return (
            <div className={styles.templateEditorial}>
                {slide.image ? (
                    <img
                        src={proxyUrl}
                        alt="slide-bg"
                        className={styles.editorialBg}
                        {...getCrossOriginProps(slide.image)}
                        {...imgProps}
                    />
                ) : (
                    <div className={styles.editorialBg} {...imgProps}></div>
                )}
                <div className={styles.editorialFrame}></div>
                <div className={styles.editorialHeader}>
                    <span className={styles.brandName}>{brandName}</span>
                    <span className={styles.categoryTag}>{slide.type?.toUpperCase() || 'CONTENT'}</span>
                </div>
                <div className={styles.editorialContent}>
                    <h1 className={styles.headline}>{slide.title}</h1>
                    <p className={styles.bodyText}>{slide.content}</p>
                </div>
                <div className={styles.editorialFooter}>
                    <span>Swipe to learn more</span>
                    <div className={styles.dotIndicator}>
                        {slides.map((_, i) => (
                            <div key={i} className={`${styles.dot} ${i === slideIndex ? styles.dotActive : ''}`} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Typewriter 主題
    if (theme === 'Typewriter') {
        return (
            <div className={styles.templateTypewriter}>
                {slide.image ? (
                    <img
                        src={proxyUrl}
                        className={styles.typewriterBg}
                        alt="bg"
                        {...getCrossOriginProps(slide.image)}
                        {...imgProps}
                    />
                ) : (
                    <div className={styles.typewriterBg} {...imgProps}></div>
                )}
                <div className={styles.typewriterContent}>
                    <div style={{ textAlign: 'right', fontFamily: 'Courier New', fontSize: '1.2rem' }}>
                        PAGE {slideIndex + 1} OF {totalSlides}
                    </div>
                    <div>
                        <h1 className={styles.typewriterTitle}>{slide.title}</h1>
                        <div style={{ height: 40 }}></div>
                        <p className={styles.typewriterBody}>{slide.content}</p>
                    </div>
                    <div style={{ borderTop: '2px solid black', paddingTop: 10 }}>#{brandName.replace(/\s+/g, '')}</div>
                </div>
            </div>
        );
    }

    // Minimal 主題
    if (theme === 'Minimal') {
        return (
            <div className={styles.templateMinimal}>
                {slide.image ? (
                    <img
                        src={proxyUrl}
                        className={styles.minimalBg}
                        alt="bg"
                        {...getCrossOriginProps(slide.image)}
                        {...imgProps}
                    />
                ) : (
                    <div className={styles.minimalBg} {...imgProps}></div>
                )}
                <div className={styles.minimalContent}>
                    <div className={styles.minimalHeader}>{brandName} /// 0{slideIndex + 1}</div>
                    <h1 className={styles.minimalTitle}>{slide.title}</h1>
                    <p className={styles.minimalBody}>{slide.content}</p>
                </div>
            </div>
        );
    }

    // Bold 主題
    if (theme === 'Bold') {
        return (
            <div className={styles.templateBold}>
                {slide.image ? (
                    <img
                        src={proxyUrl}
                        className={styles.boldBg}
                        alt="bg"
                        {...getCrossOriginProps(slide.image)}
                        {...imgProps}
                    />
                ) : (
                    <div className={styles.boldBg} {...imgProps}></div>
                )}
                <div className={styles.boldContentWrapper}>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{brandName}</div>
                    <h1 className={styles.boldTitle}>{slide.title}</h1>
                    <p className={styles.boldBody}>{slide.content}</p>
                </div>
            </div>
        );
    }

    // Compact 主題
    if (theme === 'Compact') {
        return (
            <div className={styles.templateCompact}>
                {slide.image ? (
                    <img
                        src={proxyUrl}
                        className={styles.compactBg}
                        alt="bg"
                        {...getCrossOriginProps(slide.image)}
                        {...imgProps}
                    />
                ) : (
                    <div className={styles.compactBg} {...imgProps}></div>
                )}
                <div className={styles.compactContent}>
                    <h1 className={styles.compactTitle}>{slide.title}</h1>
                    <p className={styles.compactBody}>{slide.content}</p>
                </div>
            </div>
        );
    }

    // Balanced 主題
    if (theme === 'Balanced') {
        return (
            <div className={styles.templateBalanced}>
                <div className={styles.balancedImageSection}>
                    {slide.image ? (
                        <img
                            src={proxyUrl}
                            className={styles.balancedBg}
                            alt="bg"
                            {...getCrossOriginProps(slide.image)}
                            {...imgProps}
                        />
                    ) : (
                        <div className={styles.balancedBg} {...imgProps}></div>
                    )}
                </div>
                <div className={styles.balancedTextSection}>
                    <h1 className={styles.balancedTitle}>{slide.title}</h1>
                    <p className={styles.balancedBody}>{slide.content}</p>
                    <div className={styles.balancedBrand}>{brandName}</div>
                </div>
            </div>
        );
    }

    // Opening 主題
    if (theme === 'Opening') {
        return (
            <div className={styles.templateOpening}>
                <div className={styles.openingIcon} {...imgProps}>
                    {slide.image ? (
                        <img
                            src={proxyUrl}
                            alt="icon"
                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                            {...getCrossOriginProps(slide.image)}
                        />
                    ) : (
                        "✨"
                    )}
                </div>
                <h1 className={styles.openingTitle} dangerouslySetInnerHTML={{ __html: formatTitleSafely(slide.title) }}></h1>
                <p className={styles.openingBody}>{slide.content}</p>
                <div className={styles.openingFooter}>
                    <span>Swipe</span> <ChevronRight size={24} />
                </div>
            </div>
        );
    }

    // Content 主題
    if (theme === 'Content') {
        return (
            <div className={styles.templateContent}>
                <div className={styles.contentStepPill}>Step {slideIndex + 1}</div>
                <div className={styles.contentTitlePill}>{slide.title}</div>
                <p className={styles.contentBody}>{slide.content}</p>
                <div className={styles.contentCallout}>
                    {brandName}: Save this for later!
                </div>
            </div>
        );
    }

    // Closing 主題
    if (theme === 'Closing') {
        return (
            <div className={styles.templateClosing}>
                <div className={styles.closingAvatar} {...imgProps}>
                    {slide.image ? (
                        <img
                            src={proxyUrl}
                            alt="avatar"
                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                            {...getCrossOriginProps(slide.image)}
                        />
                    ) : (
                        "👤"
                    )}
                </div>
                <div className={styles.closingHandle}>@{brandName.replace(/\s+/g, '').toLowerCase()}</div>
                <h1 className={styles.closingTitle}>{slide.title || "If you loved this post, share it with your friends."}</h1>
                <div className={styles.closingFooter}>
                    Tap to share →
                </div>
            </div>
        );
    }

    return null;
}

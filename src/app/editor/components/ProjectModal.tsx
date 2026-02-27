import { X, Trash2 } from 'lucide-react';
import { Project } from '../types';
import styles from '../editor.module.css';

// ProjectModal - 專案管理彈窗

export interface ProjectModalProps {
    isOpen: boolean;
    projectList: Project[];
    onClose: () => void;
    onLoadProject: (filename: string) => void;
    onDeleteProject: (filename: string, e: React.MouseEvent) => void;
}

export function ProjectModal({
    isOpen,
    projectList,
    onClose,
    onLoadProject,
    onDeleteProject
}: ProjectModalProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <span>已儲存的專案</span>
                    <button className={styles.modalCloseBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className={styles.modalBody}>
                    {projectList.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>尚無存檔</div>
                    ) : (
                        <div className={styles.projectList}>
                            {projectList.map((p) => (
                                <div
                                    key={p.filename}
                                    className={styles.projectItem}
                                    onClick={() => onLoadProject(p.filename)}
                                >
                                    <div className={styles.projectInfo}>
                                        <div className={styles.projectName}>{p.name}</div>
                                        <div className={styles.projectDate}>{new Date(p.updatedAt).toLocaleString()}</div>
                                    </div>
                                    <button
                                        className={styles.modalCloseBtn}
                                        style={{ color: '#ff4d4d' }}
                                        onClick={(e) => onDeleteProject(p.filename, e)}
                                        title="刪除"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

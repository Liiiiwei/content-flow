"use client";

import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clock, ArrowRight } from "lucide-react";

export default function Home() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const router = useRouter();

  // Load recent projects on mount
  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data.projects) {
          // Take only the top 3 most recent
          setRecentProjects(data.projects.slice(0, 3));
        }
      })
      .catch(err => console.error("Failed to load projects", err));
  }, []);

  const handleGenerate = async (e: React.FormEvent, mode: 'carousel' | 'story') => {
    e.preventDefault();
    if (!text) return;

    setIsLoading(true);
    try {
      // For story mode, we only need text (no image parsing)
      if (mode === 'story') {
        const response = await fetch("/api/generate-story", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Story generation failed");
        }

        const data = await response.json();
        if (data.slides) {
          localStorage.setItem("generated_slides", JSON.stringify(data.slides));
          router.push("/editor?mode=story");
        }
        return;
      }

      // Original carousel logic with smart parse
      let payload: { text: string; images?: string[] } = { text };
      try {
        const jsonInput = JSON.parse(text);
        if (typeof jsonInput === 'object' && jsonInput !== null) {

          let bestText = "";
          let bestImages: string[] = [];

          // 0. Priority Strategy: Structured Array (e.g. [{text, img}, {text, img}])
          let isStructured = false;

          // Helper to identify images safely
          const isImage = (val: any) => typeof val === 'string' &&
            (val.startsWith('http') || val.startsWith('data:image')) &&
            (val.match(/\.(jpg|jpeg|png|webp|gif)/i) || val.includes('images') || val.includes('img') || val.includes('photo'));

          if (Array.isArray(jsonInput)) {
            const itemsWithContent = jsonInput.filter(item =>
              typeof item === 'object' && item !== null &&
              Object.values(item).some((v: any) => typeof v === 'string' && v.length > 20) && // Has text
              Object.values(item).some((v: any) => isImage(v)) // Has image
            );

            if (itemsWithContent.length > 0) {
              isStructured = true;
              console.log("Smart Extract: Detected Structured Array with", itemsWithContent.length, "items");
              // Extract sequentially
              const structuredText = itemsWithContent.map(item => Object.values(item).find((v: any) => typeof v === 'string' && v.length > 20)).join('\n\n');
              const structuredImages = itemsWithContent.map(item => Object.values(item).find((v: any) => isImage(v))).filter(Boolean) as string[];

              bestText = structuredText;
              bestImages = structuredImages;
            }
          }

          if (!isStructured) {
            const crawl = (obj: any) => {
              if (!obj) return;

              if (typeof obj === 'string') {
                if (obj.length > bestText.length && obj.length > 50) bestText = obj;
              } else if (Array.isArray(obj)) {
                // 1. Array of strings
                const stringImages = obj.filter(item => typeof item === 'string' && (item.startsWith('http') || item.startsWith('data:image')));

                // 2. Array of objects with image fields (deep search in shallow objects)
                const objectImages = obj.map(item => {
                  if (typeof item === 'object' && item !== null) {
                    // Find any value that looks like an image URL
                    return Object.values(item).find(val => isImage(val));
                  }
                  return null;
                }).filter(Boolean) as string[];

                const foundImages = [...stringImages, ...objectImages];
                if (foundImages.length > bestImages.length) bestImages = foundImages;

                obj.forEach(crawl);
              } else if (typeof obj === 'object') {
                Object.values(obj).forEach(crawl);
              }
            };

            crawl(jsonInput);
          }

          if (bestText) {
            console.log(`Smart Extract: Text(${bestText.length} chars), Images(${bestImages.length})`);
            payload = { text: bestText, images: bestImages };
          }
        }
      } catch (e) { /* Not JSON */ }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Generation failed");
      }

      const data = await response.json();
      if (data.slides) {
        // Store in localStorage for the editor to pick up
        localStorage.setItem("generated_slides", JSON.stringify(data.slides));
        router.push("/editor?mode=carousel");
      }
    } catch (error: any) {
      console.error("Client Error:", error);
      alert("生成失敗: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openProject = async (filename: string) => {
    try {
      const res = await fetch(`/api/projects/${filename}`);
      const data = await res.json();

      if (data.slides) {
        localStorage.setItem("generated_slides", JSON.stringify(data.slides));
        router.push("/editor");
      }
    } catch (e) {
      console.error("Failed to open project", e);
      alert("無法開啟專案");
    }
  };

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.badge}>✨ AI 驅動的強大圖文生成器</div>
        <h1 className={styles.title}>
          將文章秒變 <br />
          <span className="text-gradient">爆款 IG 貼文</span>
        </h1>
        <p className={styles.subtitle}>
          貼上草稿、筆記或完整文章。AI 自動提煉重點，生成各種風格的吸睛圖文，讓您的內容在社群上脫穎而出。
        </p>

        <div className={styles.inputWrapper}>
          <textarea
            className={styles.input}
            placeholder="在此貼上您的內容..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
          <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
            <button
              onClick={(e) => handleGenerate(e, 'carousel')}
              className={styles.generateBtn}
              disabled={isLoading || !text}
              style={{ flex: 1 }}
            >
              {isLoading ? "分析中..." : "📱 生成貼文輪播"}
            </button>
            <button
              onClick={(e) => handleGenerate(e, 'story')}
              className={styles.generateBtnSecondary}
              disabled={isLoading || !text}
              style={{ flex: 1 }}
            >
              {isLoading ? "分析中..." : "⚡ 生成限時動態"}
            </button>
          </div>
        </div>
      </section>

      {/* Recent Projects Section */}
      {recentProjects.length > 0 && (
        <section className={styles.recentSection}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', opacity: 0.7 }}>
            <Clock size={16} />
            <h3>最近編輯的專案</h3>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {recentProjects.map((p) => (
              <div
                key={p.filename}
                className="surface-card"
                style={{
                  padding: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onClick={() => openProject(p.filename)}
              >
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '4px', color: 'var(--text-primary)' }}>{p.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {new Date(p.updatedAt).toLocaleString()}
                  </span>
                </div>
                <ArrowRight size={18} style={{ opacity: 0.3 }} />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

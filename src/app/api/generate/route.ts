import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

import { CAROUSEL_PROMPT } from "./prompt";

export const dynamic = 'force-dynamic';

// 驗證 API key
const GEMINI_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_KEY) {
    throw new Error("Missing GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(GEMINI_KEY);

// 驗證常數
const MAX_TEXT_LENGTH = 50000;
const MAX_IMAGES = 20;

interface SlideRequest {
    text: string;
    images?: string[];
}

interface AISlide {
    title: string;
    content: string;
    type?: string;
}

export async function POST(req: Request) {
    try {
        const body = await req.json() as SlideRequest;
        const { text, images } = body;

        // 驗證文本
        if (!text || typeof text !== 'string') {
            return NextResponse.json({ error: "Text must be a non-empty string" }, { status: 400 });
        }

        if (text.length > MAX_TEXT_LENGTH) {
            return NextResponse.json({
                error: `Text exceeds maximum length of ${MAX_TEXT_LENGTH}`
            }, { status: 400 });
        }

        // 驗證圖像
        if (images && (!Array.isArray(images) || images.length > MAX_IMAGES)) {
            return NextResponse.json({
                error: `Images must be an array with maximum ${MAX_IMAGES} items`
            }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const prompt = CAROUSEL_PROMPT(text);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let responseText = response.text();

        // 清理回應文本
        responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

        // 查找 JSON 陣列邊界
        const startIndex = responseText.indexOf('[');
        const endIndex = responseText.lastIndexOf(']');

        if (startIndex === -1 || endIndex === -1) {
            throw new Error("Could not find valid JSON array in AI response");
        }

        const jsonContent = responseText.substring(startIndex, endIndex + 1);
        const slidesData = JSON.parse(jsonContent) as AISlide[];

        // 使用分配的圖像充實投影片
        const enrichedSlides = slidesData.map((slide: AISlide, index: number) => {
            const assignedImage = (images && index < images.length)
                ? images[index]
                : undefined;

            return {
                ...slide,
                id: (index + 1).toString(),
                image: assignedImage
            };
        });

        return NextResponse.json({ slides: enrichedSlides });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("API Generation Error:", errorMessage);
        return NextResponse.json({
            error: "Failed to generate content"
        }, { status: 500 });
    }
}

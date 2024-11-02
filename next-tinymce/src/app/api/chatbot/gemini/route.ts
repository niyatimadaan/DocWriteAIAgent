// gemini/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    //   const { searchParams } = new URL(request.url);
    let {  documentContent, question } = await request.json();
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // const prompt = "Write a story about a magic backpack.";
    const prompt = `Context: ${documentContent}\n Please answer the Question based on the context: ${question}`;
    const result = await model.generateContent(prompt);
    const answer = result.response.text();
    return NextResponse.json({ answer: convertMarkdownToHTML(answer)}, { status: 200 });
}

function convertMarkdownToHTML(text: string) {
    // Replace '##' with <h2> tags for headings
    text = text.replace(/## (.*?)(\n|$)/g, '<h2>$1</h2>');

    // Replace '**text**' with <strong> tags for bold text
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Replace line breaks with <br> tags (optional based on formatting needs)
    text = text.replace(/\n/g, '<br>');

    // Replace numbered list pattern (e.g., "(i)", "(ii)") with <li> tags
    // Here, we assume the pattern (i) (ii) etc. are found and wrap them in <li>
    text = text.replace(/\(\w+\)\s(.*?)(\n|$)/g, '<li>$1</li>');

    // Wrap all <li> elements in an unordered or ordered list (if applicable)
    if (text.includes('<li>')) {
        text = '<ul>' + text + '</ul>';
    }

    return text;
}
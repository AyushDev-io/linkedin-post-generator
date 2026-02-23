import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // 1. Get the topic the user typed in
    const body = await req.json();
    const userTopic = body.prompt;

    if (!userTopic) {
      return NextResponse.json({ error: "Please enter a topic!" }, { status: 400 });
    }

    // 2. Connect to Google Gemini using your secret key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    // 3. The "Secret Sauce" Prompt (The user doesn't see this)
    const secretPrompt = `You are a highly sought-after LinkedIn ghostwriter. 
    Write a viral, engaging LinkedIn post about this topic: "${userTopic}". 
    Rules:
    - Start with a strong hook.
    - Use short paragraphs and lots of white space.
    - Keep it professional but conversational.
    - Do NOT use cringey corporate buzzwords.
    - End with a question to encourage comments.
    - Add 3-5 relevant hashtags at the bottom.`;

    // 4. Send to Google and wait for the response
    const result = await model.generateContent(secretPrompt);
    const response = await result.response;
    const aiText = response.text();

    // 5. Send the finished post back to the frontend
    return NextResponse.json({ post: aiText });

  } catch (error) {
    console.error("Error generating post:", error);
    return NextResponse.json({ error: "Failed to generate post. Check the server logs." }, { status: 500 });
  }
}
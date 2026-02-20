import { GoogleGenAI, Type, Schema } from "@google/genai";
import { RoadmapStep, Question, CourseRecommendation, ResumeAnalysis } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_FAST = 'gemini-3-flash-preview';

// --- Chat Assistant ---
export const streamChatResponse = async (
  history: { role: string; parts: [{ text: string }] }[],
  message: string,
  onChunk: (text: string) => void
) => {
  const chat = ai.chats.create({
    model: MODEL_FAST,
    history: history,
    config: {
      systemInstruction: `You are an expert AI Career Mentor. Your goal is to guide students and professionals.
      - Be supportive, practical, and honest.
      - Ask clarifying questions if the user's goal is vague.
      - Provide actionable advice, not just generic fluff.
      - Do NOT guarantee jobs or income.
      - Keep responses concise and structured (use bullet points).`
    }
  });

  const result = await chat.sendMessageStream({ message });
  
  for await (const chunk of result) {
    if (chunk.text) {
      onChunk(chunk.text);
    }
  }
};

// --- Roadmap Generator ---
export const generateRoadmap = async (role: string, currentStatus: string): Promise<RoadmapStep[]> => {
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        phase: { type: Type.STRING, description: "Phase name (e.g., Foundations, Advanced)" },
        title: { type: Type.STRING, description: "Main title of this step" },
        duration: { type: Type.STRING, description: "Estimated time to complete" },
        description: { type: Type.STRING, description: "What to learn in this step" },
        skills: { type: Type.ARRAY, items: { type: Type.STRING } },
        tools: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["phase", "title", "duration", "description", "skills", "tools"]
    }
  };

  const prompt = `Create a detailed step-by-step career roadmap for a user who wants to become a "${role}".
  User Background: ${currentStatus}.
  Break it down into logical progression steps (Beginner to Advanced).`;

  const response = await ai.models.generateContent({
    model: MODEL_FAST,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });

  return JSON.parse(response.text || "[]");
};

// --- Mock Interview ---
export const generateInterviewQuestions = async (topic: string, level: string, count: number = 5): Promise<Question[]> => {
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.INTEGER },
        question: { type: Type.STRING },
        options: { type: Type.ARRAY, items: { type: Type.STRING } },
        correctAnswerIndex: { type: Type.INTEGER, description: "Zero-based index of the correct option" },
        explanation: { type: Type.STRING, description: "Why this is the correct answer" }
      },
      required: ["id", "question", "options", "correctAnswerIndex", "explanation"]
    }
  };

  const prompt = `Generate ${count} multiple-choice interview questions for the topic: "${topic}" at a "${level}" level.
  Focus on conceptual understanding and practical application.`;

  const response = await ai.models.generateContent({
    model: MODEL_FAST,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });

  return JSON.parse(response.text || "[]");
};

// --- Course Recommendations ---
export const recommendCourses = async (goal: string, gap: string): Promise<CourseRecommendation[]> => {
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        platform: { type: Type.STRING },
        level: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Advanced"] },
        duration: { type: Type.STRING },
        isFree: { type: Type.BOOLEAN },
        reason: { type: Type.STRING }
      },
      required: ["title", "platform", "level", "duration", "isFree", "reason"]
    }
  };

  const prompt = `Recommend 5 best courses for someone wanting to learn: "${goal}".
  Skill gaps/focus area: "${gap}".
  Include a mix of free (YouTube, etc) and paid (Coursera, Udemy) options.`;

  const response = await ai.models.generateContent({
    model: MODEL_FAST,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });

  return JSON.parse(response.text || "[]");
};

// --- Resume Analyzer ---
export const analyzeResume = async (resumeText: string, targetRole: string): Promise<ResumeAnalysis> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      summary: { type: Type.STRING, description: "Overall feedback summary" },
      score: { type: Type.INTEGER, description: "Score out of 100" },
      strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
      improvements: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            original: { type: Type.STRING, description: "The problematic line or section (or 'General')" },
            suggestion: { type: Type.STRING, description: "Improved version or suggestion" },
            reason: { type: Type.STRING, description: "Why this change helps" }
          },
          required: ["original", "suggestion", "reason"]
        }
      }
    },
    required: ["summary", "score", "strengths", "weaknesses", "improvements"]
  };

  const prompt = `Analyze the following resume text for the role of "${targetRole}".
  Check for ATS friendliness, clarity, impact, and grammar.
  Resume Content:
  ${resumeText.substring(0, 10000)}
  `;

  const response = await ai.models.generateContent({
    model: MODEL_FAST,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });

  return JSON.parse(response.text || "{}");
};

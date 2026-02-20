export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  ROADMAP = 'ROADMAP',
  INTERVIEW = 'INTERVIEW',
  RESUME = 'RESUME',
  COURSES = 'COURSES',
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface RoadmapStep {
  phase: string;
  title: string;
  duration: string;
  description: string;
  skills: string[];
  tools: string[];
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface CourseRecommendation {
  title: string;
  platform: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  isFree: boolean;
  reason: string;
}

export interface ResumeAnalysis {
  summary: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  improvements: {
    original: string;
    suggestion: string;
    reason: string;
  }[];
}

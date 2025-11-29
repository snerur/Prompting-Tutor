export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Lesson {
  id: string;
  title: string;
  category: string;
  content: string; // Markdown supported
  examplePrompt: string;
  difficulty: Difficulty;
}

export interface JeopardyQuestion {
  id: string;
  category: string;
  value: number;
  question: string;
  answer: string; // The "correct" answer/explanation
  isDailyDouble?: boolean;
}

export interface JeopardyState {
  score: number;
  answeredIds: string[]; // IDs of questions already answered
  currentQuestion: JeopardyQuestion | null;
}

export interface PromptTemplate {
  id: string;
  title: string;
  industry: 'Healthcare' | 'Retail' | 'Finance' | 'Accounting' | 'General';
  description: string;
  template: string;
  variables: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isError?: boolean;
  thinking?: boolean; // For visual indication
}

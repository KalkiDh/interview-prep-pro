export type Industry = "tech" | "finance" | "marketing" | "healthcare";
export type InterviewType = "behavioral" | "technical" | "mixed";
export type Duration = 5 | 10 | 15;

export interface InterviewSetup {
  industry: Industry;
  interviewType: InterviewType;
  duration: Duration;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  tips?: string[];
}

export interface Answer {
  questionId: string;
  question: string;
  transcript: string;
  videoBlob?: Blob;
  videoUrl?: string;
  duration: number;
  startTime: number;
  endTime: number;
}

export interface AnswerFeedback {
  questionId: string;
  relevanceScore: number;
  clarityScore: number;
  structureScore: number;
  overallScore: number;
  strengths: string[];
  improvements: string[];
  starMethodUsed?: boolean;
  specificFeedback: string;
}

export interface InterviewMetrics {
  totalDuration: number;
  wordsPerMinute: number;
  fillerWordCount: number;
  fillerWords: Record<string, number>;
  averageAnswerDuration: number;
  longestAnswer: number;
  shortestAnswer: number;
}

export interface InterviewSession {
  id: string;
  setup: InterviewSetup;
  questions: InterviewQuestion[];
  answers: Answer[];
  feedback: AnswerFeedback[];
  metrics: InterviewMetrics;
  overallScore: number;
  createdAt: string;
  completedAt?: string;
}

export interface InterviewState {
  currentQuestionIndex: number;
  isRecording: boolean;
  isPaused: boolean;
  elapsedTime: number;
  transcript: string;
}

export const INDUSTRIES: { value: Industry; label: string; icon: string }[] = [
  { value: "tech", label: "Technology", icon: "💻" },
  { value: "finance", label: "Finance", icon: "💰" },
  { value: "marketing", label: "Marketing", icon: "📈" },
  { value: "healthcare", label: "Healthcare", icon: "🏥" },
];

export const INTERVIEW_TYPES: { value: InterviewType; label: string; description: string }[] = [
  { value: "behavioral", label: "Behavioral", description: "STAR method questions about past experiences" },
  { value: "technical", label: "Technical", description: "Domain-specific knowledge and problem-solving" },
  { value: "mixed", label: "Mixed", description: "Combination of behavioral and technical questions" },
];

export const DURATIONS: { value: Duration; label: string }[] = [
  { value: 5, label: "5 minutes" },
  { value: 10, label: "10 minutes" },
  { value: 15, label: "15 minutes" },
];

import type { InterviewSession } from "@/types/interview";

const STORAGE_KEY = "interviewiq_sessions";

export function saveSession(session: InterviewSession): void {
  const sessions = getAllSessions();
  const existingIndex = sessions.findIndex(s => s.id === session.id);
  
  if (existingIndex >= 0) {
    sessions[existingIndex] = session;
  } else {
    sessions.push(session);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function getSession(id: string): InterviewSession | null {
  const sessions = getAllSessions();
  return sessions.find(s => s.id === id) || null;
}

export function getAllSessions(): InterviewSession[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function deleteSession(id: string): void {
  const sessions = getAllSessions().filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Calculate interview metrics from answers
export function calculateMetrics(answers: { transcript: string; duration: number }[]): {
  totalDuration: number;
  wordsPerMinute: number;
  fillerWordCount: number;
  fillerWords: Record<string, number>;
  averageAnswerDuration: number;
  longestAnswer: number;
  shortestAnswer: number;
} {
  const fillerWordsList = ["um", "uh", "like", "you know", "basically", "actually", "literally", "so", "well", "right"];
  
  let totalWords = 0;
  let totalDuration = 0;
  const fillerWords: Record<string, number> = {};
  let fillerWordCount = 0;
  const durations: number[] = [];
  
  for (const answer of answers) {
    const words = answer.transcript.toLowerCase().split(/\s+/).filter(Boolean);
    totalWords += words.length;
    totalDuration += answer.duration;
    durations.push(answer.duration);
    
    for (const word of words) {
      for (const filler of fillerWordsList) {
        if (word === filler || answer.transcript.toLowerCase().includes(filler)) {
          const count = (answer.transcript.toLowerCase().match(new RegExp(`\\b${filler}\\b`, "g")) || []).length;
          if (count > 0) {
            fillerWords[filler] = (fillerWords[filler] || 0) + count;
            fillerWordCount += count;
          }
        }
      }
    }
  }
  
  // Remove duplicates in filler count
  const uniqueFillerWords: Record<string, number> = {};
  for (const [word, count] of Object.entries(fillerWords)) {
    if (!uniqueFillerWords[word]) {
      uniqueFillerWords[word] = count;
    }
  }
  
  const actualFillerCount = Object.values(uniqueFillerWords).reduce((a, b) => a + b, 0);
  
  return {
    totalDuration,
    wordsPerMinute: totalDuration > 0 ? Math.round((totalWords / totalDuration) * 60) : 0,
    fillerWordCount: actualFillerCount,
    fillerWords: uniqueFillerWords,
    averageAnswerDuration: durations.length > 0 ? totalDuration / durations.length : 0,
    longestAnswer: durations.length > 0 ? Math.max(...durations) : 0,
    shortestAnswer: durations.length > 0 ? Math.min(...durations) : 0,
  };
}

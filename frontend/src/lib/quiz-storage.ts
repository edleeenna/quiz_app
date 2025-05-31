import { QuizQuestion } from "@/types";

export interface SavedQuiz {
  id: string;
  name: string;
  questions: QuizQuestion[];
  createdAt: string;
  lastAttempt?: string;
  attempts: number;
  bestScore?: number;
}

export function saveQuiz(name: string, questions: QuizQuestion[]): SavedQuiz {
  const quiz: SavedQuiz = {
    id: crypto.randomUUID(),
    name,
    questions,
    createdAt: new Date().toISOString(),
    attempts: 0
  };

  const savedQuizzes = getSavedQuizzes();
  savedQuizzes.push(quiz);
  sessionStorage.setItem('quizzes', JSON.stringify(savedQuizzes));

  return quiz;
}

export function getSavedQuizzes(): SavedQuiz[] {
  const quizzes = sessionStorage.getItem('quizzes');
  return quizzes ? JSON.parse(quizzes) : [];
}

export function getQuizById(id: string): SavedQuiz | undefined {
  return getSavedQuizzes().find(quiz => quiz.id === id);
}

export function updateQuizAttempt(id: string, score: number): void {
  const quizzes = getSavedQuizzes();
  const quizIndex = quizzes.findIndex(q => q.id === id);
  
  if (quizIndex !== -1) {
    const quiz = quizzes[quizIndex];
    quiz.attempts += 1;
    quiz.lastAttempt = new Date().toISOString();
    quiz.bestScore = Math.max(score, quiz.bestScore || 0);
    
    sessionStorage.setItem('quizzes', JSON.stringify(quizzes));
  }
}

export function deleteQuiz(id: string): void {
  const quizzes = getSavedQuizzes().filter(quiz => quiz.id !== id);
  sessionStorage.setItem('quizzes', JSON.stringify(quizzes));
}
export type UserRole = 'admin' | 'teacher' | 'student';

export type QuestionType = 'single-correct' | 'multi-correct' | 'numerical' | 'subjective';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Question {
  id: string;
  type: QuestionType;
  questionText: string;
  questionImage?: string;
  options?: string[];
  correctAnswer?: string | string[] | number;
  marks: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  courseId: string;
  duration: number; // in minutes
  instructions: string;
  questions: Question[];
  createdBy: string;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  createdBy: string;
  createdAt: string;
  quizzes: string[]; // quiz IDs
  enrolledStudents: string[]; // student IDs
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  answers: Record<string, any>;
  visitedQuestions: string[];
  attemptedQuestions: string[];
  markedForReview: string[];
  startedAt: string;
  submittedAt?: string;
  score?: number;
}

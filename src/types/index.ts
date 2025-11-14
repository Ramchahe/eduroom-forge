export type UserRole = 'admin' | 'teacher' | 'student';

export type QuestionType = 'single-correct' | 'multi-correct' | 'numerical' | 'subjective';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type Language = 'english' | 'hindi';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePhoto?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  address?: string;
  enrollmentNumber?: string; // for students
  department?: string; // for teachers
}

export interface QuestionContent {
  questionText: string;
  options?: string[];
  questionImage?: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  content: Record<Language, QuestionContent>;
  correctAnswer?: string | string[] | number;
  marks: number;
  penaltyMarks: number;
  topic?: string;
  subject?: string;
  tags: string[];
  difficultyLevel: DifficultyLevel;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  courseId: string;
  duration: number; // in minutes
  instructions: string;
  supportedLanguages: Language[];
  questions: Question[];
  createdBy: string;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  planType: 'free' | 'paid';
  price?: number;
  discountedPrice?: number;
  category?: string;
  level?: string;
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
  selectedLanguage: Language;
}

export interface QuestionBankItem extends Question {
  bankId: string;
  createdBy: string;
  createdAt: string;
}

export interface SalaryRecord {
  id: string;
  userId: string; // teacher/admin user id
  month: string; // YYYY-MM format
  basePay: number;
  bonus?: number;
  deductions?: number;
  netPay: number; // computed: base + bonus - deductions
  status: 'pending' | 'paid';
  notes?: string;
  createdAt: string;
  paidAt?: string;
}

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

export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  createdBy: string;
  createdAt: string;
  dueDate: string;
  maxMarks: number;
  attachments?: FileAttachment[];
  allowLateSubmission: boolean;
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  data: string; // base64 encoded
  size: number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: string;
  isLate: boolean;
  content: string;
  attachments?: FileAttachment[];
  grade?: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: string;
}

export interface CourseMaterial {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  type: 'pdf' | 'document' | 'video' | 'link';
  file?: FileAttachment;
  url?: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: 'holiday' | 'exam' | 'event' | 'deadline' | 'semester';
  startDate: string;
  endDate?: string;
  category: string;
  color: string;
  createdBy: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  priority: 'normal' | 'urgent';
  visibility: 'all' | 'student' | 'teacher' | 'admin';
  targetClass?: string;
  attachments?: FileAttachment[];
  readBy: string[]; // user IDs who have read
}

export interface FeeStructure {
  id: string;
  name: string;
  components: FeeComponent[];
  academicYear: string;
  createdBy: string;
  createdAt: string;
}

export interface FeeComponent {
  id: string;
  name: string;
  amount: number;
  type: 'tuition' | 'transport' | 'activities' | 'library' | 'other';
}

export interface FeeRecord {
  id: string;
  studentId: string;
  structureId: string;
  totalAmount: number;
  paidAmount: number;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  dueDate: string;
  payments: Payment[];
  createdAt: string;
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  method: 'cash' | 'online' | 'cheque' | 'card';
  transactionId?: string;
  receiptNumber: string;
}

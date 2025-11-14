import { User, Course, Quiz, QuizAttempt } from '@/types';
import { toast } from 'sonner';

const STORAGE_KEYS = {
  USER: 'current_user',
  USERS: 'all_users',
  COURSES: 'courses',
  QUIZZES: 'quizzes',
  ATTEMPTS: 'quiz_attempts',
  SALARIES: 'salaries',
};

// Safe localStorage wrapper with error handling
const safeSetItem = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      toast.error('Storage limit reached. Please clear some data.');
    } else {
      toast.error('Failed to save data. Please try again.');
    }
    console.error('LocalStorage error:', error);
    return false;
  }
};

const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error('LocalStorage read error:', error);
    return null;
  }
};

export const storage = {
  // User operations
  getCurrentUser: (): User | null => {
    const data = safeGetItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      safeSetItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  getAllUsers: (): User[] => {
    const data = safeGetItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  addUser: (user: User) => {
    const users = storage.getAllUsers();
    users.push(user);
    safeSetItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  updateUser: (id: string, updates: Partial<User>) => {
    const users = storage.getAllUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      safeSetItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      const currentUser = storage.getCurrentUser();
      if (currentUser && currentUser.id === id) {
        storage.setCurrentUser(users[index]);
      }
    }
  },

  deleteUser: (id: string) => {
    const users = storage.getAllUsers().filter(u => u.id !== id);
    safeSetItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getUserByEmail: (email: string): User | undefined => {
    return storage.getAllUsers().find(u => u.email === email);
  },

  // Course operations
  getCourses: (): Course[] => {
    const data = safeGetItem(STORAGE_KEYS.COURSES);
    return data ? JSON.parse(data) : [];
  },

  getCourseById: (id: string): Course | undefined => {
    return storage.getCourses().find(c => c.id === id);
  },

  addCourse: (course: Course) => {
    const courses = storage.getCourses();
    courses.push(course);
    safeSetItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  },

  updateCourse: (id: string, updates: Partial<Course>) => {
    const courses = storage.getCourses();
    const index = courses.findIndex(c => c.id === id);
    if (index !== -1) {
      courses[index] = { ...courses[index], ...updates };
      safeSetItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    }
  },

  deleteCourse: (id: string) => {
    const courses = storage.getCourses().filter(c => c.id !== id);
    safeSetItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  },

  // Quiz operations
  getQuizzes: (): Quiz[] => {
    const data = safeGetItem(STORAGE_KEYS.QUIZZES);
    return data ? JSON.parse(data) : [];
  },

  getQuizById: (id: string): Quiz | undefined => {
    return storage.getQuizzes().find(q => q.id === id);
  },

  addQuiz: (quiz: Quiz) => {
    const quizzes = storage.getQuizzes();
    quizzes.push(quiz);
    safeSetItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
  },

  updateQuiz: (id: string, updates: Partial<Quiz>) => {
    const quizzes = storage.getQuizzes();
    const index = quizzes.findIndex(q => q.id === id);
    if (index !== -1) {
      quizzes[index] = { ...quizzes[index], ...updates };
      safeSetItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
    }
  },

  deleteQuiz: (id: string) => {
    const quizzes = storage.getQuizzes().filter(q => q.id !== id);
    safeSetItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
  },

  // Quiz attempt operations
  getAttempts: (): QuizAttempt[] => {
    const data = safeGetItem(STORAGE_KEYS.ATTEMPTS);
    return data ? JSON.parse(data) : [];
  },

  getAttemptById: (id: string): QuizAttempt | undefined => {
    return storage.getAttempts().find(a => a.id === id);
  },

  addAttempt: (attempt: QuizAttempt) => {
    const attempts = storage.getAttempts();
    attempts.push(attempt);
    safeSetItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
  },

  updateAttempt: (id: string, updates: Partial<QuizAttempt>) => {
    const attempts = storage.getAttempts();
    const index = attempts.findIndex(a => a.id === id);
    if (index !== -1) {
      attempts[index] = { ...attempts[index], ...updates };
      safeSetItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
    }
  },

  // Salary operations
  getSalaries: (): any[] => {
    const data = safeGetItem(STORAGE_KEYS.SALARIES);
    return data ? JSON.parse(data) : [];
  },

  addSalary: (record: any) => {
    const salaries = storage.getSalaries();
    salaries.push(record);
    safeSetItem(STORAGE_KEYS.SALARIES, JSON.stringify(salaries));
  },

  updateSalary: (id: string, updates: Partial<any>) => {
    const salaries = storage.getSalaries();
    const index = salaries.findIndex((s: any) => s.id === id);
    if (index !== -1) {
      salaries[index] = { ...salaries[index], ...updates };
      safeSetItem(STORAGE_KEYS.SALARIES, JSON.stringify(salaries));
    }
  },

  deleteSalary: (id: string) => {
    const salaries = storage.getSalaries().filter((s: any) => s.id !== id);
    safeSetItem(STORAGE_KEYS.SALARIES, JSON.stringify(salaries));
  },

  getSalariesByUser: (userId: string): any[] => {
    return storage.getSalaries().filter((s: any) => s.userId === userId);
  },
};

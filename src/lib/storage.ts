import { User, Course, Quiz, QuizAttempt } from '@/types';

const STORAGE_KEYS = {
  USER: 'current_user',
  USERS: 'all_users',
  COURSES: 'courses',
  QUIZZES: 'quizzes',
  ATTEMPTS: 'quiz_attempts',
};

export const storage = {
  // User operations
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  getAllUsers: (): User[] => {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  addUser: (user: User) => {
    const users = storage.getAllUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  updateUser: (id: string, updates: Partial<User>) => {
    const users = storage.getAllUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      const currentUser = storage.getCurrentUser();
      if (currentUser && currentUser.id === id) {
        storage.setCurrentUser(users[index]);
      }
    }
  },

  // Course operations
  getCourses: (): Course[] => {
    const data = localStorage.getItem(STORAGE_KEYS.COURSES);
    return data ? JSON.parse(data) : [];
  },

  getCourseById: (id: string): Course | undefined => {
    return storage.getCourses().find(c => c.id === id);
  },

  addCourse: (course: Course) => {
    const courses = storage.getCourses();
    courses.push(course);
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  },

  updateCourse: (id: string, updates: Partial<Course>) => {
    const courses = storage.getCourses();
    const index = courses.findIndex(c => c.id === id);
    if (index !== -1) {
      courses[index] = { ...courses[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    }
  },

  deleteCourse: (id: string) => {
    const courses = storage.getCourses().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  },

  // Quiz operations
  getQuizzes: (): Quiz[] => {
    const data = localStorage.getItem(STORAGE_KEYS.QUIZZES);
    return data ? JSON.parse(data) : [];
  },

  getQuizById: (id: string): Quiz | undefined => {
    return storage.getQuizzes().find(q => q.id === id);
  },

  addQuiz: (quiz: Quiz) => {
    const quizzes = storage.getQuizzes();
    quizzes.push(quiz);
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
  },

  updateQuiz: (id: string, updates: Partial<Quiz>) => {
    const quizzes = storage.getQuizzes();
    const index = quizzes.findIndex(q => q.id === id);
    if (index !== -1) {
      quizzes[index] = { ...quizzes[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
    }
  },

  deleteQuiz: (id: string) => {
    const quizzes = storage.getQuizzes().filter(q => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
  },

  // Quiz attempt operations
  getAttempts: (): QuizAttempt[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
    return data ? JSON.parse(data) : [];
  },

  getAttemptById: (id: string): QuizAttempt | undefined => {
    return storage.getAttempts().find(a => a.id === id);
  },

  addAttempt: (attempt: QuizAttempt) => {
    const attempts = storage.getAttempts();
    attempts.push(attempt);
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
  },

  updateAttempt: (id: string, updates: Partial<QuizAttempt>) => {
    const attempts = storage.getAttempts();
    const index = attempts.findIndex(a => a.id === id);
    if (index !== -1) {
      attempts[index] = { ...attempts[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
    }
  },
};

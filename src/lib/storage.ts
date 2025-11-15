import { User, Course, Quiz, QuizAttempt } from '@/types';
import { toast } from 'sonner';

const STORAGE_KEYS = {
  USER: 'current_user',
  USERS: 'all_users',
  COURSES: 'courses',
  QUIZZES: 'quizzes',
  ATTEMPTS: 'quiz_attempts',
  SALARIES: 'salaries',
  ASSIGNMENTS: 'assignments',
  SUBMISSIONS: 'submissions',
  MATERIALS: 'course_materials',
  CALENDAR: 'calendar_events',
  ANNOUNCEMENTS: 'announcements',
  FEE_STRUCTURES: 'fee_structures',
  FEE_RECORDS: 'fee_records',
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

  // Assignment operations
  getAssignments: (): any[] => {
    const data = safeGetItem(STORAGE_KEYS.ASSIGNMENTS);
    return data ? JSON.parse(data) : [];
  },

  addAssignment: (assignment: any) => {
    const assignments = storage.getAssignments();
    assignments.push(assignment);
    safeSetItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  },

  updateAssignment: (id: string, updates: Partial<any>) => {
    const assignments = storage.getAssignments();
    const index = assignments.findIndex((a: any) => a.id === id);
    if (index !== -1) {
      assignments[index] = { ...assignments[index], ...updates };
      safeSetItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
    }
  },

  deleteAssignment: (id: string) => {
    const assignments = storage.getAssignments().filter((a: any) => a.id !== id);
    safeSetItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  },

  // Submission operations
  getSubmissions: (): any[] => {
    const data = safeGetItem(STORAGE_KEYS.SUBMISSIONS);
    return data ? JSON.parse(data) : [];
  },

  addSubmission: (submission: any) => {
    const submissions = storage.getSubmissions();
    submissions.push(submission);
    safeSetItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  },

  updateSubmission: (id: string, updates: Partial<any>) => {
    const submissions = storage.getSubmissions();
    const index = submissions.findIndex((s: any) => s.id === id);
    if (index !== -1) {
      submissions[index] = { ...submissions[index], ...updates };
      safeSetItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
    }
  },

  // Course materials operations
  getMaterials: (): any[] => {
    const data = safeGetItem(STORAGE_KEYS.MATERIALS);
    return data ? JSON.parse(data) : [];
  },

  addMaterial: (material: any) => {
    const materials = storage.getMaterials();
    materials.push(material);
    safeSetItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials));
  },

  deleteMaterial: (id: string) => {
    const materials = storage.getMaterials().filter((m: any) => m.id !== id);
    safeSetItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials));
  },

  // Calendar operations
  getCalendarEvents: (): any[] => {
    const data = safeGetItem(STORAGE_KEYS.CALENDAR);
    return data ? JSON.parse(data) : [];
  },

  addCalendarEvent: (event: any) => {
    const events = storage.getCalendarEvents();
    events.push(event);
    safeSetItem(STORAGE_KEYS.CALENDAR, JSON.stringify(events));
  },

  updateCalendarEvent: (id: string, updates: Partial<any>) => {
    const events = storage.getCalendarEvents();
    const index = events.findIndex((e: any) => e.id === id);
    if (index !== -1) {
      events[index] = { ...events[index], ...updates };
      safeSetItem(STORAGE_KEYS.CALENDAR, JSON.stringify(events));
    }
  },

  deleteCalendarEvent: (id: string) => {
    const events = storage.getCalendarEvents().filter((e: any) => e.id !== id);
    safeSetItem(STORAGE_KEYS.CALENDAR, JSON.stringify(events));
  },

  // Announcement operations
  getAnnouncements: (): any[] => {
    const data = safeGetItem(STORAGE_KEYS.ANNOUNCEMENTS);
    return data ? JSON.parse(data) : [];
  },

  addAnnouncement: (announcement: any) => {
    const announcements = storage.getAnnouncements();
    announcements.push(announcement);
    safeSetItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  },

  updateAnnouncement: (id: string, updates: Partial<any>) => {
    const announcements = storage.getAnnouncements();
    const index = announcements.findIndex((a: any) => a.id === id);
    if (index !== -1) {
      announcements[index] = { ...announcements[index], ...updates };
      safeSetItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
    }
  },

  deleteAnnouncement: (id: string) => {
    const announcements = storage.getAnnouncements().filter((a: any) => a.id !== id);
    safeSetItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  },

  // Fee structure operations
  getFeeStructures: (): any[] => {
    const data = safeGetItem(STORAGE_KEYS.FEE_STRUCTURES);
    return data ? JSON.parse(data) : [];
  },

  addFeeStructure: (structure: any) => {
    const structures = storage.getFeeStructures();
    structures.push(structure);
    safeSetItem(STORAGE_KEYS.FEE_STRUCTURES, JSON.stringify(structures));
  },

  updateFeeStructure: (id: string, updates: Partial<any>) => {
    const structures = storage.getFeeStructures();
    const index = structures.findIndex((s: any) => s.id === id);
    if (index !== -1) {
      structures[index] = { ...structures[index], ...updates };
      safeSetItem(STORAGE_KEYS.FEE_STRUCTURES, JSON.stringify(structures));
    }
  },

  deleteFeeStructure: (id: string) => {
    const structures = storage.getFeeStructures().filter((s: any) => s.id !== id);
    safeSetItem(STORAGE_KEYS.FEE_STRUCTURES, JSON.stringify(structures));
  },

  // Fee record operations
  getFeeRecords: (): any[] => {
    const data = safeGetItem(STORAGE_KEYS.FEE_RECORDS);
    return data ? JSON.parse(data) : [];
  },

  addFeeRecord: (record: any) => {
    const records = storage.getFeeRecords();
    records.push(record);
    safeSetItem(STORAGE_KEYS.FEE_RECORDS, JSON.stringify(records));
  },

  updateFeeRecord: (id: string, updates: Partial<any>) => {
    const records = storage.getFeeRecords();
    const index = records.findIndex((r: any) => r.id === id);
    if (index !== -1) {
      records[index] = { ...records[index], ...updates };
      safeSetItem(STORAGE_KEYS.FEE_RECORDS, JSON.stringify(records));
    }
  },

  deleteFeeRecord: (id: string) => {
    const records = storage.getFeeRecords().filter((r: any) => r.id !== id);
    safeSetItem(STORAGE_KEYS.FEE_RECORDS, JSON.stringify(records));
  },
};

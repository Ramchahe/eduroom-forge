import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateCourse from "./pages/CreateCourse";
import CourseDetail from "./pages/CourseDetail";
import CreateQuiz from "./pages/CreateQuiz";
import EditQuiz from "./pages/EditQuiz";
import QuizReport from "./pages/QuizReport";
import StudentResults from "./pages/StudentResults";
import Profile from "./pages/Profile";
import Security from "./pages/Security";
import QuizPreview from "./pages/QuizPreview";
import StudentDashboard from "./pages/StudentDashboard";
import StudentCourseView from "./pages/StudentCourseView";
import QuestionBank from "./pages/QuestionBank";
import Analytics from "./pages/Analytics";
import MyResults from "./pages/MyResults";
import ManageUsers from "./pages/ManageUsers";
import NotFound from "./pages/NotFound";
import SalaryManagement from "./pages/SalaryManagement";
import Assignments from "./pages/Assignments";
import StudentAssignments from "./pages/StudentAssignments";
import Calendar from "./pages/Calendar";
import Announcements from "./pages/Announcements";
import FeeManagement from "./pages/FeeManagement";
import StudentFees from "./pages/StudentFees";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import ManageClasses from "./pages/ManageClasses";
import Timetable from "./pages/Timetable";
import ViewTimetable from "./pages/ViewTimetable";
import PerformanceAnalytics from "./pages/PerformanceAnalytics";
import Certificates from "./pages/Certificates";
import LiveStreams from "./pages/LiveStreams";
import Communities from "./pages/Communities";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/create-course" element={<CreateCourse />} />
          <Route path="/courses" element={<Dashboard />} />
          <Route path="/course/:courseId" element={<CourseDetail />} />
          <Route path="/create-quiz/:courseId" element={<CreateQuiz />} />
          <Route path="/edit-quiz/:quizId" element={<EditQuiz />} />
          <Route path="/quiz-preview/:quizId" element={<QuizPreview />} />
          <Route path="/quiz-report/:quizId" element={<QuizReport />} />
          <Route path="/student-results/:quizId" element={<StudentResults />} />
          <Route path="/student-course-view/:courseId" element={<StudentCourseView />} />
          <Route path="/question-bank" element={<QuestionBank />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/my-results" element={<MyResults />} />
          <Route path="/manage-users" element={<ManageUsers />} />
          <Route path="/admin/salaries" element={<SalaryManagement />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/student-assignments" element={<StudentAssignments />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/fee-management" element={<FeeManagement />} />
          <Route path="/my-fees" element={<StudentFees />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/manage-classes" element={<ManageClasses />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/view-timetable" element={<ViewTimetable />} />
          <Route path="/performance-analytics" element={<PerformanceAnalytics />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/live-streams" element={<LiveStreams />} />
          <Route path="/communities" element={<Communities />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/security" element={<Security />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

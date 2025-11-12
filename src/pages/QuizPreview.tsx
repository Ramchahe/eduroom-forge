import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { storage } from "@/lib/storage";
import { Quiz, QuizAttempt } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, CheckCircle2, Circle, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type QuizStage = 'instructions' | 'quiz' | 'submitted';

const QuizPreview = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [stage, setStage] = useState<QuizStage>('instructions');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [visitedQuestions, setVisitedQuestions] = useState<Set<string>>(new Set());
  const [attemptedQuestions, setAttemptedQuestions] = useState<Set<string>>(new Set());
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<'english' | 'hindi'>('english');

  useEffect(() => {
    if (!quizId) return;
    const foundQuiz = storage.getQuizById(quizId);
    if (!foundQuiz) {
      toast.error("Quiz not found");
      window.close();
      return;
    }
    setQuiz(foundQuiz);
    setTimeRemaining(foundQuiz.duration * 60);
  }, [quizId]);

  useEffect(() => {
    if (stage !== 'quiz' || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, timeRemaining]);

  useEffect(() => {
    if (quiz && stage === 'quiz') {
      const questionId = quiz.questions[currentQuestionIndex].id;
      setVisitedQuestions(prev => new Set(prev).add(questionId));
    }
  }, [currentQuestionIndex, quiz, stage]);

  const handleStartQuiz = () => {
    setStage('quiz');
  };

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    setAttemptedQuestions(prev => new Set(prev).add(questionId));
  };

  const handleMarkForReview = (questionId: string) => {
    setMarkedForReview(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleSubmit = () => {
    const user = storage.getCurrentUser();
    if (!user || !quiz) return;

    // Calculate score
    let totalScore = 0;
    quiz.questions.forEach((question) => {
      const userAnswer = answers[question.id];
      const correctAnswer = question.correctAnswer;
      
      if (question.type === 'single-correct') {
        if (userAnswer === correctAnswer) {
          totalScore += question.marks;
        } else if (userAnswer) {
          totalScore -= question.penaltyMarks;
        }
      } else if (question.type === 'multi-correct') {
        const correctAnswers = Array.isArray(correctAnswer) ? correctAnswer : [];
        const userAnswers = Array.isArray(userAnswer) ? userAnswer : [];
        
        if (JSON.stringify(userAnswers.sort()) === JSON.stringify(correctAnswers.sort())) {
          totalScore += question.marks;
        } else if (userAnswers.length > 0) {
          totalScore -= question.penaltyMarks;
        }
      } else if (question.type === 'numerical') {
        if (parseFloat(userAnswer) === correctAnswer) {
          totalScore += question.marks;
        } else if (userAnswer) {
          totalScore -= question.penaltyMarks;
        }
      }
      // Subjective questions need manual grading, so we don't auto-score them
    });

    const attempt: QuizAttempt = {
      id: Date.now().toString(),
      quizId: quiz.id,
      studentId: user.id,
      answers,
      visitedQuestions: Array.from(visitedQuestions),
      attemptedQuestions: Array.from(attemptedQuestions),
      markedForReview: Array.from(markedForReview),
      startedAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      score: Math.max(0, totalScore),
      selectedLanguage,
    };

    storage.addAttempt(attempt);
    setStage('submitted');
    toast.success(`Quiz submitted! Your score: ${Math.max(0, totalScore)}/${quiz.questions.reduce((acc, q) => acc + q.marks, 0)}`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionStatus = (questionId: string) => {
    if (attemptedQuestions.has(questionId)) {
      return markedForReview.has(questionId) ? 'review' : 'attempted';
    }
    if (visitedQuestions.has(questionId)) {
      return 'visited';
    }
    return 'not-visited';
  };

  if (!quiz) return null;

  if (stage === 'instructions') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle className="text-2xl">{quiz.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Instructions:</h3>
              <div
                className="prose prose-sm max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: quiz.instructions }}
              />
            </div>
            {quiz.supportedLanguages.length > 1 && (
              <div className="space-y-2">
                <Label>Select Language</Label>
                <Select value={selectedLanguage} onValueChange={(value: 'english' | 'hindi') => setSelectedLanguage(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {quiz.supportedLanguages.map((lang) => (
                      <SelectItem key={lang} value={lang} className="capitalize">
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-3 gap-4 py-4 border-y">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{quiz.questions.length}</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{quiz.duration}</div>
                <div className="text-sm text-muted-foreground">Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {quiz.questions.reduce((acc, q) => acc + q.marks, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Marks</div>
              </div>
            </div>
            <Button onClick={handleStartQuiz} size="lg" className="w-full">
              I'm Ready, Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (stage === 'submitted') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold">Quiz Submitted!</h2>
            <p className="text-muted-foreground">
              Your answers have been recorded successfully.
            </p>
            <Button onClick={() => window.close()} className="w-full">
              Close Window
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const currentQuestionContent = currentQuestion.content[selectedLanguage] || currentQuestion.content.english;
  const currentQuestionStatus = getQuestionStatus(currentQuestion.id);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold">{quiz.title}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span className={cn(
                "font-mono font-semibold",
                timeRemaining < 300 && "text-destructive"
              )}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            <Button onClick={handleSubmit} variant="default">
              Submit Quiz
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          {/* Question Area */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Question {currentQuestionIndex + 1} of {quiz.questions.length}
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {currentQuestion.marks} {currentQuestion.marks === 1 ? 'mark' : 'marks'}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentQuestionContent.questionText }}
                />

                {currentQuestion.type === 'single-correct' && (
                  <RadioGroup
                    value={answers[currentQuestion.id] || ''}
                    onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
                  >
                    {currentQuestionContent.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-secondary/50">
                        <RadioGroupItem value={option} id={`${currentQuestion.id}-${index}`} />
                        <Label htmlFor={`${currentQuestion.id}-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {currentQuestion.type === 'multi-correct' && (
                  <div className="space-y-2">
                    {currentQuestionContent.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-secondary/50">
                        <Checkbox
                          id={`${currentQuestion.id}-${index}`}
                          checked={(answers[currentQuestion.id] || []).includes(option)}
                          onCheckedChange={(checked) => {
                            const current = answers[currentQuestion.id] || [];
                            const updated = checked
                              ? [...current, option]
                              : current.filter((o: string) => o !== option);
                            handleAnswer(currentQuestion.id, updated);
                          }}
                        />
                        <Label htmlFor={`${currentQuestion.id}-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}

                {currentQuestion.type === 'numerical' && (
                  <Input
                    type="number"
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                    placeholder="Enter your answer"
                  />
                )}

                {currentQuestion.type === 'subjective' && (
                  <Textarea
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                    placeholder="Type your answer here..."
                    rows={6}
                  />
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => handleMarkForReview(currentQuestion.id)}
                    className={cn(
                      markedForReview.has(currentQuestion.id) && "border-warning text-warning"
                    )}
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    {markedForReview.has(currentQuestion.id) ? 'Marked for Review' : 'Mark for Review'}
                  </Button>
                  {currentQuestionIndex < quiz.questions.length - 1 && (
                    <Button onClick={() => setCurrentQuestionIndex(prev => prev + 1)}>
                      Next Question
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Palette */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Question Palette</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-5 gap-2">
                  {quiz.questions.map((q, index) => {
                    const status = getQuestionStatus(q.id);
                    return (
                      <Button
                        key={q.id}
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentQuestionIndex(index)}
                        className={cn(
                          "h-10 w-10 p-0",
                          currentQuestionIndex === index && "ring-2 ring-primary",
                          status === 'attempted' && "bg-success/20 hover:bg-success/30 border-success",
                          status === 'review' && "bg-warning/20 hover:bg-warning/30 border-warning",
                          status === 'visited' && "bg-muted"
                        )}
                      >
                        {index + 1}
                      </Button>
                    );
                  })}
                </div>

                <div className="space-y-2 text-xs border-t pt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border-2 border-success bg-success/20" />
                    <span>Attempted ({attemptedQuestions.size - markedForReview.size})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border-2 border-warning bg-warning/20" />
                    <span>Marked for Review ({markedForReview.size})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border-2 bg-muted" />
                    <span>Visited ({visitedQuestions.size - attemptedQuestions.size})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border-2" />
                    <span>Not Visited ({quiz.questions.length - visitedQuestions.size})</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPreview;

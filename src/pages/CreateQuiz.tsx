import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { storage } from "@/lib/storage";
import { Question, QuestionType } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, PlusCircle, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import RichTextEditor from "@/components/RichTextEditor";
import { Separator } from "@/components/ui/separator";

const CreateQuiz = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("60");
  const [instructions, setInstructions] = useState("1. Read all questions carefully\n2. Manage your time wisely\n3. Check your answers before submitting");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    type: 'single-correct',
    questionText: '',
    options: ['', '', '', ''],
    marks: 1,
  });

  const addQuestion = () => {
    if (!currentQuestion.questionText) {
      toast.error("Please enter a question");
      return;
    }

    const newQuestion: Question = {
      id: Date.now().toString(),
      type: currentQuestion.type as QuestionType,
      questionText: currentQuestion.questionText,
      questionImage: currentQuestion.questionImage,
      options: currentQuestion.options,
      correctAnswer: currentQuestion.correctAnswer,
      marks: currentQuestion.marks || 1,
    };

    setQuestions([...questions, newQuestion]);
    setCurrentQuestion({
      type: 'single-correct',
      questionText: '',
      options: ['', '', '', ''],
      marks: 1,
    });
    toast.success("Question added");
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
    toast.success("Question removed");
  };

  const handleSubmit = () => {
    if (!title || !description || questions.length === 0) {
      toast.error("Please fill all required fields and add at least one question");
      return;
    }

    const user = storage.getCurrentUser();
    if (!user || !courseId) return;

    const quiz = {
      id: Date.now().toString(),
      title,
      description,
      courseId,
      duration: parseInt(duration),
      instructions,
      questions,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
    };

    storage.addQuiz(quiz);
    
    const course = storage.getCourseById(courseId);
    if (course) {
      storage.updateCourse(courseId, {
        quizzes: [...course.quizzes, quiz.id],
      });
    }

    toast.success("Quiz created successfully!");
    navigate(`/course/${courseId}`);
  };

  const renderQuestionInputs = () => {
    switch (currentQuestion.type) {
      case 'single-correct':
      case 'multi-correct':
        return (
          <div className="space-y-3">
            <Label>Options</Label>
            {currentQuestion.options?.map((option, index) => (
              <Input
                key={index}
                value={option}
                onChange={(e) => {
                  const newOptions = [...(currentQuestion.options || [])];
                  newOptions[index] = e.target.value;
                  setCurrentQuestion({ ...currentQuestion, options: newOptions });
                }}
                placeholder={`Option ${index + 1}`}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentQuestion({
                  ...currentQuestion,
                  options: [...(currentQuestion.options || []), ''],
                });
              }}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Option
            </Button>
            <div className="space-y-2">
              <Label>Correct Answer</Label>
              <Input
                value={currentQuestion.correctAnswer as string || ''}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                placeholder="Enter correct option number(s), e.g., '1' or '1,3'"
              />
            </div>
          </div>
        );
      
      case 'numerical':
        return (
          <div className="space-y-2">
            <Label>Correct Answer (Number)</Label>
            <Input
              type="number"
              value={currentQuestion.correctAnswer as number || ''}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: parseFloat(e.target.value) })}
              placeholder="Enter correct numerical answer"
            />
          </div>
        );
      
      case 'subjective':
        return (
          <div className="space-y-2">
            <Label>Model Answer (Optional)</Label>
            <Textarea
              value={currentQuestion.correctAnswer as string || ''}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
              placeholder="Enter model answer for reference"
              rows={4}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(`/course/${courseId}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Quiz Details */}
          <Card>
            <CardHeader>
              <CardTitle>Quiz Details</CardTitle>
              <CardDescription>Basic information about the quiz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Quiz Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter quiz title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this quiz covers"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Add Question */}
          <Card>
            <CardHeader>
              <CardTitle>Add Question</CardTitle>
              <CardDescription>Create a new question for this quiz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Question Type</Label>
                <Select
                  value={currentQuestion.type}
                  onValueChange={(value: QuestionType) =>
                    setCurrentQuestion({ ...currentQuestion, type: value, options: value.includes('correct') ? ['', '', '', ''] : undefined })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single-correct">Single Correct</SelectItem>
                    <SelectItem value="multi-correct">Multi Correct</SelectItem>
                    <SelectItem value="numerical">Numerical</SelectItem>
                    <SelectItem value="subjective">Subjective</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Question Text</Label>
                <RichTextEditor
                  value={currentQuestion.questionText || ''}
                  onChange={(value) => setCurrentQuestion({ ...currentQuestion, questionText: value })}
                  onImagePaste={(imageData) => setCurrentQuestion({ ...currentQuestion, questionImage: imageData })}
                  placeholder="Type your question here... You can paste images directly"
                />
              </div>

              {renderQuestionInputs()}

              <div className="space-y-2">
                <Label>Marks</Label>
                <Input
                  type="number"
                  value={currentQuestion.marks}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, marks: parseInt(e.target.value) })}
                  placeholder="1"
                  min="1"
                />
              </div>

              <Button type="button" onClick={addQuestion} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Question to Quiz
              </Button>
            </CardContent>
          </Card>

          {/* Questions List */}
          {questions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Questions ({questions.length})</CardTitle>
                <CardDescription>Review and manage your questions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question.id}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">Q{index + 1}.</span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {question.type}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
                          </span>
                        </div>
                        <div
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: question.questionText }}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    {index < questions.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Save Button */}
          <div className="flex gap-4">
            <Button onClick={handleSubmit} size="lg" className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              Save Quiz
            </Button>
            <Button variant="outline" onClick={() => navigate(`/course/${courseId}`)}>
              Cancel
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateQuiz;

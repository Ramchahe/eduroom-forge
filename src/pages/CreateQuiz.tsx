import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { storage } from "@/lib/storage";
import { Question, QuestionType, DifficultyLevel, Language, QuestionContent } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, PlusCircle, Trash2, Save, ChevronDown, X } from "lucide-react";
import { toast } from "sonner";
import RichTextEditor from "@/components/RichTextEditor";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CreateQuiz = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const [showQuizDetailsDialog, setShowQuizDetailsDialog] = useState(true);
  const [quizDetailsCollapsed, setQuizDetailsCollapsed] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("60");
  const [instructions, setInstructions] = useState("1. Read all questions carefully\n2. Manage your time wisely\n3. Check your answers before submitting");
  const [supportedLanguages, setSupportedLanguages] = useState<Language[]>(['english']);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentType, setCurrentType] = useState<QuestionType>('single-correct');
  const [currentMarks, setCurrentMarks] = useState(1);
  const [currentPenalty, setCurrentPenalty] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState<DifficultyLevel>('medium');
  const [currentSubject, setCurrentSubject] = useState("");
  const [currentTopic, setCurrentTopic] = useState("");
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [currentContent, setCurrentContent] = useState<Record<Language, QuestionContent>>({
    english: { questionText: '', options: ['', '', '', ''] },
    hindi: { questionText: '', options: ['', '', '', ''] },
  });
  const [currentCorrectAnswers, setCurrentCorrectAnswers] = useState<string[]>([]);

  const addLanguageSupport = (lang: Language) => {
    if (!supportedLanguages.includes(lang)) {
      setSupportedLanguages([...supportedLanguages, lang]);
    }
  };

  const updateQuestionContent = (lang: Language, field: keyof QuestionContent, value: any) => {
    setCurrentContent(prev => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value }
    }));
  };

  const updateOption = (lang: Language, index: number, value: string) => {
    setCurrentContent(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        options: (prev[lang].options || []).map((opt, i) => i === index ? value : opt)
      }
    }));
  };

  const toggleCorrectAnswer = (optionIndex: number) => {
    const optionText = currentContent.english.options?.[optionIndex] || '';
    if (currentType === 'single-correct') {
      setCurrentCorrectAnswers([optionText]);
    } else {
      setCurrentCorrectAnswers(prev => 
        prev.includes(optionText) ? prev.filter(a => a !== optionText) : [...prev, optionText]
      );
    }
  };

  const addTag = () => {
    if (currentTag && !currentTags.includes(currentTag)) {
      setCurrentTags([...currentTags, currentTag]);
      setCurrentTag("");
    }
  };

  const addQuestion = () => {
    if (!currentContent.english.questionText) {
      toast.error("Please enter a question");
      return;
    }

    const filteredContent = Object.fromEntries(
      supportedLanguages.map(lang => [lang, currentContent[lang]])
    ) as Record<Language, QuestionContent>;

    const newQuestion: Question = {
      id: Date.now().toString(),
      type: currentType,
      content: filteredContent,
      correctAnswer: currentType === 'numerical' ? parseFloat(currentCorrectAnswers[0] || '0') : 
                     currentType === 'single-correct' ? currentCorrectAnswers[0] : currentCorrectAnswers,
      marks: currentMarks,
      penaltyMarks: currentPenalty,
      topic: currentTopic,
      subject: currentSubject,
      tags: currentTags,
      difficultyLevel: currentDifficulty,
    };

    setQuestions([...questions, newQuestion]);
    setCurrentContent({
      english: { questionText: '', options: ['', '', '', ''] },
      hindi: { questionText: '', options: ['', '', '', ''] },
    });
    setCurrentCorrectAnswers([]);
    setCurrentTags([]);
    toast.success("Question added");
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
      supportedLanguages,
      questions,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
    };

    storage.addQuiz(quiz);
    const course = storage.getCourseById(courseId);
    if (course) {
      storage.updateCourse(courseId, { quizzes: [...course.quizzes, quiz.id] });
    }

    toast.success("Quiz created successfully!");
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Dialog open={showQuizDetailsDialog} onOpenChange={setShowQuizDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Quiz Details</DialogTitle>
            <DialogDescription>Configure your quiz settings</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Quiz Title" />
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
            <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duration" />
            <div className="flex gap-2">
              <Badge>English</Badge>
              {!supportedLanguages.includes('hindi') && (
                <Button variant="outline" size="sm" onClick={() => addLanguageSupport('hindi')}>+ Hindi</Button>
              )}
            </div>
            <Button onClick={() => { setShowQuizDetailsDialog(false); setQuizDetailsCollapsed(true); }}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(`/course/${courseId}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />Back
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add Question</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={currentType} onValueChange={(v: QuestionType) => setCurrentType(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="single-correct">Single Correct</SelectItem>
                <SelectItem value="multi-correct">Multi Correct</SelectItem>
                <SelectItem value="numerical">Numerical</SelectItem>
                <SelectItem value="subjective">Subjective</SelectItem>
              </SelectContent>
            </Select>

            {supportedLanguages.map(lang => (
              <div key={lang} className="space-y-3 p-4 border rounded">
                <Label className="capitalize">{lang}</Label>
                <RichTextEditor
                  value={currentContent[lang].questionText}
                  onChange={(v) => updateQuestionContent(lang, 'questionText', v)}
                />
                {(currentType === 'single-correct' || currentType === 'multi-correct') && (
                  <div className="space-y-2">
                    {currentContent[lang].options?.map((opt, i) => (
                      <div key={i} className="flex gap-2">
                        <Checkbox checked={currentCorrectAnswers.includes(currentContent.english.options?.[i] || '')} onCheckedChange={() => toggleCorrectAnswer(i)} />
                        <Input value={opt} onChange={(e) => updateOption(lang, i, e.target.value)} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="grid grid-cols-2 gap-4">
              <Input type="number" value={currentMarks} onChange={(e) => setCurrentMarks(parseInt(e.target.value))} placeholder="Marks" />
              <Input type="number" value={currentPenalty} onChange={(e) => setCurrentPenalty(parseFloat(e.target.value))} placeholder="Penalty" />
            </div>

            <Button onClick={addQuestion} className="w-full"><PlusCircle className="mr-2 h-4 w-4" />Add Question</Button>
          </CardContent>
        </Card>

        {questions.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Questions ({questions.length})</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {questions.map((q, i) => (
                <div key={q.id} className="flex justify-between">
                  <div dangerouslySetInnerHTML={{ __html: q.content.english.questionText }} />
                  <Button variant="ghost" size="sm" onClick={() => setQuestions(questions.filter(qu => qu.id !== q.id))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Button onClick={handleSubmit} size="lg" className="w-full"><Save className="mr-2 h-4 w-4" />Save Quiz</Button>
      </main>
    </div>
  );
};

export default CreateQuiz;

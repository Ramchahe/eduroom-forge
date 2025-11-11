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

      <main className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
        {quizDetailsCollapsed && (
          <Collapsible>
            <Card>
              <CollapsibleTrigger className="w-full">
                <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
                  <div>
                    <CardTitle>{title || "Quiz Details"}</CardTitle>
                    <CardDescription>Click to edit quiz settings</CardDescription>
                  </div>
                  <ChevronDown className="h-5 w-5" />
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Quiz Title</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter quiz title" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter quiz description" />
                  </div>
                  <div>
                    <Label>Duration (minutes)</Label>
                    <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="60" />
                  </div>
                  <div>
                    <Label>Instructions</Label>
                    <RichTextEditor value={instructions} onChange={setInstructions} />
                  </div>
                  <div>
                    <Label>Supported Languages</Label>
                    <div className="flex gap-2 mt-2">
                      <Badge>English</Badge>
                      {!supportedLanguages.includes('hindi') && (
                        <Button variant="outline" size="sm" onClick={() => addLanguageSupport('hindi')}>+ Add Hindi</Button>
                      )}
                      {supportedLanguages.includes('hindi') && <Badge>Hindi</Badge>}
                    </div>
                  </div>
                  <Button onClick={() => toast.success("Quiz details saved")}>
                    <Save className="mr-2 h-4 w-4" />Save Details
                  </Button>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Add Question</CardTitle>
            <CardDescription>Fill in all fields carefully to add a question to your quiz</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Question Type *</Label>
                <p className="text-xs text-muted-foreground mb-2">Select the type of question</p>
                <Select value={currentType} onValueChange={(v: QuestionType) => setCurrentType(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single-correct">Single Correct Answer</SelectItem>
                    <SelectItem value="multi-correct">Multiple Correct Answers</SelectItem>
                    <SelectItem value="numerical">Numerical Answer</SelectItem>
                    <SelectItem value="subjective">Subjective Answer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Difficulty Level *</Label>
                <p className="text-xs text-muted-foreground mb-2">Choose difficulty</p>
                <Select value={currentDifficulty} onValueChange={(v: DifficultyLevel) => setCurrentDifficulty(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Topic</Label>
                <p className="text-xs text-muted-foreground mb-2">Main topic of the question</p>
                <Input value={currentTopic} onChange={(e) => setCurrentTopic(e.target.value)} placeholder="e.g., Algebra" />
              </div>
              <div>
                <Label className="text-sm font-medium">Subject</Label>
                <p className="text-xs text-muted-foreground mb-2">Subject category</p>
                <Input value={currentSubject} onChange={(e) => setCurrentSubject(e.target.value)} placeholder="e.g., Mathematics" />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Tags</Label>
              <p className="text-xs text-muted-foreground mb-2">Add keywords for easy searching (press Enter to add)</p>
              <div className="flex gap-2 mb-2">
                <Input 
                  value={currentTag} 
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Type a tag and press Enter"
                />
                <Button type="button" onClick={addTag} variant="outline">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentTags.map((tag, i) => (
                  <Badge key={i} variant="secondary">
                    {tag}
                    <button onClick={() => setCurrentTags(currentTags.filter((_, idx) => idx !== i))} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {supportedLanguages.map((lang, langIndex) => (
              <div key={lang} className="space-y-4 p-6 border rounded-lg bg-muted/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold capitalize">{lang} Version</h3>
                  <Badge variant="outline">{lang}</Badge>
                </div>

                <div>
                  <Label className="text-sm font-medium">Question Text ({lang}) *</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Write your question here. You can paste images directly into this field.
                  </p>
                  <RichTextEditor
                    value={currentContent[lang].questionText}
                    onChange={(v) => updateQuestionContent(lang, 'questionText', v)}
                  />
                </div>

                {(currentType === 'single-correct' || currentType === 'multi-correct') && (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Options ({lang}) *</Label>
                      <p className="text-xs text-muted-foreground mb-3">
                        {currentType === 'single-correct' 
                          ? 'Check ONE box to mark the correct answer. You can paste images in option fields.'
                          : 'Check MULTIPLE boxes to mark correct answers. You can paste images in option fields.'}
                      </p>
                    </div>
                    {currentContent[lang].options?.map((opt, i) => (
                      <div key={i} className="flex gap-3 items-start p-3 bg-background rounded border">
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <Checkbox 
                            checked={lang === 'english' && currentCorrectAnswers.includes(currentContent.english.options?.[i] || '')} 
                            onCheckedChange={() => lang === 'english' && toggleCorrectAnswer(i)}
                            disabled={lang !== 'english'}
                          />
                          <Label className="text-sm font-medium">Option {i + 1}</Label>
                        </div>
                        <Input 
                          value={opt} 
                          onChange={(e) => updateOption(lang, i, e.target.value)}
                          placeholder={`Enter option ${i + 1} (paste images supported)`}
                          className="flex-1"
                        />
                      </div>
                    ))}
                    {lang === 'english' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          supportedLanguages.forEach(l => {
                            updateQuestionContent(l, 'options', [...(currentContent[l].options || []), '']);
                          });
                        }}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add More Options
                      </Button>
                    )}
                  </div>
                )}

                {currentType === 'numerical' && lang === 'english' && (
                  <div>
                    <Label className="text-sm font-medium">Correct Answer (Numerical) *</Label>
                    <p className="text-xs text-muted-foreground mb-2">Enter the correct numerical value</p>
                    <Input 
                      type="number" 
                      step="any"
                      value={currentCorrectAnswers[0] || ''} 
                      onChange={(e) => setCurrentCorrectAnswers([e.target.value])}
                      placeholder="e.g., 42 or 3.14"
                    />
                  </div>
                )}

                {langIndex < supportedLanguages.length - 1 && <Separator />}
              </div>
            ))}

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Marks *</Label>
                <p className="text-xs text-muted-foreground mb-2">Points awarded for correct answer</p>
                <Input 
                  type="number" 
                  min="0"
                  value={currentMarks} 
                  onChange={(e) => setCurrentMarks(Math.max(0, parseInt(e.target.value) || 0))} 
                  placeholder="e.g., 4"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Penalty Marks</Label>
                <p className="text-xs text-muted-foreground mb-2">Negative marks for wrong answer (optional)</p>
                <Input 
                  type="number" 
                  step="0.25"
                  min="0"
                  value={currentPenalty} 
                  onChange={(e) => setCurrentPenalty(Math.max(0, parseFloat(e.target.value) || 0))} 
                  placeholder="e.g., 1 or 0.25"
                />
              </div>
            </div>

            <Button onClick={addQuestion} size="lg" className="w-full">
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Question to Quiz
            </Button>
          </CardContent>
        </Card>

        {questions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Added Questions ({questions.length})</CardTitle>
              <CardDescription>Questions that will be included in this quiz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {questions.map((q, i) => (
                <div key={q.id} className="flex items-start gap-4 p-4 border rounded-lg bg-muted/30">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">Q{i + 1}</Badge>
                      <Badge variant={q.difficultyLevel === 'easy' ? 'secondary' : q.difficultyLevel === 'hard' ? 'destructive' : 'default'}>
                        {q.difficultyLevel}
                      </Badge>
                      <Badge variant="outline">{q.type}</Badge>
                      <span className="text-sm text-muted-foreground">Marks: {q.marks}</span>
                      {q.penaltyMarks > 0 && <span className="text-sm text-muted-foreground">Penalty: -{q.penaltyMarks}</span>}
                    </div>
                    <div 
                      className="prose prose-sm max-w-none" 
                      dangerouslySetInnerHTML={{ __html: q.content.english.questionText }}
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setQuestions(questions.filter(qu => qu.id !== q.id))}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Button onClick={handleSubmit} size="lg" className="w-full">
          <Save className="mr-2 h-5 w-5" />
          Save Quiz & Return to Course
        </Button>
      </main>
    </div>
  );
};

export default CreateQuiz;

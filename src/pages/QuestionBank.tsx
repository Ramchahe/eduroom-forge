import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";
import { User, Question, QuestionType, DifficultyLevel, Language, QuestionContent } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import RichTextEditor from "@/components/RichTextEditor";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const QuestionBank = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<QuestionType | "all">("all");
  const [filterDifficulty, setFilterDifficulty] = useState<DifficultyLevel | "all">("all");
  const [showAddDialog, setShowAddDialog] = useState(false);

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

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (currentUser.role === "student") {
      navigate("/student-dashboard");
      return;
    }
    setUser(currentUser);
    loadQuestions();
  }, [navigate]);

  const loadQuestions = () => {
    const allQuizzes = storage.getQuizzes();
    const allQuestions: Question[] = [];
    allQuizzes.forEach(quiz => {
      allQuestions.push(...quiz.questions);
    });
    setQuestions(allQuestions);
    setFilteredQuestions(allQuestions);
  };

  useEffect(() => {
    let filtered = questions;

    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.content.english.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.topic?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter(q => q.type === filterType);
    }

    if (filterDifficulty !== "all") {
      filtered = filtered.filter(q => q.difficultyLevel === filterDifficulty);
    }

    setFilteredQuestions(filtered);
  }, [searchTerm, filterType, filterDifficulty, questions]);

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

    const newQuestion: Question = {
      id: Date.now().toString(),
      type: currentType,
      content: currentContent,
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
    setFilteredQuestions([...questions, newQuestion]);
    
    // Reset form
    setCurrentContent({
      english: { questionText: '', options: ['', '', '', ''] },
      hindi: { questionText: '', options: ['', '', '', ''] },
    });
    setCurrentCorrectAnswers([]);
    setCurrentTags([]);
    setCurrentSubject("");
    setCurrentTopic("");
    setShowAddDialog(false);
    toast.success("Question added to bank");
  };

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar user={user} />
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-card shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4 flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-bold">Question Bank</h1>
            </div>
          </header>

          <main className="flex-1 container mx-auto px-4 py-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Question Bank</h2>
                <p className="text-muted-foreground mt-1">
                  Manage and reuse questions across quizzes
                </p>
              </div>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button size="lg">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Add Question
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Question to Bank</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Question Type</Label>
                      <Select value={currentType} onValueChange={(v: QuestionType) => setCurrentType(v)}>
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

                    <div>
                      <Label>Question Text (English)</Label>
                      <RichTextEditor
                        value={currentContent.english.questionText}
                        onChange={(v) => setCurrentContent(prev => ({
                          ...prev,
                          english: { ...prev.english, questionText: v }
                        }))}
                      />
                    </div>

                    {(currentType === 'single-correct' || currentType === 'multi-correct') && (
                      <div className="space-y-2">
                        <Label>Options</Label>
                        {currentContent.english.options?.map((opt, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <Checkbox 
                              checked={currentCorrectAnswers.includes(currentContent.english.options?.[i] || '')} 
                              onCheckedChange={() => toggleCorrectAnswer(i)} 
                            />
                            <Input 
                              value={opt} 
                              onChange={(e) => updateOption('english', i, e.target.value)}
                              placeholder={`Option ${i + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {currentType === 'numerical' && (
                      <div>
                        <Label>Correct Answer</Label>
                        <Input 
                          type="number" 
                          value={currentCorrectAnswers[0] || ''} 
                          onChange={(e) => setCurrentCorrectAnswers([e.target.value])}
                          placeholder="Enter numerical answer"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Subject</Label>
                        <Input value={currentSubject} onChange={(e) => setCurrentSubject(e.target.value)} />
                      </div>
                      <div>
                        <Label>Topic</Label>
                        <Input value={currentTopic} onChange={(e) => setCurrentTopic(e.target.value)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Marks</Label>
                        <Input type="number" value={currentMarks} onChange={(e) => setCurrentMarks(parseInt(e.target.value))} />
                      </div>
                      <div>
                        <Label>Penalty</Label>
                        <Input type="number" step="0.25" value={currentPenalty} onChange={(e) => setCurrentPenalty(parseFloat(e.target.value))} />
                      </div>
                      <div>
                        <Label>Difficulty</Label>
                        <Select value={currentDifficulty} onValueChange={(v: DifficultyLevel) => setCurrentDifficulty(v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Tags</Label>
                      <div className="flex gap-2 mb-2">
                        <Input 
                          value={currentTag} 
                          onChange={(e) => setCurrentTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addTag()}
                          placeholder="Add tag and press Enter"
                        />
                        <Button type="button" onClick={addTag} variant="outline">Add</Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {currentTags.map((tag, i) => (
                          <Badge key={i} variant="secondary">
                            {tag}
                            <button onClick={() => setCurrentTags(currentTags.filter((_, idx) => idx !== i))} className="ml-1">×</button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button onClick={addQuestion} className="w-full">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Question
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="mb-6 space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={(v: any) => setFilterType(v)}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="single-correct">Single Correct</SelectItem>
                    <SelectItem value="multi-correct">Multi Correct</SelectItem>
                    <SelectItem value="numerical">Numerical</SelectItem>
                    <SelectItem value="subjective">Subjective</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterDifficulty} onValueChange={(v: any) => setFilterDifficulty(v)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredQuestions.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <h3 className="text-xl font-semibold mb-2">No questions found</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    Start building your question bank to reuse questions across multiple quizzes.
                  </p>
                  <Button onClick={() => setShowAddDialog(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add First Question
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredQuestions.map((question) => (
                  <Card key={question.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={
                              question.difficultyLevel === 'easy' ? 'secondary' :
                              question.difficultyLevel === 'hard' ? 'destructive' : 'default'
                            }>
                              {question.difficultyLevel}
                            </Badge>
                            <Badge variant="outline">{question.type}</Badge>
                            {question.subject && <Badge variant="outline">{question.subject}</Badge>}
                            {question.topic && <Badge variant="outline">{question.topic}</Badge>}
                          </div>
                          <div 
                            className="prose prose-sm max-w-none" 
                            dangerouslySetInnerHTML={{ __html: question.content.english.questionText }}
                          />
                          <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
                            <span>Marks: {question.marks}</span>
                            <span>Penalty: {question.penaltyMarks}</span>
                          </div>
                          {question.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {question.tags.map((tag, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default QuestionBank;

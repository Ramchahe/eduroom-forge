import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { storage } from "@/lib/storage";
import { Quiz, Question, QuestionType, DifficultyLevel, Language, QuestionContent } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, PlusCircle, Trash2, Edit2, X } from "lucide-react";
import { toast } from "sonner";
import RichTextEditor from "@/components/RichTextEditor";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const EditQuiz = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [instructions, setInstructions] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    if (!quizId) return;
    
    const foundQuiz = storage.getQuizById(quizId);
    if (!foundQuiz) {
      toast.error("Quiz not found");
      navigate("/dashboard");
      return;
    }

    setQuiz(foundQuiz);
    setTitle(foundQuiz.title);
    setDescription(foundQuiz.description);
    setDuration(foundQuiz.duration.toString());
    setInstructions(foundQuiz.instructions);
    setQuestions(foundQuiz.questions);
  }, [quizId, navigate]);

  const handleSave = () => {
    if (!title || !description || !quiz) {
      toast.error("Please fill all required fields");
      return;
    }

    const updatedQuiz: Quiz = {
      ...quiz,
      title,
      description,
      duration: parseInt(duration),
      instructions,
      questions,
    };

    storage.updateQuiz(quiz.id, updatedQuiz);
    toast.success("Quiz updated successfully!");
    navigate(`/course/${quiz.courseId}`);
  };

  const deleteQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
    toast.success("Question deleted");
  };

  const startEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setShowEditDialog(true);
  };

  const saveEditedQuestion = () => {
    if (!editingQuestion) return;
    setQuestions(questions.map(q => q.id === editingQuestion.id ? editingQuestion : q));
    setShowEditDialog(false);
    setEditingQuestion(null);
    toast.success("Question updated");
  };

  if (!quiz) return null;

  return (
    <div className="min-h-screen bg-background">
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
            <DialogDescription>Update question details below</DialogDescription>
          </DialogHeader>
          {editingQuestion && (
            <div className="space-y-4">
              <div>
                <Label>Question Text (English)</Label>
                <RichTextEditor 
                  value={editingQuestion.content.english.questionText}
                  onChange={(v) => setEditingQuestion({
                    ...editingQuestion,
                    content: {
                      ...editingQuestion.content,
                      english: { ...editingQuestion.content.english, questionText: v }
                    }
                  })}
                />
              </div>

              {(editingQuestion.type === 'single-correct' || editingQuestion.type === 'multi-correct') && (
                <div className="space-y-2">
                  <Label>Options</Label>
                  {editingQuestion.content.english.options?.map((opt, i) => (
                    <Input 
                      key={i}
                      value={opt}
                      onChange={(e) => {
                        const newOptions = [...(editingQuestion.content.english.options || [])];
                        newOptions[i] = e.target.value;
                        setEditingQuestion({
                          ...editingQuestion,
                          content: {
                            ...editingQuestion.content,
                            english: { ...editingQuestion.content.english, options: newOptions }
                          }
                        });
                      }}
                    />
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Marks</Label>
                  <Input 
                    type="number"
                    value={editingQuestion.marks}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, marks: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Penalty Marks</Label>
                  <Input 
                    type="number"
                    value={editingQuestion.penaltyMarks}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, penaltyMarks: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
                <Button onClick={saveEditedQuestion}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(`/course/${quiz.courseId}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Edit Quiz</h1>
          <p className="text-muted-foreground">Update quiz details and questions</p>
        </div>

        <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen} className="mb-6">
          <Card>
            <CardHeader>
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between cursor-pointer">
                  <CardTitle>Quiz Details</CardTitle>
                  <Button variant="ghost" size="sm">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div>
                  <Label>Duration (minutes)</Label>
                  <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
                </div>
                <div>
                  <Label>Instructions</Label>
                  <RichTextEditor value={instructions} onChange={setInstructions} />
                </div>
                <Button onClick={() => setDetailsOpen(false)}>Save Details</Button>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Questions ({questions.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No questions added yet</p>
            ) : (
              questions.map((question, index) => (
                <Card key={question.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge>{question.type}</Badge>
                          <Badge variant="outline">{question.difficultyLevel}</Badge>
                          <span className="text-sm text-muted-foreground">
                            Question {index + 1}
                          </span>
                        </div>
                        <div 
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: question.content.english.questionText }}
                        />
                        <div className="mt-2 text-sm text-muted-foreground">
                          Marks: {question.marks} | Penalty: {question.penaltyMarks}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditQuestion(question)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteQuestion(question.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </CardContent>
        </Card>

        <Button onClick={handleSave} size="lg" className="w-full">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </main>
    </div>
  );
};

export default EditQuiz;

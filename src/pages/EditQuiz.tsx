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
import { ArrowLeft, Save, PlusCircle, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import RichTextEditor from "@/components/RichTextEditor";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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

  if (!quiz) return null;

  return (
    <div className="min-h-screen bg-background">
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteQuestion(question.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
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

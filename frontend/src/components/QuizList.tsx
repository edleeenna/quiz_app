import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getSavedQuizzes, deleteQuiz, SavedQuiz } from "@/lib/quiz-storage";
import { BookOpen, Trash, History, Trophy, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface QuizListProps {
  onSelectQuiz: (quiz: SavedQuiz) => void;
  setActiveTab?: (tab: "notes" | "quiz" | "past-quizzes") => void;
}

const QuizList = ({ onSelectQuiz, setActiveTab }: QuizListProps) => {
  const [quizzes, setQuizzes] = useState<SavedQuiz[]>([]);

  useEffect(() => {
    setQuizzes(getSavedQuizzes());
  }, []);

  const handleDeleteQuiz = (id: string) => {
    deleteQuiz(id);
    setQuizzes(getSavedQuizzes());
    toast.success("Quiz deleted successfully");
  };

  const handleTakeQuiz = (quiz: SavedQuiz) => {
    onSelectQuiz(quiz);
    if (setActiveTab) {
      setActiveTab("quiz");
    }
  };

  if (quizzes.length === 0) {
    return (
      <Card className="border border-dashed border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No quizzes yet</h3>
          <p className="text-muted-foreground">
            Generate a quiz from your notes to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => (
        <Card key={quiz.id} className="group animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-primary" />
              {quiz.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span>Attempts: {quiz.attempts}</span>
              </div>
              {quiz.bestScore !== undefined && (
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  <span>Best Score: {quiz.bestScore}%</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteQuiz(quiz.id)}
              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
            >
              <Trash className="h-4 w-4 mr-1" />
              Delete
            </Button>
            <Button
              size="sm"
              onClick={() => handleTakeQuiz(quiz)}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all group-hover:scale-105"
            >
              Take Quiz
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default QuizList;
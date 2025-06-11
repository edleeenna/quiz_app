import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSavedQuizzes, deleteQuiz, SavedQuiz } from "@/lib/quiz-storage";
import { BookOpen, Trash, History, Trophy, ArrowRight, Clock, Target, Sparkles } from "lucide-react";
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getScoreColor = (score?: number) => {
    if (!score) return "text-muted-foreground";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score?: number) => {
    if (!score) return "secondary";
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  if (quizzes.length === 0) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-full text-purple-600 dark:text-purple-400 text-sm font-medium">
            <History className="h-4 w-4 mr-2" />
            Quiz History
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Your <span className="gradient-text">Quiz History</span>
          </h2>
        </div>

        {/* Empty State */}
        <div className="text-center py-16 animate-fade-in">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center mb-6">
            <BookOpen className="h-12 w-12 text-purple-500" />
          </div>
          <h3 className="text-2xl font-semibold mb-3">No quizzes yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Generate your first quiz from your notes to start tracking your learning progress.
          </p>
          <Button 
            onClick={() => setActiveTab?.("notes")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Create Your First Quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">
            Your <span className="gradient-text">Quiz History</span>
          </h2>
          <p className="text-muted-foreground mt-1">
            {quizzes.length} {quizzes.length === 1 ? 'quiz' : 'quizzes'} completed
          </p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Trophy className="h-4 w-4" />
            <span>
              Avg: {quizzes.length > 0 
                ? Math.round(quizzes.reduce((sum, quiz) => sum + (quiz.bestScore || 0), 0) / quizzes.length)
                : 0}%
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>
              Total attempts: {quizzes.reduce((sum, quiz) => sum + quiz.attempts, 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Quiz Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz, index) => (
          <Card 
            key={quiz.id} 
            className="group glass-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg truncate group-hover:gradient-text transition-all duration-300">
                      {quiz.name}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Created {formatDate(quiz.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {quiz.bestScore !== undefined && (
                  <Badge variant={getScoreBadgeVariant(quiz.bestScore)} className="ml-2 flex-shrink-0">
                    {quiz.bestScore}%
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pb-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <History className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Attempts:</span>
                  </div>
                  <span className="font-medium">{quiz.attempts}</span>
                </div>
                
                {quiz.bestScore !== undefined && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Best Score:</span>
                    </div>
                    <span className={`font-medium ${getScoreColor(quiz.bestScore)}`}>
                      {quiz.bestScore}%
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Questions:</span>
                  </div>
                  <span className="font-medium">{quiz.questions.length}</span>
                </div>
                
                {quiz.lastAttempt && (
                  <div className="text-xs text-muted-foreground">
                    Last attempt: {formatDate(quiz.lastAttempt)}
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="pt-0 flex justify-between space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteQuiz(quiz.id)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash className="h-4 w-4 mr-1" />
                Delete
              </Button>
              
              <Button
                size="sm"
                onClick={() => handleTakeQuiz(quiz)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-200 group/btn"
              >
                <span>Take Quiz</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuizList;
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSavedQuizzes, deleteQuiz, SavedQuiz } from "@/lib/quiz-storage";
import { BookOpen, Trash, History, Trophy, ArrowRight, Clock, Target } from "lucide-react";
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

  const getScoreBadge = (score?: number) => {
    if (!score) return { text: "Not taken", color: "bg-slate-100 text-slate-600" };
    if (score >= 90) return { text: "Excellent", color: "bg-green-100 text-green-700" };
    if (score >= 80) return { text: "Great", color: "bg-blue-100 text-blue-700" };
    if (score >= 70) return { text: "Good", color: "bg-yellow-100 text-yellow-700" };
    if (score >= 60) return { text: "Fair", color: "bg-orange-100 text-orange-700" };
    return { text: "Needs work", color: "bg-red-100 text-red-700" };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (quizzes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Quiz History</h2>
          <p className="text-lg text-slate-600">
            Your completed quizzes and progress will appear here
          </p>
        </div>
        
        <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <History className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-3">No quizzes yet</h3>
            <p className="text-slate-500 mb-6 max-w-md">
              Generate your first quiz from your notes to start tracking your learning progress
            </p>
            <Button 
              variant="outline" 
              onClick={() => setActiveTab?.("notes")}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Go to Notes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-900">Quiz History</h2>
        <p className="text-lg text-slate-600">
          Review your past quizzes and track your learning progress
        </p>
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-slate-600">{quizzes.length} Total Quizzes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-slate-600">
              {quizzes.reduce((sum, quiz) => sum + quiz.attempts, 0)} Total Attempts
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => {
          const badge = getScoreBadge(quiz.bestScore);
          
          return (
            <Card key={quiz.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <CardHeader className="relative z-10 pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg leading-tight truncate" title={quiz.name}>
                        {quiz.name}
                      </CardTitle>
                      <p className="text-sm text-slate-500 mt-1">
                        Created {formatDate(quiz.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <Badge className={badge.color} variant="secondary">
                    {badge.text}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="relative z-10 pt-0 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <History className="h-4 w-4 text-slate-500" />
                      <span className="text-xs text-slate-500 font-medium">Attempts</span>
                    </div>
                    <div className="text-xl font-bold text-slate-900">{quiz.attempts}</div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Trophy className="h-4 w-4 text-slate-500" />
                      <span className="text-xs text-slate-500 font-medium">Best Score</span>
                    </div>
                    <div className="text-xl font-bold text-slate-900">
                      {quiz.bestScore ? `${quiz.bestScore}%` : '-'}
                    </div>
                  </div>
                </div>
                
                {quiz.lastAttempt && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="h-4 w-4" />
                    <span>Last attempt: {formatDate(quiz.lastAttempt)}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Target className="h-4 w-4" />
                  <span>{quiz.questions.length} questions</span>
                </div>
              </CardContent>
              
              <CardFooter className="relative z-10 flex justify-between gap-2 pt-4 bg-slate-50/50 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteQuiz(quiz.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleTakeQuiz(quiz)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all group/btn"
                >
                  <span className="flex items-center">
                    Take Quiz
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                  </span>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default QuizList;
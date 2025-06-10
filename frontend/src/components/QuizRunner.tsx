import React, { useState, useEffect } from 'react';
import { Check, X, ArrowRight, ArrowLeft, CheckCircle, RefreshCw, Trophy, Target, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { updateQuizAttempt } from '@/lib/quiz-storage';
import { QuizQuestion } from '@/types';
import { toast } from 'sonner';

interface QuizRunnerProps {
  questions: QuizQuestion[];
  restartQuiz: () => void;
  quizId?: string;
}

const QuizRunner = ({ questions, restartQuiz, quizId }: QuizRunnerProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [startTime] = useState(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  
  useEffect(() => {
    if (!quizCompleted) {
      const timer = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [startTime, quizCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  };

  const goToNextQuestion = () => {
    if (!selectedAnswer) {
      toast.error("Please select an answer");
      return;
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(userAnswers[questions[currentQuestionIndex - 1].id] || null);
      setShowExplanation(false);
    }
  };

  const getScore = React.useCallback(() => {
    let correct = 0;
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100)
    };
  }, [questions, userAnswers]);

  useEffect(() => {
    if (quizCompleted && quizId) {
      const score = getScore();
      updateQuizAttempt(quizId, score.percentage);
    }
  }, [quizCompleted, quizId, getScore]);

  const handleShowExplanation = () => {
    setShowExplanation(true);
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return "Outstanding! 🎉";
    if (percentage >= 80) return "Great job! 👏";
    if (percentage >= 70) return "Good work! 👍";
    if (percentage >= 60) return "Not bad! 📚";
    return "Keep studying! 💪";
  };

  if (quizCompleted) {
    const score = getScore();
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Results Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-full text-green-600 dark:text-green-400 text-sm font-medium">
            <Trophy className="h-4 w-4 mr-2" />
            Quiz Completed
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Quiz <span className="gradient-text">Results</span>
          </h2>
        </div>

        <Card className="glass-card animate-scale-in">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-32 h-32 relative mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted-foreground/20"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - score.percentage / 100)}`}
                  className="text-blue-500 transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(score.percentage)}`}>
                    {score.percentage}%
                  </div>
                  <div className="text-xs text-muted-foreground">Score</div>
                </div>
              </div>
            </div>
            
            <CardTitle className="text-2xl mb-2">
              {getScoreMessage(score.percentage)}
            </CardTitle>
            <CardDescription className="text-lg">
              You got <span className="font-semibold text-foreground">{score.correct}</span> out of{' '}
              <span className="font-semibold text-foreground">{score.total}</span> questions correct
            </CardDescription>
            
            <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Time: {formatTime(timeElapsed)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Accuracy: {score.percentage}%</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <h3 className="font-semibold text-lg mb-4">Question Review</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {questions.map((q, idx) => {
                const isCorrect = userAnswers[q.id] === q.correctAnswer;
                return (
                  <div key={q.id} className={`p-4 rounded-xl border transition-colors ${
                    isCorrect 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            Question {idx + 1}
                          </Badge>
                          <Badge variant={isCorrect ? "default" : "destructive"} className="text-xs">
                            {isCorrect ? "Correct" : "Incorrect"}
                          </Badge>
                        </div>
                        <p className="font-medium mb-3 break-words">{q.question}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <span className="text-muted-foreground whitespace-nowrap">Your answer:</span>
                            <span className={`break-words flex-1 font-medium ${
                              isCorrect ? "text-green-600" : "text-red-600"
                            }`}>
                              {userAnswers[q.id]}
                            </span>
                          </div>
                          {!isCorrect && (
                            <div className="flex items-start gap-2">
                              <span className="text-muted-foreground whitespace-nowrap">Correct answer:</span>
                              <span className="text-green-600 break-words flex-1 font-medium">
                                {q.correctAnswer}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
          
          <CardFooter className="flex gap-3">
            <Button 
              variant="outline"
              onClick={() => {
                setQuizCompleted(false);
                setCurrentQuestionIndex(0);
                setSelectedAnswer(null);
                setUserAnswers({});
                setShowExplanation(false);
              }} 
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Quiz
            </Button>
            <Button 
              onClick={restartQuiz} 
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quizzes
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Quiz Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium">
          <Target className="h-4 w-4 mr-2" />
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{formatTime(timeElapsed)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="h-4 w-4" />
            <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete</span>
          </div>
        </div>
      </div>

      <Card className="glass-card animate-scale-in">
        <CardHeader>
          <Progress 
            value={((currentQuestionIndex + 1) / questions.length) * 100} 
            className="h-2 mb-4" 
          />
          <CardTitle className="text-xl leading-relaxed break-words">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === currentQuestion.correctAnswer;
              const showCorrectness = showExplanation;
              
              return (
                <button
                  key={idx}
                  onClick={() => !showExplanation && handleAnswerSelect(option)}
                  disabled={showExplanation}
                  className={`w-full p-4 text-left rounded-xl transition-all duration-200 border-2 ${
                    showCorrectness
                      ? isCorrect
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : isSelected
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-border bg-background'
                      : isSelected 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md' 
                      : 'border-border hover:border-blue-300 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      showCorrectness
                        ? isCorrect
                          ? 'bg-green-500 text-white'
                          : isSelected
                          ? 'bg-red-500 text-white'
                          : 'bg-muted text-muted-foreground'
                        : isSelected 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="flex-1 break-words font-medium">
                      {option}
                    </span>
                    {showCorrectness && isCorrect && (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    )}
                    {showCorrectness && isSelected && !isCorrect && (
                      <X className="h-5 w-5 text-red-500 flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          
          {showExplanation && (
            <div className="p-4 bg-muted/30 rounded-xl border animate-fade-in">
              <h4 className="font-medium mb-2 flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Explanation</span>
              </h4>
              <p className="text-muted-foreground break-words">
                {selectedAnswer === currentQuestion.correctAnswer 
                  ? "Correct! Well done." 
                  : `The correct answer is "${currentQuestion.correctAnswer}".`}
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>
          
          <div className="flex space-x-2">
            {selectedAnswer && !showExplanation && (
              <Button 
                variant="outline" 
                onClick={handleShowExplanation}
                className="flex items-center space-x-2"
              >
                <Check className="h-4 w-4" />
                <span>Check Answer</span>
              </Button>
            )}
            <Button 
              onClick={goToNextQuestion}
              disabled={!selectedAnswer}
              className={`flex items-center space-x-2 ${
                selectedAnswer 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white' 
                  : ''
              }`}
            >
              <span>
                {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish Quiz"}
              </span>
              {currentQuestionIndex < questions.length - 1 ? (
                <ArrowRight className="h-4 w-4" />
              ) : (
                <Trophy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizRunner;
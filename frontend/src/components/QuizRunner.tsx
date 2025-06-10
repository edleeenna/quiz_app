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

  const currentQuestion = questions[currentQuestionIndex];
  
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

  const getScoreBadge = (percentage: number) => {
    if (percentage >= 90) return { text: "Excellent!", color: "bg-green-100 text-green-800" };
    if (percentage >= 80) return { text: "Great Job!", color: "bg-blue-100 text-blue-800" };
    if (percentage >= 70) return { text: "Good Work!", color: "bg-yellow-100 text-yellow-800" };
    if (percentage >= 60) return { text: "Keep Trying!", color: "bg-orange-100 text-orange-800" };
    return { text: "Need Practice", color: "bg-red-100 text-red-800" };
  };

  if (quizCompleted) {
    const score = getScore();
    const badge = getScoreBadge(score.percentage);
    
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <Card className="relative overflow-hidden border border-slate-200 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50" />
          
          <CardHeader className="relative z-10 text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Trophy className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-slate-900">Quiz Complete!</CardTitle>
            <CardDescription className="text-lg">
              Here's how you performed on this quiz
            </CardDescription>
          </CardHeader>
          
          <CardContent className="relative z-10 space-y-8">
            {/* Score Display */}
            <div className="text-center space-y-4">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-slate-200"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - score.percentage / 100)}`}
                    className={getScoreColor(score.percentage)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(score.percentage)}`}>
                      {score.percentage}%
                    </div>
                    <div className="text-sm text-slate-500">Score</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Badge className={badge.color} variant="secondary">
                  {badge.text}
                </Badge>
                <p className="text-lg font-medium text-slate-700">
                  You got {score.correct} out of {score.total} questions correct
                </p>
              </div>
            </div>

            {/* Question Summary */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Question Review
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {questions.map((q, idx) => {
                  const isCorrect = userAnswers[q.id] === q.correctAnswer;
                  return (
                    <div key={q.id} className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {isCorrect ? (
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                              <X className="h-4 w-4 text-red-600" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 mb-2">
                            Question {idx + 1}
                          </p>
                          <p className="text-sm text-slate-600 mb-3 break-words">
                            {q.question}
                          </p>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <span className="text-slate-500 whitespace-nowrap font-medium">Your answer:</span>
                              <span className={`break-words flex-1 ${isCorrect ? "text-green-600 font-medium" : "text-red-600"}`}>
                                {userAnswers[q.id]}
                              </span>
                            </div>
                            {!isCorrect && (
                              <div className="flex items-start gap-2">
                                <span className="text-slate-500 whitespace-nowrap font-medium">Correct:</span>
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
            </div>
          </CardContent>
          
          <CardFooter className="relative z-10 flex gap-3 bg-slate-50/50 border-t">
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
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
    <div className="max-w-3xl mx-auto animate-fade-in">
      <Card className="relative overflow-hidden border border-slate-200 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50" />
        
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
                </p>
              </div>
            </div>
            <Badge variant="outline" className="px-3 py-1">
              {questions.length - currentQuestionIndex - 1} remaining
            </Badge>
          </div>
          <Progress 
            value={((currentQuestionIndex + 1) / questions.length) * 100} 
            className="h-3" 
          />
        </CardHeader>
        
        <CardContent className="relative z-10 space-y-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-6 break-words leading-relaxed">
              {currentQuestion.question}
            </h2>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === currentQuestion.correctAnswer;
                const showCorrectness = showExplanation;
                
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showExplanation}
                    className={`w-full p-4 text-left rounded-xl transition-all duration-200 border-2 ${
                      showCorrectness
                        ? isCorrect
                          ? 'border-green-300 bg-green-50'
                          : isSelected
                          ? 'border-red-300 bg-red-50'
                          : 'border-slate-200 bg-white'
                        : isSelected 
                        ? 'border-blue-300 bg-blue-50 shadow-md'
                        : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                        showCorrectness
                          ? isCorrect
                            ? 'border-green-500 bg-green-500 text-white'
                            : isSelected
                            ? 'border-red-500 bg-red-500 text-white'
                            : 'border-slate-300 text-slate-500'
                          : isSelected 
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-slate-300 text-slate-500'
                      }`}>
                        {showCorrectness && isCorrect ? (
                          <Check className="h-4 w-4" />
                        ) : showCorrectness && isSelected && !isCorrect ? (
                          <X className="h-4 w-4" />
                        ) : (
                          <span className="text-sm font-medium">{String.fromCharCode(65 + idx)}</span>
                        )}
                      </div>
                      <span className="flex-1 break-words text-slate-900 font-medium">
                        {option}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          {showExplanation && (
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Explanation
              </h3>
              <p className="text-slate-700 break-words">
                {selectedAnswer === currentQuestion.correctAnswer 
                  ? "Excellent! That's the correct answer. Well done!" 
                  : `The correct answer is "${currentQuestion.correctAnswer}". This question tests your understanding of the key concepts from your notes.`}
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="relative z-10 flex justify-between bg-slate-50/50 border-t">
          <Button 
            variant="outline" 
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex gap-3">
            {selectedAnswer && !showExplanation && (
              <Button 
                variant="outline" 
                onClick={handleShowExplanation}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Check Answer
              </Button>
            )}
            <Button 
              onClick={goToNextQuestion}
              disabled={!selectedAnswer}
              className={`flex items-center gap-2 ${
                selectedAnswer 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white' 
                  : ''
              }`}
            >
              {currentQuestionIndex < questions.length - 1 ? (
                <>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  Finish Quiz
                  <Trophy className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizRunner;
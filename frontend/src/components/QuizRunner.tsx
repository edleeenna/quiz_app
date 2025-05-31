import React, { useState, useEffect } from 'react';
import { Check, X, ArrowRight, ArrowLeft, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { updateQuizAttempt } from '@/lib/quiz-storage.ts';
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
  const [showResult, setShowResult] = useState(false);
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

  const getScore = () => {
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
  };

  useEffect(() => {
    if (quizCompleted && quizId) {
      const score = getScore();
      updateQuizAttempt(quizId, score.percentage);
    }
  }, [quizCompleted, quizId]);

  const handleShowExplanation = () => {
    setShowExplanation(true);
  };

  if (quizCompleted) {
    const score = getScore();
    return (
      <Card className="animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Quiz Results</CardTitle>
          <CardDescription>
            You've completed the quiz!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative h-36 w-36 flex items-center justify-center">
              <svg className="h-full w-full" viewBox="0 0 100 100">
                <circle
                  className="text-muted stroke-current"
                  strokeWidth="10"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                />
                <circle
                  className="text-primary stroke-current"
                  strokeWidth="10"
                  strokeLinecap="round"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * score.percentage) / 100}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-3xl font-bold">{score.percentage}%</div>
              </div>
            </div>
            <p className="mt-4 text-lg font-medium">
              You got {score.correct} out of {score.total} questions correct
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Question Summary</h3>
            {questions.map((q, idx) => (
              <div key={q.id} className="flex items-center space-x-3 p-3 rounded-md bg-muted/30">
                <div className="flex-shrink-0">
                  {userAnswers[q.id] === q.correctAnswer ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-destructive" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Question {idx + 1}</p>
                  <p className="text-xs text-muted-foreground truncate">{q.question}</p>
                  <div className="mt-1 text-xs">
                    <span className="text-muted-foreground">Your answer: </span>
                    <span className={userAnswers[q.id] === q.correctAnswer ? "text-green-500" : "text-destructive"}>
                      {userAnswers[q.id]}
                    </span>
                    {userAnswers[q.id] !== q.correctAnswer && (
                      <>
                        <span className="text-muted-foreground ml-2">Correct answer: </span>
                        <span className="text-green-500">{q.correctAnswer}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
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
            className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quizzes
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex justify-between mb-2">
          <p className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
          <p className="text-sm font-medium">
            {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
          </p>
        </div>
        <Progress 
          value={((currentQuestionIndex + 1) / questions.length) * 100} 
          className="h-2" 
        />
      </CardHeader>
      <CardContent className="space-y-6">
        <h2 className="text-xl font-medium">{currentQuestion.question}</h2>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full p-4 text-left rounded-lg transition-colors border ${
                selectedAnswer === option 
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center border ${
                  selectedAnswer === option 
                    ? 'border-primary text-primary'
                    : 'border-muted-foreground text-muted-foreground'
                }`}>
                  <span className="text-sm">{String.fromCharCode(65 + idx)}</span>
                </div>
                <span className="flex-1">{option}</span>
              </div>
            </button>
          ))}
        </div>
        
        {showExplanation && (
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <h3 className="font-medium mb-2">Explanation</h3>
            <p className="text-muted-foreground">
              {selectedAnswer === currentQuestion.correctAnswer 
                ? "That's correct! Good job." 
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
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex space-x-2">
          {selectedAnswer && !showExplanation && (
            <Button variant="outline" onClick={handleShowExplanation}>
              Check Answer
            </Button>
          )}
          <Button 
            onClick={goToNextQuestion}
            disabled={!selectedAnswer}
            className={selectedAnswer ? 'bg-gradient-to-r from-primary to-secondary hover:opacity-90' : ''}
          >
            {currentQuestionIndex < questions.length - 1 ? (
              <>
                Next <ArrowRight className="h-4 w-4 ml-2" />
              </>
            ) : (
              "Finish Quiz"
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default QuizRunner;
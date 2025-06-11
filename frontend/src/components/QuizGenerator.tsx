import React, { useState } from 'react';
import { BookOpen, Loader, ArrowRight, CheckCircle, FileInput, Sparkles, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface NoteFile {
  id: string;
  name: string;
  content: string;
  exampleQuestions?: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizGeneratorProps {
  selectedNote: NoteFile | null;
  onQuizGenerated: (questions: QuizQuestion[]) => void;
}

const QuizGenerator = ({ selectedNote, onQuizGenerated }: QuizGeneratorProps) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isExamplesOpen, setIsExamplesOpen] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);

  const generateQuiz = async () => {
    if (!selectedNote) {
      toast.error("Please select a note first");
      return;
    }

    setLoading(true);
    setProgress(10);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev < 90) {
          return prev + Math.floor(Math.random() * 10) + 1;
        }
        return prev;
      });
    }, 500);

    const formData = new FormData();
    formData.append("id", selectedNote.id);
    formData.append("name", selectedNote.name);
    formData.append("content", selectedNote.content);
    formData.append("num_questions", numQuestions.toString());
    if (selectedNote.exampleQuestions) {
      formData.append("example_questions", selectedNote.exampleQuestions);
    }

    try {
      const response = await fetch('https://quiz-app-gs-c0g.fly.dev/generate-quiz', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
        toast.error("No questions were generated.", {
          action: {
            label: "Retry",
            onClick: generateQuiz
          }
        });
        throw new Error("No quiz questions were returned. Please check your input and try again.");
      }

      const questions = data.questions.map((q, index) => ({
        id: `q-${index}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.correct_answer,
      }));

      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        onQuizGenerated(questions);
        toast.success("Quiz generated successfully!");
      }, 500);
    } catch (error) {
      clearInterval(interval);
      setLoading(false);
      console.error("Error generating quiz:", error);
      toast.error("Failed to generate quiz. Please try again.");
    }
  };

  if (!selectedNote) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="mx-auto w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center mb-6">
          <BookOpen className="h-12 w-12 text-purple-500" />
        </div>
        <h3 className="text-2xl font-semibold mb-3">No note selected</h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          Please select a note from your collection to generate an AI-powered quiz.
        </p>
        <Button variant="outline" disabled>
          <Sparkles className="h-4 w-4 mr-2" />
          Generate Quiz
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <div className="inline-flex items-center px-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-full text-purple-600 dark:text-purple-400 text-sm font-medium">
          <Zap className="h-4 w-4 mr-2" />
          AI Quiz Generation
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">
          Generate Your <span className="gradient-text">Smart Quiz</span>
        </h2>
        <p className="text-lg text-muted-foreground">
          Our AI will analyze your notes and create personalised questions to test your knowledge.
        </p>
      </div>

      <Card className="glass-card animate-scale-in">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="gradient-text">Quiz Generation</span>
              <CardDescription className="mt-1">
                <strong>⚠️ Note:</strong> The app may take a moment to warm up after inactivity due to free tier limitations. Please be patient and try again if needed.
              </CardDescription>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Selected Note Display */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200/50 dark:border-blue-800/50">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-2">{selectedNote.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {selectedNote.content.length > 200 
                    ? `${selectedNote.content.substring(0, 200)}...` 
                    : selectedNote.content}
                </p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>{selectedNote.content.length} characters</span>
                  {selectedNote.exampleQuestions && (
                    <Badge variant="secondary" className="text-xs">
                      <FileInput className="h-3 w-3 mr-1" />
                      Has examples
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="question-count" className="text-sm font-medium flex items-center space-x-2">
                <Target className="h-4 w-4 text-purple-500" />
                <span>Number of Questions</span>
              </label>
              <select
                id="question-count"
                className="px-3 py-2 border border-border rounded-lg bg-background text-sm min-w-[100px] focus:border-purple-300 focus:ring-2 focus:ring-purple-200 transition-colors"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                disabled={loading}
              >
                {[5, 10, 15, 20, 25].map((count) => (
                  <option key={count} value={count}>
                    {count} questions
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Example Questions Collapsible */}
          {selectedNote.exampleQuestions && (
            <Collapsible 
              open={isExamplesOpen} 
              onOpenChange={setIsExamplesOpen}
              className="border border-border/50 rounded-xl overflow-hidden"
            >
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <FileInput className="h-5 w-5 text-purple-500" />
                    <span className="font-medium">Example Questions</span>
                    <Badge variant="outline" className="text-xs">
                      Guide AI
                    </Badge>
                  </div>
                  <ArrowRight className={`h-4 w-4 transition-transform ${isExamplesOpen ? 'rotate-90' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="border-t border-border/50">
                <div className="p-4 bg-muted/20">
                  <div className="bg-background rounded-lg p-4 max-h-40 overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap text-muted-foreground">
                      {selectedNote.exampleQuestions}
                    </pre>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    These examples will help the AI understand your preferred question format and style.
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Loading State */}
          {loading && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between text-sm">
                <span className="flex items-center space-x-2">
                  <Loader className="h-4 w-4 animate-spin text-purple-500" />
                  <span>Generating your quiz...</span>
                </span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {selectedNote.exampleQuestions 
                    ? "Analyzing content and examples to create personalised questions..."
                    : "Analyzing content and creating intelligent questions..."}
                </p>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          <Button 
            onClick={generateQuiz} 
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            {loading ? (
              <>
                <Loader className="h-5 w-5 mr-2 animate-spin" />
                Generating Quiz...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                Generate {numQuestions} Questions
                {selectedNote.exampleQuestions && " with Examples"}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizGenerator;
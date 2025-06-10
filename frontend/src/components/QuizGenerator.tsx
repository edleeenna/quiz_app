import React, { useState } from 'react';
import { BookOpen, Loader, ArrowRight, CheckCircle, FileInput, Sparkles, Zap, Settings } from 'lucide-react';
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
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-700 mb-3">No note selected</h3>
            <p className="text-slate-500 mb-6 max-w-md">
              Choose a note from your collection to generate an AI-powered quiz
            </p>
            <Button variant="outline" disabled className="pointer-events-none">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Generate AI Quiz
        </h2>
        <p className="text-slate-600">
          Transform your notes into an interactive learning experience
        </p>
      </div>

      <Card className="relative overflow-hidden border border-slate-200 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50" />
        
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            Quiz Configuration
          </CardTitle>
          <CardDescription>
            Customize your quiz settings and review your selected note
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative z-10 space-y-6">
          {/* Selected Note Display */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-slate-900 truncate">{selectedNote.name}</h3>
                  {selectedNote.exampleQuestions && (
                    <Badge variant="secondary" className="flex-shrink-0">
                      <FileInput className="h-3 w-3 mr-1" />
                      Examples
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-600 line-clamp-2">
                  {selectedNote.content.length > 150 
                    ? `${selectedNote.content.substring(0, 150)}...` 
                    : selectedNote.content}
                </p>
                <div className="mt-2 text-xs text-slate-500">
                  {selectedNote.content.length} characters
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Settings */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="h-5 w-5 text-slate-600" />
              <h4 className="font-medium text-slate-900">Quiz Settings</h4>
            </div>
            
            <div className="space-y-3">
              <label htmlFor="question-count" className="block text-sm font-medium text-slate-700">
                Number of Questions
              </label>
              <select
                id="question-count"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
              >
                {[5, 10, 15, 20, 25].map((count) => (
                  <option key={count} value={count}>
                    {count} questions
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Example Questions Preview */}
          {selectedNote.exampleQuestions && (
            <Collapsible 
              open={isExamplesOpen} 
              onOpenChange={setIsExamplesOpen}
              className="bg-white rounded-xl border border-slate-200 shadow-sm"
            >
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between cursor-pointer p-6 hover:bg-slate-50 transition-colors rounded-xl">
                  <div className="flex items-center gap-2">
                    <FileInput className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-slate-900">Example Questions</span>
                    <Badge variant="outline" className="ml-2">Preview</Badge>
                  </div>
                  <span className="text-sm text-slate-500">
                    {isExamplesOpen ? "Hide" : "Show"}
                  </span>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6">
                <div className="bg-slate-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                  <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono">
                    {selectedNote.exampleQuestions}
                  </pre>
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  These examples will guide the AI to generate questions in a similar style and format.
                </p>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Generating quiz</span>
                  </div>
                  <span className="text-slate-600">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>
                    {selectedNote.exampleQuestions 
                      ? "Analyzing content and examples to create personalized questions..."
                      : "Analyzing content and generating intelligent questions..."}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Warning Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex gap-3">
              <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-amber-600 text-xs font-bold">!</span>
              </div>
              <div className="text-sm">
                <p className="font-medium text-amber-800 mb-1">Please Note</p>
                <p className="text-amber-700">
                  The app may take a moment to warm up after periods of inactivity due to free tier limitations. 
                  If no questions are generated, please wait and try again.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="relative z-10 bg-slate-50/50 border-t">
          <Button 
            onClick={generateQuiz} 
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3"
            size="lg"
          >
            {loading ? (
              <>
                <Loader className="h-5 w-5 mr-2 animate-spin" />
                Generating Quiz...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Generate {numQuestions} Questions
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizGenerator;
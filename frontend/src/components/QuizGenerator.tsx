import React, { useState } from 'react';
import { BookOpen, Loader, ArrowRight, CheckCircle, FileInput } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  
  const generateQuiz = async () => {
    if (!selectedNote) {
      toast.error("Please select a note first");
      return;
    }
  
    toast.warning("Warming up the server... This might take a few seconds.");
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
    if (selectedNote.exampleQuestions) {
      formData.append("example_questions", selectedNote.exampleQuestions);
    }
  
    try {
      const response = await fetch('https://quiz-app-zoxs.onrender.com/generate-quiz', {
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
      <Card className="border border-white/10 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2 text-white">No note selected</h3>
          <p className="text-gray-400 mb-4">
            Please select a note to generate a quiz
          </p>
          <Button variant="outline" disabled className="border-white/10 text-gray-400">
            Generate Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in bg-card/50 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Generate Quiz</CardTitle>
        <CardDescription className="text-gray-400">
          Create a multiple-choice quiz from your note
          {selectedNote.exampleQuestions ? " (includes example questions)" : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10">
          <BookOpen className="h-8 w-8 text-theme-blue flex-shrink-0" />
          <div className="flex-1 overflow-hidden">
            <h3 className="font-medium text-white truncate">{selectedNote.name}</h3>
            <p className="text-sm text-gray-400 truncate">
              {selectedNote.content.length > 80 
                ? `${selectedNote.content.substring(0, 80)}...` 
                : selectedNote.content}
            </p>
          </div>
        </div>

        {selectedNote.exampleQuestions && (
          <Collapsible 
            open={isExamplesOpen} 
            onOpenChange={setIsExamplesOpen}
            className="border border-white/10 rounded-lg p-2"
          >
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between cursor-pointer p-2 hover:bg-white/5 rounded transition-colors">
                <div className="flex items-center">
                  <FileInput className="h-5 w-5 mr-2 text-theme-purple" />
                  <span className="text-sm font-medium text-white">Example Questions</span>
                </div>
                <span className="text-xs text-gray-400">
                  {isExamplesOpen ? "Hide" : "Show"}
                </span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="bg-white/5 p-3 rounded text-sm max-h-40 overflow-y-auto text-gray-300">
                <pre className="whitespace-pre-wrap">{selectedNote.exampleQuestions}</pre>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                These example questions will be used to guide the AI in generating similar questions.
              </p>
            </CollapsibleContent>
          </Collapsible>
        )}

        {loading && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-white">
              <span>Generating quiz</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
              <Loader className="h-4 w-4 animate-spin" />
              <span>
                {selectedNote.exampleQuestions 
                  ? "Analyzing content and examples to create questions..."
                  : "Analyzing content and creating questions..."}
              </span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={generateQuiz} 
          disabled={loading}
          className="w-full bg-gradient-to-r from-theme-blue to-theme-purple hover:opacity-90"
        >
          {loading ? (
            <Loader className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <BookOpen className="h-4 w-4 mr-2" />
          )}
          Generate Quiz {selectedNote.exampleQuestions ? "with Examples" : ""}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizGenerator;
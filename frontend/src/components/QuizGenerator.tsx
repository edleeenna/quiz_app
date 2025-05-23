
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
  
  setLoading(true);
  setProgress(10);
  
  // Progress animation
  const progressInterval = setInterval(() => {
    setProgress((prev) => {
      const newProgress = prev + Math.floor(Math.random() * 15);
      return newProgress >= 90 ? 90 : newProgress;
    });
  }, 600);

  try {
    // Format the data for the API
    const noteData = {
      id: selectedNote.id,
      name: selectedNote.name,
      content: selectedNote.content,
      example_questions: selectedNote.exampleQuestions?.split('\n') || null
    };
    
    // Call the backend API
    const response = await fetch('https://quiz-app-zoxs.onrender.com/generate-quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Map the API response to your frontend format
    const questions = data.questions.map((q, index) => ({
      id: `q-${index}`,
      question: q.question,
      options: q.options,
      correctAnswer: q.correct_answer
    }));
    
    clearInterval(progressInterval);
    setProgress(100);
    
    setTimeout(() => {
      setLoading(false);
      onQuizGenerated(questions);
      toast.success("Quiz generated successfully!");
    }, 500);
    
  } catch (error) {
    clearInterval(progressInterval);
    setLoading(false);
    console.error("Error generating quiz:", error);
    toast.error("Failed to generate quiz. Please try again.");
  }
};


  if (!selectedNote) {
    return (
      <Card className="border border-dashed border-border bg-muted/30 animate-fade-in">
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No note selected</h3>
          <p className="text-muted-foreground mb-4">
            Please select a note to generate a quiz
          </p>
          <Button variant="outline" disabled>
            Generate Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Generate Quiz</CardTitle>
        <CardDescription>
          Create a multiple-choice quiz from your note
          {selectedNote.exampleQuestions ? " (includes example questions)" : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
          <BookOpen className="h-8 w-8 text-primary flex-shrink-0" />
          <div className="flex-1 overflow-hidden">
            <h3 className="font-medium truncate">{selectedNote.name}</h3>
            <p className="text-sm text-muted-foreground truncate">
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
            className="border rounded-lg p-2"
          >
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between cursor-pointer p-2 hover:bg-muted/30 rounded">
                <div className="flex items-center">
                  <FileInput className="h-5 w-5 mr-2 text-primary" />
                  <span className="text-sm font-medium">Example Questions</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {isExamplesOpen ? "Hide" : "Show"}
                </span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="bg-muted/20 p-3 rounded text-sm max-h-40 overflow-y-auto">
                <pre className="whitespace-pre-wrap">{selectedNote.exampleQuestions}</pre>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                These example questions will be used to guide the AI in generating similar questions.
              </p>
            </CollapsibleContent>
          </Collapsible>
        )}

        {loading && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Generating quiz</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
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
          className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
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

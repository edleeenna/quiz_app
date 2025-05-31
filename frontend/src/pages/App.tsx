import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import NotesUploader from '@/components/NotesUploader';
import NotesList from '@/components/NotesList';
import QuizGenerator from '@/components/QuizGenerator';
import QuizRunner from '@/components/QuizRunner';

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

const App = () => {
  const [activeTab, setActiveTab] = useState<"notes" | "quiz">("notes");
  const [notes, setNotes] = useState<NoteFile[]>([]);
  const [selectedNote, setSelectedNote] = useState<NoteFile | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizActive, setQuizActive] = useState(false);

  const addNote = (note: NoteFile) => {
    setNotes(prev => [...prev, note]);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  const selectNoteForQuiz = (note: NoteFile) => {
    setSelectedNote(note);
    setActiveTab("quiz");
    setQuizActive(false);
  };

  const handleQuizGenerated = (questions: QuizQuestion[]) => {
    setQuizQuestions(questions);
    setQuizActive(true);
  };

  const restartQuiz = () => {
    setQuizActive(false);
    setQuizQuestions([]);
    setSelectedNote(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/20">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 container py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          {activeTab === "notes" && (
            <div className="space-y-12 animate-fade-in">
              <div className="relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-24 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -top-6 left-[45%] -translate-x-1/2 w-24 h-24 bg-secondary/10 rounded-full blur-3xl" />
                <div className="absolute -top-6 left-[55%] -translate-x-1/2 w-24 h-24 bg-accent/10 rounded-full blur-3xl" />
                <NotesUploader addNote={addNote} />
              </div>
              <NotesList 
                notes={notes}
                deleteNote={deleteNote}
                selectNoteForQuiz={selectNoteForQuiz}
              />
            </div>
          )}
          
          {activeTab === "quiz" && (
            <div className="max-w-2xl mx-auto animate-fade-in">
              <div className="relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-24 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -top-6 left-[45%] -translate-x-1/2 w-24 h-24 bg-secondary/10 rounded-full blur-3xl" />
                {!quizActive ? (
                  <QuizGenerator 
                    selectedNote={selectedNote}
                    onQuizGenerated={handleQuizGenerated}
                  />
                ) : (
                  <QuizRunner 
                    questions={quizQuestions}
                    restartQuiz={restartQuiz}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground border-t bg-muted/10 backdrop-blur-sm">
        <div className="container">
          <p className="font-medium">
            QuizNotes © {new Date().getFullYear()} - Transform your notes into quizzes
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
import React, { useState } from 'react';
import Header from '@/components/Header';
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
    <div className="min-h-screen flex flex-col bg-background">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 container py-8">
        {activeTab === "notes" && (
          <div className="space-y-8">
            <NotesUploader addNote={addNote} />
            <NotesList 
              notes={notes}
              deleteNote={deleteNote}
              selectNoteForQuiz={selectNoteForQuiz}
            />
          </div>
        )}
        
        {activeTab === "quiz" && (
          <div className="max-w-2xl mx-auto">
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
        )}
      </main>
      
      <footer className="py-4 text-center text-sm text-muted-foreground border-t">
        <div className="container">
          QuizNotes © {new Date().getFullYear()} - Turn your notes into quizzes
        </div>
      </footer>
    </div>
  );
};

export default App;
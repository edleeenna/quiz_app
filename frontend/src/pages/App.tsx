import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import NotesUploader from '@/components/NotesUploader';
import NotesList from '@/components/NotesList';
import QuizGenerator from '@/components/QuizGenerator';
import QuizRunner from '@/components/QuizRunner';
import QuizList from '@/components/QuizList';
import { NoteFile, QuizQuestion } from '@/types';
import { SavedQuiz, saveQuiz } from '@/lib/quiz-storage';

const App = () => {
  const [activeTab, setActiveTab] = useState<"notes" | "quiz" | "past-quizzes">("notes");
  const [notes, setNotes] = useState<NoteFile[]>([]);
  const [selectedNote, setSelectedNote] = useState<NoteFile | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizActive, setQuizActive] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<SavedQuiz | null>(null);

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
    setSelectedQuiz(null);
    setActiveTab("quiz");
    setQuizActive(false);
  };

  const handleQuizGenerated = (questions: QuizQuestion[]) => {
    const quiz = saveQuiz(selectedNote?.name || 'Untitled Quiz', questions);
    setQuizQuestions(questions);
    setSelectedQuiz(quiz);
    setQuizActive(true);
  };

  const handleSelectSavedQuiz = (quiz: SavedQuiz) => {
    setSelectedQuiz(quiz);
    setQuizQuestions(quiz.questions);
    setQuizActive(true);
    setSelectedNote(null);
  };

  const restartQuiz = () => {
    setQuizActive(false);
    setQuizQuestions([]);
    setSelectedNote(null);
    setSelectedQuiz(null);
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
                    quizId={selectedQuiz?.id}
                  />
                )}
              </div>
            </div>
          )}

          {activeTab === "past-quizzes" && (
            <div className="max-w-6xl mx-auto animate-fade-in">
              <div className="relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-24 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -top-6 left-[45%] -translate-x-1/2 w-24 h-24 bg-secondary/10 rounded-full blur-3xl" />
                <QuizList onSelectQuiz={handleSelectSavedQuiz} />
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
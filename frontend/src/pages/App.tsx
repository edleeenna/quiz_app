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
    setActiveTab("past-quizzes");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 container py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          {activeTab === "notes" && (
            <div className="space-y-16 animate-fade-in">
              <NotesUploader addNote={addNote} />
              <NotesList 
                notes={notes}
                deleteNote={deleteNote}
                selectNoteForQuiz={selectNoteForQuiz}
              />
            </div>
          )}
          
          {activeTab === "quiz" && (
            <div className="animate-fade-in">
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
          )}

          {activeTab === "past-quizzes" && (
            <div className="animate-fade-in">
              <QuizList 
                onSelectQuiz={handleSelectSavedQuiz} 
                setActiveTab={setActiveTab}
              />
            </div>
          )}
        </div>
      </main>
      
      <footer className="py-12 border-t border-border/40 bg-white/50 dark:bg-black/20 backdrop-blur-xl">
        <div className="container text-center">
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            QuizNotes © {new Date().getFullYear()} - Empowering learners with AI-driven education technology
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
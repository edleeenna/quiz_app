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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="container py-8 md:py-12">
        {activeTab === "notes" && (
          <div className="space-y-12">
            <NotesUploader addNote={addNote} />
            <NotesList 
              notes={notes}
              deleteNote={deleteNote}
              selectNoteForQuiz={selectNoteForQuiz}
            />
          </div>
        )}
        
        {activeTab === "quiz" && (
          <div className="space-y-8">
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
          <QuizList 
            onSelectQuiz={handleSelectSavedQuiz} 
            setActiveTab={setActiveTab}
          />
        )}
      </main>
      
      <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Q</span>
              </div>
              <div>
                <p className="font-semibold text-slate-900">QuizNotes</p>
                <p className="text-sm text-slate-500">AI-Powered Learning Platform</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-slate-600">
                © {new Date().getFullYear()} QuizNotes. Transform your notes into quizzes.
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Powered by advanced AI technology
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
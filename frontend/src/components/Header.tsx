
import React from 'react';
import { FileText, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  activeTab: "notes" | "quiz";
  setActiveTab: (tab: "notes" | "quiz") => void;
}

const Header = ({ activeTab, setActiveTab }: HeaderProps) => {
  return (
    <header className="w-full py-4 border-b border-border bg-card">
      <div className="container flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-2">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold">QuizNotes</h1>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={activeTab === "notes" ? "default" : "outline"}
            onClick={() => setActiveTab("notes")}
            className="flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>Notes</span>
          </Button>
          <Button
            variant={activeTab === "quiz" ? "default" : "outline"}
            onClick={() => setActiveTab("quiz")}
            className="flex items-center space-x-2"
          >
            <BookOpen className="h-4 w-4" />
            <span>Quiz</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

import React from "react";
import { FileText, BookOpen, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  activeTab: "notes" | "quiz" | "quiz-list";
  setActiveTab: (tab: "notes" | "quiz" | "quiz-list") => void;
}

const Header = ({ activeTab, setActiveTab }: HeaderProps) => {
  return (
    <header className="w-full py-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            className="bg-gradient-to-r from-primary to-secondary rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary group transition-transform hover:scale-105"
            aria-label="Go to Notes"
            onClick={() => setActiveTab("notes")}
          >
            <BookOpen className="h-6 w-6 text-white transition-transform group-hover:scale-110" />
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            QuizNotes
          </h1>
        </div>

        <div className="flex space-x-2">
          <Button
            variant={activeTab === "notes" ? "default" : "outline"}
            onClick={() => setActiveTab("notes")}
            className={`flex items-center space-x-2 transition-all hover:-translate-y-0.5 ${
              activeTab === "notes" && "bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Notes</span>
          </Button>
          <Button
            variant={activeTab === "quiz-list" ? "default" : "outline"}
            onClick={() => setActiveTab("quiz-list")}
            className={`flex items-center space-x-2 transition-all hover:-translate-y-0.5 ${
              activeTab === "quiz-list" && "bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            }`}
          >
            <List className="h-4 w-4" />
            <span>My Quizzes</span>
          </Button>
          {activeTab === "quiz" && (
            <Button
              variant="default"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 flex items-center space-x-2 transition-all hover:-translate-y-0.5"
            >
              <BookOpen className="h-4 w-4" />
              <span>Quiz</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
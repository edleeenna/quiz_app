import React from "react";
import { FileText, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HeaderProps {
  activeTab: "notes" | "quiz";
  setActiveTab: (tab: "notes" | "quiz") => void;
}

const Header = ({ activeTab, setActiveTab }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-black/50 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="flex items-center space-x-2 transition-opacity hover:opacity-80"
          >
            <BookOpen className="h-6 w-6 text-theme-blue" />
            <span className="text-xl font-bold text-white">QuizNotes</span>
          </Link>
        </div>

        <div className="flex space-x-2">
          <Button
            variant={activeTab === "notes" ? "default" : "ghost"}
            onClick={() => setActiveTab("notes")}
            className="flex items-center space-x-2 transition-all hover:-translate-y-0.5"
          >
            <FileText className="h-4 w-4" />
            <span>Notes</span>
          </Button>
          <Button
            variant={activeTab === "quiz" ? "default" : "ghost"}
            onClick={() => setActiveTab("quiz")}
            className="flex items-center space-x-2 transition-all hover:-translate-y-0.5"
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
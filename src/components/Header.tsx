import React from "react";
import { FileText, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

interface HeaderProps {
  activeTab?: "notes" | "quiz";
  setActiveTab?: (tab: "notes" | "quiz") => void;
}

const Header = ({ activeTab, setActiveTab }: HeaderProps) => {
  const location = useLocation();
  const isAppPage = location.pathname === "/app";

  return (
    <header className="w-full py-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary group transition-transform hover:scale-105">
            <BookOpen className="h-6 w-6 text-white transition-transform group-hover:scale-110" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            QuizNotes
          </h1>
        </Link>

        <div className="flex items-center space-x-4">
          <nav className="flex space-x-4 mr-4">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:-translate-y-0.5 transform duration-200 ${
                location.pathname === "/" 
                  ? "text-foreground after:content-[''] after:block after:h-0.5 after:bg-gradient-to-r after:from-primary after:to-secondary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Home
            </Link>
            <Link 
              to="/app" 
              className={`text-sm font-medium transition-colors hover:-translate-y-0.5 transform duration-200 ${
                location.pathname === "/app" 
                  ? "text-foreground after:content-[''] after:block after:h-0.5 after:bg-gradient-to-r after:from-primary after:to-secondary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              App
            </Link>
          </nav>

          {isAppPage && setActiveTab && (
            <div className="flex space-x-2">
              <Button
                variant={activeTab === "notes" ? "default" : "outline"}
                onClick={() => setActiveTab("notes")}
                className="flex items-center space-x-2 transition-all hover:-translate-y-0.5"
              >
                <FileText className="h-4 w-4" />
                <span>Notes</span>
              </Button>
              <Button
                variant={activeTab === "quiz" ? "default" : "outline"}
                onClick={() => setActiveTab("quiz")}
                className="flex items-center space-x-2 transition-all hover:-translate-y-0.5"
              >
                <BookOpen className="h-4 w-4" />
                <span>Quiz</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
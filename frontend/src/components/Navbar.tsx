import { Link, useLocation } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavbarProps {
  activeTab?: "notes" | "quiz" | "past-quizzes";
  setActiveTab?: (tab: "notes" | "quiz" | "past-quizzes") => void;
}

const Navbar = ({ activeTab, setActiveTab }: NavbarProps) => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isApp = location.pathname === "/app";

  return (
    <header className="w-full py-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <button
              className="bg-gradient-to-r from-primary to-secondary rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary group transition-transform hover:scale-105"
              aria-label="Go to Home"
            >
              <BookOpen className="h-6 w-6 text-white transition-transform group-hover:scale-110" />
            </button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              QuizNotes
            </h1>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {isApp && setActiveTab && (
            <div className="flex space-x-2">
              <Button
                variant={activeTab === "notes" ? "default" : "outline"}
                onClick={() => setActiveTab("notes")}
                className={cn(
                  "flex items-center space-x-2 transition-all hover:-translate-y-0.5",
                  activeTab === "notes" && "bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                )}
              >
                <BookOpen className="h-4 w-4" />
                <span>Notes</span>
              </Button>
              <Button
                variant={activeTab === "quiz" ? "default" : "outline"}
                onClick={() => setActiveTab("quiz")}
                className={cn(
                  "flex items-center space-x-2 transition-all hover:-translate-y-0.5",
                  activeTab === "quiz" && "bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                )}
              >
                <BookOpen className="h-4 w-4" />
                <span>Create Quiz</span>
              </Button>
              <Button
                variant={activeTab === "past-quizzes" ? "default" : "outline"}
                onClick={() => setActiveTab("past-quizzes")}
                className={cn(
                  "flex items-center space-x-2 transition-all hover:-translate-y-0.5",
                  activeTab === "past-quizzes" && "bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                )}
              >
                <BookOpen className="h-4 w-4" />
                <span>Past Quizzes</span>
              </Button>
            </div>
          )}

          {isHome && (
            <Link to="/app">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                Get Started
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
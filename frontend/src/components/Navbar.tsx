import { Link, useLocation } from "react-router-dom";
import { BookOpen, Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface NavbarProps {
  activeTab?: "notes" | "quiz" | "past-quizzes";
  setActiveTab?: (tab: "notes" | "quiz" | "past-quizzes") => void;
}

const Navbar = ({ activeTab, setActiveTab }: NavbarProps) => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isApp = location.pathname === "/quiz-notes";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-2.5">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              QuizNotes
            </h1>
            <span className="text-xs text-muted-foreground -mt-1">AI-Powered Learning</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {isApp && setActiveTab && (
            <nav className="flex items-center space-x-1 bg-muted/50 rounded-full p-1">
              {[
                { id: "notes", label: "Notes", icon: BookOpen },
                { id: "quiz", label: "Quiz", icon: Sparkles },
                { id: "past-quizzes", label: "History", icon: BookOpen }
              ].map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  variant={activeTab === id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(id as any)}
                  className={cn(
                    "flex items-center space-x-2 rounded-full transition-all",
                    activeTab === id 
                      ? "bg-white shadow-sm text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Button>
              ))}
            </nav>
          )}

          {isHome && (
            <Link to="/quiz-notes">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                Get Started
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <div className="container py-4 space-y-3">
            {isApp && setActiveTab && (
              <>
                {[
                  { id: "notes", label: "Notes", icon: BookOpen },
                  { id: "quiz", label: "Quiz", icon: Sparkles },
                  { id: "past-quizzes", label: "History", icon: BookOpen }
                ].map(({ id, label, icon: Icon }) => (
                  <Button
                    key={id}
                    variant={activeTab === id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      setActiveTab(id as any);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {label}
                  </Button>
                ))}
              </>
            )}

            {isHome && (
              <Link to="/quiz-notes" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
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
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 rounded-xl">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold gradient-text">QuizNotes</h1>
            <span className="text-xs text-muted-foreground -mt-1">AI-Powered Learning</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {isApp && setActiveTab && (
            <nav className="flex items-center space-x-1 bg-muted/50 p-1 rounded-xl">
              {[
                { id: "notes", label: "Notes", icon: BookOpen },
                { id: "quiz", label: "Quiz", icon: Sparkles },
                { id: "past-quizzes", label: "History", icon: BookOpen },
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center space-x-2 transition-all duration-200",
                    activeTab === tab.id
                      ? "bg-background shadow-sm"
                      : "hover:bg-background/50"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </Button>
              ))}
            </nav>
          )}

          {isHome && (
            <Link to="/quiz-notes">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                <Sparkles className="h-4 w-4 mr-2" />
                Get Started
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <div className="container py-4 space-y-3">
            {isApp && setActiveTab && (
              <div className="space-y-2">
                {[
                  { id: "notes", label: "Notes", icon: BookOpen },
                  { id: "quiz", label: "Quiz", icon: Sparkles },
                  { id: "past-quizzes", label: "History", icon: BookOpen },
                ].map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <tab.icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </Button>
                ))}
              </div>
            )}

            {isHome && (
              <Link to="/quiz-notes" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <Sparkles className="h-4 w-4 mr-2" />
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
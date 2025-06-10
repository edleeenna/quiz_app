import { Link, useLocation } from "react-router-dom";
import { BookOpen, Sparkles, Menu, X, Home, FileText, Brain, History } from "lucide-react";
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

  const navItems = [
    { id: "notes", label: "Notes", icon: FileText },
    { id: "quiz", label: "Quiz", icon: Brain },
    { id: "past-quizzes", label: "History", icon: History },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
            <div className="relative bg-gradient-to-r from-violet-600 to-indigo-600 p-3 rounded-2xl shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold gradient-text">QuizNotes</h1>
            <span className="text-xs text-muted-foreground -mt-1 font-medium">AI Learning Platform</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {isApp && setActiveTab && (
            <div className="flex items-center space-x-2 bg-muted/30 p-1.5 rounded-2xl border border-border/50">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab(item.id as any)}
                  className={cn(
                    "flex items-center space-x-2 transition-all duration-300 relative px-4 py-2 rounded-xl",
                    activeTab === item.id
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg hover:shadow-xl"
                      : "hover:bg-background/80 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                  {activeTab === item.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-xl blur-sm" />
                  )}
                </Button>
              ))}
            </div>
          )}

          {isHome && (
            <Link to="/quiz-notes">
              <Button className="btn-gradient px-6 py-2 rounded-xl font-medium">
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
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl">
          <div className="container py-4 space-y-3">
            {isApp && setActiveTab && (
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start transition-all duration-300 rounded-xl",
                      activeTab === item.id
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700"
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                ))}
              </div>
            )}

            {isHome && (
              <Link to="/quiz-notes" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full btn-gradient rounded-xl">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
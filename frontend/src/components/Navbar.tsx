import { Link, useLocation } from "react-router-dom";
import { BookOpen, Sparkles, Menu, X, Home, FileText, Brain, History, Cpu, Zap } from "lucide-react";
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
    { id: "notes", label: "DATA", icon: FileText, color: "text-cyan-400" },
    { id: "quiz", label: "NEURAL", icon: Brain, color: "text-magenta-400" },
    { id: "past-quizzes", label: "ARCHIVE", icon: History, color: "text-accent" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-cyan-500/30 bg-card/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-300 animate-glow-pulse" />
            <div className="relative bg-gradient-to-r from-cyan-500 to-magenta-500 p-3 rounded-xl border border-cyan-500/50">
              <Cpu className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-display font-bold neon-text">QUIZ.AI</h1>
            <span className="text-xs text-cyan-400 -mt-1 font-tech font-medium">NEURAL SYSTEM</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {isApp && setActiveTab && (
            <div className="flex items-center space-x-2 cyber-card p-1.5 rounded-xl border border-cyan-500/30">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab(item.id as any)}
                  className={cn(
                    "flex items-center space-x-2 transition-all duration-300 relative px-4 py-2 rounded-lg font-tech font-semibold",
                    activeTab === item.id
                      ? "bg-gradient-to-r from-cyan-500/20 to-magenta-500/20 text-white border border-cyan-500/50 animate-glow-pulse"
                      : `hover:bg-cyan-500/10 ${item.color} hover:text-cyan-300`
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {activeTab === item.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-magenta-500/10 rounded-lg blur-sm" />
                  )}
                </Button>
              ))}
            </div>
          )}

          {isHome && (
            <Link to="/quiz-notes">
              <Button className="cyber-button px-6 py-2 rounded-xl font-tech font-bold">
                <Zap className="h-4 w-4 mr-2" />
                NEURAL LINK
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden p-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-cyan-500/30 cyber-card">
          <div className="container py-4 space-y-3">
            {isApp && setActiveTab && (
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start transition-all duration-300 rounded-xl font-tech font-semibold",
                      activeTab === item.id
                        ? "bg-gradient-to-r from-cyan-500/20 to-magenta-500/20 text-white border border-cyan-500/50"
                        : `hover:bg-cyan-500/10 ${item.color}`
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
                <Button className="w-full cyber-button rounded-xl font-tech font-bold">
                  <Zap className="h-4 w-4 mr-2" />
                  NEURAL LINK
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
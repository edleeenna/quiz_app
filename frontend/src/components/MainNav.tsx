import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

const MainNav = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <BookOpen className="h-6 w-6 text-theme-blue" />
            <span className="text-xl font-bold text-white">QuizNotes</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/#features" className="text-gray-400 hover:text-white transition-colors">
              Features
            </Link>
            <Link to="/#how-it-works" className="text-gray-400 hover:text-white transition-colors">
              How It Works
            </Link>
            <Link to="/#about" className="text-gray-400 hover:text-white transition-colors">
              About
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" className="text-gray-400 hover:text-white">
              <Link to="/app">
                Sign In
              </Link>
            </Button>
            <Button asChild className="bg-theme-blue hover:bg-theme-blue/90">
              <Link to="/app">
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNav;
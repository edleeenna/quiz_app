import { BookOpen, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <div className="container px-4 py-24 mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-fade-in">
          Turn Your Notes Into Quizzes
        </h1>
        <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
          Upload your study materials and let AI generate personalized quizzes to help you learn more effectively.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
            <Link to="/app">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border bg-card">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Upload Notes</h3>
            <p className="text-muted-foreground">
              Import your study materials in various formats including text and PDF files.
            </p>
          </div>
          <div className="p-6 rounded-xl border bg-card">
            <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI-Generated Quizzes</h3>
            <p className="text-muted-foreground">
              Our AI analyzes your notes and creates relevant multiple-choice questions.
            </p>
          </div>
          <div className="p-6 rounded-xl border bg-card">
            <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-accent"
              >
                <path d="M12 2v20M2 12h20" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Add Examples</h3>
            <p className="text-muted-foreground">
              Guide the AI by providing example questions to match your preferred style.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container px-4 py-6 text-center text-sm text-muted-foreground">
          QuizNotes © {new Date().getFullYear()} - Turn your notes into quizzes
        </div>
      </footer>
    </div>
  );
};

export default Home;
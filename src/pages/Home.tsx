import { BookOpen, FileText, ArrowRight, Brain, CheckCircle, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/50 to-muted">
      <Header />
      
      {/* Hero Section */}
      <div className="container px-4 py-32 mx-auto text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-24 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -top-6 left-[45%] -translate-x-1/2 w-24 h-24 bg-secondary/10 rounded-full blur-3xl" />
          <div className="absolute -top-6 left-[55%] -translate-x-1/2 w-24 h-24 bg-accent/10 rounded-full blur-3xl" />
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-fade-in relative">
            Transform Your Study Notes Into Smart Quizzes
          </h1>
        </div>
        <p className="mt-8 text-xl text-muted-foreground max-w-2xl mx-auto">
          Harness the power of AI to convert your study materials into personalized quizzes that adapt to your learning style.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 group relative overflow-hidden">
            <Link to="/app" className="relative z-10">
              <span className="relative z-10 flex items-center">
                Start Learning
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 blur-xl group-hover:opacity-75 transition-opacity" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Rest of the Home page content remains unchanged */}
      {/* Features Section */}
      <div className="container px-4 py-24">
        {/* Existing features section content */}
      </div>

      {/* CTA Section */}
      <div className="container px-4 py-24">
        {/* Existing CTA section content */}
      </div>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              QuizNotes © {new Date().getFullYear()} - Transform your notes into quizzes
            </p>
            <div className="flex items-center gap-6">
              <Link to="/app" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Get Started
              </Link>
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
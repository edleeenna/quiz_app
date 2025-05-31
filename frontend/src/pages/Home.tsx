import { BookOpen, FileText, ArrowRight, Brain, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/50 to-muted">
      <Navbar />
      
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
          Harness the power of AI to convert your study materials into personalized quizzes.
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

      {/* Features Section */}
      <div className="container px-4 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="group p-8 rounded-xl border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all hover:shadow-lg hover:-translate-y-1">
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Upload Notes</h3>
            <p className="text-muted-foreground leading-relaxed">
              Import your study materials in various formats including text, DOCX and PDF files or enter your notes manually. 
            </p>
          </div>

          <div className="group p-8 rounded-xl border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all hover:shadow-lg hover:-translate-y-1">
            <div className="h-14 w-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Brain className="h-7 w-7 text-secondary" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Processing</h3>
            <p className="text-muted-foreground leading-relaxed">
            Our AI analyzes your notes and creates relevant multiple-choice questions tailored to your content.
            </p>
          </div>

          <div className="group p-8 rounded-xl border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all hover:shadow-lg hover:-translate-y-1">
            <div className="h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <CheckCircle className="h-7 w-7 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-3">Take Quizzes</h3>
            <p className="text-muted-foreground leading-relaxed">
              Test your knowledge with interactive quizzes and track your progress as you learn and improve.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container px-4 py-24">
        <div className="relative rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-12 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="relative text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join a singular student who is already using AI-powered quizzes to enhance their study experience.
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 group">
              <Link to="/app">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              QuizNotes © {new Date().getFullYear()} - Transform your notes into quizzes
            </p>
       
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
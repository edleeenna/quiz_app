import { BookOpen, FileText, ArrowRight, Brain, CheckCircle, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import MainNav from '@/components/MainNav';

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <MainNav />
      
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center pt-20">
        {/* Animated background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(67,97,238,0.15),rgba(114,9,183,0.15))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.9),transparent_50%,rgba(0,0,0,0.9))]" />
        
        {/* Animated circles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full mix-blend-screen animate-pulse-light"
              style={{
                background: `radial-gradient(circle at center, ${
                  ['#4361ee', '#7209b7', '#4cc9f0'][i % 3]
                }33, transparent)`,
                width: `${Math.random() * 400 + 100}px`,
                height: `${Math.random() * 400 + 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 5}s`,
              }}
            />
          ))}
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Transform Your Notes Into
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-theme-blue via-theme-purple to-theme-lightBlue">
                Interactive Quizzes
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
              Harness the power of AI to convert your study materials into engaging quizzes that adapt to your learning style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-theme-blue hover:bg-theme-blue/90 text-lg h-14 px-8">
                <Link to="/app">
                  Start Learning
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative bg-black py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(67,97,238,0.15),transparent_50%)]" />
        <div className="container relative">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-20">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-theme-blue to-theme-purple">
              How It Works
            </span>
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Upload,
                title: "Upload Notes",
                description: "Import your study materials in various formats. Our system processes your content intelligently.",
                color: "theme-blue"
              },
              {
                icon: Brain,
                title: "AI Processing",
                description: "Advanced AI analyzes your notes and creates relevant multiple-choice questions tailored to your content.",
                color: "theme-purple"
              },
              {
                icon: CheckCircle,
                title: "Take Quizzes",
                description: "Test your knowledge with interactive quizzes and track your progress as you learn.",
                color: "theme-lightBlue"
              }
            ].map((feature, i) => (
              <div key={i} className="group relative">
                <div className={`absolute inset-0 bg-${feature.color}/10 blur-xl rounded-3xl group-hover:blur-2xl transition-all duration-500`} />
                <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 h-full transition-transform duration-500 hover:-translate-y-2">
                  <div className={`h-16 w-16 rounded-2xl bg-${feature.color}/20 flex items-center justify-center mb-6`}>
                    <feature.icon className={`h-8 w-8 text-${feature.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-black py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(67,97,238,0.15),transparent_50%)]" />
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Ready to Transform Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-theme-blue to-theme-purple">
                Learning Experience?
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Join thousands of students who are already using AI-powered quizzes to enhance their study experience.
            </p>
            <Button asChild size="lg" className="bg-theme-purple hover:bg-theme-purple/90 text-lg h-14 px-8">
              <Link to="/app">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400">
              QuizNotes © {new Date().getFullYear()} - Transform your notes into quizzes
            </p>
            <div className="flex items-center gap-8">
              <Link to="/app" className="text-gray-400 hover:text-white transition-colors">
                Get Started
              </Link>
              <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                Features
              </a>
              <a href="#about" className="text-gray-400 hover:text-white transition-colors">
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
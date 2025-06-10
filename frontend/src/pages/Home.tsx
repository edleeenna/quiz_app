import { BookOpen, FileText, ArrowRight, Brain, CheckCircle, Sparkles, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container px-4 py-20 md:py-32 mx-auto text-center relative">
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl floating-animation" />
          <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl floating-animation" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl floating-animation" style={{ animationDelay: '4s' }} />
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-8 animate-fade-in">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Learning Revolution
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 animate-slide-up">
              Transform Your
              <span className="gradient-text block">Study Notes</span>
              Into Smart Quizzes
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Harness the power of AI to convert your study materials into personalized, interactive quizzes that adapt to your learning style.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button asChild size="lg" className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <Link to="/quiz-notes">
                  <Zap className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Start Learning Now
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" className="group border-2 hover:bg-muted/50 transition-all duration-300">
                <BookOpen className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                View Demo
              </Button>
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="space-y-2">
                <div className="text-3xl font-bold gradient-text">10K+</div>
                <div className="text-sm text-muted-foreground">Questions Generated</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold gradient-text">95%</div>
                <div className="text-sm text-muted-foreground">Accuracy Rate</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold gradient-text">24/7</div>
                <div className="text-sm text-muted-foreground">AI Availability</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to transform your learning experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: FileText,
                title: "Upload Your Notes",
                description: "Import study materials in various formats including text, DOCX, and PDF files, or enter notes manually with optional example questions.",
                color: "from-blue-500 to-cyan-500",
                delay: "0s"
              },
              {
                icon: Brain,
                title: "AI Processing",
                description: "Our advanced AI analyzes your content and creates relevant, challenging multiple-choice questions tailored to your specific material.",
                color: "from-purple-500 to-pink-500",
                delay: "0.2s"
              },
              {
                icon: Target,
                title: "Smart Quizzes",
                description: "Take interactive quizzes, track your progress, and identify areas for improvement with detailed analytics and insights.",
                color: "from-indigo-500 to-blue-500",
                delay: "0.4s"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative animate-fade-in"
                style={{ animationDelay: feature.delay }}
              >
                <div className="glass-card p-8 rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} />
                  
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 group-hover:gradient-text transition-all duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ backgroundImage: `linear-gradient(to right, ${feature.color.split(' ')[1]}, ${feature.color.split(' ')[3]})` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Why Choose <span className="gradient-text">QuizNotes</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-16">
              Experience the future of personalized learning
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  description: "Generate comprehensive quizzes in seconds, not hours"
                },
                {
                  icon: Brain,
                  title: "AI-Powered",
                  description: "Advanced algorithms ensure relevant and challenging questions"
                },
                {
                  icon: Target,
                  title: "Personalized",
                  description: "Adaptive learning that adjusts to your knowledge level"
                },
                {
                  icon: CheckCircle,
                  title: "Progress Tracking",
                  description: "Detailed analytics to monitor your learning journey"
                }
              ].map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4 text-left animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex-shrink-0 p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10" />
        <div className="container px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass-card p-12 rounded-3xl">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Ready to <span className="gradient-text">Transform</span> Your Learning?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of students who are already using AI-powered quizzes to enhance their study experience and achieve better results.
              </p>
              <Button asChild size="lg" className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <Link to="/quiz-notes">
                  <Sparkles className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Start Your Journey
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/40 bg-background/50 backdrop-blur">
        <div className="container px-4 text-center">
          <p className="text-muted-foreground">
            QuizNotes © {new Date().getFullYear()} - Empowering learners with AI-driven education
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
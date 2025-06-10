import { BookOpen, FileText, ArrowRight, Brain, CheckCircle, Sparkles, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="container px-4 py-24 md:py-32 mx-auto text-center relative">
          {/* Floating elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
          <div className="absolute top-40 right-10 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000" />
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-500" />
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-blue-800 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Quiz Generation
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 animate-slide-up">
              Transform Your
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Study Notes
              </span>
              Into Smart Quizzes
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in delay-200">
              Harness the power of AI to convert your study materials into personalized, interactive quizzes that adapt to your learning style.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in delay-300">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group px-8 py-4 text-lg">
                <Link to="/quiz-notes">
                  <span className="flex items-center">
                    Start Learning Now
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" className="border-2 hover:bg-slate-50 px-8 py-4 text-lg">
                Watch Demo
              </Button>
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center animate-fade-in delay-500">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-3">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-slate-900">10x</div>
                <div className="text-slate-600">Faster Learning</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-3">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-slate-900">95%</div>
                <div className="text-slate-600">Accuracy Rate</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-3">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-slate-900">AI</div>
                <div className="text-slate-600">Powered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Three simple steps to transform your learning experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: FileText,
                title: "Upload Your Notes",
                description: "Import study materials in various formats including text, DOCX, and PDF files. Or enter your notes manually with optional example questions.",
                color: "from-blue-500 to-blue-600",
                bgColor: "bg-blue-50",
                step: "01"
              },
              {
                icon: Brain,
                title: "AI Processing",
                description: "Our advanced AI analyzes your content and generates relevant, challenging multiple-choice questions tailored to your material.",
                color: "from-purple-500 to-purple-600",
                bgColor: "bg-purple-50",
                step: "02"
              },
              {
                icon: CheckCircle,
                title: "Take Smart Quizzes",
                description: "Test your knowledge with interactive quizzes, track your progress, and identify areas that need more attention.",
                color: "from-green-500 to-green-600",
                bgColor: "bg-green-50",
                step: "03"
              }
            ].map((feature, index) => (
              <div key={index} className="relative group">
                <div className={`absolute inset-0 ${feature.bgColor} rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300`} />
                <div className="relative bg-white rounded-3xl p-8 shadow-lg group-hover:shadow-xl transition-all duration-300 border border-slate-100">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <span className="text-6xl font-bold text-slate-100 group-hover:text-slate-200 transition-colors">
                      {feature.step}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
                Why Choose QuizNotes?
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Experience the future of personalized learning
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Zap, title: "Lightning Fast", desc: "Generate quizzes in seconds" },
                { icon: Brain, title: "AI-Powered", desc: "Smart question generation" },
                { icon: Target, title: "Personalized", desc: "Tailored to your content" },
                { icon: CheckCircle, title: "Progress Tracking", desc: "Monitor your improvement" }
              ].map((benefit, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 card-hover">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-slate-900">{benefit.title}</h3>
                  <p className="text-slate-600">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-2xl mx-auto">
              Join thousands of students who are already using AI-powered quizzes to enhance their study experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-4 text-lg font-semibold">
                <Link to="/quiz-notes">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 text-lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-white">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-2">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg">QuizNotes</div>
                <div className="text-sm text-slate-400">AI-Powered Learning</div>
              </div>
            </div>
            <div className="text-slate-400 text-center md:text-right">
              <p>© {new Date().getFullYear()} QuizNotes. Transform your notes into quizzes.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
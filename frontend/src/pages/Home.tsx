import { BookOpen, FileText, ArrowRight, Brain, CheckCircle, Sparkles, Zap, Target, Star, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="container px-4 py-20 md:py-32 mx-auto text-center relative">
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-violet-500/20 rounded-full blur-xl floating-element" />
          <div className="absolute top-40 right-20 w-32 h-32 bg-indigo-500/20 rounded-full blur-xl floating-element" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-purple-500/20 rounded-full blur-xl floating-element" style={{ animationDelay: '4s' }} />
          
          <div className="relative z-10 max-w-5xl mx-auto">
           
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 animate-slide-up leading-tight">
              Transform Your
              <span className="gradient-text block mt-2">Study Experience</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto mb-12 animate-fade-in leading-relaxed" style={{ animationDelay: '0.2s' }}>
              Harness the power of AI to convert your study materials into personalised, interactive quizzes that adapt to your learning style and accelerate your progress.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button asChild size="lg" className="group btn-gradient px-8 py-4 text-lg rounded-2xl shadow-2xl hover:shadow-violet-500/25 transform hover:scale-105 transition-all duration-300">
                <Link to="/quiz-notes">
                  <Zap className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Start Learning Now
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
            
            </div>
            
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
              {[
                { icon: Users, value: "10K+", label: "Active Learners" },
                { icon: TrendingUp, value: "95%", label: "Success Rate" },
                { icon: Star, value: "4.9/5", label: "User Rating" }
              ].map((stat, index) => (
                <div key={index} className="space-y-3 p-6 rounded-2xl bg-white/50 dark:bg-black/20 backdrop-blur-xl border border-white/20 shadow-lg">
                  <stat.icon className="h-8 w-8 mx-auto text-violet-600" />
                  <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative bg-white/50 dark:bg-black/20">
        <div className="container px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Three simple steps to revolutionize your learning experience with AI-powered personalization
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {[
              {
                icon: FileText,
                title: "Upload Your Content",
                description: "Import study materials in various formats including text, DOCX, and PDF files, or create notes manually with optional example questions to guide the AI.",
                color: "from-blue-500 to-cyan-500",
                delay: "0s",
                step: "01"
              },
              {
                icon: Brain,
                title: "AI Analysis",
                description: "Our advanced AI analyses your content using natural language processing to understand context and create relevant, challenging questions tailored to your material.",
                color: "from-violet-500 to-purple-500",
                delay: "0.2s",
                step: "02"
              },
              {
                icon: Target,
                title: "Smart Assessment",
                description: "Take interactive quizzes with instant feedback, track your progress with detailed analytics, and identify areas for improvement with personalised insights.",
                color: "from-indigo-500 to-blue-500",
                delay: "0.4s",
                step: "03"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative animate-fade-in"
                style={{ animationDelay: feature.delay }}
              >
                <div className="relative p-8 rounded-3xl bg-white/80 dark:bg-black/20 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden">
                  <div className="absolute top-6 right-6 text-6xl font-bold text-slate-100 dark:text-slate-800 opacity-50">
                    {feature.step}
                  </div>
                  
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 group-hover:gradient-text transition-all duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-bold mb-8">
                Why Choose <span className="gradient-text">QuizNotes</span>?
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Experience the future of personalised learning with cutting-edge AI technology
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              {[
                {
                  icon: Zap,
                  title: "Lightning Fast Generation",
                  description: "Create comprehensive quizzes in seconds, not hours, with our optimized AI algorithms"
                },
                {
                  icon: Brain,
                  title: "Advanced AI Intelligence",
                  description: "State-of-the-art natural language processing ensures relevant and challenging questions"
                },
                {
                  icon: Target,
                  title: "Personalised Learning",
                  description: "Adaptive algorithms that adjust to your knowledge level and learning preferences"
                },
                {
                  icon: CheckCircle,
                  title: "Comprehensive Analytics",
                  description: "Detailed progress tracking and insights to optimize your learning journey"
                }
              ].map((benefit, index) => (
                <div key={index} className="flex items-start space-x-6 p-6 rounded-2xl bg-white/80 dark:bg-black/20 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex-shrink-0 p-3 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl shadow-lg">
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-indigo-600/10" />
        <div className="absolute inset-0 bg-dot-pattern opacity-20" />
        <div className="container px-4 relative">
          <div className="max-w-5xl mx-auto text-center">
            <div className="p-12 rounded-3xl bg-white/80 dark:bg-black/20 backdrop-blur-xl border border-white/20 shadow-2xl">
              <h2 className="text-4xl md:text-6xl font-bold mb-8">
                Ready to <span className="gradient-text">Transform</span> Your Learning?
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Join thousands of students who are already using AI-powered quizzes to enhance their study experience, improve retention, and achieve better academic results.
              </p>
              <Button asChild size="lg" className="btn-gradient px-12 py-6 text-xl rounded-2xl shadow-2xl hover:shadow-violet-500/25 transform hover:scale-105 transition-all duration-300 group">
                <Link to="/quiz-notes">
                  <Sparkles className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
                  Start Your Journey
                  <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/40 bg-white/50 dark:bg-black/20 backdrop-blur-xl">
        <div className="container px-4 text-center">
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            QuizNotes © {new Date().getFullYear()} - Empowering learners with AI-driven education technology
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
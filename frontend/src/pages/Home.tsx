import { BookOpen, FileText, ArrowRight, Brain, CheckCircle, Sparkles, Zap, Target, Star, Users, TrendingUp, Cpu, Shield, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen bg-background cyber-grid">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 matrix-bg opacity-30" />
        
        {/* Floating cyber elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl animate-float-cyber" />
        <div className="absolute top-40 right-20 w-40 h-40 bg-magenta-500/10 rounded-full blur-xl animate-float-cyber" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-accent/10 rounded-full blur-xl animate-float-cyber" style={{ animationDelay: '4s' }} />
        
        <div className="container px-4 py-20 md:py-32 mx-auto text-center relative">
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="inline-flex items-center px-6 py-3 cyber-card rounded-full text-cyan-400 text-sm font-semibold mb-8 animate-cyber-fade border border-cyan-500/50 data-stream">
              <Cpu className="h-4 w-4 mr-2" />
              POWERED BY ADVANCED AI NEURAL NETWORKS
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black mb-8 animate-cyber-slide leading-tight">
              NEURAL
              <span className="neon-text block mt-2 pulse-neon">QUIZ.AI</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-cyan-300 max-w-4xl mx-auto mb-12 animate-cyber-fade leading-relaxed font-tech" style={{ animationDelay: '0.2s' }}>
              HARNESS QUANTUM-POWERED AI TO TRANSFORM YOUR STUDY MATERIALS INTO 
              <span className="text-magenta-400 font-bold"> ADAPTIVE NEURAL QUIZZES</span> THAT EVOLVE WITH YOUR LEARNING PATTERNS
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-cyber-fade" style={{ animationDelay: '0.4s' }}>
              <Button asChild size="lg" className="group cyber-button px-8 py-4 text-lg rounded-xl font-bold transform hover:scale-105 transition-all duration-300">
                <Link to="/quiz-notes">
                  <Rocket className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                  INITIALIZE NEURAL LINK
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" className="group border-2 border-cyan-500/50 hover:border-cyan-400 bg-transparent hover:bg-cyan-500/10 text-cyan-400 transition-all duration-300 px-8 py-4 text-lg rounded-xl font-bold">
                <Shield className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                SYSTEM DEMO
              </Button>
            </div>
            
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center animate-cyber-fade" style={{ animationDelay: '0.6s' }}>
              {[
                { icon: Users, value: "10K+", label: "NEURAL NODES", color: "text-cyan-400" },
                { icon: TrendingUp, value: "99.7%", label: "EFFICIENCY RATE", color: "text-magenta-400" },
                { icon: Star, value: "5.0/5", label: "QUANTUM RATING", color: "text-accent" }
              ].map((stat, index) => (
                <div key={index} className="space-y-3 p-6 rounded-xl cyber-card cyber-card-hover hologram-effect">
                  <stat.icon className={`h-8 w-8 mx-auto ${stat.color}`} />
                  <div className={`text-3xl font-bold font-display ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-tech font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="container px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-display font-black mb-8">
              NEURAL <span className="neon-text">PROTOCOL</span>
            </h2>
            <p className="text-xl text-cyan-300 max-w-3xl mx-auto leading-relaxed font-tech">
              THREE-PHASE QUANTUM LEARNING ACCELERATION SYSTEM
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {[
              {
                icon: FileText,
                title: "DATA INJECTION",
                description: "Upload neural data streams in multiple formats. Our quantum processors analyze molecular-level content patterns to extract maximum learning potential.",
                color: "from-cyan-500 to-blue-500",
                delay: "0s",
                step: "01",
                accent: "text-cyan-400"
              },
              {
                icon: Brain,
                title: "AI SYNTHESIS",
                description: "Advanced neural networks process your data through quantum algorithms, creating adaptive question matrices that evolve with your cognitive patterns.",
                color: "from-magenta-500 to-purple-500",
                delay: "0.2s",
                step: "02",
                accent: "text-magenta-400"
              },
              {
                icon: Target,
                title: "NEURAL ASSESSMENT",
                description: "Experience hyper-intelligent quizzes with real-time adaptation, quantum feedback loops, and predictive analytics for optimal learning acceleration.",
                color: "from-accent to-green-500",
                delay: "0.4s",
                step: "03",
                accent: "text-accent"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative animate-cyber-fade"
                style={{ animationDelay: feature.delay }}
              >
                <div className="relative p-8 rounded-2xl cyber-card cyber-card-hover overflow-hidden data-stream">
                  <div className="absolute top-6 right-6 text-6xl font-display font-black text-muted/20">
                    {feature.step}
                  </div>
                  
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg animate-glow-pulse`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className={`text-2xl font-display font-bold mb-4 ${feature.accent} group-hover:pulse-neon transition-all duration-300`}>
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed font-tech">
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
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-magenta-500/5 to-accent/5" />
        <div className="container px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-7xl font-display font-black mb-8">
                QUANTUM <span className="neon-text">ADVANTAGES</span>
              </h2>
              <p className="text-xl text-cyan-300 max-w-3xl mx-auto font-tech">
                EXPERIENCE THE FUTURE OF NEURAL-ENHANCED LEARNING SYSTEMS
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              {[
                {
                  icon: Zap,
                  title: "QUANTUM PROCESSING",
                  description: "Generate comprehensive neural quizzes in nanoseconds using our quantum-accelerated AI algorithms",
                  accent: "text-cyan-400"
                },
                {
                  icon: Brain,
                  title: "NEURAL INTELLIGENCE",
                  description: "Advanced consciousness simulation ensures maximum relevance and adaptive difficulty scaling",
                  accent: "text-magenta-400"
                },
                {
                  icon: Target,
                  title: "ADAPTIVE LEARNING",
                  description: "Self-evolving algorithms that predict and adapt to your unique cognitive patterns in real-time",
                  accent: "text-accent"
                },
                {
                  icon: CheckCircle,
                  title: "QUANTUM ANALYTICS",
                  description: "Comprehensive neural mapping and progress tracking with predictive learning optimization",
                  accent: "text-cyan-400"
                }
              ].map((benefit, index) => (
                <div key={index} className="flex items-start space-x-6 p-6 rounded-xl cyber-card cyber-card-hover hologram-effect animate-cyber-fade" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className={`flex-shrink-0 p-3 bg-gradient-to-r from-cyan-500/20 to-magenta-500/20 rounded-xl border border-cyan-500/30 animate-glow-pulse`}>
                    <benefit.icon className={`h-6 w-6 ${benefit.accent}`} />
                  </div>
                  <div>
                    <h3 className={`text-xl font-display font-bold mb-3 ${benefit.accent}`}>{benefit.title}</h3>
                    <p className="text-muted-foreground leading-relaxed font-tech">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-magenta-500/10 to-accent/10" />
        <div className="absolute inset-0 matrix-bg opacity-20" />
        <div className="container px-4 relative">
          <div className="max-w-5xl mx-auto text-center">
            <div className="p-12 rounded-2xl cyber-card cyber-card-hover hologram-effect">
              <h2 className="text-5xl md:text-7xl font-display font-black mb-8">
                READY TO <span className="neon-text glitch" data-text="EVOLVE">EVOLVE</span>?
              </h2>
              <p className="text-xl text-cyan-300 mb-12 max-w-3xl mx-auto leading-relaxed font-tech">
                JOIN THE NEURAL REVOLUTION. THOUSANDS OF MINDS ALREADY CONNECTED TO OUR 
                <span className="text-magenta-400 font-bold"> QUANTUM LEARNING MATRIX</span>
              </p>
              <Button asChild size="lg" className="cyber-button px-12 py-6 text-xl rounded-xl font-display font-bold transform hover:scale-105 transition-all duration-300 group animate-glow-pulse">
                <Link to="/quiz-notes">
                  <Sparkles className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
                  INITIATE NEURAL LINK
                  <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-cyan-500/30 bg-card/50 backdrop-blur-xl">
        <div className="container px-4 text-center">
          <p className="text-muted-foreground font-tech font-medium">
            NEURAL QUIZ.AI © {new Date().getFullYear()} - QUANTUM-POWERED LEARNING ACCELERATION SYSTEM
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
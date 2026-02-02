import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  Video, 
  MessageSquare, 
  BarChart3, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Play
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Questions",
    description: "Get realistic interview questions tailored to your industry and experience level"
  },
  {
    icon: Video,
    title: "Video Recording",
    description: "Practice with your webcam to perfect your body language and presence"
  },
  {
    icon: MessageSquare,
    title: "Real-time Transcription",
    description: "See your answers transcribed live with the Web Speech API"
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description: "Track your speech pace, filler words, and answer structure"
  }
];

const benefits = [
  "Practice behavioral & technical interviews",
  "Get personalized AI feedback on every answer",
  "Track your improvement over time",
  "No signup required - start practicing now"
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">InterviewIQ</span>
          </Link>
          <Link to="/setup">
            <Button variant="default" size="sm">
              Start Practice
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto max-w-5xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Interview Prep
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Ace Your Next
              <span className="text-gradient block mt-2">Interview</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Practice with AI-generated questions, record your responses, and get instant
              feedback to improve your interview skills.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/setup">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-glow text-lg px-8 h-14">
                  <Play className="w-5 h-5 mr-2" />
                  Start Free Practice
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 h-14">
                Watch Demo
              </Button>
            </div>
          </motion.div>

          {/* Hero Image/Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16"
          >
            <Card className="glass shadow-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-8 md:p-12">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-card shadow-md">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-3 h-3 rounded-full bg-destructive" />
                          <span className="text-sm text-muted-foreground">Recording...</span>
                        </div>
                        <p className="text-sm font-medium">
                          "Tell me about a time when you had to lead a project under tight deadlines..."
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-card shadow-md">
                        <div className="text-xs text-muted-foreground mb-2">Live Transcript</div>
                        <p className="text-sm">
                          "In my previous role at a startup, I was tasked with delivering a critical feature..."
                        </p>
                      </div>
                    </div>
                    <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <div className="text-center">
                        <Video className="w-16 h-16 mx-auto text-primary/50 mb-2" />
                        <p className="text-sm text-muted-foreground">Webcam Preview</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Prepare
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform helps you practice, analyze, and improve your interview performance.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Practice with <span className="text-gradient">InterviewIQ</span>?
              </h2>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-primary to-secondary text-primary-foreground p-8">
                <div className="text-center">
                  <div className="text-6xl font-bold mb-2">85%</div>
                  <p className="text-primary-foreground/80">
                    of users report improved confidence after just 3 practice sessions
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="glass p-12 shadow-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Practicing?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                No signup required. Start your first mock interview in under a minute.
              </p>
              <Link to="/setup">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-glow text-lg px-12 h-14">
                  Begin Your Practice Interview
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">InterviewIQ</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 InterviewIQ. Built for interview success.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

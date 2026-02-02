import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Briefcase, 
  Target,
  AlertCircle
} from "lucide-react";
import { 
  Industry, 
  InterviewType, 
  Duration,
  INDUSTRIES, 
  INTERVIEW_TYPES, 
  DURATIONS 
} from "@/types/interview";

export default function Setup() {
  const navigate = useNavigate();
  const [industry, setIndustry] = useState<Industry | null>(null);
  const [interviewType, setInterviewType] = useState<InterviewType | null>(null);
  const [duration, setDuration] = useState<Duration>(10);

  const canProceed = industry && interviewType;

  const handleStart = () => {
    if (canProceed) {
      const params = new URLSearchParams({
        industry,
        type: interviewType,
        duration: duration.toString(),
      });
      navigate(`/interview?${params.toString()}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">InterviewIQ</span>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-12">
        {/* Practice Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 p-4 rounded-lg bg-accent border border-accent-foreground/10">
            <AlertCircle className="w-5 h-5 text-accent-foreground flex-shrink-0" />
            <p className="text-sm text-accent-foreground">
              <strong>Practice Mode:</strong> This is a simulated interview environment for practice purposes. 
              Your responses are not shared with any employers.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Configure Your Interview</h1>
          <p className="text-lg text-muted-foreground">
            Customize your practice session to match your target role
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Industry Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Select Industry</h2>
                <p className="text-sm text-muted-foreground">Choose your target industry</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {INDUSTRIES.map((ind) => (
                <Card
                  key={ind.value}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    industry === ind.value
                      ? "border-2 border-primary shadow-md bg-primary/5"
                      : "hover:border-primary/30"
                  }`}
                  onClick={() => setIndustry(ind.value)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{ind.icon}</div>
                    <p className="font-medium">{ind.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Interview Type Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Interview Type</h2>
                <p className="text-sm text-muted-foreground">Select the type of questions</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {INTERVIEW_TYPES.map((type) => (
                <Card
                  key={type.value}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    interviewType === type.value
                      ? "border-2 border-secondary shadow-md bg-secondary/5"
                      : "hover:border-secondary/30"
                  }`}
                  onClick={() => setInterviewType(type.value)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{type.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Duration Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <Clock className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Session Duration</h2>
                <p className="text-sm text-muted-foreground">How long do you want to practice?</p>
              </div>
            </div>
            <div className="flex gap-4">
              {DURATIONS.map((d) => (
                <Button
                  key={d.value}
                  variant={duration === d.value ? "default" : "outline"}
                  className={duration === d.value ? "bg-gradient-primary" : ""}
                  onClick={() => setDuration(d.value)}
                >
                  {d.label}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Summary & Start */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Your Interview Setup</h3>
                    <div className="flex flex-wrap gap-2">
                      {industry && (
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                          {INDUSTRIES.find(i => i.value === industry)?.label}
                        </span>
                      )}
                      {interviewType && (
                        <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
                          {INTERVIEW_TYPES.find(t => t.value === interviewType)?.label}
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-medium">
                        {duration} minutes
                      </span>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    disabled={!canProceed}
                    onClick={handleStart}
                    className="bg-gradient-primary hover:opacity-90 shadow-glow min-w-[200px]"
                  >
                    Start Interview
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

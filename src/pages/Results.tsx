import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  ArrowLeft, 
  Download,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  MessageSquare,
  BarChart3,
  TrendingUp,
  Award,
  Play
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getSession, saveSession } from "@/lib/interviewStorage";
import { InterviewSession, AnswerFeedback } from "@/types/interview";
import { useToast } from "@/hooks/use-toast";
import ScoreCircle from "@/components/ScoreCircle";
import FeedbackCard from "@/components/FeedbackCard";
import MetricsDisplay from "@/components/MetricsDisplay";

export default function Results() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const sessionId = searchParams.get("session");
  
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingProgress, setAnalyzingProgress] = useState(0);

  useEffect(() => {
    if (!sessionId) {
      navigate("/");
      return;
    }

    const loadedSession = getSession(sessionId);
    if (!loadedSession) {
      toast({
        title: "Session not found",
        description: "The interview session could not be found.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setSession(loadedSession);
    setIsLoading(false);

    // Generate feedback if not already done
    if (loadedSession.feedback.length === 0 && loadedSession.answers.length > 0) {
      generateFeedback(loadedSession);
    }
  }, [sessionId, navigate, toast]);

  const generateFeedback = async (currentSession: InterviewSession) => {
    setIsAnalyzing(true);
    const feedbackResults: AnswerFeedback[] = [];
    
    for (let i = 0; i < currentSession.answers.length; i++) {
      const answer = currentSession.answers[i];
      setAnalyzingProgress(((i + 1) / currentSession.answers.length) * 100);
      
      try {
        const { data, error } = await supabase.functions.invoke("analyze-answer", {
          body: {
            question: answer.question,
            answer: answer.transcript,
            interviewType: currentSession.setup.interviewType,
            industry: currentSession.setup.industry,
          },
        });

        if (error) throw error;
        
        if (data?.feedback) {
          feedbackResults.push({
            questionId: answer.questionId,
            ...data.feedback,
          });
        }
      } catch (err) {
        console.error("Error analyzing answer:", err);
        // Add default feedback on error
        feedbackResults.push({
          questionId: answer.questionId,
          relevanceScore: 50,
          clarityScore: 50,
          structureScore: 50,
          overallScore: 50,
          strengths: ["Unable to analyze - please try again"],
          improvements: [],
          specificFeedback: "We encountered an error analyzing this response.",
        });
      }
    }

    // Calculate overall score
    const overallScore = feedbackResults.length > 0
      ? Math.round(feedbackResults.reduce((sum, f) => sum + f.overallScore, 0) / feedbackResults.length)
      : 0;

    const updatedSession: InterviewSession = {
      ...currentSession,
      feedback: feedbackResults,
      overallScore,
      completedAt: new Date().toISOString(),
    };

    saveSession(updatedSession);
    setSession(updatedSession);
    setIsAnalyzing(false);
  };

  const downloadReport = () => {
    if (!session) return;

    const report = generateTextReport(session);
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interview-report-${session.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateTextReport = (session: InterviewSession): string => {
    let report = `
INTERVIEW IQ - Practice Interview Report
=========================================
Date: ${new Date(session.createdAt).toLocaleDateString()}
Industry: ${session.setup.industry.toUpperCase()}
Interview Type: ${session.setup.interviewType.toUpperCase()}
Duration: ${session.setup.duration} minutes

OVERALL SCORE: ${session.overallScore}/100
=========================================

METRICS
-------
Words per Minute: ${session.metrics.wordsPerMinute}
Filler Words Used: ${session.metrics.fillerWordCount}
Average Answer Duration: ${Math.round(session.metrics.averageAnswerDuration)}s

QUESTIONS & FEEDBACK
====================
`;

    session.answers.forEach((answer, i) => {
      const feedback = session.feedback.find(f => f.questionId === answer.questionId);
      report += `
Question ${i + 1}: ${answer.question}
---
Your Answer:
${answer.transcript || "(No transcript available)"}

Score: ${feedback?.overallScore || "N/A"}/100
Strengths: ${feedback?.strengths.join(", ") || "N/A"}
Areas for Improvement: ${feedback?.improvements.join(", ") || "N/A"}
Feedback: ${feedback?.specificFeedback || "N/A"}

`;
    });

    report += `
=========================================
Generated by InterviewIQ
Practice makes perfect!
`;

    return report;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Session Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The interview session could not be loaded.
            </p>
            <Link to="/">
              <Button>Return Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={downloadReport}>
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Link to="/setup">
              <Button className="bg-gradient-primary hover:opacity-90">
                Practice Again
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-8">
        {/* Analyzing Overlay */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center"
          >
            <Card className="max-w-md w-full mx-4">
              <CardContent className="p-8 text-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Analyzing Your Responses</h3>
                <p className="text-muted-foreground mb-4">
                  Our AI is reviewing your answers and generating personalized feedback...
                </p>
                <Progress value={analyzingProgress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  {Math.round(analyzingProgress)}% complete
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
            <CheckCircle2 className="w-4 h-4" />
            Interview Complete
          </div>
          <h1 className="text-4xl font-bold mb-4">Your Interview Results</h1>
          <p className="text-lg text-muted-foreground">
            Review your performance and see how you can improve
          </p>
        </motion.div>

        {/* Score Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-4 gap-6 mb-12"
        >
          <Card className="md:col-span-1">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <ScoreCircle score={session.overallScore} size={140} />
              <p className="mt-4 font-semibold">Overall Score</p>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{session.answers.length}</div>
                  <p className="text-sm text-muted-foreground">Questions Answered</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary">
                    {Math.round(session.metrics.totalDuration)}s
                  </div>
                  <p className="text-sm text-muted-foreground">Total Speaking Time</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-success">
                    {session.metrics.wordsPerMinute}
                  </div>
                  <p className="text-sm text-muted-foreground">Words per Minute</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="feedback" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="feedback">
              <MessageSquare className="w-4 h-4 mr-2" />
              Feedback
            </TabsTrigger>
            <TabsTrigger value="metrics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Metrics
            </TabsTrigger>
            <TabsTrigger value="transcript">
              <Clock className="w-4 h-4 mr-2" />
              Transcript
            </TabsTrigger>
          </TabsList>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-6">
            {session.answers.map((answer, index) => {
              const feedback = session.feedback.find(f => f.questionId === answer.questionId);
              return (
                <FeedbackCard
                  key={answer.questionId}
                  questionNumber={index + 1}
                  question={answer.question}
                  answer={answer.transcript}
                  feedback={feedback}
                />
              );
            })}
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics">
            <MetricsDisplay metrics={session.metrics} />
          </TabsContent>

          {/* Transcript Tab */}
          <TabsContent value="transcript" className="space-y-4">
            {session.answers.map((answer, index) => (
              <Card key={answer.questionId}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Q{index + 1}: {answer.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {Math.round(answer.duration)}s
                    </div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm leading-relaxed">
                      {answer.transcript || "(No transcript available)"}
                    </p>
                  </div>
                  {answer.videoUrl && (
                    <div className="mt-4">
                      <video 
                        src={answer.videoUrl} 
                        controls 
                        className="w-full rounded-lg max-h-[300px]"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <Card className="glass">
            <CardContent className="p-8 text-center">
              <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Keep Improving!</h3>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                The more you practice, the more confident you'll become. 
                Try another interview session to continue building your skills.
              </p>
              <Link to="/setup">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-glow">
                  <Play className="w-5 h-5 mr-2" />
                  Start Another Practice Session
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

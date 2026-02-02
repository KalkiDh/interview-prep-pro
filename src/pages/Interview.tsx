import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  Mic, 
  MicOff,
  Video,
  VideoOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  Clock,
  ChevronRight
} from "lucide-react";
import { useMediaRecorder } from "@/hooks/useMediaRecorder";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { supabase } from "@/integrations/supabase/client";
import { 
  InterviewQuestion, 
  Answer,
  InterviewSetup,
  Industry,
  InterviewType,
  Duration
} from "@/types/interview";
import { saveSession, generateSessionId, calculateMetrics } from "@/lib/interviewStorage";
import { useToast } from "@/hooks/use-toast";
import WebcamPreview from "@/components/WebcamPreview";
import InterviewTimer from "@/components/InterviewTimer";
import TranscriptDisplay from "@/components/TranscriptDisplay";

export default function Interview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const setup: InterviewSetup = {
    industry: (searchParams.get("industry") as Industry) || "tech",
    interviewType: (searchParams.get("type") as InterviewType) || "behavioral",
    duration: (parseInt(searchParams.get("duration") || "10") as Duration) || 10,
  };

  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isRecordingAnswer, setIsRecordingAnswer] = useState(false);
  const [answerStartTime, setAnswerStartTime] = useState(0);
  const [sessionId] = useState(generateSessionId);
  const [isFinishing, setIsFinishing] = useState(false);
  
  const answerVideoBlobsRef = useRef<Map<string, Blob>>(new Map());
  
  const {
    isRecording,
    stream,
    error: mediaError,
    startRecording,
    stopRecording,
    getRecordingBlob,
  } = useMediaRecorder({
    onStop: (blob) => {
      if (questions[currentIndex]) {
        answerVideoBlobsRef.current.set(questions[currentIndex].id, blob);
      }
    },
  });

  const {
    transcript,
    interimTranscript,
    isListening,
    isSupported: speechSupported,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // Fetch questions on mount
  useEffect(() => {
    async function fetchQuestions() {
      try {
        setIsLoading(true);
        const { data, error: fetchError } = await supabase.functions.invoke("generate-questions", {
          body: {
            industry: setup.industry,
            interviewType: setup.interviewType,
            questionCount: setup.duration === 5 ? 4 : setup.duration === 10 ? 6 : 8,
          },
        });

        if (fetchError) throw fetchError;
        if (data?.questions) {
          setQuestions(data.questions);
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to generate questions. Please try again.");
        toast({
          title: "Error",
          description: "Failed to generate interview questions.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuestions();
  }, [setup.industry, setup.interviewType, setup.duration, toast]);

  const startAnswering = useCallback(async () => {
    resetTranscript();
    setAnswerStartTime(Date.now());
    setIsRecordingAnswer(true);
    
    await startRecording();
    startListening();
  }, [startRecording, startListening, resetTranscript]);

  const finishAnswer = useCallback(() => {
    stopListening();
    stopRecording();
    
    const currentQuestion = questions[currentIndex];
    const endTime = Date.now();
    const duration = (endTime - answerStartTime) / 1000;
    
    const answer: Answer = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      transcript: transcript.trim(),
      duration,
      startTime: answerStartTime,
      endTime,
    };
    
    setAnswers(prev => [...prev, answer]);
    setIsRecordingAnswer(false);
  }, [questions, currentIndex, transcript, answerStartTime, stopListening, stopRecording]);

  const goToNextQuestion = useCallback(() => {
    if (isRecordingAnswer) {
      finishAnswer();
    }
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      resetTranscript();
    }
  }, [isRecordingAnswer, currentIndex, questions.length, finishAnswer, resetTranscript]);

  const finishInterview = useCallback(async () => {
    if (isRecordingAnswer) {
      finishAnswer();
    }
    
    setIsFinishing(true);
    
    // Create video URLs for answers
    const answersWithVideo = answers.map(answer => {
      const blob = answerVideoBlobsRef.current.get(answer.questionId);
      return {
        ...answer,
        videoBlob: blob,
        videoUrl: blob ? URL.createObjectURL(blob) : undefined,
      };
    });
    
    // Calculate metrics
    const metrics = calculateMetrics(answersWithVideo);
    
    // Save session to localStorage (feedback will be generated on results page)
    const session = {
      id: sessionId,
      setup,
      questions,
      answers: answersWithVideo,
      feedback: [],
      metrics,
      overallScore: 0,
      createdAt: new Date().toISOString(),
    };
    
    saveSession(session);
    navigate(`/results?session=${sessionId}`);
  }, [isRecordingAnswer, finishAnswer, answers, sessionId, setup, questions, navigate]);

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const isLastQuestion = currentIndex === questions.length - 1;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg font-medium">Generating your interview questions...</p>
          <p className="text-muted-foreground">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => navigate("/setup")}>Try Again</Button>
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
            <InterviewTimer duration={setup.duration} onTimeUp={finishInterview} />
            <Button 
              variant="destructive" 
              size="sm"
              onClick={finishInterview}
              disabled={isFinishing}
            >
              {isFinishing ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              End Interview
            </Button>
          </div>
        </div>
      </header>

      {/* Practice Mode Banner */}
      <div className="bg-accent border-b border-accent-foreground/10 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-sm text-accent-foreground">
            <AlertCircle className="w-4 h-4" />
            <span>Practice Mode - Your responses are private and not shared</span>
          </div>
        </div>
      </div>

      <main className="container mx-auto max-w-6xl px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion?.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden">
                  <div className="bg-gradient-primary p-4">
                    <div className="flex items-center gap-2 text-primary-foreground">
                      <span className="px-2 py-1 rounded bg-primary-foreground/20 text-sm font-medium">
                        {currentQuestion?.category}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">
                      {currentQuestion?.question}
                    </h2>
                    {currentQuestion?.tips && (
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm font-medium mb-2">Tips:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {currentQuestion.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Transcript Display */}
            <TranscriptDisplay
              transcript={transcript}
              interimTranscript={interimTranscript}
              isListening={isListening}
            />

            {/* Controls */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-4">
                  {!isRecordingAnswer ? (
                    <Button 
                      onClick={startAnswering}
                      className="bg-gradient-primary hover:opacity-90"
                      disabled={mediaError !== null || !speechSupported}
                    >
                      <Mic className="w-4 h-4 mr-2" />
                      Start Recording Answer
                    </Button>
                  ) : (
                    <Button 
                      onClick={finishAnswer}
                      variant="destructive"
                    >
                      <MicOff className="w-4 h-4 mr-2" />
                      Stop Recording
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={goToNextQuestion}
                    disabled={isLastQuestion}
                  >
                    Next Question
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  {isLastQuestion && (
                    <Button
                      onClick={finishInterview}
                      className="bg-gradient-primary hover:opacity-90"
                      disabled={isFinishing}
                    >
                      {isFinishing ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      Finish Interview
                    </Button>
                  )}
                </div>

                {(mediaError || speechError) && (
                  <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    <AlertCircle className="w-4 h-4 inline mr-2" />
                    {mediaError || speechError}
                  </div>
                )}

                {!speechSupported && (
                  <div className="mt-4 p-3 rounded-lg bg-warning/10 text-warning text-sm">
                    <AlertCircle className="w-4 h-4 inline mr-2" />
                    Speech recognition is not supported in this browser. Try Chrome or Edge.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Webcam */}
          <div className="space-y-6">
            <WebcamPreview 
              stream={stream} 
              isRecording={isRecording}
            />

            {/* Recording Status */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Recording Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Camera</span>
                    <div className="flex items-center gap-2">
                      {stream ? (
                        <>
                          <Video className="w-4 h-4 text-success" />
                          <span className="text-sm text-success">Active</span>
                        </>
                      ) : (
                        <>
                          <VideoOff className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Inactive</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Microphone</span>
                    <div className="flex items-center gap-2">
                      {isListening ? (
                        <>
                          <Mic className="w-4 h-4 text-success" />
                          <span className="text-sm text-success">Listening</span>
                        </>
                      ) : (
                        <>
                          <MicOff className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Inactive</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Answers Recorded</span>
                    <span className="text-sm font-medium">{answers.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

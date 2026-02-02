import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle, Lightbulb } from "lucide-react";
import { AnswerFeedback } from "@/types/interview";

interface FeedbackCardProps {
  questionNumber: number;
  question: string;
  answer: string;
  feedback?: AnswerFeedback;
}

export default function FeedbackCard({ 
  questionNumber, 
  question, 
  answer, 
  feedback 
}: FeedbackCardProps) {
  if (!feedback) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Question {questionNumber}: {question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Feedback not available</p>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-primary";
    if (score >= 40) return "text-warning";
    return "text-destructive";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-success";
    if (score >= 60) return "bg-primary";
    if (score >= 40) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-lg flex-1">
              Q{questionNumber}: {question}
            </CardTitle>
            <div className={`text-2xl font-bold ${getScoreColor(feedback.overallScore)}`}>
              {feedback.overallScore}/100
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Breakdown */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Relevance</span>
                <span className={`text-sm font-medium ${getScoreColor(feedback.relevanceScore)}`}>
                  {feedback.relevanceScore}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${getProgressColor(feedback.relevanceScore)}`}
                  style={{ width: `${feedback.relevanceScore}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Clarity</span>
                <span className={`text-sm font-medium ${getScoreColor(feedback.clarityScore)}`}>
                  {feedback.clarityScore}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${getProgressColor(feedback.clarityScore)}`}
                  style={{ width: `${feedback.clarityScore}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Structure</span>
                <span className={`text-sm font-medium ${getScoreColor(feedback.structureScore)}`}>
                  {feedback.structureScore}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${getProgressColor(feedback.structureScore)}`}
                  style={{ width: `${feedback.structureScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* STAR Method Badge */}
          {feedback.starMethodUsed !== undefined && (
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
              feedback.starMethodUsed 
                ? "bg-success/10 text-success" 
                : "bg-muted text-muted-foreground"
            }`}>
              {feedback.starMethodUsed ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  STAR Method Used
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4" />
                  Consider Using STAR Method
                </>
              )}
            </div>
          )}

          {/* Your Answer */}
          <div>
            <h4 className="text-sm font-medium mb-2">Your Answer</h4>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                {answer || "(No transcript available)"}
              </p>
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid md:grid-cols-2 gap-4">
            {feedback.strengths.length > 0 && (
              <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                <h4 className="text-sm font-medium text-success mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Strengths
                </h4>
                <ul className="space-y-1">
                  {feedback.strengths.map((strength, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      • {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {feedback.improvements.length > 0 && (
              <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
                <h4 className="text-sm font-medium text-warning mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Areas to Improve
                </h4>
                <ul className="space-y-1">
                  {feedback.improvements.map((improvement, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      • {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Detailed Feedback */}
          {feedback.specificFeedback && (
            <div className="p-4 rounded-lg bg-accent">
              <h4 className="text-sm font-medium mb-2">Detailed Feedback</h4>
              <p className="text-sm text-muted-foreground">
                {feedback.specificFeedback}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

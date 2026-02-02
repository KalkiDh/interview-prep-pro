import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Clock, MessageSquare, AlertTriangle } from "lucide-react";
import { InterviewMetrics } from "@/types/interview";

interface MetricsDisplayProps {
  metrics: InterviewMetrics;
}

export default function MetricsDisplay({ metrics }: MetricsDisplayProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="space-y-6">
      {/* Main Metrics Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-3xl font-bold text-primary">{metrics.wordsPerMinute}</div>
            <p className="text-sm text-muted-foreground">Words per Minute</p>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.wordsPerMinute < 120 
                ? "A bit slow - aim for 120-150 WPM" 
                : metrics.wordsPerMinute > 160 
                  ? "A bit fast - slow down for clarity"
                  : "Good pace!"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-secondary mx-auto mb-2" />
            <div className="text-3xl font-bold text-secondary">
              {formatDuration(metrics.totalDuration)}
            </div>
            <p className="text-sm text-muted-foreground">Total Speaking Time</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <MessageSquare className="w-8 h-8 text-accent-foreground mx-auto mb-2" />
            <div className="text-3xl font-bold text-accent-foreground">
              {formatDuration(metrics.averageAnswerDuration)}
            </div>
            <p className="text-sm text-muted-foreground">Avg Answer Duration</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className={`w-8 h-8 mx-auto mb-2 ${
              metrics.fillerWordCount > 10 ? "text-warning" : "text-success"
            }`} />
            <div className={`text-3xl font-bold ${
              metrics.fillerWordCount > 10 ? "text-warning" : "text-success"
            }`}>
              {metrics.fillerWordCount}
            </div>
            <p className="text-sm text-muted-foreground">Filler Words</p>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.fillerWordCount === 0 
                ? "Excellent! No filler words" 
                : metrics.fillerWordCount <= 5 
                  ? "Good! Minimal filler words"
                  : metrics.fillerWordCount <= 10
                    ? "Moderate - try to reduce"
                    : "Work on reducing filler words"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filler Words Breakdown */}
      {Object.keys(metrics.fillerWords).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Filler Words Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(metrics.fillerWords).map(([word, count]) => (
                <div 
                  key={word}
                  className="px-3 py-2 rounded-lg bg-warning/10 text-warning-foreground"
                >
                  <span className="font-medium">"{word}"</span>
                  <span className="ml-2 text-muted-foreground">× {count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Answer Duration Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Answer Duration Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold">{formatDuration(metrics.averageAnswerDuration)}</p>
              <p className="text-sm text-muted-foreground">Average</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold">{formatDuration(metrics.longestAnswer)}</p>
              <p className="text-sm text-muted-foreground">Longest</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold">{formatDuration(metrics.shortestAnswer)}</p>
              <p className="text-sm text-muted-foreground">Shortest</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            💡 Tip: Aim for 1-2 minute answers for behavioral questions and 30 seconds to 1 minute for technical questions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

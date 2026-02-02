import { Card, CardContent } from "@/components/ui/card";
import { Mic } from "lucide-react";

interface TranscriptDisplayProps {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
}

export default function TranscriptDisplay({ 
  transcript, 
  interimTranscript, 
  isListening 
}: TranscriptDisplayProps) {
  const hasContent = transcript || interimTranscript;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Mic className={`w-4 h-4 ${isListening ? "text-success animate-pulse" : "text-muted-foreground"}`} />
          <span className="text-sm font-medium">Live Transcript</span>
          {isListening && (
            <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs">
              Listening...
            </span>
          )}
        </div>
        <div className="min-h-[100px] max-h-[200px] overflow-y-auto p-4 bg-muted rounded-lg">
          {hasContent ? (
            <p className="text-sm leading-relaxed">
              {transcript}
              {interimTranscript && (
                <span className="text-muted-foreground italic">
                  {interimTranscript}
                </span>
              )}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">
              Your spoken words will appear here in real-time...
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

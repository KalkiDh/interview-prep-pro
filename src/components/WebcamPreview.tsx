import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Video } from "lucide-react";

interface WebcamPreviewProps {
  stream: MediaStream | null;
  isRecording: boolean;
}

export default function WebcamPreview({ stream, isRecording }: WebcamPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 relative">
        {stream ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full aspect-video object-cover"
            />
            {isRecording && (
              <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive text-destructive-foreground text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-destructive-foreground animate-pulse" />
                Recording
              </div>
            )}
          </>
        ) : (
          <div className="aspect-video bg-muted flex flex-col items-center justify-center">
            <Video className="w-12 h-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Camera Preview</p>
            <p className="text-xs text-muted-foreground mt-1">
              Click "Start Recording" to enable
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

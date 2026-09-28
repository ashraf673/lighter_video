import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatBytes, formatDuration } from "@/lib/format";
import { useAppStore } from "@/lib/store";

export function VideoStage() {
  const phase = useAppStore((s) => s.phase);
  const meta = useAppStore((s) => s.meta);
  const previewUrl = useAppStore((s) => s.previewUrl);
  const resultUrl = useAppStore((s) => s.resultUrl);
  const progress = useAppStore((s) => s.progress);
  const reset = useAppStore((s) => s.reset);
  const src = phase === "done" && resultUrl ? resultUrl : previewUrl;

  return (
    <div className="relative overflow-hidden rounded-xl bg-secondary">
      {src ? (
        <video
          key={src}
          src={src}
          className="aspect-video w-full bg-background object-contain"
          controls={phase !== "compressing"}
          playsInline
          muted={phase === "compressing"}
          preload="auto"
        />
      ) : (
        <div className="aspect-video w-full bg-secondary" />
      )}

      {phase === "compressing" ? (
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-background/80 px-4 py-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">Encoding</span>
            <span className="font-mono tabular-nums text-muted-foreground">
              {Math.round(progress * 100)}%
            </span>
          </div>
          <Progress value={progress * 100} />
        </div>
      ) : null}

      <Button
        type="button"
        size="icon"
        variant="secondary"
        className="absolute top-3 right-3 size-9 min-h-9"
        onClick={reset}
        aria-label="Remove video"
      >
        <X className="size-4" />
      </Button>

      {meta ? (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border px-4 py-3 text-xs text-muted-foreground">
          <span className="max-w-48 truncate font-medium text-foreground">
            {meta.name}
          </span>
          <span className="font-mono tabular-nums">{formatBytes(meta.bytes)}</span>
          <span className="font-mono tabular-nums">
            {meta.width}×{meta.height}
          </span>
          <span className="font-mono tabular-nums">
            {formatDuration(meta.duration)}
          </span>
        </div>
      ) : null}
    </div>
  );
}

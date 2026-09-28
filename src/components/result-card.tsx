import { Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes, formatPercent, stemFromFilename } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ResultCard() {
  const meta = useAppStore((s) => s.meta);
  const result = useAppStore((s) => s.result);
  const resultUrl = useAppStore((s) => s.resultUrl);
  const reset = useAppStore((s) => s.reset);

  if (!meta || !result || !resultUrl) return null;

  const saved = meta.bytes - result.bytes;
  const ratio = saved / Math.max(meta.bytes, 1);
  const grew = result.bytes >= meta.bytes;

  const download = () => {
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = `${stemFromFilename(meta.name)}-pinch.${result.extension}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="flex flex-col gap-5 rounded-xl bg-secondary/70 p-4">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {grew ? "Result" : "Saved"}
        </p>
        <p
          className={cn(
            "font-display text-3xl font-medium tracking-tight",
            grew ? "text-foreground" : "text-gain",
          )}
        >
          {grew ? "Already lean" : `${formatPercent(ratio * 100)} smaller`}
        </p>
        <p className="text-sm text-muted-foreground">
          {grew
            ? "This clip was already tightly encoded. Try Tiny or a lower size."
            : `${formatBytes(meta.bytes)} down to ${formatBytes(result.bytes)}.`}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <SizeBar label="Original" bytes={meta.bytes} max={meta.bytes} />
        <SizeBar
          label="Pinch"
          bytes={result.bytes}
          max={meta.bytes}
          accent={!grew}
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="button" className="flex-1" onClick={download}>
          <Download className="size-4" />
          Download {result.extension.toUpperCase()}
        </Button>
        <Button type="button" variant="secondary" className="flex-1" onClick={reset}>
          <RotateCcw className="size-4" />
          New video
        </Button>
      </div>
    </div>
  );
}

function SizeBar({
  label,
  bytes,
  max,
  accent,
}: {
  label: string;
  bytes: number;
  max: number;
  accent?: boolean;
}) {
  const width = `${Math.max(8, Math.min(100, (bytes / Math.max(max, 1)) * 100))}%`;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono tabular-nums text-foreground">
          {formatBytes(bytes)}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-border">
        <div
          className={cn("h-full rounded-full", accent ? "bg-gain" : "bg-primary/70")}
          style={{ width }}
        />
      </div>
    </div>
  );
}

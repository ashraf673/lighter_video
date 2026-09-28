import { useEffect } from "react";
import { ArrowDown, Info, LoaderCircle, Sun } from "lucide-react";
import { PinchMark } from "@/components/pinch-mark";
import { DropZone } from "@/components/drop-zone";
import { VideoStage } from "@/components/video-stage";
import { SettingsPanel } from "@/components/settings-panel";
import { ResultCard } from "@/components/result-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatBytes } from "@/lib/format";
import { useAppStore } from "@/lib/store";

export function CompressorApp() {
  const phase = useAppStore((s) => s.phase);
  const error = useAppStore((s) => s.error);
  const meta = useAppStore((s) => s.meta);
  const history = useAppStore((s) => s.history);
  const screenHeld = useAppStore((s) => s.screenHeld);
  const leftWhileEncoding = useAppStore((s) => s.leftWhileEncoding);
  const compress = useAppStore((s) => s.compress);
  const cancel = useAppStore((s) => s.cancel);
  const reset = useAppStore((s) => s.reset);
  const loadFile = useAppStore((s) => s.loadFile);
  const markLeftWhileEncoding = useAppStore((s) => s.markLeftWhileEncoding);
  const restoreScreenHold = useAppStore((s) => s.restoreScreenHold);
  const hasFile = phase !== "empty";

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const file = event.clipboardData?.files?.[0];
      if (file) void loadFile(file);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [loadFile]);

  useEffect(() => {
    if (phase !== "compressing") return;

    const onUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        markLeftWhileEncoding();
      } else {
        void restoreScreenHold();
      }
    };

    window.addEventListener("beforeunload", onUnload);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("beforeunload", onUnload);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [phase, markLeftWhileEncoding, restoreScreenHold]);

  return (
    <div className="relative flex min-h-dvh flex-col bg-background text-foreground">
      <header className="flex items-center justify-between px-5 pt-5 pb-2 sm:px-8 sm:pt-7">
        <div className="flex items-center gap-2.5">
          <PinchMark className="size-8" />
          <span className="font-display text-xl font-medium tracking-tight">
            Pinch
          </span>
        </div>
        <HowItWorks />
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-5 py-6 sm:px-8 sm:py-10">
        {!hasFile ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-start">
            <VideoStage />
            <div className="flex flex-col gap-5">
              {phase === "done" ? <ResultCard /> : meta ? <SettingsPanel /> : null}

              {phase === "compressing" ? (
                <StayOpenNote
                  screenHeld={screenHeld}
                  leftWhileEncoding={leftWhileEncoding}
                />
              ) : null}

              {error && phase === "error" ? (
                <p className="rounded-xl bg-destructive/12 px-4 py-3 text-sm text-destructive">
                  {error}
                </p>
              ) : null}

              {phase === "done" ? null : phase === "compressing" ? (
                <Button type="button" variant="secondary" onClick={cancel}>
                  Cancel
                </Button>
              ) : meta ? (
                <div className="sticky bottom-0 z-10 -mx-5 border-t border-border bg-background px-5 py-3 md:static md:mx-0 md:border-0 md:p-0">
                  <Button
                    type="button"
                    size="lg"
                    className="w-full"
                    onClick={() => void compress()}
                    disabled={phase === "probing"}
                  >
                    {phase === "probing" ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                      <ArrowDown className="size-4" />
                    )}
                    Compress video
                  </Button>
                </div>
              ) : (
                <Button type="button" variant="secondary" onClick={reset}>
                  Try another video
                </Button>
              )}
            </div>
          </div>
        )}

        {history.length > 0 && !hasFile ? (
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-medium text-muted-foreground">Recent</h2>
            <ul className="divide-y divide-border rounded-xl border border-border">
              {history.slice(0, 4).map((item) => {
                const saved = item.originalBytes - item.outputBytes;
                const pct = saved / Math.max(item.originalBytes, 1);
                return (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
                  >
                    <span className="min-w-0 truncate text-foreground">
                      {item.name}
                    </span>
                    <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                      {formatBytes(item.originalBytes)}
                      <span className="text-border"> → </span>
                      {formatBytes(item.outputBytes)}
                      {pct > 0.05 ? (
                        <span className="text-gain">
                          {" "}
                          · {Math.round(pct * 100)}%
                        </span>
                      ) : null}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}
      </main>
    </div>
  );
}

function StayOpenNote({
  screenHeld,
  leftWhileEncoding,
}: {
  screenHeld: boolean;
  leftWhileEncoding: boolean;
}) {
  return (
    <div className="flex gap-3 rounded-xl bg-secondary px-4 py-3 text-sm leading-relaxed text-secondary-foreground">
      <Sun className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
      <p>
        {leftWhileEncoding
          ? "Encoding pauses if this screen is hidden. Stay here and it should continue."
          : screenHeld
            ? "Screen stays on until this finishes. Leave Pinch open — phones freeze encoding in the background."
            : "Keep this screen open. Phones freeze encoding if you switch apps or lock the phone."}
      </p>
    </div>
  );
}

function EmptyState() {
  const error = useAppStore((s) => s.error);
  const phase = useAppStore((s) => s.phase);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8">
      <div className="stagger flex flex-col gap-3">
        <h1 className="font-display text-4xl leading-tight font-medium tracking-tight text-balance sm:text-5xl">
          Lighter videos.
        </h1>
        <p className="max-w-md text-base leading-relaxed text-pretty text-muted-foreground">
          Drop a clip, pick a size, download a smaller file. Nothing is uploaded
          — encoding happens on this device.
        </p>
      </div>
      <DropZone />
      {error && phase === "error" ? (
        <p className="rounded-xl bg-destructive/12 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function HowItWorks() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="icon" aria-label="How Pinch works">
          <Info className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How Pinch works</DialogTitle>
          <DialogDescription>
            A private video compressor that runs entirely in your browser.
          </DialogDescription>
        </DialogHeader>
        <ol className="flex list-decimal flex-col gap-3 pl-4 text-sm leading-relaxed text-muted-foreground">
          <li>Choose a video from your library. It never leaves this device.</li>
          <li>Pick a quality preset, a resolution, or a target file size.</li>
          <li>Pinch re-encodes the clip with your browser’s hardware encoder.</li>
          <li>Keep this screen open while it runs. Phones pause the job if you switch apps.</li>
          <li>Download the lighter MP4 or WebM — depending on the device.</li>
        </ol>
      </DialogContent>
    </Dialog>
  );
}

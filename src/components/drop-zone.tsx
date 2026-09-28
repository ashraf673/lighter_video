import { useCallback, useRef, useState } from "react";
import { Film, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

function pickVideo(files: FileList | File[] | null): File | null {
  if (!files) return null;
  const list = Array.from(files);
  return list.find((file) => file.type.startsWith("video/")) ?? list[0] ?? null;
}

export function DropZone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const loadFile = useAppStore((s) => s.loadFile);
  const phase = useAppStore((s) => s.phase);
  const [over, setOver] = useState(false);
  const busy = phase === "probing";

  const onFiles = useCallback(
    (files: FileList | File[] | null) => {
      const file = pickVideo(files);
      if (file) void loadFile(file);
    },
    [loadFile],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragEnter={(event) => {
        event.preventDefault();
        setOver(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setOver(false);
        onFiles(event.dataTransfer.files);
      }}
      className={cn(
        "group relative flex min-h-64 cursor-pointer flex-col items-center justify-center gap-4 rounded-xl bg-secondary/60 px-6 py-10 text-center outline-none transition-[box-shadow,background-color] duration-quick ease-out-expo",
        "shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
        over && "bg-secondary shadow-[var(--shadow-border-hover)]",
        "focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="sr-only"
        onChange={(event) => {
          onFiles(event.target.files);
          event.target.value = "";
        }}
      />
      <div className="flex size-12 items-center justify-center rounded-lg bg-card text-foreground">
        {busy ? (
          <Upload className="size-5 animate-pulse" />
        ) : (
          <Film className="size-5" />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-base font-medium text-foreground">
          {busy ? "Reading video…" : "Drop a video here"}
        </p>
        <p className="text-sm text-muted-foreground">
          MP4, MOV, or WebM. Stays on this device.
        </p>
      </div>
      <Button
        type="button"
        variant="secondary"
        className="pointer-events-none"
        tabIndex={-1}
      >
        Choose a video
      </Button>
    </div>
  );
}

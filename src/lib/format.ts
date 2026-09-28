export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1000) return `${Math.round(bytes)} B`;
  const units = ["KB", "MB", "GB", "TB"] as const;
  let value = bytes / 1000;
  let unit = 0;
  while (value >= 1000 && unit < units.length - 1) {
    value /= 1000;
    unit += 1;
  }
  const digits = value >= 100 ? 0 : value >= 10 ? 1 : 2;
  return `${value.toFixed(digits)} ${units[unit]}`;
}

export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.round(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const rounded = Math.abs(value) >= 10 ? Math.round(value) : Math.round(value * 10) / 10;
  return `${rounded}%`;
}

export function formatCodec(codec: string | null): string {
  if (!codec) return "Unknown";
  const map: Record<string, string> = {
    avc: "H.264",
    hevc: "H.265",
    vp9: "VP9",
    vp8: "VP8",
    av1: "AV1",
    prores: "ProRes",
    aac: "AAC",
    opus: "Opus",
    mp3: "MP3",
    vorbis: "Vorbis",
    flac: "FLAC",
  };
  return map[codec] ?? codec.toUpperCase();
}

export function stemFromFilename(name: string): string {
  const trimmed = name.trim() || "video";
  const dot = trimmed.lastIndexOf(".");
  if (dot <= 0) return trimmed;
  return trimmed.slice(0, dot);
}

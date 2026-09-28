export const PRESET_IDS = ["crisp", "balanced", "small", "tiny"] as const;
export type PresetId = (typeof PRESET_IDS)[number];

export const RESOLUTION_IDS = ["original", "1080", "720", "480", "360"] as const;
export type ResolutionId = (typeof RESOLUTION_IDS)[number];

export type QualityLevel = "very-low" | "low" | "medium" | "high";

export type Preset = {
  id: PresetId;
  label: string;
  hint: string;
  quality: QualityLevel;
  resolution: ResolutionId;
};

export const PRESETS: Record<PresetId, Preset> = {
  crisp: {
    id: "crisp",
    label: "Crisp",
    hint: "Near-original look",
    quality: "high",
    resolution: "original",
  },
  balanced: {
    id: "balanced",
    label: "Balanced",
    hint: "The everyday pick",
    quality: "medium",
    resolution: "720",
  },
  small: {
    id: "small",
    label: "Small",
    hint: "Clear, much lighter",
    quality: "low",
    resolution: "480",
  },
  tiny: {
    id: "tiny",
    label: "Tiny",
    hint: "For chats and caps",
    quality: "very-low",
    resolution: "360",
  },
};

export const RESOLUTION_OPTIONS: {
  id: ResolutionId;
  label: string;
  maxWidth: number;
  maxHeight: number;
}[] = [
  { id: "original", label: "Original", maxWidth: 1920, maxHeight: 1080 },
  { id: "1080", label: "1080p", maxWidth: 1920, maxHeight: 1080 },
  { id: "720", label: "720p", maxWidth: 1280, maxHeight: 720 },
  { id: "480", label: "480p", maxWidth: 854, maxHeight: 480 },
  { id: "360", label: "360p", maxWidth: 640, maxHeight: 360 },
];

/** Bits per pixel per frame — used only for size estimates. */
export const BITS_PER_PIXEL: Record<QualityLevel, number> = {
  high: 0.1,
  medium: 0.055,
  low: 0.032,
  "very-low": 0.018,
};

export const AUDIO_BITRATE: Record<QualityLevel, number> = {
  high: 128_000,
  medium: 96_000,
  low: 64_000,
  "very-low": 48_000,
};

export const LONG_EDGE_CAP = 1920;

export function resolutionBox(id: ResolutionId): { maxWidth: number; maxHeight: number } {
  const found = RESOLUTION_OPTIONS.find((item) => item.id === id);
  return found ?? RESOLUTION_OPTIONS[0];
}

export function fitDimensions(
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } {
  const safeSrcW = Math.max(2, srcWidth);
  const safeSrcH = Math.max(2, srcHeight);
  const scale = Math.min(1, maxWidth / safeSrcW, maxHeight / safeSrcH);
  let width = Math.round(safeSrcW * scale);
  let height = Math.round(safeSrcH * scale);
  if (width % 2) width -= 1;
  if (height % 2) height -= 1;
  return { width: Math.max(2, width), height: Math.max(2, height) };
}

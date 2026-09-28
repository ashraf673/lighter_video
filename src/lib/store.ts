import { create } from "zustand";
import {
  CompressError,
  compressVideo,
  estimateOutputBytes,
  probeVideo,
  targetBitrateFromSize,
  type CompressResult,
  type VideoMeta,
} from "@/lib/compress";
import {
  AUDIO_BITRATE,
  PRESETS,
  type PresetId,
  type ResolutionId,
  resolutionBox,
} from "@/lib/presets";
import { holdScreen, releaseScreen } from "@/lib/wake-lock";

export type Phase = "empty" | "probing" | "ready" | "compressing" | "done" | "error";
export type TargetMode = "preset" | "size";

export type HistoryItem = {
  id: string;
  name: string;
  originalBytes: number;
  outputBytes: number;
  at: number;
};

const HISTORY_KEY = "pinch.history";

function readHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryItem[];
    return Array.isArray(parsed) ? parsed.slice(0, 8) : [];
  } catch {
    return [];
  }
}

function writeHistory(items: HistoryItem[]) {
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 8)));
  } catch {
    /* ignore quota */
  }
}

type AppState = {
  phase: Phase;
  file: File | null;
  previewUrl: string | null;
  resultUrl: string | null;
  meta: VideoMeta | null;
  presetId: PresetId;
  resolutionId: ResolutionId;
  targetMode: TargetMode;
  targetMb: number;
  progress: number;
  result: CompressResult | null;
  error: string | null;
  history: HistoryItem[];
  screenHeld: boolean;
  leftWhileEncoding: boolean;
  loadFile: (file: File) => Promise<void>;
  setPreset: (id: PresetId) => void;
  setResolution: (id: ResolutionId) => void;
  setTargetMb: (mb: number) => void;
  compress: () => Promise<void>;
  cancel: () => void;
  reset: () => void;
  markLeftWhileEncoding: () => void;
  restoreScreenHold: () => Promise<void>;
};

let abortController: AbortController | null = null;

function revoke(url: string | null) {
  if (url) URL.revokeObjectURL(url);
}

function messageFromUnknown(error: unknown): string {
  if (error instanceof CompressError) return error.message;
  if (error instanceof DOMException && error.name === "AbortError") {
    return "Compression cancelled.";
  }
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong while reading that video.";
}

export const useAppStore = create<AppState>((set, get) => ({
  phase: "empty",
  file: null,
  previewUrl: null,
  resultUrl: null,
  meta: null,
  presetId: "balanced",
  resolutionId: "720",
  targetMode: "preset",
  targetMb: 8,
  progress: 0,
  result: null,
  error: null,
  history: readHistory(),
  screenHeld: false,
  leftWhileEncoding: false,

  loadFile: async (file) => {
    abortController?.abort();
    abortController = null;
    const { previewUrl, resultUrl } = get();
    revoke(previewUrl);
    revoke(resultUrl);
    const nextPreview = URL.createObjectURL(file);
    set({
      phase: "probing",
      file,
      previewUrl: nextPreview,
      resultUrl: null,
      meta: null,
      result: null,
      error: null,
      progress: 0,
      screenHeld: false,
      leftWhileEncoding: false,
    });
    try {
      const meta = await probeVideo(file);
      const halfMb = Math.max(0.1, meta.bytes / 1_000_000 / 2);
      set({
        phase: "ready",
        meta,
        targetMb: Math.round(halfMb * 10) / 10,
        error: null,
      });
    } catch (error) {
      set({
        phase: "error",
        error: messageFromUnknown(error),
        meta: null,
      });
    }
  },

  setPreset: (id) => {
    const preset = PRESETS[id];
    set({
      presetId: id,
      resolutionId: preset.resolution,
      targetMode: "preset",
    });
  },

  setResolution: (id) => set({ resolutionId: id }),

  setTargetMb: (mb) =>
    set({
      targetMb: mb,
      targetMode: "size",
    }),

  compress: async () => {
    const { file, meta, presetId, resolutionId, targetMode, targetMb } = get();
    if (!file || !meta) return;

    abortController?.abort();
    abortController = new AbortController();
    const signal = abortController.signal;

    set({
      phase: "compressing",
      progress: 0,
      error: null,
      result: null,
      leftWhileEncoding: false,
    });
    revoke(get().resultUrl);

    const held = await holdScreen();
    set({ screenHeld: held });

    const preset = PRESETS[presetId];
    const box = resolutionBox(resolutionId);
    const targetVideoBitrate =
      targetMode === "size"
        ? targetBitrateFromSize(
            targetMb * 1_000_000,
            meta.duration,
            meta.hasAudio,
            preset.quality,
          )
        : null;

    try {
      const result = await compressVideo(
        file,
        {
          maxWidth: box.maxWidth,
          maxHeight: box.maxHeight,
          quality: preset.quality,
          targetVideoBitrate,
        },
        {
          signal,
          onProgress: (progress) => set({ progress }),
        },
      );
      const resultUrl = URL.createObjectURL(result.blob);
      const item: HistoryItem = {
        id: `${Date.now()}`,
        name: meta.name,
        originalBytes: meta.bytes,
        outputBytes: result.bytes,
        at: Date.now(),
      };
      const history = [item, ...get().history].slice(0, 8);
      writeHistory(history);
      set({
        phase: "done",
        result,
        resultUrl,
        progress: 1,
        history,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        set({ phase: "ready", progress: 0 });
        return;
      }
      set({
        phase: "error",
        error: messageFromUnknown(error),
        progress: 0,
      });
    } finally {
      abortController = null;
      await releaseScreen();
      set({ screenHeld: false });
    }
  },

  cancel: () => {
    abortController?.abort();
  },

  reset: () => {
    abortController?.abort();
    abortController = null;
    void releaseScreen();
    const { previewUrl, resultUrl } = get();
    revoke(previewUrl);
    revoke(resultUrl);
    set({
      phase: "empty",
      file: null,
      previewUrl: null,
      resultUrl: null,
      meta: null,
      result: null,
      error: null,
      progress: 0,
      targetMode: "preset",
      presetId: "balanced",
      resolutionId: "720",
      screenHeld: false,
      leftWhileEncoding: false,
    });
  },

  markLeftWhileEncoding: () => {
    if (get().phase === "compressing") set({ leftWhileEncoding: true });
  },

  restoreScreenHold: async () => {
    if (get().phase !== "compressing") return;
    const held = await holdScreen();
    set({ screenHeld: held });
  },
}));

export function currentEstimate(): number | null {
  const { meta, presetId, resolutionId, targetMode, targetMb } = useAppStore.getState();
  if (!meta) return null;
  if (targetMode === "size") return Math.round(targetMb * 1_000_000);
  const preset = PRESETS[presetId];
  const box = resolutionBox(resolutionId);
  return estimateOutputBytes(meta, {
    maxWidth: box.maxWidth,
    maxHeight: box.maxHeight,
    quality: preset.quality,
    targetVideoBitrate: null,
  });
}

export function currentOutputSize(meta: VideoMeta, state: Pick<
  AppState,
  "presetId" | "resolutionId" | "targetMode" | "targetMb"
>): number {
  if (state.targetMode === "size") return Math.round(state.targetMb * 1_000_000);
  const preset = PRESETS[state.presetId];
  const box = resolutionBox(state.resolutionId);
  return estimateOutputBytes(meta, {
    maxWidth: box.maxWidth,
    maxHeight: box.maxHeight,
    quality: preset.quality,
    targetVideoBitrate: null,
  });
}

export function audioBitrateFor(presetId: PresetId): number {
  return AUDIO_BITRATE[PRESETS[presetId].quality];
}

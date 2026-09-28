import {
  AUDIO_BITRATE,
  BITS_PER_PIXEL,
  type QualityLevel,
  fitDimensions,
} from "@/lib/presets";

export type VideoMeta = {
  name: string;
  bytes: number;
  duration: number;
  width: number;
  height: number;
  fps: number | null;
  videoCodec: string | null;
  audioCodec: string | null;
  hasAudio: boolean;
  mimeType: string;
};

export type CompressSettings = {
  maxWidth: number;
  maxHeight: number;
  quality: QualityLevel;
  /** When set, encode to this video bitrate instead of a qualitative level. */
  targetVideoBitrate: number | null;
};

export type CompressResult = {
  blob: Blob;
  bytes: number;
  width: number;
  height: number;
  mimeType: string;
  extension: "mp4" | "webm";
  codec: string;
};

export class CompressError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CompressError";
  }
}

export function estimateOutputBytes(meta: VideoMeta, settings: CompressSettings): number {
  const { width, height } = fitDimensions(
    meta.width,
    meta.height,
    settings.maxWidth,
    settings.maxHeight,
  );
  const fps = meta.fps && meta.fps > 1 && meta.fps < 120 ? meta.fps : 30;
  const videoBps =
    settings.targetVideoBitrate ?? width * height * fps * BITS_PER_PIXEL[settings.quality];
  const audioBps = meta.hasAudio ? AUDIO_BITRATE[settings.quality] : 0;
  const duration = Math.max(meta.duration, 0.2);
  const bytes = ((videoBps + audioBps) / 8) * duration * 1.05;
  return Math.max(12_000, Math.round(bytes));
}

export function targetBitrateFromSize(
  targetBytes: number,
  duration: number,
  hasAudio: boolean,
  quality: QualityLevel,
): number {
  const audioBps = hasAudio ? AUDIO_BITRATE[quality] : 0;
  const totalBps = (targetBytes * 8) / Math.max(duration, 0.2);
  return Math.max(80_000, Math.round(totalBps - audioBps));
}

type Mediabunny = typeof import("mediabunny");
type VideoCodec = import("mediabunny").VideoCodec;
type AudioCodec = import("mediabunny").AudioCodec;
type Quality = import("mediabunny").Quality;

let mediabunnyPromise: Promise<Mediabunny> | null = null;

function loadMediabunny(): Promise<Mediabunny> {
  mediabunnyPromise ??= import("mediabunny");
  return mediabunnyPromise;
}

async function openInput(mb: Mediabunny, file: File) {
  const input = new mb.Input({
    source: new mb.BlobSource(file),
    formats: mb.ALL_FORMATS,
  });
  const readable = await input.canRead();
  if (!readable) {
    input.dispose();
    throw new CompressError(
      "This file isn’t a video Pinch can read. Try MP4, MOV, or WebM.",
    );
  }
  return input;
}

export async function probeVideo(file: File): Promise<VideoMeta> {
  if (!file.type.startsWith("video/") && !looksLikeVideoName(file.name)) {
    throw new CompressError("Please choose a video file.");
  }
  const mb = await loadMediabunny();
  const input = await openInput(mb, file);
  try {
    const videoTrack = await input.getPrimaryVideoTrack();
    if (!videoTrack) {
      throw new CompressError("That file doesn’t contain a video track.");
    }

    const audioTrack = await input.getPrimaryAudioTrack();
    const durationFromMeta = await input.getDurationFromMetadata();
    const duration =
      durationFromMeta && durationFromMeta > 0
        ? durationFromMeta
        : await input.computeDuration();

    const width = await videoTrack.getDisplayWidth();
    const height = await videoTrack.getDisplayHeight();
    const videoCodec = await videoTrack.getCodec();
    const audioCodec = audioTrack ? await audioTrack.getCodec() : null;

    let fps: number | null = null;
    try {
      const metrics = await videoTrack.computeFrameRateMetrics({
        targetPacketCount: 48,
      });
      fps = metrics.bestGuessFrameRate;
    } catch {
      fps = null;
    }

    let mimeType = file.type;
    try {
      mimeType = await input.getMimeType();
    } catch {
      mimeType = file.type;
    }

    return {
      name: file.name,
      bytes: file.size,
      duration: Math.max(duration, 0),
      width,
      height,
      fps,
      videoCodec,
      audioCodec,
      hasAudio: Boolean(audioTrack),
      mimeType,
    };
  } finally {
    input.dispose();
  }
}

function looksLikeVideoName(name: string): boolean {
  return /\.(mp4|m4v|mov|qt|webm|mkv|avi|mpeg|mpg|3gp|ts)$/i.test(name);
}

function isRetryableEncodeError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /encoder configuration|not supported in this environment|cannot be encoded|could not be encoded/i.test(
    message,
  );
}

type Attempt = {
  container: "mp4" | "webm";
  videoCodecs: VideoCodec[];
  audioCodecs: AudioCodec[];
  qualityMode: "bitrate" | "qualitative";
};

export async function compressVideo(
  file: File,
  settings: CompressSettings,
  handlers: {
    onProgress?: (progress: number) => void;
    signal?: AbortSignal;
  } = {},
): Promise<CompressResult> {
  if (handlers.signal?.aborted) {
    throw new DOMException("Cancelled", "AbortError");
  }

  const mb = await loadMediabunny();

  const probeInput = await openInput(mb, file);
  let width: number;
  let height: number;
  try {
    const videoTrack = await probeInput.getPrimaryVideoTrack();
    if (!videoTrack) {
      throw new CompressError("That file doesn’t contain a video track.");
    }
    const srcWidth = await videoTrack.getDisplayWidth();
    const srcHeight = await videoTrack.getDisplayHeight();
    ({ width, height } = fitDimensions(
      srcWidth,
      srcHeight,
      settings.maxWidth,
      settings.maxHeight,
    ));
  } finally {
    probeInput.dispose();
  }

  const attempts: Attempt[] = [
    {
      container: "mp4",
      videoCodecs: ["avc", "hevc"],
      audioCodecs: ["aac", "mp3"],
      qualityMode: settings.targetVideoBitrate ? "bitrate" : "qualitative",
    },
    {
      container: "webm",
      videoCodecs: ["vp9", "av1", "vp8"],
      audioCodecs: ["opus", "vorbis", "aac"],
      qualityMode: settings.targetVideoBitrate ? "bitrate" : "qualitative",
    },
    {
      container: "webm",
      videoCodecs: ["vp8", "vp9"],
      audioCodecs: ["opus", "vorbis"],
      qualityMode: "qualitative",
    },
  ];

  let lastError: unknown = null;

  for (const attempt of attempts) {
    if (handlers.signal?.aborted) {
      throw new DOMException("Cancelled", "AbortError");
    }
    try {
      return await runAttempt(mb, file, settings, width, height, attempt, handlers);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") throw error;
      if (error instanceof mb.ConversionCanceledError) {
        throw new DOMException("Cancelled", "AbortError");
      }
      lastError = error;
      if (!isRetryableEncodeError(error)) {
        break;
      }
    }
  }

  if (lastError instanceof CompressError) throw lastError;
  throw new CompressError(
    "This device couldn’t encode that clip. Try a lower size, or another browser.",
  );
}

async function runAttempt(
  mb: Mediabunny,
  file: File,
  settings: CompressSettings,
  width: number,
  height: number,
  attempt: Attempt,
  handlers: {
    onProgress?: (progress: number) => void;
    signal?: AbortSignal;
  },
): Promise<CompressResult> {
  const quality = buildQuality(mb, settings, attempt.qualityMode);
  const videoCodec = await mb.getFirstEncodableVideoCodec(attempt.videoCodecs, {
    width,
    height,
    quality,
  });
  if (!videoCodec) {
    throw new Error("encoder configuration is not supported in this environment");
  }

  const audioCodec = await mb.getFirstEncodableAudioCodec(attempt.audioCodecs, {
    quality: new mb.Quality(settings.quality),
  });

  const input = await openInput(mb, file);
  const target = new mb.BufferTarget();
  const output = new mb.Output({
    format:
      attempt.container === "mp4" ? new mb.Mp4OutputFormat() : new mb.WebMOutputFormat(),
    target,
  });

  try {
    const conversion = await mb.Conversion.init({
      input,
      output,
      tracks: "primary",
      showWarnings: false,
      video: {
        width,
        height,
        fit: "contain",
        codec: videoCodec,
        quality,
        forceTranscode: true,
      },
      audio: audioCodec
        ? {
            codec: audioCodec,
            quality: new mb.Quality(settings.quality),
            forceTranscode: true,
          }
        : { discard: true },
    });

    if (!conversion.isValid) {
      const reasons = conversion.discardedTracks.map((item) => item.reason);
      if (reasons.includes("no_encodable_target_codec")) {
        throw new Error("encoder configuration is not supported in this environment");
      }
      if (reasons.includes("undecodable_source_codec")) {
        throw new CompressError(
          "This browser can’t decode that video. Export it as MP4 and try again.",
        );
      }
      throw new CompressError("Couldn’t set up compression for this file.");
    }

    const onAbort = () => {
      void conversion.cancel();
    };
    handlers.signal?.addEventListener("abort", onAbort, { once: true });

    conversion.onProgress = (progress) => {
      handlers.onProgress?.(Math.min(1, Math.max(0, progress)));
    };

    try {
      await conversion.execute();
    } finally {
      handlers.signal?.removeEventListener("abort", onAbort);
    }

    const buffer = target.buffer;
    if (!buffer || buffer.byteLength === 0) {
      throw new CompressError("Compression finished without a file. Try another clip.");
    }

    const mimeType = attempt.container === "mp4" ? "video/mp4" : "video/webm";
    const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
    return {
      blob,
      bytes: blob.size,
      width,
      height,
      mimeType,
      extension: attempt.container,
      codec: videoCodec,
    };
  } finally {
    input.dispose();
  }
}

function buildQuality(
  mb: Mediabunny,
  settings: CompressSettings,
  mode: "bitrate" | "qualitative",
): Quality {
  if (mode === "bitrate" && settings.targetVideoBitrate) {
    return new mb.Quality({
      bitrate: settings.targetVideoBitrate,
      bitrateMode: "variable",
    });
  }
  return new mb.Quality({
    quality: settings.quality,
    preferBitrate: false,
    bitrateMode: "variable",
  });
}

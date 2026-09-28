import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, r as Slot, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as RotateCcw, c as Film, i as Sun, l as Download, n as Upload, o as LoaderCircle, s as Info, t as X, u as ArrowDown } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { a as DialogOverlay$1, c as DialogTrigger$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as Root, t as Indicator } from "../_libs/radix-ui__react-progress.mjs";
import { t as Root$1 } from "../_libs/radix-ui__react-label.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BGTKmCC5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function PinchMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: cn("rounded-md bg-secondary text-primary", className),
		fill: "none",
		"aria-hidden": true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: "11",
			y: "7",
			width: "10",
			height: "18",
			rx: "2.5",
			fill: "currentColor"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M6.25 10.5v11M25.75 10.5v11",
			stroke: "currentColor",
			strokeWidth: "2.75",
			strokeLinecap: "round"
		})]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-[color,background-color,box-shadow,transform,opacity] duration-quick ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			outline: "border border-border bg-transparent text-foreground hover:bg-card",
			ghost: "text-foreground hover:bg-accent",
			destructive: "bg-destructive text-white hover:bg-destructive/90"
		},
		size: {
			default: "h-11 min-h-11 px-4",
			sm: "h-9 min-h-9 rounded-md px-3 text-xs",
			lg: "h-12 min-h-12 px-5 text-base",
			icon: "size-11 min-h-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var PRESET_IDS = [
	"crisp",
	"balanced",
	"small",
	"tiny"
];
var PRESETS = {
	crisp: {
		id: "crisp",
		label: "Crisp",
		hint: "Near-original look",
		quality: "high",
		resolution: "original"
	},
	balanced: {
		id: "balanced",
		label: "Balanced",
		hint: "The everyday pick",
		quality: "medium",
		resolution: "720"
	},
	small: {
		id: "small",
		label: "Small",
		hint: "Clear, much lighter",
		quality: "low",
		resolution: "480"
	},
	tiny: {
		id: "tiny",
		label: "Tiny",
		hint: "For chats and caps",
		quality: "very-low",
		resolution: "360"
	}
};
var RESOLUTION_OPTIONS = [
	{
		id: "original",
		label: "Original",
		maxWidth: 1920,
		maxHeight: 1080
	},
	{
		id: "1080",
		label: "1080p",
		maxWidth: 1920,
		maxHeight: 1080
	},
	{
		id: "720",
		label: "720p",
		maxWidth: 1280,
		maxHeight: 720
	},
	{
		id: "480",
		label: "480p",
		maxWidth: 854,
		maxHeight: 480
	},
	{
		id: "360",
		label: "360p",
		maxWidth: 640,
		maxHeight: 360
	}
];
/** Bits per pixel per frame — used only for size estimates. */
var BITS_PER_PIXEL = {
	high: .1,
	medium: .055,
	low: .032,
	"very-low": .018
};
var AUDIO_BITRATE = {
	high: 128e3,
	medium: 96e3,
	low: 64e3,
	"very-low": 48e3
};
function resolutionBox(id) {
	return RESOLUTION_OPTIONS.find((item) => item.id === id) ?? RESOLUTION_OPTIONS[0];
}
function fitDimensions(srcWidth, srcHeight, maxWidth, maxHeight) {
	const safeSrcW = Math.max(2, srcWidth);
	const safeSrcH = Math.max(2, srcHeight);
	const scale = Math.min(1, maxWidth / safeSrcW, maxHeight / safeSrcH);
	let width = Math.round(safeSrcW * scale);
	let height = Math.round(safeSrcH * scale);
	if (width % 2) width -= 1;
	if (height % 2) height -= 1;
	return {
		width: Math.max(2, width),
		height: Math.max(2, height)
	};
}
var CompressError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "CompressError";
	}
};
function estimateOutputBytes(meta, settings) {
	const { width, height } = fitDimensions(meta.width, meta.height, settings.maxWidth, settings.maxHeight);
	const fps = meta.fps && meta.fps > 1 && meta.fps < 120 ? meta.fps : 30;
	const videoBps = settings.targetVideoBitrate ?? width * height * fps * BITS_PER_PIXEL[settings.quality];
	const audioBps = meta.hasAudio ? AUDIO_BITRATE[settings.quality] : 0;
	const duration = Math.max(meta.duration, .2);
	const bytes = (videoBps + audioBps) / 8 * duration * 1.05;
	return Math.max(12e3, Math.round(bytes));
}
function targetBitrateFromSize(targetBytes, duration, hasAudio, quality) {
	const audioBps = hasAudio ? AUDIO_BITRATE[quality] : 0;
	const totalBps = targetBytes * 8 / Math.max(duration, .2);
	return Math.max(8e4, Math.round(totalBps - audioBps));
}
var mediabunnyPromise = null;
function loadMediabunny() {
	mediabunnyPromise ??= import("../_libs/mediabunny.mjs").then((n) => n.t);
	return mediabunnyPromise;
}
async function openInput(mb, file) {
	const input = new mb.Input({
		source: new mb.BlobSource(file),
		formats: mb.ALL_FORMATS
	});
	if (!await input.canRead()) {
		input.dispose();
		throw new CompressError("This file isn’t a video Pinch can read. Try MP4, MOV, or WebM.");
	}
	return input;
}
async function probeVideo(file) {
	if (!file.type.startsWith("video/") && !looksLikeVideoName(file.name)) throw new CompressError("Please choose a video file.");
	const input = await openInput(await loadMediabunny(), file);
	try {
		const videoTrack = await input.getPrimaryVideoTrack();
		if (!videoTrack) throw new CompressError("That file doesn’t contain a video track.");
		const audioTrack = await input.getPrimaryAudioTrack();
		const durationFromMeta = await input.getDurationFromMetadata();
		const duration = durationFromMeta && durationFromMeta > 0 ? durationFromMeta : await input.computeDuration();
		const width = await videoTrack.getDisplayWidth();
		const height = await videoTrack.getDisplayHeight();
		const videoCodec = await videoTrack.getCodec();
		const audioCodec = audioTrack ? await audioTrack.getCodec() : null;
		let fps = null;
		try {
			fps = (await videoTrack.computeFrameRateMetrics({ targetPacketCount: 48 })).bestGuessFrameRate;
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
			mimeType
		};
	} finally {
		input.dispose();
	}
}
function looksLikeVideoName(name) {
	return /\.(mp4|m4v|mov|qt|webm|mkv|avi|mpeg|mpg|3gp|ts)$/i.test(name);
}
function isRetryableEncodeError(error) {
	const message = error instanceof Error ? error.message : String(error);
	return /encoder configuration|not supported in this environment|cannot be encoded|could not be encoded/i.test(message);
}
async function compressVideo(file, settings, handlers = {}) {
	if (handlers.signal?.aborted) throw new DOMException("Cancelled", "AbortError");
	const mb = await loadMediabunny();
	const probeInput = await openInput(mb, file);
	let width;
	let height;
	try {
		const videoTrack = await probeInput.getPrimaryVideoTrack();
		if (!videoTrack) throw new CompressError("That file doesn’t contain a video track.");
		const srcWidth = await videoTrack.getDisplayWidth();
		const srcHeight = await videoTrack.getDisplayHeight();
		({width, height} = fitDimensions(srcWidth, srcHeight, settings.maxWidth, settings.maxHeight));
	} finally {
		probeInput.dispose();
	}
	const attempts = [
		{
			container: "mp4",
			videoCodecs: ["avc", "hevc"],
			audioCodecs: ["aac", "mp3"],
			qualityMode: settings.targetVideoBitrate ? "bitrate" : "qualitative"
		},
		{
			container: "webm",
			videoCodecs: [
				"vp9",
				"av1",
				"vp8"
			],
			audioCodecs: [
				"opus",
				"vorbis",
				"aac"
			],
			qualityMode: settings.targetVideoBitrate ? "bitrate" : "qualitative"
		},
		{
			container: "webm",
			videoCodecs: ["vp8", "vp9"],
			audioCodecs: ["opus", "vorbis"],
			qualityMode: "qualitative"
		}
	];
	let lastError = null;
	for (const attempt of attempts) {
		if (handlers.signal?.aborted) throw new DOMException("Cancelled", "AbortError");
		try {
			return await runAttempt(mb, file, settings, width, height, attempt, handlers);
		} catch (error) {
			if (error instanceof DOMException && error.name === "AbortError") throw error;
			if (error instanceof mb.ConversionCanceledError) throw new DOMException("Cancelled", "AbortError");
			lastError = error;
			if (!isRetryableEncodeError(error)) break;
		}
	}
	if (lastError instanceof CompressError) throw lastError;
	throw new CompressError("This device couldn’t encode that clip. Try a lower size, or another browser.");
}
async function runAttempt(mb, file, settings, width, height, attempt, handlers) {
	const quality = buildQuality(mb, settings, attempt.qualityMode);
	const videoCodec = await mb.getFirstEncodableVideoCodec(attempt.videoCodecs, {
		width,
		height,
		quality
	});
	if (!videoCodec) throw new Error("encoder configuration is not supported in this environment");
	const audioCodec = await mb.getFirstEncodableAudioCodec(attempt.audioCodecs, { quality: new mb.Quality(settings.quality) });
	const input = await openInput(mb, file);
	const target = new mb.BufferTarget();
	const output = new mb.Output({
		format: attempt.container === "mp4" ? new mb.Mp4OutputFormat() : new mb.WebMOutputFormat(),
		target
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
				forceTranscode: true
			},
			audio: audioCodec ? {
				codec: audioCodec,
				quality: new mb.Quality(settings.quality),
				forceTranscode: true
			} : { discard: true }
		});
		if (!conversion.isValid) {
			const reasons = conversion.discardedTracks.map((item) => item.reason);
			if (reasons.includes("no_encodable_target_codec")) throw new Error("encoder configuration is not supported in this environment");
			if (reasons.includes("undecodable_source_codec")) throw new CompressError("This browser can’t decode that video. Export it as MP4 and try again.");
			throw new CompressError("Couldn’t set up compression for this file.");
		}
		const onAbort = () => {
			conversion.cancel();
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
		if (!buffer || buffer.byteLength === 0) throw new CompressError("Compression finished without a file. Try another clip.");
		const mimeType = attempt.container === "mp4" ? "video/mp4" : "video/webm";
		const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
		return {
			blob,
			bytes: blob.size,
			width,
			height,
			mimeType,
			extension: attempt.container,
			codec: videoCodec
		};
	} finally {
		input.dispose();
	}
}
function buildQuality(mb, settings, mode) {
	if (mode === "bitrate" && settings.targetVideoBitrate) return new mb.Quality({
		bitrate: settings.targetVideoBitrate,
		bitrateMode: "variable"
	});
	return new mb.Quality({
		quality: settings.quality,
		preferBitrate: false,
		bitrateMode: "variable"
	});
}
var sentinel = null;
async function holdScreen() {
	if (typeof navigator === "undefined" || !("wakeLock" in navigator)) return false;
	try {
		if (sentinel && !sentinel.released) await sentinel.release();
	} catch {}
	sentinel = null;
	try {
		sentinel = await navigator.wakeLock.request("screen");
		sentinel.addEventListener("release", () => {
			sentinel = null;
		});
		return true;
	} catch {
		sentinel = null;
		return false;
	}
}
async function releaseScreen() {
	const current = sentinel;
	sentinel = null;
	if (!current || current.released) return;
	try {
		await current.release();
	} catch {}
}
var HISTORY_KEY = "pinch.history";
function readHistory() {
	if (typeof window === "undefined") return [];
	try {
		const raw = window.localStorage.getItem(HISTORY_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed.slice(0, 8) : [];
	} catch {
		return [];
	}
}
function writeHistory(items) {
	try {
		window.localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 8)));
	} catch {}
}
var abortController = null;
function revoke(url) {
	if (url) URL.revokeObjectURL(url);
}
function messageFromUnknown(error) {
	if (error instanceof CompressError) return error.message;
	if (error instanceof DOMException && error.name === "AbortError") return "Compression cancelled.";
	if (error instanceof Error && error.message) return error.message;
	return "Something went wrong while reading that video.";
}
var useAppStore = create((set, get) => ({
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
		set({
			phase: "probing",
			file,
			previewUrl: URL.createObjectURL(file),
			resultUrl: null,
			meta: null,
			result: null,
			error: null,
			progress: 0,
			screenHeld: false,
			leftWhileEncoding: false
		});
		try {
			const meta = await probeVideo(file);
			const halfMb = Math.max(.1, meta.bytes / 1e6 / 2);
			set({
				phase: "ready",
				meta,
				targetMb: Math.round(halfMb * 10) / 10,
				error: null
			});
		} catch (error) {
			set({
				phase: "error",
				error: messageFromUnknown(error),
				meta: null
			});
		}
	},
	setPreset: (id) => {
		const preset = PRESETS[id];
		set({
			presetId: id,
			resolutionId: preset.resolution,
			targetMode: "preset"
		});
	},
	setResolution: (id) => set({ resolutionId: id }),
	setTargetMb: (mb) => set({
		targetMb: mb,
		targetMode: "size"
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
			leftWhileEncoding: false
		});
		revoke(get().resultUrl);
		set({ screenHeld: await holdScreen() });
		const preset = PRESETS[presetId];
		const box = resolutionBox(resolutionId);
		const targetVideoBitrate = targetMode === "size" ? targetBitrateFromSize(targetMb * 1e6, meta.duration, meta.hasAudio, preset.quality) : null;
		try {
			const result = await compressVideo(file, {
				maxWidth: box.maxWidth,
				maxHeight: box.maxHeight,
				quality: preset.quality,
				targetVideoBitrate
			}, {
				signal,
				onProgress: (progress) => set({ progress })
			});
			const resultUrl = URL.createObjectURL(result.blob);
			const history = [{
				id: `${Date.now()}`,
				name: meta.name,
				originalBytes: meta.bytes,
				outputBytes: result.bytes,
				at: Date.now()
			}, ...get().history].slice(0, 8);
			writeHistory(history);
			set({
				phase: "done",
				result,
				resultUrl,
				progress: 1,
				history
			});
		} catch (error) {
			if (error instanceof DOMException && error.name === "AbortError") {
				set({
					phase: "ready",
					progress: 0
				});
				return;
			}
			set({
				phase: "error",
				error: messageFromUnknown(error),
				progress: 0
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
		releaseScreen();
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
			leftWhileEncoding: false
		});
	},
	markLeftWhileEncoding: () => {
		if (get().phase === "compressing") set({ leftWhileEncoding: true });
	},
	restoreScreenHold: async () => {
		if (get().phase !== "compressing") return;
		set({ screenHeld: await holdScreen() });
	}
}));
function currentOutputSize(meta, state) {
	if (state.targetMode === "size") return Math.round(state.targetMb * 1e6);
	const preset = PRESETS[state.presetId];
	const box = resolutionBox(state.resolutionId);
	return estimateOutputBytes(meta, {
		maxWidth: box.maxWidth,
		maxHeight: box.maxHeight,
		quality: preset.quality,
		targetVideoBitrate: null
	});
}
function pickVideo(files) {
	if (!files) return null;
	const list = Array.from(files);
	return list.find((file) => file.type.startsWith("video/")) ?? list[0] ?? null;
}
function DropZone() {
	const inputRef = (0, import_react.useRef)(null);
	const loadFile = useAppStore((s) => s.loadFile);
	const phase = useAppStore((s) => s.phase);
	const [over, setOver] = (0, import_react.useState)(false);
	const busy = phase === "probing";
	const onFiles = (0, import_react.useCallback)((files) => {
		const file = pickVideo(files);
		if (file) loadFile(file);
	}, [loadFile]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "button",
		tabIndex: 0,
		onClick: () => inputRef.current?.click(),
		onKeyDown: (event) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				inputRef.current?.click();
			}
		},
		onDragEnter: (event) => {
			event.preventDefault();
			setOver(true);
		},
		onDragOver: (event) => {
			event.preventDefault();
			setOver(true);
		},
		onDragLeave: () => setOver(false),
		onDrop: (event) => {
			event.preventDefault();
			setOver(false);
			onFiles(event.dataTransfer.files);
		},
		className: cn("group relative flex min-h-64 cursor-pointer flex-col items-center justify-center gap-4 rounded-xl bg-secondary/60 px-6 py-10 text-center outline-none transition-[box-shadow,background-color] duration-quick ease-out-expo", "shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]", over && "bg-secondary shadow-[var(--shadow-border-hover)]", "focus-visible:ring-2 focus-visible:ring-ring"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				type: "file",
				accept: "video/*",
				className: "sr-only",
				onChange: (event) => {
					onFiles(event.target.files);
					event.target.value = "";
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex size-12 items-center justify-center rounded-lg bg-card text-foreground",
				children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-5 animate-pulse" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, { className: "size-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-base font-medium text-foreground",
					children: busy ? "Reading video…" : "Drop a video here"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "MP4, MOV, or WebM. Stays on this device."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "secondary",
				className: "pointer-events-none",
				tabIndex: -1,
				children: "Choose a video"
			})
		]
	});
}
var Progress = import_react.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("relative h-1.5 w-full overflow-hidden rounded-full bg-secondary", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Indicator, {
		className: "h-full w-full flex-1 bg-primary transition-transform duration-quick ease-out-expo",
		style: { transform: `translateX(-${100 - (value ?? 0)}%)` }
	})
}));
Progress.displayName = Root.displayName;
function formatBytes(bytes) {
	if (!Number.isFinite(bytes) || bytes < 0) return "—";
	if (bytes < 1e3) return `${Math.round(bytes)} B`;
	const units = [
		"KB",
		"MB",
		"GB",
		"TB"
	];
	let value = bytes / 1e3;
	let unit = 0;
	while (value >= 1e3 && unit < units.length - 1) {
		value /= 1e3;
		unit += 1;
	}
	const digits = value >= 100 ? 0 : value >= 10 ? 1 : 2;
	return `${value.toFixed(digits)} ${units[unit]}`;
}
function formatDuration(seconds) {
	if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
	const total = Math.round(seconds);
	const h = Math.floor(total / 3600);
	const m = Math.floor(total % 3600 / 60);
	const s = total % 60;
	if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
	return `${m}:${String(s).padStart(2, "0")}`;
}
function formatPercent(value) {
	if (!Number.isFinite(value)) return "—";
	return `${Math.abs(value) >= 10 ? Math.round(value) : Math.round(value * 10) / 10}%`;
}
function stemFromFilename(name) {
	const trimmed = name.trim() || "video";
	const dot = trimmed.lastIndexOf(".");
	if (dot <= 0) return trimmed;
	return trimmed.slice(0, dot);
}
function VideoStage() {
	const phase = useAppStore((s) => s.phase);
	const meta = useAppStore((s) => s.meta);
	const previewUrl = useAppStore((s) => s.previewUrl);
	const resultUrl = useAppStore((s) => s.resultUrl);
	const progress = useAppStore((s) => s.progress);
	const reset = useAppStore((s) => s.reset);
	const src = phase === "done" && resultUrl ? resultUrl : previewUrl;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-xl bg-secondary",
		children: [
			src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				src,
				className: "aspect-video w-full bg-background object-contain",
				controls: phase !== "compressing",
				playsInline: true,
				muted: phase === "compressing",
				preload: "auto"
			}, src) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-video w-full bg-secondary" }),
			phase === "compressing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-background/80 px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-foreground",
						children: "Encoding"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono tabular-nums text-muted-foreground",
						children: [Math.round(progress * 100), "%"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: progress * 100 })]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				size: "icon",
				variant: "secondary",
				className: "absolute top-3 right-3 size-9 min-h-9",
				onClick: reset,
				"aria-label": "Remove video",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
			}),
			meta ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border px-4 py-3 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "max-w-48 truncate font-medium text-foreground",
						children: meta.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono tabular-nums",
						children: formatBytes(meta.bytes)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono tabular-nums",
						children: [
							meta.width,
							"×",
							meta.height
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono tabular-nums",
						children: formatDuration(meta.duration)
					})
				]
			}) : null
		]
	});
}
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root$1, {
	ref,
	className: cn("text-sm font-medium text-foreground", className),
	...props
}));
Label.displayName = Root$1.displayName;
var Slider = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
	ref,
	className: cn("relative flex w-full touch-none select-none items-center", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
		className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-secondary",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-primary" })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-5 rounded-full border border-border bg-primary shadow-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" })]
}));
Slider.displayName = Slider$1.displayName;
function SettingsPanel() {
	const meta = useAppStore((s) => s.meta);
	const presetId = useAppStore((s) => s.presetId);
	const resolutionId = useAppStore((s) => s.resolutionId);
	const targetMode = useAppStore((s) => s.targetMode);
	const targetMb = useAppStore((s) => s.targetMb);
	const phase = useAppStore((s) => s.phase);
	const setPreset = useAppStore((s) => s.setPreset);
	const setResolution = useAppStore((s) => s.setResolution);
	const setTargetMb = useAppStore((s) => s.setTargetMb);
	const disabled = phase === "compressing";
	if (!meta) return null;
	const estimate = currentOutputSize(meta, {
		presetId,
		resolutionId,
		targetMode,
		targetMb
	});
	const ratio = estimate / Math.max(meta.bytes, 1);
	const smaller = Math.max(0, (1 - ratio) * 100);
	const maxMb = Math.max(2, Math.ceil(meta.bytes / 1e6));
	const sourceMax = Math.max(meta.width, meta.height);
	const sizes = RESOLUTION_OPTIONS.filter((option) => {
		if (option.id === "original") return true;
		if (option.id === "1080") return sourceMax > 1280;
		return true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
				disabled,
				className: "flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
					className: "text-sm font-medium text-foreground",
					children: "Quality"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2",
					children: PRESET_IDS.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PresetCard, {
						id,
						selected: presetId === id && targetMode === "preset",
						onSelect: () => setPreset(id)
					}, id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
				disabled,
				className: "flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: "text-sm font-medium text-foreground",
						children: "Size"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: sizes.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setResolution(option.id),
							className: cn("h-11 min-h-11 rounded-lg px-3.5 text-sm font-medium transition-colors duration-quick ease-out-expo", resolutionId === option.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"),
							children: option.label
						}, option.id))
					}),
					sourceMax > 1920 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Clips larger than 1080p are scaled down so this device can encode them."
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "target-size",
							children: "Target size"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-sm tabular-nums text-muted-foreground",
							children: [targetMb.toFixed(1), " MB"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						id: "target-size",
						min: .1,
						max: maxMb,
						step: .1,
						value: [Math.min(targetMb, maxMb)],
						disabled,
						onValueChange: (value) => setTargetMb(value[0] ?? targetMb)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Drag to aim at a file size. Quality presets reset this."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-3 rounded-xl bg-secondary/70 px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-0.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: "Estimated"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-lg font-medium tabular-nums text-foreground",
						children: [
							formatBytes(meta.bytes),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: " → "
							}),
							formatBytes(estimate)
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("font-mono text-sm tabular-nums", smaller > 5 ? "text-gain" : "text-muted-foreground"),
					children: smaller > 5 ? `${Math.round(smaller)}% smaller` : "Similar size"
				})]
			})
		]
	});
}
function PresetCard({ id, selected, onSelect }) {
	const preset = PRESETS[id];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: onSelect,
		className: cn("flex min-h-16 flex-col items-start gap-0.5 rounded-xl px-3.5 py-3 text-left transition-[background-color,box-shadow] duration-quick ease-out-expo", selected ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-medium",
			children: preset.label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("text-xs", selected ? "text-primary-foreground/70" : "text-muted-foreground"),
			children: preset.hint
		})]
	});
}
function ResultCard() {
	const meta = useAppStore((s) => s.meta);
	const result = useAppStore((s) => s.result);
	const resultUrl = useAppStore((s) => s.resultUrl);
	const reset = useAppStore((s) => s.reset);
	if (!meta || !result || !resultUrl) return null;
	const ratio = (meta.bytes - result.bytes) / Math.max(meta.bytes, 1);
	const grew = result.bytes >= meta.bytes;
	const download = () => {
		const link = document.createElement("a");
		link.href = resultUrl;
		link.download = `${stemFromFilename(meta.name)}-pinch.${result.extension}`;
		document.body.appendChild(link);
		link.click();
		link.remove();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5 rounded-xl bg-secondary/70 p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: grew ? "Result" : "Saved"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("font-display text-3xl font-medium tracking-tight", grew ? "text-foreground" : "text-gain"),
						children: grew ? "Already lean" : `${formatPercent(ratio * 100)} smaller`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: grew ? "This clip was already tightly encoded. Try Tiny or a lower size." : `${formatBytes(meta.bytes)} down to ${formatBytes(result.bytes)}.`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SizeBar, {
					label: "Original",
					bytes: meta.bytes,
					max: meta.bytes
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SizeBar, {
					label: "Pinch",
					bytes: result.bytes,
					max: meta.bytes,
					accent: !grew
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					className: "flex-1",
					onClick: download,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }),
						"Download ",
						result.extension.toUpperCase()
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "secondary",
					className: "flex-1",
					onClick: reset,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), "New video"]
				})]
			})
		]
	});
}
function SizeBar({ label, bytes, max, accent }) {
	const width = `${Math.max(8, Math.min(100, bytes / Math.max(max, 1) * 100))}%`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono tabular-nums text-foreground",
				children: formatBytes(bytes)
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-1.5 overflow-hidden rounded-full bg-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("h-full rounded-full", accent ? "bg-gain" : "bg-primary/70"),
				style: { width }
			})
		})]
	});
}
var Dialog = Dialog$1;
var DialogTrigger = DialogTrigger$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-background/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed top-1/2 left-4 right-4 z-50 mx-auto grid max-w-md -translate-y-1/2 gap-4 rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-xl duration-fast data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute top-4 right-4 rounded-sm text-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1.5 text-left", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-display text-xl font-medium tracking-tight", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("text-sm leading-relaxed text-muted-foreground", className),
		...props
	});
}
function CompressorApp() {
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
	(0, import_react.useEffect)(() => {
		const onPaste = (event) => {
			const file = event.clipboardData?.files?.[0];
			if (file) loadFile(file);
		};
		window.addEventListener("paste", onPaste);
		return () => window.removeEventListener("paste", onPaste);
	}, [loadFile]);
	(0, import_react.useEffect)(() => {
		if (phase !== "compressing") return;
		const onUnload = (event) => {
			event.preventDefault();
			event.returnValue = "";
		};
		const onVisibility = () => {
			if (document.visibilityState === "hidden") markLeftWhileEncoding();
			else restoreScreenHold();
		};
		window.addEventListener("beforeunload", onUnload);
		document.addEventListener("visibilitychange", onVisibility);
		return () => {
			window.removeEventListener("beforeunload", onUnload);
			document.removeEventListener("visibilitychange", onVisibility);
		};
	}, [
		phase,
		markLeftWhileEncoding,
		restoreScreenHold
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-dvh flex-col bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between px-5 pt-5 pb-2 sm:px-8 sm:pt-7",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinchMark, { className: "size-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-xl font-medium tracking-tight",
					children: "Pinch"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowItWorks, {})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-5 py-6 sm:px-8 sm:py-10",
			children: [!hasFile ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoStage, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-5",
					children: [
						phase === "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultCard, {}) : meta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsPanel, {}) : null,
						phase === "compressing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StayOpenNote, {
							screenHeld,
							leftWhileEncoding
						}) : null,
						error && phase === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rounded-xl bg-destructive/12 px-4 py-3 text-sm text-destructive",
							children: error
						}) : null,
						phase === "done" ? null : phase === "compressing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "secondary",
							onClick: cancel,
							children: "Cancel"
						}) : meta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "sticky bottom-0 z-10 -mx-5 border-t border-border bg-background px-5 py-3 md:static md:mx-0 md:border-0 md:p-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								size: "lg",
								className: "w-full",
								onClick: () => void compress(),
								disabled: phase === "probing",
								children: [phase === "probing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "size-4" }), "Compress video"]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "secondary",
							onClick: reset,
							children: "Try another video"
						})
					]
				})]
			}), history.length > 0 && !hasFile ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium text-muted-foreground",
					children: "Recent"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border rounded-xl border border-border",
					children: history.slice(0, 4).map((item) => {
						const pct = (item.originalBytes - item.outputBytes) / Math.max(item.originalBytes, 1);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between gap-3 px-4 py-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0 truncate text-foreground",
								children: item.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "shrink-0 font-mono text-xs tabular-nums text-muted-foreground",
								children: [
									formatBytes(item.originalBytes),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-border",
										children: " → "
									}),
									formatBytes(item.outputBytes),
									pct > .05 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-gain",
										children: [
											" ",
											"· ",
											Math.round(pct * 100),
											"%"
										]
									}) : null
								]
							})]
						}, item.id);
					})
				})]
			}) : null]
		})]
	});
}
function StayOpenNote({ screenHeld, leftWhileEncoding }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-3 rounded-xl bg-secondary px-4 py-3 text-sm leading-relaxed text-secondary-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, {
			className: "mt-0.5 size-4 shrink-0 text-muted-foreground",
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: leftWhileEncoding ? "Encoding pauses if this screen is hidden. Stay here and it should continue." : screenHeld ? "Screen stays on until this finishes. Leave Pinch open — phones freeze encoding in the background." : "Keep this screen open. Phones freeze encoding if you switch apps or lock the phone." })]
	});
}
function EmptyState() {
	const error = useAppStore((s) => s.error);
	const phase = useAppStore((s) => s.phase);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full max-w-lg flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "stagger flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl leading-tight font-medium tracking-tight text-balance sm:text-5xl",
					children: "Lighter videos."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-md text-base leading-relaxed text-pretty text-muted-foreground",
					children: "Drop a clip, pick a size, download a smaller file. Nothing is uploaded — encoding happens on this device."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropZone, {}),
			error && phase === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-xl bg-destructive/12 px-4 py-3 text-sm text-destructive",
				children: error
			}) : null
		]
	});
}
function HowItWorks() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "button",
			variant: "ghost",
			size: "icon",
			"aria-label": "How Pinch works",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-4" })
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "How Pinch works" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "A private video compressor that runs entirely in your browser." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
		className: "flex list-decimal flex-col gap-3 pl-4 text-sm leading-relaxed text-muted-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Choose a video from your library. It never leaves this device." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Pick a quality preset, a resolution, or a target file size." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Pinch re-encodes the clip with your browser’s hardware encoder." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Keep this screen open while it runs. Phones pause the job if you switch apps." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Download the lighter MP4 or WebM — depending on the device." })
		]
	})] })] });
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompressorApp, {});
}
//#endregion
export { Home as component };

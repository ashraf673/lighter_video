import { PRESETS, PRESET_IDS, RESOLUTION_OPTIONS, type PresetId } from "@/lib/presets";
import { formatBytes } from "@/lib/format";
import { currentOutputSize, useAppStore } from "@/lib/store";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export function SettingsPanel() {
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
    targetMb,
  });
  const ratio = estimate / Math.max(meta.bytes, 1);
  const smaller = Math.max(0, (1 - ratio) * 100);
  const maxMb = Math.max(2, Math.ceil(meta.bytes / 1_000_000));
  const sourceMax = Math.max(meta.width, meta.height);
  const sizes = RESOLUTION_OPTIONS.filter((option) => {
    if (option.id === "original") return true;
    if (option.id === "1080") return sourceMax > 1280;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <fieldset disabled={disabled} className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-foreground">Quality</legend>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_IDS.map((id) => (
            <PresetCard
              key={id}
              id={id}
              selected={presetId === id && targetMode === "preset"}
              onSelect={() => setPreset(id)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset disabled={disabled} className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-foreground">Size</legend>
        <div className="flex flex-wrap gap-2">
          {sizes.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setResolution(option.id)}
              className={cn(
                "h-11 min-h-11 rounded-lg px-3.5 text-sm font-medium transition-colors duration-quick ease-out-expo",
                resolutionId === option.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        {sourceMax > 1920 ? (
          <p className="text-xs text-muted-foreground">
            Clips larger than 1080p are scaled down so this device can encode them.
          </p>
        ) : null}
      </fieldset>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="target-size">Target size</Label>
          <span className="font-mono text-sm tabular-nums text-muted-foreground">
            {targetMb.toFixed(1)} MB
          </span>
        </div>
        <Slider
          id="target-size"
          min={0.1}
          max={maxMb}
          step={0.1}
          value={[Math.min(targetMb, maxMb)]}
          disabled={disabled}
          onValueChange={(value) => setTargetMb(value[0] ?? targetMb)}
        />
        <p className="text-xs text-muted-foreground">
          Drag to aim at a file size. Quality presets reset this.
        </p>
      </div>

      <div className="flex items-end justify-between gap-3 rounded-xl bg-secondary/70 px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Estimated
          </span>
          <span className="font-mono text-lg font-medium tabular-nums text-foreground">
            {formatBytes(meta.bytes)}
            <span className="text-muted-foreground"> → </span>
            {formatBytes(estimate)}
          </span>
        </div>
        <span
          className={cn(
            "font-mono text-sm tabular-nums",
            smaller > 5 ? "text-gain" : "text-muted-foreground",
          )}
        >
          {smaller > 5 ? `${Math.round(smaller)}% smaller` : "Similar size"}
        </span>
      </div>
    </div>
  );
}

function PresetCard({
  id,
  selected,
  onSelect,
}: {
  id: PresetId;
  selected: boolean;
  onSelect: () => void;
}) {
  const preset = PRESETS[id];
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex min-h-16 flex-col items-start gap-0.5 rounded-xl px-3.5 py-3 text-left transition-[background-color,box-shadow] duration-quick ease-out-expo",
        selected
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      )}
    >
      <span className="text-sm font-medium">{preset.label}</span>
      <span
        className={cn(
          "text-xs",
          selected ? "text-primary-foreground/70" : "text-muted-foreground",
        )}
      >
        {preset.hint}
      </span>
    </button>
  );
}

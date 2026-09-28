let sentinel: WakeLockSentinel | null = null;

export async function holdScreen(): Promise<boolean> {
  if (typeof navigator === "undefined" || !("wakeLock" in navigator)) return false;
  try {
    if (sentinel && !sentinel.released) await sentinel.release();
  } catch {
    /* already released */
  }
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

export async function releaseScreen(): Promise<void> {
  const current = sentinel;
  sentinel = null;
  if (!current || current.released) return;
  try {
    await current.release();
  } catch {
    /* ignore */
  }
}

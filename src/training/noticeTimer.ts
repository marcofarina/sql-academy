/** Conto alla rovescia della notifica, sospendibile senza perdere il tempo trascorso. */
export const NOTICE_DURATION = 4000;

/** Crea un timer fermo. Dopo la scadenza può solo essere scartato. */
export function createNoticeTimer(onElapsed: () => void) {
  let remaining: number | undefined = NOTICE_DURATION;
  let started = 0;
  let timeout: ReturnType<typeof setTimeout> | undefined;

  return {
    resume() {
      if (timeout !== undefined || remaining === undefined) return;
      started = performance.now();
      timeout = setTimeout(() => {
        timeout = undefined;
        remaining = undefined;
        onElapsed();
      }, remaining);
    },
    pause() {
      if (timeout === undefined || remaining === undefined) return;
      clearTimeout(timeout);
      timeout = undefined;
      remaining = Math.max(0, remaining - (performance.now() - started));
    },
  };
}

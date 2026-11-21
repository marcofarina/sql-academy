/** Verifiche del tempo della notifica. */
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { createNoticeTimer, NOTICE_DURATION } from './noticeTimer.ts';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

test('scade dopo quattro secondi e chiama la chiusura una volta sola', () => {
  const close = vi.fn();
  const timer = createNoticeTimer(close);
  timer.resume();
  vi.advanceTimersByTime(NOTICE_DURATION - 1);
  expect(close).not.toHaveBeenCalled();
  vi.advanceTimersByTime(1);
  timer.resume();
  vi.runAllTimers();
  expect(close).toHaveBeenCalledOnce();
});

test('la pausa ferma il conto e la ripresa usa soltanto il tempo rimasto', () => {
  const close = vi.fn();
  const timer = createNoticeTimer(close);
  timer.resume();
  vi.advanceTimersByTime(1200);
  timer.pause();
  timer.pause();
  vi.advanceTimersByTime(6000);
  expect(close).not.toHaveBeenCalled();
  timer.resume();
  vi.advanceTimersByTime(2799);
  expect(close).not.toHaveBeenCalled();
  vi.advanceTimersByTime(1);
  expect(close).toHaveBeenCalledOnce();
});

test('la chiusura manuale ferma il timer prima che la notifica venga tolta', () => {
  const close = vi.fn();
  const timer = createNoticeTimer(close);
  timer.resume();
  vi.advanceTimersByTime(2000);
  timer.pause();
  vi.runAllTimers();
  expect(close).not.toHaveBeenCalled();
});

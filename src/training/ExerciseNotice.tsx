/** Notifica della risposta corretta, con i punti e il salvataggio nello zaino. */
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Icon } from '../icons/Icon.tsx';
import type { VerificationReward } from '../progress/useProgress.ts';
import { formatRoute } from '../routing/route.ts';
import type { Exercise } from '../themes/contract.ts';
import { statoPillola, testoZainoEsito } from '../zaino/labels.ts';
import { useStatoZaino } from '../zaino/sincronizza.ts';
import { ZainoMark } from '../zaino/ZainoMark.tsx';
import { DIFFICULTY_LABEL } from './exercises.ts';
import { createNoticeTimer, NOTICE_DURATION } from './noticeTimer.ts';

const MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const ZERO_REASONS = {
  'solution-seen': 'Avevi aperto la soluzione prima di risolvere l’esercizio.',
  'already-solved': 'Avevi già risolto l’esercizio. Il premio si incassa una volta sola.',
  review: 'Ripasso riuscito. Il ripasso non dà punti.',
  'review-failed': 'Avevi aperto la soluzione, quindi il ripasso non è riuscito: l’esercizio tornerà fra un giorno.',
};

interface NoticeProps {
  exercise: Exercise;
  balance: number;
  notice: { id: number; reward: VerificationReward } | undefined;
  onClose(restoreFocus: boolean): void;
}

function subscribeMotion(listener: () => void) {
  const media = window.matchMedia(MOTION_QUERY);
  media.addEventListener('change', listener);
  return () => media.removeEventListener('change', listener);
}

function reducedMotion() {
  return window.matchMedia(MOTION_QUERY).matches;
}

/** Mantiene montata la regione di stato, così il lettore di schermo può annunciare ogni risposta corretta. */
export function ExerciseNotice({ exercise, balance, notice, onClose }: NoticeProps) {
  const reward = notice?.reward;
  return (
    <>
      <div className="visually-hidden" role="status" aria-label="Esito dell’esercizio">
        {notice && (
          <span key={notice.id}>
            Esercizio risolto. {exercise.title}. {typeof reward === 'number' ? `Hai guadagnato ${reward} punti.` : 'Nessun punto.'} Il saldo è di {balance} punti.
          </span>
        )}
      </div>
      {notice && (
        <NoticeCard key={notice.id} exercise={exercise} balance={balance} reward={notice.reward} onClose={onClose} />
      )}
    </>
  );
}

function NoticeCard({ exercise, balance, reward, onClose }: Omit<NoticeProps, 'notice'> & { reward: VerificationReward }) {
  const stato = useStatoZaino();
  const { fase } = statoPillola(stato);
  const reduced = useSyncExternalStore(subscribeMotion, reducedMotion);
  const card = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const paused = hovered || focused;
  const earned = typeof reward === 'number';

  useEffect(() => {
    const close = () => onClose(!!card.current?.contains(document.activeElement));
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.defaultPrevented) close();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      ref={card}
      className="exercise-notice"
      onPointerEnter={(event) => {
        if (event.pointerType !== 'touch') setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onPointerCancel={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <header className="exercise-notice-heading">
        <Icon name="circle-check" />
        <div>
          <p>Esercizio risolto</p>
          <p>{exercise.title} · {DIFFICULTY_LABEL[exercise.difficulty].toLowerCase()}</p>
        </div>
      </header>
      <div className="exercise-notice-points">
        <div className={earned ? 'exercise-notice-earned' : 'exercise-notice-zero'}>
          <Icon name="coin" />
          {earned ? <><strong>+{reward}</strong> punti</> : <strong>Nessun punto</strong>}
        </div>
        <p className="exercise-notice-balance"><span>saldo</span><strong>{balance}</strong></p>
        {!earned && <p className="exercise-notice-reason">{ZERO_REASONS[reward]}</p>}
      </div>
      <div className="exercise-notice-zaino" data-zaino-fase={fase}>
        <ZainoMark fase={fase} />
        <p>
          {testoZainoEsito(stato)}
          {fase === 'scollegato' && <> <a href={formatRoute({ page: 'zaino' })}>Collega lo zaino</a> per ritrovarlo su un altro computer.</>}
        </p>
      </div>
      <button type="button" className="exercise-notice-ok" onClick={() => onClose(true)}>
        OK
        {!reduced && <NoticeFill paused={paused} onClose={onClose} />}
      </button>
    </div>
  );
}

function NoticeFill({ paused, onClose }: { paused: boolean; onClose(restoreFocus: boolean): void }) {
  // In modalità a movimento ridotto il riempimento e il suo timer vengono smontati insieme.
  const [timer] = useState(() => createNoticeTimer(() => onClose(false)));
  useEffect(() => {
    if (!paused) timer.resume();
    return timer.pause;
  }, [paused, timer]);

  return (
    <span
      className="exercise-notice-fill"
      aria-hidden="true"
      style={{ animationDuration: `${NOTICE_DURATION}ms`, animationPlayState: paused ? 'paused' : 'running' }}
    >
      OK
    </span>
  );
}

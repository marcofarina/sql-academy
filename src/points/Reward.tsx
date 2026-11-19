import { Icon } from '../icons/Icon.tsx';
import type { ExerciseProgress } from '../progress/progress.ts';
import { rewardDescription, rewardStatus } from './labels.ts';
import { REWARD, type PointsExercise } from './points.ts';

/** Il premio di un esercizio nel percorso e nel catalogo: quanto vale e se è già incassato. */
export function Reward({ exercise, state }: { exercise: PointsExercise; state: ExerciseProgress }) {
  const status = rewardStatus(state);
  const description = rewardDescription(exercise, state);
  return (
    <span className={`reward is-${status}`} title={description}>
      <Icon name={status === 'earned' ? 'circle-check' : 'coin'} />
      <span aria-hidden="true">{status === 'earned' ? state.pointsEarned : status === 'lost' ? 0 : REWARD[exercise.difficulty]}</span>
      <span className="visually-hidden">{description}</span>
    </span>
  );
}

import type {DelayFnArgs} from './types';

export function getDelay({
  duration,
  timeRemaining,
  allowPausing,
  skipFirstInterval,
  firstIntervalPlayed,
}: DelayFnArgs) {
  if (skipFirstInterval && !firstIntervalPlayed) {
    return 0;
  }

  return allowPausing ? timeRemaining : duration;
}

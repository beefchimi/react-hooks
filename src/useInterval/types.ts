import type {UtcMilliseconds} from '../types';

// TODO: Consider supporting setInterval paramaters.
// TODO: Maybe `any` instead of `void` (or use generic)?
export type IntervalCallback = (timestamp: UtcMilliseconds) => void;

// TODO: Not currently returing this data,
// but can revisit if/when we want to support it.
export interface IntervalTimeData {
  // TODO: Would be nice to type this between `0-100`
  progress: number;
  timeRemaining: number;
}

export type IntervalPauseCallback = (timeData: IntervalTimeData) => void;

export interface IntervalHookOptions {
  duration?: number;
  playing?: boolean;
  allowPausing?: boolean;
  skipFirstInterval?: boolean;
  onPause?: IntervalPauseCallback;
}

export interface DelayFnArgs {
  duration: NonNullable<IntervalHookOptions['duration']>;
  timeRemaining: IntervalTimeData['timeRemaining'];
  allowPausing: NonNullable<IntervalHookOptions['allowPausing']>;
  skipFirstInterval: NonNullable<IntervalHookOptions['skipFirstInterval']>;
  firstIntervalPlayed: boolean;
}

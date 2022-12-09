import {useCallback, useEffect, useRef} from 'react';

import {filterNullishValuesFromObject, noop} from '../utilities';
import type {SetIntervalId, SetTimeoutId} from '../types';
import type {
  IntervalCallback,
  IntervalHookOptions,
  IntervalTimeData,
} from './types';
import {getDelay} from './utilities';

const DEFAULT_OPTIONS: Required<IntervalHookOptions> = {
  duration: 0,
  playing: true,
  allowPausing: false,
  skipFirstInterval: false,
  onPause: noop,
};

export function useInterval(
  callback: IntervalCallback,
  options?: IntervalHookOptions,
): void {
  // NOTE: This wouldn't be necessary if we always require
  // `duration` to be passed (making the `options` object required).
  const {duration, playing, allowPausing, skipFirstInterval, onPause} = {
    ...DEFAULT_OPTIONS,
    ...filterNullishValuesFromObject<IntervalHookOptions>(options ?? {}),
  };

  const initialTimeData: IntervalTimeData = {
    progress: 0,
    timeRemaining: duration,
  };

  const callbackRef = useRef<IntervalCallback>();
  const intervalRef = useRef<SetIntervalId>();
  const timeoutRef = useRef<SetTimeoutId>();

  const mountedRef = useRef(false);
  const firstIntervalPlayed = useRef(false);

  const startTime = useRef(0);
  const progress = useRef(initialTimeData.progress);
  const timeRemaining = useRef(initialTimeData.timeRemaining);

  const resetTimeData = useCallback(() => {
    progress.current = initialTimeData.progress;
    timeRemaining.current = initialTimeData.timeRemaining;
  }, [initialTimeData.progress, initialTimeData.timeRemaining]);

  function handleCallback() {
    console.log('handleCallback');
    resetTimeData();
    startTime.current = Date.now();
    callbackRef.current?.(startTime.current);
  }

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // NOTE: Necessary to start using the new duration if it changes while `playing`.
  useEffect(() => {
    resetTimeData();
  }, [duration, resetTimeData]);

  // TODO: I am intentionally omitting `skipFirstInterval`
  // from the dependencies array, but might reconsider.
  useEffect(() => {
    if (playing) {
      // NOTE: Need to set this right away or else the
      // very first `pause` will not record `timeRemaining`.
      startTime.current = Date.now();

      const delay = getDelay({
        duration,
        allowPausing,
        skipFirstInterval,
        firstIntervalPlayed: firstIntervalPlayed.current,
        timeRemaining: timeRemaining.current,
      });

      // TODO: Should we use the `useTimeout()` hook instead?
      timeoutRef.current = setTimeout(() => {
        handleCallback();

        if (!firstIntervalPlayed.current) {
          firstIntervalPlayed.current = true;
        }

        intervalRef.current = setInterval(handleCallback, duration);
      }, delay);
    }

    if (!playing && startTime.current && duration) {
      const timeDiff = Date.now() - startTime.current;

      progress.current = (timeDiff / duration) * 100;
      timeRemaining.current = duration - timeDiff;
    }

    return () => {
      console.log('teardown > intervalRef.current', intervalRef.current);
      // TODO: Unfortunate typecasting because of dual DOM/Node environment.
      clearInterval(intervalRef.current as unknown as number);
      clearTimeout(timeoutRef.current as unknown as number);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, playing, allowPausing]);

  useEffect(() => {
    if (!playing && mountedRef.current) {
      onPause({
        progress: progress.current,
        timeRemaining: timeRemaining.current,
      });
    }
  }, [playing, onPause]);

  useEffect(() => {
    // Not using `useMounted()` hook, as we actually want to
    // avoid calling `onPause()` on very first mount when `!playing`.
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  console.log('intervalRef.current', intervalRef.current);
}

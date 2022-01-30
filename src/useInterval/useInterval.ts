import {useCallback, useEffect, useRef} from 'react';

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
};

export function useInterval(
  callback: IntervalCallback,
  options?: IntervalHookOptions,
): void {
  const {duration, playing, allowPausing, skipFirstInterval} = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const initialTimeData: IntervalTimeData = {
    // progress: 0,
    timeRemaining: duration,
  };

  const callbackRef = useRef<IntervalCallback>();
  const intervalRef = useRef<number>();
  const timeoutRef = useRef<number>();

  const firstIntervalPlayed = useRef(false);

  const startTime = useRef(0);
  // const progress = useRef(initialTimeData.progress);
  const timeRemaining = useRef(initialTimeData.timeRemaining);

  /*
  const [timeData, setTimeData] = useState<IntervalHookReturn>({
      ...initialTimeData
  });
  */

  const resetTimeData = useCallback(() => {
    // progress.current = initialTimeData.progress;
    timeRemaining.current = initialTimeData.timeRemaining;
  }, [initialTimeData.timeRemaining]);

  function handleCallback() {
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
    // setTimeData({ ...initialTimeData });
  }, [duration, resetTimeData]);

  // TODO: I am intentionally omitting `skipFirstInterval`
  // from the dependencies array, but might reconsider.
  useEffect(() => {
    if (playing) {
      // setTimeData({ ...initialTimeData });

      if (!skipFirstInterval && !firstIntervalPlayed.current) {
        // NOTE: Need to set this right away or else the
        // very first `pause` will not record `timeRemaining`.
        startTime.current = Date.now();
      }

      const delay = getDelay({
        duration,
        allowPausing,
        skipFirstInterval,
        firstIntervalPlayed: firstIntervalPlayed.current,
        timeRemaining: timeRemaining.current,
      });

      // TODO: Should we use the `useTimeout()` hook instead?
      timeoutRef.current = window.setTimeout(() => {
        handleCallback();

        if (!firstIntervalPlayed.current) {
          firstIntervalPlayed.current = true;
        }

        intervalRef.current = window.setInterval(handleCallback, duration);
      }, delay);
    }

    if (!playing && startTime.current && duration) {
      const timeDiff = Date.now() - startTime.current;

      // progress.current = (timeDiff / duration) * 100;
      timeRemaining.current = duration - timeDiff;

      /*
      setTimeData({
          progress: progress.current,
          timeRemaining: timeRemaining.current
      });
      */
    }

    return () => {
      window.clearInterval(intervalRef.current);
      window.clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, playing, allowPausing]);

  // TODO: Storing state in this hook is controversial,
  // but if we want to support "progress between intervals",
  // we will need to utilize useState();
  // return timeData;
}

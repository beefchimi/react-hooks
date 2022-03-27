import {useEffect, useRef} from 'react';

import {timeMeasurement} from '../utilities';
import {useInterval} from '../useInterval';
import type {UtcMilliseconds} from '../types';

import type {CountdownCallback} from './types';

// TODO: Consider allowing an `option` to specify `interval` duration.
export function useCountdown(
  callback: CountdownCallback,
  timeTarget: UtcMilliseconds,
  pause = false,
): void {
  const callbackRef = useRef<CountdownCallback>();

  function handleCallback(timestamp: UtcMilliseconds) {
    callbackRef.current?.(timeTarget - timestamp);
  }

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Trigger `callback` on first render and subsequent changes
  // of `timeTarget` arg. This saves us from passing
  // `skipFirstInterval: true` to `useInterval()` and gets
  // around the problem of not being able to declare `timeTarget`
  // as a depencency of that hook. We do need to manually skip
  // first render if `pause` is `true`, and therefor keep it
  // out of our dependencies array.
  useEffect(() => {
    if (!pause) {
      handleCallback(Date.now());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeTarget]);

  useInterval(handleCallback, {
    duration: timeMeasurement.msPerSec,
    allowPausing: true,
    playing: !pause,
  });
}

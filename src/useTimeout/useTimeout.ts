import {useEffect, useRef} from 'react';

import type {SetTimeoutId} from '../types';
import type {TimeoutCallback, TimeoutHookOptions} from './types';

const DEFAULT_OPTIONS: Required<TimeoutHookOptions> = {
  duration: 0,
  playing: true,
};

// TODO: We could also support "pausing",
// but would likely need to change the API.
export function useTimeout(
  callback: TimeoutCallback,
  options?: TimeoutHookOptions,
): void {
  const {duration, playing} = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const callbackRef = useRef<TimeoutCallback>();
  const timeoutRef = useRef<SetTimeoutId>();

  function handleCallback() {
    callbackRef.current?.(Date.now());
  }

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (playing) {
      timeoutRef.current = setTimeout(handleCallback, duration);

      // TODO: Really stupid casting required by TypeScript
      return () => clearTimeout(timeoutRef.current as unknown as number);
    }
  }, [duration, playing]);
}

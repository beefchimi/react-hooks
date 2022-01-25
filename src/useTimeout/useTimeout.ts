import {useEffect, useRef} from 'react';

import {filterNullishValuesFromObject} from '../utilities';
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
  // NOTE: This wouldn't be necessary if we always require
  // `duration` to be passed (making the `options` object required).
  const filteredOptions = options
    ? filterNullishValuesFromObject<TimeoutHookOptions>(options)
    : {};

  const {duration, playing} = {
    ...DEFAULT_OPTIONS,
    ...filteredOptions,
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
    }

    // TODO: Really stupid casting required by TypeScript
    return () => clearTimeout(timeoutRef.current as unknown as number);
  }, [duration, playing]);
}

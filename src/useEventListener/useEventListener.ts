import {useEffect, useRef} from 'react';

import {useIsoLayoutEffect} from '../useIsoLayoutEffect';
import type {GlobalEventCallback} from '../types';
import type {EventListenerHookOptions} from './types';

export function useEventListener({
  eventType,
  callback,
  target,
  options = {},
  disabled = false,
  preferLayoutEffect = false,
}: EventListenerHookOptions): void {
  const {capture, passive, once} = options;

  const callbackRef = useRef(callback);

  const usePreferredEffect = preferLayoutEffect
    ? useIsoLayoutEffect
    : useEffect;

  useIsoLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // TODO: Does this need the `callback` as a dependency?
  // We might need to move `handleCallback()` out of the effect
  // and wrap with `useCallback()` if we find this to be a problem.
  usePreferredEffect(() => {
    const handleCallback: GlobalEventCallback = (event) => {
      callbackRef.current(event);
    };

    if (!disabled && target) {
      target.addEventListener(eventType, handleCallback, options);
    }

    return () => {
      target?.removeEventListener(eventType, handleCallback, options);
    };
  }, [eventType, target, disabled, capture, passive, once]);
}

import {useEffect, useRef} from 'react';

import {useIsoLayoutEffect} from '../useIsoLayoutEffect';
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

  usePreferredEffect(() => {
    // TODO: This could move outside of the effect,
    // and then this effect could use it as a dependency.
    function handleCallback(event: any) {
      callbackRef.current(event);
    }

    if (!disabled && target) {
      target.addEventListener(eventType, handleCallback, options);
    }

    return () => {
      target?.removeEventListener(eventType, handleCallback, options);
    };
  }, [eventType, target, disabled, capture, passive, once]);
}

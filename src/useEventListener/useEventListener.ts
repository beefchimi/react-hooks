import {useEffect, useRef} from 'react';

import {noop} from '../utilities';
import {useIsoLayoutEffect} from '../useIsoLayoutEffect';
import type {EventListenerHookOptions} from './types';

export function useEventListener({
  target,
  eventName,
  callback,
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
    function handler(event: any) {
      callbackRef.current(event);
    }

    if (!disabled && target != null) {
      target.addEventListener(eventName, handler, options);

      return () => {
        target.removeEventListener(eventName, handler, options);
      };
    }

    return noop;
  }, [target, eventName, disabled, capture, passive, once]);
}

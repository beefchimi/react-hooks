import {useEffect, useRef} from 'react';

import {filterNullishValuesFromObject} from '../utilities';
import {useIsoLayoutEffect} from '../useIsoLayoutEffect';
import type {GlobalEventCallback, GlobalEventTarget} from '../types';
import type {
  EventListenerHookOptions,
  SupportedEventListenerOptions,
} from './types';

const DEFAULT_OPTIONS: Required<EventListenerHookOptions> = {
  disabled: false,
  preferLayoutEffect: false,
};

const DEFAULT_LISTENER_OPTIONS: SupportedEventListenerOptions = {};

export function useEventListener(
  target: GlobalEventTarget,
  eventType: string,
  callback: GlobalEventCallback,
  options?: EventListenerHookOptions,
  listenerOptions?: SupportedEventListenerOptions,
): void {
  const {disabled, preferLayoutEffect} = {
    ...DEFAULT_OPTIONS,
    ...filterNullishValuesFromObject<EventListenerHookOptions>(options ?? {}),
  };

  const {capture, passive, once} = {
    ...DEFAULT_LISTENER_OPTIONS,
    ...filterNullishValuesFromObject<SupportedEventListenerOptions>(
      listenerOptions ?? {},
    ),
  };

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
      target.addEventListener(eventType, handleCallback, listenerOptions);
    }

    return () => {
      target?.removeEventListener(eventType, handleCallback, listenerOptions);
    };
  }, [eventType, target, disabled, capture, passive, once]);
}

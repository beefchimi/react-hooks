import {useCallback, useRef} from 'react';

import {filterNullishValuesFromObject} from '../utilities';
import {useEventListener} from '../useEventListener';
import {useIsoLayoutEffect} from '../useIsoLayoutEffect';
import {KeyPressEventType} from './types';
import type {
  KeyPressCallback,
  KeyPressInput,
  KeyPressHookOptions,
} from './types';

const DEFAULT_OPTIONS: Required<KeyPressHookOptions> = {
  eventType: KeyPressEventType.Down,
  target: document,
  disabled: false,
};

export function useKeyPress(
  keys: KeyPressInput,
  callback: KeyPressCallback,
  options?: KeyPressHookOptions,
) {
  // NOTE: This wouldn't be necessary if `options` was required.
  const {eventType, target, disabled} = {
    ...DEFAULT_OPTIONS,
    ...filterNullishValuesFromObject<KeyPressHookOptions>(options ?? {}),
  };

  const callbackRef = useRef(callback);

  const handleCallback: KeyPressCallback = useCallback(
    (event: KeyboardEvent) => {
      const requiredKeysEngaged = keys.some((key) => event.key === key);

      if (requiredKeysEngaged) {
        callbackRef.current?.(event);
      }
    },
    [keys],
  );

  useIsoLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // TODO: Consider using {capture: true}
  useEventListener(target, eventType, handleCallback, {disabled});
}

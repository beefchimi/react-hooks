import {useCallback, useEffect, useRef} from 'react';

import {filterNullishValuesFromObject} from '../utilities';
import {useIsoLayoutEffect} from '../useIsoLayoutEffect';
import {KeyPressEventType} from './types';
import type {KeyPressCallback, KeyPressInput, KeyPressOptions} from './types';

const DEFAULT_OPTIONS: Required<KeyPressOptions> = {
  eventType: KeyPressEventType.Down,
  target: document,
  disabled: false,
};

export function useKeyPress(
  keys: KeyPressInput,
  callback: KeyPressCallback,
  options?: KeyPressOptions,
) {
  // NOTE: This wouldn't be necessary if `options` was required.
  const {eventType, target, disabled} = {
    ...DEFAULT_OPTIONS,
    ...filterNullishValuesFromObject<KeyPressOptions>(options ?? {}),
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

  // TODO: This can probably use the `useEventListener()` hook,
  // but we likely won't be able to use a `enum` for `eventType`.
  useEffect(() => {
    if (!disabled && target) {
      target.addEventListener(eventType, handleCallback);
    }

    return () => {
      target?.removeEventListener(eventType, handleCallback);
    };
  }, [handleCallback, eventType, target, disabled]);
}

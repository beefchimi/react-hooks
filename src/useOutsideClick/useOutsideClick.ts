import {useCallback, useRef} from 'react';

import {useEventListener} from '../useEventListener';
import {useIsoLayoutEffect} from '../useIsoLayoutEffect';
import type {OutsideClickCallback} from './types';

export function useOutsideClick(
  element: HTMLElement | null | undefined,
  callback: OutsideClickCallback,
  // TODO: Consider making an array of elements
  exclude?: HTMLElement | null,
) {
  const elementRef = useRef(element);
  const callbackRef = useRef(callback);

  const memoizedCallback = useCallback(
    (event: PointerEvent) => {
      const element = elementRef.current;

      if (
        element &&
        event.target instanceof HTMLElement &&
        !element.contains(event.target) &&
        !exclude?.contains(event.target)
      ) {
        callbackRef.current(event);
      }
    },
    [exclude],
  );

  useIsoLayoutEffect(() => {
    elementRef.current = element;
    callbackRef.current = callback;
  }, [callback, element]);

  useEventListener({
    eventType: 'click',
    callback: memoizedCallback,
    target: element?.ownerDocument,
    options: {
      capture: true,
    },
  });
}

import {useCallback, useRef} from 'react';

import {useEventListener} from '../useEventListener';
import {useIsoLayoutEffect} from '../useIsoLayoutEffect';
import type {OutsideClickCallback, OutsideClickExclusion} from './types';

export function useOutsideClick(
  element: HTMLElement | null | undefined,
  callback: OutsideClickCallback,
  exclude: OutsideClickExclusion = [],
) {
  const elementRef = useRef(element);
  const callbackRef = useRef(callback);

  const memoizedCallback = useCallback(
    (event: PointerEvent) => {
      const element = elementRef.current;

      // TODO: Unsure why I require the final typecast for
      // `as HTMLElement` when that condition must already be `true`.
      if (
        element &&
        event.target instanceof HTMLElement &&
        !element.contains(event.target) &&
        !exclude.some((item) => item?.contains(event.target as HTMLElement))
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

  useEventListener(
    element?.ownerDocument,
    'click',
    memoizedCallback,
    {},
    {capture: true},
  );
}

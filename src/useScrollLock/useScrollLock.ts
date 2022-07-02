import {useState} from 'react';

import {filterNullishValuesFromObject} from '../utilities';
import {useIsoLayoutEffect} from '../useIsoLayoutEffect';

import {
  applyScrollStyles,
  resetScrollStyles,
  guessScrollbarWidth,
} from './utilities';
import {ScrollAxis} from './types';
import type {
  DefaultScrollLockOptions,
  ScrollLockOptions,
  ScrollLockHookReturn,
} from './types';

const DEFAULT_OPTIONS: DefaultScrollLockOptions = {
  // Using optional chaining on `document` in case this is SSR.
  target: document?.body,
  scrollAxis: ScrollAxis.Vertical,
};

export function useScrollLock(
  options?: ScrollLockOptions,
): ScrollLockHookReturn {
  const [scrollingLocked, setScrollLock] = useState(false);

  const {target, scrollAxis, scrollbarOffset, onLock, onUnlock} = {
    ...DEFAULT_OPTIONS,
    ...filterNullishValuesFromObject<ScrollLockOptions>(options ?? {}),
  };

  useIsoLayoutEffect(() => {
    if (!scrollingLocked || !target) {
      return;
    }

    // An explicitly passed `scrollbarOffset` could be `0`,
    // so we will accept that value if passed.
    const scrollbarWidth = scrollbarOffset ?? guessScrollbarWidth();

    const originalOverflow = target.style.overflow;
    const originalPaddingRight = target.style.paddingRight;
    const originalPaddingBottom = target.style.paddingBottom;

    const captured = applyScrollStyles({
      target,
      scrollAxis,
      scrollbarWidth,
    });

    onLock?.(captured);

    // TODO: Adjust linting so that an early return is acceptable.
    // eslint-disable-next-line consistent-return
    return () => {
      resetScrollStyles({
        target,
        overflow: originalOverflow,
        paddingRight: originalPaddingRight,
        paddingBottom: originalPaddingBottom,
      });

      onUnlock?.();
    };
  }, [scrollingLocked, target, scrollAxis, scrollbarOffset, onLock, onUnlock]);

  return [scrollingLocked, setScrollLock];
}

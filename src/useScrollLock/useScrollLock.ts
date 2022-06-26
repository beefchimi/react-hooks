import {useState} from 'react';

import {filterNullishValuesFromObject} from '../utilities';
import {useIsoLayoutEffect} from '../useIsoLayoutEffect';

import {getPaddingRight, guessScrollbarWidth} from './utilities';
import {ScrollAxis} from './types';
import type {ScrollLockOptions, ScrollLockHookReturn} from './types';

const DEFAULT_OPTIONS: ScrollLockOptions = {
  // Using optional chaining on `document` in case this is SSR.
  target: document?.body,
  scrollAxis: ScrollAxis.Vertical,
};

export function useScrollLock(
  options?: ScrollLockOptions,
): ScrollLockHookReturn {
  const [scrollingLocked, setScrollLock] = useState(false);

  // scrollAxis
  const {target, scrollbarOffset} = {
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
    const computedPaddingRight = getPaddingRight();

    // Should these instead be stored as refs?
    const originalOverflow = target.style.overflow;
    const originalPaddingRight = target.style.paddingRight;

    target.style.overflow = 'hidden';

    // TODO: We should also consider horizontal scrolling.
    if (scrollbarWidth) {
      target.style.paddingRight = `${computedPaddingRight + scrollbarWidth}px`;
    }

    // TODO: Adjust linting so that an early return is acceptable.
    // eslint-disable-next-line consistent-return
    return () => {
      target.style.overflow = originalOverflow;

      if (scrollbarWidth) {
        target.style.paddingRight = originalPaddingRight;
      }
    };
  }, [target, scrollbarOffset, scrollingLocked]);

  return [scrollingLocked, setScrollLock];
}

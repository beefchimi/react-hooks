import {useState} from 'react';

import {canUseDom, filterNullishValuesFromObject} from '../utilities';
import {useIsoLayoutEffect} from '../useIsoLayoutEffect';

import type {ScrollLockOptions, ScrollLockHookReturn} from './types';

const DEFAULT_OPTIONS: ScrollLockOptions = {
  // Using optional chaining on `document` in case this is SSR.
  target: document?.body,
};

export function useScrollLock(
  options?: ScrollLockOptions,
): ScrollLockHookReturn {
  const [scrollingLocked, setScrollLock] = useState(false);

  const {target, scrollbarOffset} = {
    ...DEFAULT_OPTIONS,
    ...filterNullishValuesFromObject<ScrollLockOptions>(options ?? {}),
  };

  useIsoLayoutEffect(() => {
    if (!scrollingLocked || !target) {
      return;
    }

    // Should these instead be stored as refs?
    const originalOverflow = target.style.overflow;
    const originalPaddingRight = target.style.paddingRight;

    target.style.overflow = 'hidden';

    // An explicitly passed `scrollbarOffset` could be `0`,
    // so we will accept that value if passed.
    const scrollBarWidth = scrollbarOffset ?? guessScrollbarWidth();

    // TODO: We should also consider horizontal scrolling.
    if (scrollBarWidth) {
      target.style.paddingRight = `${scrollBarWidth}px`;
    }

    // TODO: Adjust linting so that an early return is acceptable.
    // eslint-disable-next-line consistent-return
    return () => {
      target.style.overflow = originalOverflow;

      if (scrollBarWidth) {
        target.style.paddingRight = originalPaddingRight;
      }
    };
  }, [target, scrollingLocked]);

  return [scrollingLocked, setScrollLock];
}

function guessScrollbarWidth() {
  // A better alternative might be:
  // document.body.offsetWidth - document.body.scrollWidth
  return canUseDom ? window.innerWidth - document.body.offsetWidth : 0;
}

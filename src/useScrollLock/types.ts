import type {Dispatch, SetStateAction} from 'react';

// Explicitly typing this appears to be required. Otherwise,
// TypeScript throws an error, claiming `setScrollLock()` is not callable.
// It appears TypeScript is confused about array item positions.
export type ScrollLockHookReturn = [boolean, Dispatch<SetStateAction<boolean>>];

// eslint-disable-next-line @beefchimi/typescript/prefer-singular-enums
export enum ScrollAxis {
  Horizontal = 'x',
  Vertical = 'y',
  Both = 'both',
}

export interface ScrollLockOptions {
  target?: HTMLElement | null;
  scrollAxis?: ScrollAxis;

  // There is intentionally only one "scrollbar size" for both
  // `x` and `y` axis. Supporting the case where sizes would be different
  // is so rare that it isn't worth the complexity.
  scrollbarOffset?: number;

  // Consider a prop that allows skipping the
  // scrollbar width `padding-right` reservation.
  // bypassReservedScrollPadding?: boolean;
}

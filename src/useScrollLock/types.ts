import type {Dispatch, SetStateAction} from 'react';

// Explicitly typing this appears to be required. Otherwise,
// TypeScript throws an error, claiming `setScrollLock()` is not callable.
// It appears TypeScript is confused about array item positions.
export type ScrollLockHookReturn = [boolean, Dispatch<SetStateAction<boolean>>];

// eslint-disable-next-line @beefchimi/typescript/prefer-singular-enums
export enum ScrollAxis {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
  Both = 'both',
}

export interface ScrollbarWidthDualAxis {
  [ScrollAxis.Vertical]: number;
  [ScrollAxis.Horizontal]: number;
}

export type ScrollbarWidth = ScrollbarWidthDualAxis | number;

export interface ScrollLockCapturedProperties {
  scrollbarWidth: ScrollbarWidthDualAxis;
  paddingRight?: number;
  appliedPaddingRight?: number;
  paddingBottom?: number;
  appliedPaddingBottom?: number;
}

export interface ScrollLockOptions {
  target?: HTMLElement | null;
  scrollAxis?: ScrollAxis;
  scrollbarOffset?: ScrollbarWidth;
  onLock?(captured: ScrollLockCapturedProperties): void;
  onUnlock?(): void;
}

export interface DefaultScrollLockOptions extends ScrollLockOptions {
  scrollAxis: NonNullable<ScrollLockOptions['scrollAxis']>;
}

export type RequiredTarget = NonNullable<ScrollLockOptions['target']>;

import type {Dispatch, SetStateAction} from 'react';

// Explicitly typing this appears to be required. Otherwise,
// TypeScript throws an error, claiming `setScrollLock()` is not callable.
// It appears TypeScript is confused about array item positions.
export type ScrollLockHookReturn = [boolean, Dispatch<SetStateAction<boolean>>];

export interface ScrollLockOptions {
  target?: HTMLElement | null;
  scrollbarOffset?: number;
}

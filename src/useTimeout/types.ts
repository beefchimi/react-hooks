import type {UtcMilliseconds} from '../types';

// TODO: Consider supporting setTimeout paramaters.
// TODO: Maybe `any` instead of `void` (or use generic)?
export type TimeoutCallback = (timestamp: UtcMilliseconds) => void;

export interface TimeoutHookOptions {
  duration?: number;
  playing?: boolean;
}

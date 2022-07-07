import type {GlobalEventTarget} from '../types';

export enum KeyPressEventType {
  Down = 'keydown',
  Press = 'keypress',
  Up = 'keyup',
}

export type KeyPressCallback = (event: KeyboardEvent) => void;
export type KeyPressInput = string[];

// TODO: Consider a `preferKeyCode` boolean option:
// https://github.com/beefchimi/react-hooks/issues/24
export interface KeyPressHookOptions {
  // TODO: Could consider using an array of event types:
  // https://github.com/beefchimi/react-hooks/issues/21
  eventType?: KeyPressEventType;
  target?: GlobalEventTarget;
  disabled?: boolean;
}

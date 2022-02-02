import type {GlobalEventCallback, GlobalEventTarget} from '../types';

export enum KeyPressEventType {
  Down = 'keydown',
  Press = 'keypress',
  Up = 'keyup',
}

// TODO: Figure out how to type this for `KeyboardEvent`.
// TypeScript complains about the `event` type.
export type KeyPressCallback = GlobalEventCallback;
export type KeyPressInput = string[];

// TODO: Consider a `preferKeyCode` boolean option:
// https://github.com/beefchimi/react-hooks/issues/24
export interface KeyPressOptions {
  // TODO: Could consider using an array of event types:
  // https://github.com/beefchimi/react-hooks/issues/21
  eventType?: KeyPressEventType;
  target?: GlobalEventTarget;
  disabled?: boolean;
}

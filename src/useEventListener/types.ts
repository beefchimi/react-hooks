import type {GlobalEventCallback, GlobalEventTarget} from '../types';

export interface EventListenerHookOptions {
  eventType: string;
  callback: GlobalEventCallback;
  target?: GlobalEventTarget;
  options?: AddEventListenerOptions;
  disabled?: boolean;
  preferLayoutEffect?: boolean;
}

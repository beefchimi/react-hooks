import type {GlobalEventCallback} from '../types';

export interface EventListenerHookOptions {
  target: Document | Window | HTMLElement | null | undefined;
  eventName: string;
  callback: GlobalEventCallback;
  options?: AddEventListenerOptions;
  disabled?: boolean;
  preferLayoutEffect?: boolean;
}

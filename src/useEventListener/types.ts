export interface EventListenerHookOptions {
  disabled?: boolean;
  preferLayoutEffect?: boolean;
}

// TODO: Consider merging `options` and `listenerOptions`
// into a single arg / interface.
export interface SupportedEventListenerOptions
  extends Pick<AddEventListenerOptions, 'capture' | 'passive' | 'once'> {}

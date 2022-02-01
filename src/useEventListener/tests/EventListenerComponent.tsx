import React, {useRef} from 'react';

import {useEventListener} from '../useEventListener';
import type {EventListenerHookOptions} from '../types';

export enum AllowedEvent {
  Click = 'click',
  KeyPress = 'keypress',
}

export interface EventListenerComponentProps
  extends Pick<
    EventListenerHookOptions,
    'callback' | 'options' | 'disabled' | 'preferLayoutEffect'
  > {
  eventType?: AllowedEvent;
}

export function EventListenerComponent({
  eventType = AllowedEvent.Click,
  callback,
  options,
  disabled,
  preferLayoutEffect,
}: EventListenerComponentProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEventListener({
    target: buttonRef.current,
    eventType,
    callback,
    options,
    disabled,
    preferLayoutEffect,
  });

  return (
    <div className="EventListenerComponent">
      <button ref={buttonRef} type="button">
        Event Listener Component
      </button>
    </div>
  );
}

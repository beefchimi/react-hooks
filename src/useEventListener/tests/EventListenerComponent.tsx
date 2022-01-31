import React, {useRef} from 'react';

import {useEventListener} from '../useEventListener';
import type {EventListenerHookOptions} from '../types';

enum AllowedEvent {
  Click = 'click',
  Focus = 'focus',
  Blur = 'blur',
}

export interface EventListenerComponentProps
  extends Pick<
    EventListenerHookOptions,
    'callback' | 'options' | 'disabled' | 'preferLayoutEffect'
  > {
  event?: AllowedEvent;
}

export function EventListenerComponent({
  event = AllowedEvent.Click,
  callback,
  options,
  disabled,
  preferLayoutEffect,
}: EventListenerComponentProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEventListener({
    target: buttonRef.current,
    eventName: event,
    callback,
    options,
    disabled,
    preferLayoutEffect,
  });

  return (
    <div className="EventListenerComponent">
      <button ref={buttonRef} type="button" className="Button">
        Event Listener Component
      </button>
    </div>
  );
}

import React from 'react';

import {useInstantRef} from '../../useInstantRef';
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
  attachToDocument?: boolean;
}

export function EventListenerComponent({
  eventType = AllowedEvent.Click,
  callback,
  options,
  disabled,
  preferLayoutEffect,
  attachToDocument = false,
}: EventListenerComponentProps) {
  const [buttonElement, buttonRef] = useInstantRef<HTMLButtonElement>();

  const target = attachToDocument
    ? buttonElement?.ownerDocument
    : buttonElement;

  useEventListener({
    eventType,
    callback,
    target,
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

import React from 'react';

import {useInstantRef} from '../../useInstantRef';
import {useEventListener} from '../useEventListener';

import type {GlobalEventCallback} from '../../types';
import type {
  EventListenerHookOptions,
  SupportedEventListenerOptions,
} from '../types';

export enum AllowedEvent {
  Click = 'click',
  KeyPress = 'keypress',
}

export interface EventListenerComponentProps {
  callback: GlobalEventCallback;
  options?: EventListenerHookOptions;
  listenerOptions?: SupportedEventListenerOptions;
  eventType?: AllowedEvent;
  attachToDocument?: boolean;
}

export function EventListenerComponent({
  callback,
  options,
  listenerOptions,
  eventType = AllowedEvent.Click,
  attachToDocument = false,
}: EventListenerComponentProps) {
  const [buttonElement, buttonRef] = useInstantRef<HTMLButtonElement>();

  const target = attachToDocument
    ? buttonElement?.ownerDocument
    : buttonElement;

  useEventListener(target, eventType, callback, options, listenerOptions);

  return (
    <div className="EventListenerComponent">
      <button ref={buttonRef} type="button">
        Event Listener Component
      </button>
    </div>
  );
}

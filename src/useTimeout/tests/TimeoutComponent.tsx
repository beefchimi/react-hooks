import React from 'react';

import {useTimeout} from '../useTimeout';
import type {TimeoutCallback, TimeoutHookOptions} from '../types';

export interface TimeoutComponentProps extends TimeoutHookOptions {
  callback: TimeoutCallback;
}

export function TimeoutComponent({
  callback,
  ...options
}: TimeoutComponentProps) {
  const handleTimeoutEnd: TimeoutCallback = (timestamp) => callback(timestamp);

  useTimeout(handleTimeoutEnd, options);

  return (
    <div className="TimeoutComponent">
      <p className="Text">Timeout Component</p>
    </div>
  );
}

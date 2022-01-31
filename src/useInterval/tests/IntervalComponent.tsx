import React from 'react';

import {useInterval} from '../useInterval';
import type {IntervalCallback, IntervalHookOptions} from '../types';

export interface IntervalComponentProps extends IntervalHookOptions {
  callback: IntervalCallback;
}

export function IntervalComponent({
  callback,
  ...options
}: IntervalComponentProps) {
  const handleTimeoutEnd: IntervalCallback = (timestamp) => callback(timestamp);

  useInterval(handleTimeoutEnd, options);

  return (
    <div className="IntervalComponent">
      <p className="Text">Interval Component</p>
    </div>
  );
}

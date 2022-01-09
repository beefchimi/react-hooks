import React from 'react';
import {useTimeout} from '../useTimeout';
import type {TimeoutCallback, TimeoutHookOptions} from '../types';

export interface ExampleHookComponentProps {
  callback: TimeoutCallback;
  duration?: TimeoutHookOptions['duration'];
  playing?: TimeoutHookOptions['playing'];
}

export function ExampleHookComponent({
  callback,
  duration,
  playing,
}: ExampleHookComponentProps) {
  const handleTimeoutEnd: TimeoutCallback = (timestamp) => callback(timestamp);

  useTimeout(handleTimeoutEnd, {duration, playing});

  return (
    <div className="ExampleHookComponent">
      <p>Example Hook Component</p>
    </div>
  );
}

import React, {useState} from 'react';
import {useTimeout} from '../useTimeout';
import type {TimeoutHookOptions} from '../types';

export interface ExampleHookComponentProps {
  preTimeoutValue: string;
  postTimeoutValue: string;
  duration?: TimeoutHookOptions['duration'];
}

export function ExampleHookComponent({
  preTimeoutValue,
  postTimeoutValue,
  duration,
}: ExampleHookComponentProps) {
  const [activeValue, setActiveValue] = useState(preTimeoutValue);

  function handleTimeoutEnd() {
    setActiveValue(postTimeoutValue);
  }

  useTimeout(handleTimeoutEnd, {duration});

  return (
    <div className="Parent">
      <p className="Child">{activeValue}</p>
    </div>
  );
}

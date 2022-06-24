import React, {useRef} from 'react';

// import {useInstantRef} from '../../useInstantRef';
import {useScrollLock} from '../useScrollLock';
// import type {ScrollLockHookOptions} from '../useScrollLock';

export interface ScrollLockComponentProps {
  parentTarget?: boolean;
}

export function ScrollLockComponent({
  parentTarget = false,
}: ScrollLockComponentProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const target = parentTarget ? parentRef.current : undefined;

  const [scrollingLocked, setScrollLock] = useScrollLock({target});

  function handleScrollLockToggle() {
    setScrollLock((locked) => !locked);
  }

  return (
    <div ref={parentRef} className="ScrollLockComponent">
      <button ref={buttonRef} type="button" onClick={handleScrollLockToggle}>
        {scrollingLocked ? 'Locked' : 'Unlocked'}
      </button>

      <p>Long scrolling content goes here.</p>
    </div>
  );
}

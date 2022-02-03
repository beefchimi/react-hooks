import React from 'react';

import {noop} from '../../utilities';
import {useInstantRef} from '../useInstantRef';
import {useFocusEffect} from './useFocusEffect';

export interface InstantRefComponentProps {
  onFocus(): void;
}

export function InstantRefComponent({onFocus}: InstantRefComponentProps) {
  const [buttonElement, buttonRef] = useInstantRef<HTMLButtonElement>();

  useFocusEffect(buttonElement);

  return (
    <div className="InstantRefComponent">
      <button ref={buttonRef} type="button" onClick={noop} onFocus={onFocus}>
        Instant Ref Component
      </button>
    </div>
  );
}

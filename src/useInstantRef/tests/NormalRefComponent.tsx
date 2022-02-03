import React, {useRef} from 'react';

import {noop} from '../../utilities';
import {useFocusEffect} from './useFocusEffect';

export interface NormalRefComponentProps {
  onFocus(): void;
}

export function NormalRefComponent({onFocus}: NormalRefComponentProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useFocusEffect(buttonRef.current);

  return (
    <div className="NormalRefComponent">
      <button ref={buttonRef} type="button" onClick={noop} onFocus={onFocus}>
        Normal Ref Component
      </button>
    </div>
  );
}

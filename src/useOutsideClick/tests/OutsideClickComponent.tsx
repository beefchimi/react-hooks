import React, {useRef} from 'react';

import {useOutsideClick} from '../useOutsideClick';
import type {OutsideClickCallback} from '../types';

export interface OutsideClickComponentProps {
  onAction(): void;
  onOutsideClick: OutsideClickCallback;
  exclude?: boolean;
}

export function OutsideClickComponent({
  onAction,
  onOutsideClick,
  exclude = false,
}: OutsideClickComponentProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const outsideElementRef = useRef<HTMLParagraphElement>(null);

  useOutsideClick(
    buttonRef.current,
    onOutsideClick,
    exclude ? outsideElementRef.current : undefined,
  );

  return (
    <div className="OutsideClickComponent">
      <p>First element</p>

      <button ref={buttonRef} type="button" onClick={onAction}>
        Outside Event Component
      </button>

      <p ref={outsideElementRef}>Last element</p>
    </div>
  );
}

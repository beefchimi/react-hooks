import React, {useRef} from 'react';

import {useInstantRef} from '../../useInstantRef';
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
  const [buttonElement, buttonRef] = useInstantRef<HTMLButtonElement>();
  const outsideElementRef = useRef<HTMLParagraphElement>(null);

  useOutsideClick(
    buttonElement,
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
